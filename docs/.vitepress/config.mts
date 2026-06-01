import { defineConfig } from 'vitepress'
import { katex } from '@mdit/plugin-katex'
import { generatedSidebar } from './sidebar.generated'

export default defineConfig({
  base: '/XCPC-notes/',
  lang: 'zh-CN',
  title: 'XCPC Notes',
  description: '算法竞赛笔记',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    config(md) {
      md.use(katex, { throwOnError: false, strict: false })
    }
  },
  head: [
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '算法模板', link: '/templates/' },
      { text: '知识点', link: '/knowledge/' },
      { text: '竞赛题解', link: '/contests/' }
    ],
    sidebar: {
      '/templates/': generatedSidebar.templates,
      '/knowledge/': generatedSidebar.knowledge,
      '/contests/': generatedSidebar.contests
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                noResultsText: '无结果',
                resetButtonTitle: '清除',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Linver04/XCPC-notes' }
    ],
    footer: {
      message: '',
      copyright: 'Wenwei Lin · 2022 — 2025'
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
})
