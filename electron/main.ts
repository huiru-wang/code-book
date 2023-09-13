import { app, BrowserWindow, screen, ipcMain } from 'electron'
import path from 'node:path'
import { flushConfig, flushData, flushTags, readCodeData, readCodeTags, readCodeSettings } from './codeFile';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 700,
    height: 850,
    x: screen.getPrimaryDisplay().bounds.width - 700,
    y: screen.getPrimaryDisplay().bounds.height - 870,
    resizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    icon: path.join(process.env.PUBLIC, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  })

  app.setName('CodeBook');

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    // win.webContents.toggleDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  // read data
  ipcMain.on('read-data', event => readCodeData(event));

  ipcMain.on('read-tags', event => readCodeTags(event));

  ipcMain.on('read-settings', event => readCodeSettings(event));

  // flush data
  ipcMain.on('flush-data', (event, codeData) => flushData(event, codeData));

  ipcMain.on('flush-tags', (event, tags) => flushTags(event, tags));

  ipcMain.on('flush-settings', (event, settings) => flushConfig(event, settings));
}

app.on('window-all-closed', () => {
  win = null
  process.exit(0);
})

app.whenReady().then(createWindow)

// 在 macOS 上，当所有窗口都关闭时退出应用程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 创建新窗口（在 macOS 上，通常在单击应用程序图标后）
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});