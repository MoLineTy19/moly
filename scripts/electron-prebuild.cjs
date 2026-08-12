const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const standalone = path.join(root, '.next', 'standalone')

function ensureExists(p) {
  if (!fs.existsSync(p)) {
    console.error('Не найдено: ' + path.relative(root, p))
    console.error('Сначала выполните `next build` (output: standalone).')
    process.exit(1)
  }
}

ensureExists(standalone)

// 1. Статика (JS/CSS браузерного бандла) -> standalone/.next/static.
const staticSrc = path.join(root, '.next', 'static')
const staticDst = path.join(standalone, '.next', 'static')
fs.cpSync(staticSrc, staticDst, { recursive: true })
console.log('static ->', path.relative(root, staticDst))

// 2. Миграции drizzle -> standalone/drizzle (читаются раннером из main.cjs).
const drizzleSrc = path.join(root, 'drizzle')
const drizzleDst = path.join(standalone, 'drizzle')
fs.cpSync(drizzleSrc, drizzleDst, { recursive: true })
console.log('drizzle ->', path.relative(root, drizzleDst))

// 3. Удаляем dev-БД, случайно попавшую в standalone при трейсинге.
const strayDb = path.join(standalone, 'database.db')
if (fs.existsSync(strayDb)) {
  fs.unlinkSync(strayDb)
  console.log('удалён мусор:', path.relative(root, strayDb))
}

// 4. Копируем пересобранный под Electron better-sqlite3 в standalone.
// next build кладёт туда нативный бинарник под ABI Node, а сервер в упакованном
// приложении работает под ABI Electron. electron-rebuild пересобирает копию в
// основном node_modules, отсюда и берём.
const bs3Src = path.join(root, 'node_modules', 'better-sqlite3')
const bs3Dst = path.join(standalone, 'node_modules', 'better-sqlite3')
if (!fs.existsSync(bs3Src)) {
  console.error('better-sqlite3 не найден в node_modules. Выполняли electron-rebuild?')
  process.exit(1)
}
fs.cpSync(bs3Src, bs3Dst, { recursive: true })
console.log('better-sqlite3 (electron) ->', path.relative(root, bs3Dst))

console.log('prebuild готов')
