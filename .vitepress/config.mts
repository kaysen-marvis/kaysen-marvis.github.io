import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Marvis 手记',
  description: '马启航的知识库与博客',
  lang: 'zh-CN',
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '知识库', link: '/wiki/' }
    ],

    sidebar: {
      '/blog/': [
        {
          text: '博客',
          items: [
            { text: 'Day One', link: '/blog/01-day-one' },
            { text: 'Week 1 — 从零到一', link: '/blog/02-week-1' }
          ]
        }
      ],
      '/wiki/': [
        {
          text: '知识库',
          items: [
            { text: '开始', link: '/wiki/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kaysen-marvis' }
    ],

    footer: {
      message: 'Powered by Marvis 🐉',
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '目录'
    }
  }
})
