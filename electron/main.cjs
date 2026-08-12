// Точка входа Electron: main-процесс.
// Dev: рендерер грузит уже работающий next dev (порт 3000, запускается concurrently).
// Prod: здесь же будет подъём встроенного Next-сервера и миграции (шаг 3 плана).
const { app, BrowserWindow, Menu } = require('electron')

function createWindow() {
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

  win.loadURL('http://localhost:3000')

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

app.whenReady().then(() => {
  // Убираем дефолтное меню Electron (View/Window/Help с reload и devtools):
  // без него приложение выглядит как нативный десктоп, а не обёртка над браузером.
  Menu.setApplicationMenu(null)

  createWindow()

  // macOS: клик по иконке в доке, когда окон нет, открывает новое.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // macOS: приложение обычно остаётся в доке после закрытия окон.
  if (process.platform !== 'darwin') app.quit()
})
