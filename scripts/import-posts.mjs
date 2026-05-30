import fs from 'node:fs/promises'
import path from 'node:path'
import { TextDecoder } from 'node:util'
import {
  DOCS_DIR,
  PROJECT_ROOT,
  REPORT_PATH,
  SOURCE_DIR,
  ensureDir,
  readJson,
  titleFromFile,
  writeText
} from './shared.mjs'

const CONTENT_DIRS = ['templates', 'knowledge', 'contests']
const DATA_DIR = path.join(PROJECT_ROOT, 'data')
const OVERRIDES_PATH = path.join(DATA_DIR, 'overrides.json')
const TAXONOMY_PATH = path.join(DATA_DIR, 'taxonomy.json')

const FILE_NAME_RE = /^(\d{4})-(\d{1,2})-(\d{1,2})-(.+)\.md$/i
const UTF8_DECODER = new TextDecoder('utf-8')
const GB18030_DECODER = new TextDecoder('gb18030')

const EXCLUDE_RE = [
  /python学习/i,
  /java学习|JAVA程序设计/i,
  /markdown语法|VsCode配置/i,
  /大学物理|计算机网络/i,
  /huggingface|pipeline|tokenizer|Transformer/i
]

function parseFileName(fileName) {
  const match = fileName.match(FILE_NAME_RE)
  if (!match) return null

  const [, year, month, day, rawTitle] = match
  const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  return {
    date,
    title: rawTitle.trim(),
    sourceFile: fileName
  }
}

function normalizeFence(line) {
  return line.replace(/^```\s*(?:c\+\+|C\+\+|cpp|CPP|c|C)\s*$/u, '```cpp')
}

function normalizeMarkdown(raw, title) {
  let body = raw.replace(/^\uFEFF/, '')

  const lines = body
    .split(/\r?\n/)
    .filter((line) => !/^\s*@?\[(?:toc|TOC)\](?:\([^)]*\))?\s*$/u.test(line))
    .map(normalizeFence)

  body = lines.join('\n').trimStart()
  body = body.replace(/^\s*---\s*[\r\n][\s\S]*?[\r\n]\s*---\s*[\r\n]?/u, '').trimStart()

  if (!/^#\s+/m.test(body)) {
    body = `# ${title}\n\n${body}`
  }

  return body.trimEnd()
}

async function readSourceText(sourcePath) {
  const buffer = await fs.readFile(sourcePath)
  const utf8 = UTF8_DECODER.decode(buffer)
  const replacementCount = (utf8.match(/\uFFFD/g) ?? []).length

  if (replacementCount > 0) {
    return GB18030_DECODER.decode(buffer)
  }

  return utf8
}

function yamlString(value) {
  return JSON.stringify(value)
}

function yamlArray(values) {
  return `[${values.map(yamlString).join(', ')}]`
}

function buildFrontmatter(meta) {
  const tags = meta.tags?.length ? meta.tags : [meta.categoryLabel, meta.subcategoryLabel].filter(Boolean)

  return [
    '---',
    `title: ${yamlString(meta.title)}`,
    `date: ${yamlString(meta.date)}`,
    `sourceFile: ${yamlString(meta.sourceFile)}`,
    `category: ${yamlString(meta.category)}`,
    `categoryLabel: ${yamlString(meta.categoryLabel)}`,
    `subcategory: ${yamlString(meta.subcategory)}`,
    `subcategoryLabel: ${yamlString(meta.subcategoryLabel)}`,
    `tags: ${yamlArray(tags)}`,
    '---',
    '',
    '<PostMeta />',
    ''
  ].join('\n')
}

function containsAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text))
}

function contestCategory(title, raw) {
  const bodyHead = raw.slice(0, 6000)
  const searchText = `${title}\n${bodyHead}`

  if (/CCPC|GDCPC|女生专场|河北cpc|中国大学生程序设计竞赛/i.test(title)) {
    return 'ccpc'
  }
  if (/ICPC|XCPC|区域赛|邀请赛|网络赛/i.test(title)) {
    return 'icpc'
  }
  if (/Codeforces|Educational Codeforces|\bCF\d{3,5}[A-Z]?\b|Round\s*#?\d+/i.test(title)) {
    return 'codeforces'
  }
  if (/\babc\d+\b|\bABC\d+\b|AtCoder/i.test(title)) {
    return 'atcoder'
  }
  if (/牛客/i.test(title)) {
    return 'nowcoder'
  }
  if (/luogu|洛谷|\bP\d{4,}\b/i.test(title)) {
    return 'luogu'
  }
  if (/蓝桥杯|码蹄杯/i.test(title)) {
    return 'other'
  }
  if (/codeforces\.com\/gym/i.test(searchText) && /题解|ICPC|CCPC|XCPC|区域赛|邀请赛/i.test(title)) {
    return 'icpc'
  }
  if (/codeforces\.com\/contest/i.test(bodyHead) && /题解|Round|Codeforces|\bCF\d{3,5}[A-Z]?\b/i.test(title)) {
    return 'codeforces'
  }
  if (/atcoder\.jp\/contests/i.test(bodyHead) && /题解|\babc\d+\b|\bABC\d+\b|AtCoder/i.test(title)) {
    return 'atcoder'
  }
  if (/nowcoder\.com/i.test(bodyHead) && /题解|牛客/i.test(title)) {
    return 'nowcoder'
  }
  if (/luogu\.com\.cn/i.test(bodyHead) && /题解|luogu|洛谷|\bP\d{4,}\b/i.test(title)) {
    return 'luogu'
  }
  return null
}

function knowledgeCategory(title, searchText, taxonomy) {
  for (const [category, keywords] of Object.entries(taxonomy)) {
    if (keywords.some((keyword) => title.includes(keyword))) {
      return category
    }
  }

  for (const [category, keywords] of Object.entries(taxonomy)) {
    if (keywords.some((keyword) => searchText.includes(keyword))) {
      return category
    }
  }
  return '杂项'
}

function classify(fileName, raw, taxonomy, overrides) {
  const override = overrides[fileName]
  if (override) {
    return {
      category: override.category,
      subcategory: override.subcategory ?? ''
    }
  }

  const title = titleFromFile(fileName)
  const searchText = `${fileName}\n${raw.slice(0, 6000)}`

  if (containsAny(searchText, EXCLUDE_RE)) {
    return { category: 'excluded', subcategory: '非竞赛' }
  }

  if (/算法模板|补充算法笔记/i.test(title)) {
    return { category: 'templates', subcategory: '' }
  }

  const contest = contestCategory(title, raw)
  if (contest) {
    return { category: 'contests', subcategory: contest }
  }

  if (/板子|题单|复习|模板/i.test(title) && !contest) {
    return { category: 'templates', subcategory: '' }
  }

  return {
    category: 'knowledge',
    subcategory: knowledgeCategory(title, searchText, taxonomy)
  }
}

function categoryLabel(category) {
  return {
    templates: '算法模板',
    knowledge: '知识点',
    contests: '竞赛题解'
  }[category] ?? category
}

function contestLabel(subcategory) {
  return {
    icpc: 'ICPC',
    ccpc: 'CCPC',
    codeforces: 'Codeforces',
    atcoder: 'AtCoder',
    nowcoder: '牛客',
    luogu: '洛谷',
    other: '其他'
  }[subcategory] ?? subcategory
}

function targetDirFor(classification) {
  if (classification.category === 'templates') {
    return path.join(DOCS_DIR, 'templates')
  }
  if (classification.category === 'knowledge') {
    return path.join(DOCS_DIR, 'knowledge', classification.subcategory || '杂项')
  }
  return path.join(DOCS_DIR, 'contests', classification.subcategory || 'other')
}

async function cleanGeneratedContent() {
  await Promise.all(
    CONTENT_DIRS.map((dir) => fs.rm(path.join(DOCS_DIR, dir), { recursive: true, force: true }))
  )
}

async function main() {
  const [taxonomy, overrides] = await Promise.all([
    readJson(TAXONOMY_PATH, {}),
    readJson(OVERRIDES_PATH, {})
  ])

  await ensureDir(DATA_DIR)
  await cleanGeneratedContent()

  const files = (await fs.readdir(SOURCE_DIR))
    .filter((fileName) => fileName.toLowerCase().endsWith('.md'))
    .map((fileName) => path.join(SOURCE_DIR, fileName))

  const imported = []
  const excluded = []
  const skipped = []

  for (const sourcePath of files) {
    const sourceFile = path.basename(sourcePath)
    const parsedName = parseFileName(sourceFile)

    if (!parsedName) {
      skipped.push({ sourceFile, reason: '文件名不含可解析时间戳' })
      continue
    }

    const raw = await readSourceText(sourcePath)
    const classification = classify(sourceFile, raw, taxonomy, overrides)

    if (classification.category === 'excluded') {
      excluded.push({
        sourceFile,
        title: parsedName.title,
        date: parsedName.date,
        reason: classification.subcategory
      })
      continue
    }

    const normalizedBody = normalizeMarkdown(raw, parsedName.title)
    const targetDir = targetDirFor(classification)
    const targetPath = path.join(targetDir, sourceFile)
    const subcategoryLabel = classification.category === 'contests'
      ? contestLabel(classification.subcategory)
      : classification.subcategory
    const meta = {
      ...parsedName,
      category: classification.category,
      categoryLabel: categoryLabel(classification.category),
      subcategory: classification.subcategory,
      subcategoryLabel,
      docPath: targetPath,
      link: `/${path.relative(DOCS_DIR, targetPath).split(path.sep).join('/').replace(/\.md$/i, '')}`,
      tags: [categoryLabel(classification.category), subcategoryLabel].filter(Boolean)
    }

    await writeText(targetPath, `${buildFrontmatter(meta)}${normalizedBody}\n`)
    imported.push(meta)
  }

  imported.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-Hans-CN'))
  excluded.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-Hans-CN'))

  await writeText(REPORT_PATH, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    sourceDir: SOURCE_DIR,
    counts: {
      imported: imported.length,
      excluded: excluded.length,
      skipped: skipped.length,
      total: files.length
    },
    imported,
    excluded,
    skipped
  }, null, 2)}\n`)

  console.log(`Imported ${imported.length} notes, excluded ${excluded.length}, skipped ${skipped.length}.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
