/**
 * 构建后处理脚本
 * 修复 CSS/JS 中静态资源 url 的绝对路径问题
 * uni-app 默认生成 url(/static/...)，但部署到 GitHub Pages 子路径时会 404
 *
 * 处理规则：
 * - dist/build/h5/assets/*.css -> url(../static/...)
 * - dist/build/h5/assets/*.js  -> 字符串 "../static/..."
 * - dist/build/h5/index.html  -> href/src 用 "./static/..."
 *
 * 因为 CSS/JS 位于 assets/ 目录，相对路径需要返回上一级；
 * 而 index.html 在根目录，相对路径直接用 ./static/。
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, extname, dirname, relative, sep } from 'node:path'

const DIST_DIR = 'dist/build/h5'

// 需要处理的文件扩展名
const TARGET_EXTS = new Set(['.css', '.js', '.html'])

// 计算某个文件所在目录到 dist/build/h5 的相对深度
function depthFromRoot(filePath) {
  const rel = relative(DIST_DIR, dirname(filePath))
  if (rel === '' || rel === '.') return 0
  return rel.split(sep).length
}

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
  const ext = extname(filePath)

  // 计算相对路径前缀：从当前文件目录到 dist/build/h5 的相对路径
  // 比如 assets/foo.css 需要 "../"，根目录的 index.html 需要 "./"
  const depth = depthFromRoot(filePath)
  const prefix = depth === 0 ? './' : '../'.repeat(depth) + 'static/'

  let modified = original
  let count = 0

  if (ext === '.css') {
    // 把 url(/static/xxx) 替换为 url({prefix}xxx)
    modified = original.replace(/url\(\s*(\/static\/)([^)"'\s]+)\s*\)/g, (_m, _slash, path) => {
      count++
      return `url(${prefix}${path})`
    })
  } else if (ext === '.js') {
    // 把字符串 "/static/xxx" 替换为 "{prefix}xxx"
    // 简单直接替换，不要求字符串内容不含特殊字符
    const jsPrefix = depth === 0 ? './' : '../'.repeat(depth) + 'static/'
    modified = original.replace(/(['"`])\/static\//g, (m) => {
      count++
      // 把第一个 /static/ 替换为 jsPrefix
      return m.replace(/\/static\//, jsPrefix)
    })
  } else if (ext === '.html') {
    // 把 href="/static/..." 或 src="/static/..." 替换为相对路径
    modified = original.replace(/(\s(?:href|src)=)(["'])\/static\/([^"']+)\2/g, (_m, attr, q, path) => {
      count++
      return `${attr}${q}${prefix}${path}${q}`
    })
  }

  if (modified !== original) {
    await writeFile(filePath, modified, 'utf8')
    totalFiles++
    totalReplacements += count
    console.log(`  [${ext}] ${filePath} (depth=${depth}) -> ${count} 处替换，prefix="${prefix}"`)
  }
}

console.log('开始处理静态资源 URL 路径...')
await walk(DIST_DIR)
console.log(`完成: 处理了 ${totalFiles} 个文件，共 ${totalReplacements} 处替换`)
