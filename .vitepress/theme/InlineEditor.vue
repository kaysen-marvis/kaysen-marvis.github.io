<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const enabled = ref(false)

function isEditablePath(path: string) {
  return path.startsWith('/music-studio') || path.startsWith('/wiki')
}

function getToken(): string | null {
  return localStorage.getItem('gh-token')
}

function promptToken(): string | null {
  const token = prompt('请输入 GitHub Personal Access Token（用于保存编辑）：')
  if (token) localStorage.setItem('gh-token', token)
  return token
}

async function getFileSha(path: string, token: string): Promise<{ sha: string; content: string }> {
  const res = await fetch(
    `https://api.github.com/repos/kaysen-marvis/kaysen-marvis.github.io/contents/${path}?ref=main`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error('Failed to fetch file: ' + res.status)
  const data = await res.json()
  return { sha: data.sha, content: atob(data.content.replace(/\n/g, '')) }
}

async function saveFile(path: string, content: string, sha: string, token: string) {
  const res = await fetch(
    `https://api.github.com/repos/kaysen-marvis/kaysen-marvis.github.io/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `edit: update ${path} via inline editor`,
        content: btoa(unescape(encodeURIComponent(content))),
        sha,
        branch: 'main',
      }),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Save failed: ' + res.status)
  }
}

function getSourcePath(): string {
  // VitePress route.path is like /wiki/foo -> wiki/foo.md
  let p = route.path
  if (p.startsWith('/')) p = p.slice(1)
  if (p.endsWith('/')) p += 'index'
  if (!p.endsWith('.md')) p += '.md'
  return p
}

function setupEditors() {
  const container = document.querySelector('.vp-doc')
  if (!container) return

  // Clean up old buttons
  container.querySelectorAll('.inline-edit-btn').forEach(el => el.remove())

  const selectors = 'p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, table'
  const blocks = container.querySelectorAll(selectors)

  blocks.forEach((block) => {
    const el = block as HTMLElement
    // Skip if inside another editable or if it's empty
    if (el.closest('.inline-editing') || !el.textContent?.trim()) return

    // Make wrapper relative
    el.style.position = 'relative'

    const btn = document.createElement('button')
    btn.className = 'inline-edit-btn'
    btn.textContent = '✏️'
    btn.title = '编辑此段落'
    btn.addEventListener('click', () => startEdit(el))
    el.appendChild(btn)
  })
}

function startEdit(el: HTMLElement) {
  const token = getToken() || promptToken()
  if (!token) return

  // Get text content of the element for editing
  const originalHTML = el.innerHTML
  // Remove edit button from content
  const btn = el.querySelector('.inline-edit-btn')
  btn?.remove()

  const textContent = el.innerText || el.textContent || ''

  el.classList.add('inline-editing')
  const tagName = el.tagName.toLowerCase()

  const wrapper = document.createElement('div')
  wrapper.className = 'inline-editor-wrapper'

  const textarea = document.createElement('textarea')
  textarea.className = 'inline-editor-textarea'
  textarea.value = textContent
  textarea.rows = Math.max(3, textContent.split('\n').length + 1)

  const actions = document.createElement('div')
  actions.className = 'inline-editor-actions'

  const saveBtn = document.createElement('button')
  saveBtn.className = 'inline-editor-save'
  saveBtn.textContent = '💾 保存'

  const cancelBtn = document.createElement('button')
  cancelBtn.className = 'inline-editor-cancel'
  cancelBtn.textContent = '取消'

  const status = document.createElement('span')
  status.className = 'inline-editor-status'

  actions.appendChild(saveBtn)
  actions.appendChild(cancelBtn)
  actions.appendChild(status)
  wrapper.appendChild(textarea)
  wrapper.appendChild(actions)

  el.innerHTML = ''
  el.appendChild(wrapper)

  textarea.focus()

  cancelBtn.addEventListener('click', () => {
    el.innerHTML = originalHTML
    el.classList.remove('inline-editing')
    // Re-add edit button
    const newBtn = document.createElement('button')
    newBtn.className = 'inline-edit-btn'
    newBtn.textContent = '✏️'
    newBtn.title = '编辑此段落'
    newBtn.addEventListener('click', () => startEdit(el))
    el.appendChild(newBtn)
  })

  saveBtn.addEventListener('click', async () => {
    const newText = textarea.value
    if (newText === textContent) {
      cancelBtn.click()
      return
    }

    saveBtn.disabled = true
    status.textContent = '保存中...'

    try {
      const filePath = getSourcePath()
      const { sha, content: fileContent } = await getFileSha(filePath, token)

      const oldText = textContent.trim()
      const newTextTrimmed = newText.trim()

      // 1. 先尝试精确匹配
      if (fileContent.includes(oldText)) {
        const updatedContent = fileContent.replace(oldText, newTextTrimmed)
        await saveFile(filePath, updatedContent, sha, token)
        status.textContent = '✅ 已保存，刷新中...'
        setTimeout(() => location.reload(), 1000)
        return
      }

      // 2. 去除 Markdown 标记后模糊匹配
      const stripMd = (s: string) =>
        s.replace(/[*_~`#>\[\]!]/g, '').replace(/\s+/g, ' ').trim()

      const strippedOld = stripMd(oldText)
      const lines = fileContent.split('\n')

      // 找到最佳匹配的行范围（滑动窗口匹配多行段落）
      let bestScore = 0
      let bestStart = -1
      let bestEnd = -1

      // 单行匹配
      for (let i = 0; i < lines.length; i++) {
        const stripped = stripMd(lines[i])
        if (!stripped) continue
        // 计算包含率：strippedOld 中有多少词出现在 stripped 里
        const words = strippedOld.split(' ').filter(Boolean)
        if (!words.length) continue
        const matched = words.filter(w => stripped.includes(w)).length
        const score = matched / words.length
        if (score > bestScore) {
          bestScore = score
          bestStart = i
          bestEnd = i
        }
      }

      // 多行窗口匹配（适用于段落跨行）
      for (let size = 2; size <= 8; size++) {
        for (let i = 0; i <= lines.length - size; i++) {
          const chunk = lines.slice(i, i + size).join(' ')
          const stripped = stripMd(chunk)
          const words = strippedOld.split(' ').filter(Boolean)
          if (!words.length) continue
          const matched = words.filter(w => stripped.includes(w)).length
          const score = matched / words.length
          if (score > bestScore) {
            bestScore = score
            bestStart = i
            bestEnd = i + size - 1
          }
        }
      }

      // 相似度需达到 60% 以上才替换
      if (bestScore < 0.6 || bestStart === -1) {
        throw new Error(`无法定位该段落（最佳匹配度 ${Math.round(bestScore * 100)}%），请手动编辑源文件`)
      }

      // 用新文本替换匹配到的行范围
      lines.splice(bestStart, bestEnd - bestStart + 1, newTextTrimmed)
      const updatedContent = lines.join('\n')
      await saveFile(filePath, updatedContent, sha, token)

      status.textContent = `✅ 已保存（模糊匹配 ${Math.round(bestScore * 100)}%），刷新中...`
      setTimeout(() => location.reload(), 1000)
    } catch (err: any) {
      status.textContent = '❌ ' + err.message
      saveBtn.disabled = false
    }
  })
}

let observer: MutationObserver | null = null

onMounted(() => {
  enabled.value = isEditablePath(route.path)
  if (enabled.value) {
    // Wait for content to render
    setTimeout(setupEditors, 500)
  }

  // Watch for route changes (SPA navigation)
  observer = new MutationObserver(() => {
    enabled.value = isEditablePath(route.path)
    if (enabled.value) {
      setTimeout(setupEditors, 300)
    }
  })

  const target = document.querySelector('#app')
  if (target) {
    observer.observe(target, { childList: true, subtree: true })
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div v-if="enabled" class="inline-editor-root" />
</template>

<style>
.inline-edit-btn {
  position: absolute;
  top: 2px;
  right: -30px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.15;
  font-size: 14px;
  padding: 2px;
  transition: opacity 0.2s;
  line-height: 1;
  z-index: 10;
}

.vp-doc *:hover > .inline-edit-btn {
  opacity: 0.7;
}

.inline-edit-btn:hover {
  opacity: 1 !important;
}

.inline-editing {
  background: var(--vp-c-bg-soft) !important;
  border-radius: 6px;
  padding: 8px !important;
}

.inline-editor-wrapper {
  width: 100%;
}

.inline-editor-textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-sizing: border-box;
}

.inline-editor-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.inline-editor-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 6px;
}

.inline-editor-save,
.inline-editor-cancel {
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
  cursor: pointer;
  font-size: 13px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.inline-editor-save {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.inline-editor-save:hover {
  background: var(--vp-c-brand-2);
}

.inline-editor-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.inline-editor-cancel:hover {
  background: var(--vp-c-bg-soft);
}

.inline-editor-status {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.inline-editor-root {
  display: none;
}
</style>
