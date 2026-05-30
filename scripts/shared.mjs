import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const DOCS_DIR = path.join(PROJECT_ROOT, 'docs')
export const SOURCE_DIR = 'D:\\个人博客\\Linver04.github.io\\_posts'
export const REPORT_PATH = path.join(PROJECT_ROOT, 'data', 'import-report.json')

export const CATEGORY_LABELS = {
  templates: '算法模板',
  knowledge: '知识点',
  contests: '竞赛题解'
}

export const CONTEST_LABELS = {
  icpc: 'ICPC',
  ccpc: 'CCPC',
  codeforces: 'Codeforces',
  atcoder: 'AtCoder',
  nowcoder: '牛客',
  luogu: '洛谷',
  other: '其他'
}

export const KNOWLEDGE_ORDER = ['数据结构', '图论', '计算几何', '数学', '动态规划', '字符串', '杂项']
export const CONTEST_ORDER = ['icpc', 'ccpc', 'codeforces', 'atcoder', 'nowcoder', 'luogu', 'other']

export function toPosixPath(value) {
  return value.split(path.sep).join('/')
}

export function stripMarkdownExtension(fileName) {
  return fileName.replace(/\.md$/i, '')
}

export function titleFromFile(fileName) {
  return stripMarkdownExtension(fileName).replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '').trim()
}

export function linkFromDocPath(docPath) {
  const rel = toPosixPath(path.relative(DOCS_DIR, docPath))
  return `/${stripMarkdownExtension(rel)}`
}

export function encodeMarkdownLink(link) {
  return encodeURI(link).replace(/\(/g, '%28').replace(/\)/g, '%29')
}

export function sortByDateDesc(a, b) {
  return b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-Hans-CN')
}

export async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

export async function writeText(filePath, content) {
  await ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, content, 'utf8')
}
