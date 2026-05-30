import path from 'node:path'
import {
  CONTEST_LABELS,
  CONTEST_ORDER,
  DOCS_DIR,
  KNOWLEDGE_ORDER,
  REPORT_PATH,
  encodeMarkdownLink,
  readJson,
  sortByDateDesc,
  writeText
} from './shared.mjs'

const report = await readJson(REPORT_PATH, { imported: [], excluded: [] })
const imported = report.imported ?? []

function itemsFor(category, subcategory) {
  return imported
    .filter((item) => item.category === category && (subcategory === undefined || item.subcategory === subcategory))
    .sort(sortByDateDesc)
}

function noteRows(items) {
  if (!items.length) return '暂无笔记。\n'

  return [
    '| 发布时间 | 标题 | 源文件 |',
    '| --- | --- | --- |',
    ...items.map((item) => {
      const link = encodeMarkdownLink(item.link)
      return `| ${item.date} | [${item.title}](${link}) | \`${item.sourceFile}\` |`
    }),
    ''
  ].join('\n')
}

function categoryCards(groups) {
  return [
    '| 分类 | 数量 |',
    '| --- | ---: |',
    ...groups.map(({ label, link, count }) => `| [${label}](${encodeMarkdownLink(link)}) | ${count} |`),
    ''
  ].join('\n')
}

async function writeTemplatesIndex() {
  const items = itemsFor('templates')
  await writeText(path.join(DOCS_DIR, 'templates', 'index.md'), [
    '# 算法模板',
    '',
    '这里收录算法模板、板子和题单类笔记，按发布时间倒序排列。',
    '',
    noteRows(items)
  ].join('\n'))
}

async function writeKnowledgeIndexes() {
  const groups = KNOWLEDGE_ORDER.map((label) => ({
    label,
    link: `/knowledge/${label}/`,
    count: itemsFor('knowledge', label).length
  })).filter((group) => group.count > 0)

  await writeText(path.join(DOCS_DIR, 'knowledge', 'index.md'), [
    '# 知识点',
    '',
    '按照算法模板一级标题和笔记关键词整理的知识点目录。',
    '',
    categoryCards(groups),
    '## 全部知识点',
    '',
    noteRows(itemsFor('knowledge'))
  ].join('\n'))

  for (const label of KNOWLEDGE_ORDER) {
    const items = itemsFor('knowledge', label)
    await writeText(path.join(DOCS_DIR, 'knowledge', label, 'index.md'), [
      `# ${label}`,
      '',
      `共 ${items.length} 篇，按发布时间倒序排列。`,
      '',
      noteRows(items)
    ].join('\n'))
  }
}

async function writeContestIndexes() {
  const groups = CONTEST_ORDER.map((key) => ({
    label: CONTEST_LABELS[key] ?? key,
    link: `/contests/${key}/`,
    count: itemsFor('contests', key).length
  })).filter((group) => group.count > 0)

  await writeText(path.join(DOCS_DIR, 'contests', 'index.md'), [
    '# 竞赛题解',
    '',
    '按赛事和平台整理的题解归档。',
    '',
    categoryCards(groups),
    '## 全部题解',
    '',
    noteRows(itemsFor('contests'))
  ].join('\n'))

  for (const key of CONTEST_ORDER) {
    const label = CONTEST_LABELS[key] ?? key
    const items = itemsFor('contests', key)
    await writeText(path.join(DOCS_DIR, 'contests', key, 'index.md'), [
      `# ${label}`,
      '',
      `共 ${items.length} 篇，按发布时间倒序排列。`,
      '',
      noteRows(items)
    ].join('\n'))
  }
}

await Promise.all([
  writeTemplatesIndex(),
  writeKnowledgeIndexes(),
  writeContestIndexes()
])

console.log('Generated index pages.')
