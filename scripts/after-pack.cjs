const fs = require('node:fs')
const path = require('node:path')

exports.default = async function (context) {
  const src = path.join(__dirname, '..', '.next', 'standalone', 'node_modules')
  const dst = path.join(context.appOutDir, 'resources', 'standalone', 'node_modules')

  if (!fs.existsSync(src)) {
    console.warn('[afterPack] standalone node_modules не найден:', src)
    return
  }

  fs.cpSync(src, dst, { recursive: true })
  console.log('[afterPack] standalone/node_modules скопирован в', path.relative(context.appOutDir, dst))
}
