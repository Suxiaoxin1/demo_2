/**
 * 构建后处理脚本
 * 修复 CSS/JS 中静态资源 url 的绝对路径问题
 * uni-app 默认生成 url(/static/...)，但部署到 GitHub Pages 子路径时会 404
 * 把 /static/ 替换为 ./static/（相对路径）
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const DIST_DIR = 'dist/build/h5'

// 需要处理的文件扩展名
const TARGET_EXTS = new Set(['.css', '.js', '.html'])

// 匹配 css url() 内的绝对路径
const CSS_URL_REGEX = /url\(\s*(\/static\/[^)"'\s]+)\s*\)/g
// 匹配 JS 中的 "/static/" 字符串
const JS_STRING_REGEX = /(["'])\/static\//g
// 匹配 HTML 中的 href/src="/static/"
const HTML_ATTR_REGEX = /(\s(?:href|src)=)(["'])\/static\//g

let totalFiles = 0
let totalReplacements = 0

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(fullPath)
    } else if (TARGET_EXTS.has(extname(entry.name))) {
      await processFile(fullPath)
    }
  }
}

async function processFile(filePath) {
  const original = await readFile(filePath, 'utf8')
  let modified = original
  const ext = extname(filePath)

  if (ext === '.css') {
    modified = original.replace(CSS_URL_REGEX, (_match, url) => `url(./static/${url.replace(/^\/static\//, '')})`)
  } else if (ext === '.js') {
    modified = original.replace(JS_STRING_REGEX, '$1./static/')
  } else if (ext === '.html') {
    modified = original.replace(HTML_ATTR_REGEX, '$1$2./static/')
  }

  if (modified !== original) {
    const count =
      (ext === '.css' ? (original.match(CSS_URL_REGEX) || []).length : 0) +
      (ext === '.js' ? (original.match(JS_STRING_REGEX) || []).length : 0) +
      (ext === '.html' ? (original.match(HTML_ATTR_REGEX) || []).length : 0)
    await writeFile(filePath, modified, 'utf8')
    totalFiles++
    totalReplacements += count
    console.log(`  [${ext}] ${filePath} -> ${count} 处替换`)
  }
}

console.log('开始处理静态资源 URL 路径...')
await walk(DIST_DIR)
console.log(`完成: 处理了 ${totalFiles} 个文件，共 ${totalReplacements} 处替换`)
