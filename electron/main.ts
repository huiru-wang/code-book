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
    resizable: true,
    maximizable: false,
    autoHideMenuBar: true,
    icon: path.join(process.env.PUBLIC, '4391378.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.toggleDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  // read data
  ipcMain.on('read-data', event => readCodeData(event));

  ipcMain.on('read-tags', event => readCodeTags(event));

  ipcMain.on('read-settings', event => readCodeSettings(event));

  ipcMain.on('flush-data', (event, codeData) => flushData(event, codeData));

  ipcMain.on('flush-tags', (event, tags) => flushTags(event, tags));

  ipcMain.on('flush-settings', (event, settings) => flushConfig(event, settings));
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(createWindow)
