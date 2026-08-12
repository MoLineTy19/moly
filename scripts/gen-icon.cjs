// Собирает многослойный build/icon.ico из build/icon.svg.
// ICO с PNG-вложениями (формат поддерживается Windows Vista+ и electron-builder).
// Запуск: node scripts/gen-icon.cjs
const sharp = require('sharp')
const fs = require('node:fs')
const path = require('node:path')

const sizes = [16, 24, 32, 48, 64, 128, 256]
const svgPath = path.join(__dirname, '..', 'build', 'icon.svg')
const outPath = path.join(__dirname, '..', 'build', 'icon.ico')

async function main() {
  const svg = fs.readFileSync(svgPath)

  const pngs = await Promise.all(
    sizes.map((s) => sharp(svg, { density: 384 }).resize(s, s).png().toBuffer())
  )

  // Заголовок ICO: 6 байт. Каталог: по 16 байт на размер. Затем PNG-данные.
  const headerSize = 6
  const dirEntrySize = 16
  const dirSize = dirEntrySize * pngs.length
  let offset = headerSize + dirSize

  const dir = Buffer.alloc(dirSize)
  let p = 0
  for (let i = 0; i < pngs.length; i++) {
    const s = sizes[i]
    // 0 означает 256 в каталоге ICO.
    dir.writeUInt8(s >= 256 ? 0 : s, p)
    dir.writeUInt8(s >= 256 ? 0 : s, p + 1)
    dir.writeUInt8(0, p + 2) // палитра (нет)
    dir.writeUInt8(0, p + 3) // reserved
    dir.writeUInt16LE(1, p + 4) // planes
    dir.writeUInt16LE(32, p + 6) // bpp
    dir.writeUInt32LE(pngs[i].length, p + 8) // размер данных
    dir.writeUInt32LE(offset, p + 12) // смещение
    offset += pngs[i].length
    p += dirEntrySize
  }

  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type = ICO
  header.writeUInt16LE(pngs.length, 4) // count

  fs.writeFileSync(outPath, Buffer.concat([header, dir, ...pngs]))
  console.log('icon.ico собран:', path.relative(process.cwd(), outPath), '(' + sizes.join(',') + ')')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
