import path from 'node:path'
import {
  CONTEST_LABELS,
  CONTEST_ORDER,
  DOCS_DIR,
  KNOWLEDGE_ORDER,
  REPORT_PATH,
  readJson,
  sortByDateDesc,
  writeText
} from './shared.mjs'

const report = await readJson(REPORT_PATH, { imported: [] })
const imported = report.imported ?? []

function itemsFor(category, subcategory) {
  return imported
    .filter((item) => item.category === category && (subcategory === undefined || item.subcategory === subcategory))
    .sort(sortByDateDesc)
}

function sidebarItem(item) {
  return {
    text: `[${item.date}] ${item.title}`,
    link: item.link
  }
}

function group(text, link, items, collapsed = true) {
  return {
    text,
    collapsed,
    items: [
      { text: '总览', link },
      ...items.map(sidebarItem)
    ]
  }
}

const templates = [
  group('算法模板', '/templates/', itemsFor('templates'), false)
]

const knowledge = [
  {
    text: '知识点',
    items: [{ text: '总览', link: '/knowledge/' }]
  },
  ...KNOWLEDGE_ORDER.map((label) => group(label, `/knowledge/${label}/`, itemsFor('knowledge', label)))
    .filter((entry) => entry.items.length > 1)
]

const contests = [
  {
    text: '竞赛题解',
    items: [{ text: '总览', link: '/contests/' }]
  },
  ...CONTEST_ORDER.map((key) => group(CONTEST_LABELS[key] ?? key, `/contests/${key}/`, itemsFor('contests', key)))
    .filter((entry) => entry.items.length > 1)
]

const outputPath = path.join(DOCS_DIR, '.vitepress', 'sidebar.generated.mts')
const output = `export const generatedSidebar = ${JSON.stringify({ templates, knowledge, contests }, null, 2)}\n`

await writeText(outputPath, output)
console.log('Generated sidebar.')
