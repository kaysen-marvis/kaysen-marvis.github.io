import DefaultTheme from 'vitepress/theme'
import InlineEditor from './InlineEditor.vue'
import { h } from 'vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(InlineEditor),
    })
  },
} satisfies Theme
