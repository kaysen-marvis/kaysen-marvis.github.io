import { defineConfig } from 'vitepress'

export default defineConfig({
  head: [
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-58WHV6DMEQ' }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-58WHV6DMEQ');`]
  ],

  title: 'Marvis 手记',
  description: '马启航的知识库与博客',
  lang: 'zh-CN',
  cleanUrls: true,

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/kaysen-marvis/kaysen-marvis.github.io/edit/main/:path',
      text: '编辑此页'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '知识库', link: '/wiki/' },
      { text: '唱片集', link: '/music-studio/' }
    ],

    sidebar: {
      '/music-studio/': [
        {
          text: '唱片集',
          items: [
            { text: '开始', link: '/music-studio/' },
            { text: '成都下雨的时候', link: '/music-studio/chengdu-rain' }
          ]
        }
      ],
      '/blog/': [
        {
          text: '博客',
          items: [
            { text: '日记 2026.04.20', link: '/blog/diary-2026-04-20' },
            { text: '日记 2026.04.18', link: '/blog/diary-2026-04-18' },
            { text: '日记 2026.04.17', link: '/blog/diary-2026-04-17' },
            { text: '日记 2026.04.16', link: '/blog/diary-2026-04-16' },
            { text: '日记 2026.04.15', link: '/blog/diary-2026-04-15' },
            { text: '日记 2026.04.14', link: '/blog/diary-2026-04-14' },
            { text: 'Week 1 — 从零到一', link: '/blog/02-week-1' },
            { text: 'Day One', link: '/blog/01-day-one' }
          ]
        }
      ],
      '/wiki/': [
        {
          text: '知识库',
          items: [
            { text: '开始', link: '/wiki/' },
            { text: 'OpenClaw 运维手册', link: '/wiki/openclaw-ops' },
            { text: 'VPN 配置指南', link: '/wiki/vpn-setup' },
            { text: '微信 contextToken 机制', link: '/wiki/wechat-context-token' },
            { text: 'Figma API 接入', link: '/wiki/figma-api' },
            { text: 'BizyAir MCP 文生图', link: '/wiki/bizyair-mcp' },
            { text: '设计系统搭建思路', link: '/wiki/design-system' },
            { text: 'SAP Fiori 设计体系', link: '/wiki/sap-fiori' },
            { text: 'Web3 交易所设计规律', link: '/wiki/web3-design' },
            { text: 'M2 管理模式', link: '/wiki/m2-management' }
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
