// Точка входа Electron: main-процесс.
//
// Dev:  рендерер грузит уже работающий next dev (порт 3000, запускается concurrently).
// Prod: main поднимает встроенный Next-сервер из standalone-сборки:
//       ставит MOLY_DB_PATH, прогоняет миграции, спавнит standalone/server.js
//       дочерним процессом (Electron-бинарник как Node через ELECTRON_RUN_AS_NODE),
//       и грузит localhost:PORT в окне.
const { app, BrowserWindow, Menu } = require('electron')
const path = require('node:path')
const net = require('node:net')
const http = require('node:http')
const { spawn } = require('node:child_process')

let serverProcess = null

// Каталог standalone-сборки. В упакованном приложении лежит в resources/standalone
// (extraResources, реальные файлы вне asar).
function standaloneDir() {
  return path.join(process.resourcesPath, 'standalone')
}

// Свободный порт на loopback. tiny race между закрытием тестового сокета и стартом
// сервера допустим для локального single-user приложения.
function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port
      srv.close(() => resolve(port))
    })
    srv.on('error', reject)
  })
}

// Ждём, пока сервер начнёт отвечать на порту. Next при первом запросе компилирует
// страницу, поэтому отвечать может не сразу.
function waitForServer(port, timeoutMs = 60000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    function check() {
      const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
        res.resume()
        resolve()
      })
      req.setTimeout(2000, () => req.destroy(new Error('timeout')))
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('Next-сервер не ответил за ' + timeoutMs + 'мс'))
        else setTimeout(check, 300)
      })
    }
    check()
  })
}

// Миграции перед стартом сервера. better-sqlite3 берём из standalone (пересобран
// под ABI Electron), сам раннер — рядом, в electron/migrate.cjs.
function runMigrationsProd(dbPath) {
  const Database = require(path.join(standaloneDir(), 'node_modules', 'better-sqlite3'))
  const { runMigrations } = require('./migrate.cjs')
  return runMigrations({
    dbPath,
    migrationsFolder: path.join(standaloneDir(), 'drizzle'),
    Database,
  })
}

function startProdServer(port, dbPath) {
  serverProcess = spawn(process.execPath, [path.join(standaloneDir(), 'server.js')], {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      PORT: String(port),
      HOSTNAME: '127.0.0.1',
      MOLY_DB_PATH: dbPath,
      NODE_ENV: 'production',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  serverProcess.stdout.on('data', (d) => process.stdout.write('[next] ' + d))
  serverProcess.stderr.on('data', (d) => process.stderr.write('[next] ' + d))
  serverProcess.on('exit', (code) => console.log('[next] server exited', code))
}

function createWindow(targetUrl) {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    // Ниже этих размеров UI ломается: сайдбар и таблицы не помещаются.
    minWidth: 900,
    minHeight: 600,
    center: true,
    // Дефолтный тёмный фон приложения, чтобы не было белой вспышки до отрисовки.
    backgroundColor: '#030712',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.loadURL(targetUrl)

  // Меню убрано (см. app.whenReady ниже), поэтому стандартные акселераторы
  // devtools не сработают. Перехватываем на уровне ввода, только в dev.
  if (!app.isPackaged) {
    win.webContents.on('before-input-event', (event, input) => {
      const key = input.key.toLowerCase()
      if (key === 'f12' || (input.control && input.shift && key === 'i')) {
        win.webContents.toggleDevTools()
      }
    })
  }
}

async function startProd() {
  const dbPath = path.join(app.getPath('userData'), 'database.db')
  process.env.MOLY_DB_PATH = dbPath

  const { applied } = runMigrationsProd(dbPath)
  console.log('[moly] применено миграций:', applied)

  const port = await findFreePort()
  startProdServer(port, dbPath)
  await waitForServer(port)
  createWindow('http://127.0.0.1:' + port)
}

app.whenReady().then(async () => {
  // Убираем дефолтное меню Electron (View/Window/Help с reload и devtools):
  // без него приложение выглядит как нативный десктоп, а не обёртка над браузером.
  Menu.setApplicationMenu(null)

  try {
    if (app.isPackaged) {
      await startProd()
    } else {
      createWindow('http://localhost:3000')
    }
  } catch (err) {
    console.error('[moly] ошибка запуска:', err)
    const { dialog } = require('electron')
    dialog.showErrorBox('Moly: ошибка запуска', String(err && err.message || err))
    app.quit()
  }

  // macOS: клик по иконке в доке, когда окон нет, открывает новое.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (app.isPackaged) startProd().catch(console.error)
      else createWindow('http://localhost:3000')
    }
  })
})

app.on('window-all-closed', () => {
  // macOS: приложение обычно остаётся в доке после закрытия окон.
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  if (serverProcess && !serverProcess.killed) serverProcess.kill()
})
