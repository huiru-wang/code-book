import { app, BrowserWindow, screen, ipcMain } from 'electron'
import path from 'node:path'
import fs from 'fs';
import os from 'os';
import { createExampleData } from './example';

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
const BASE_CODE_FOLDER_PATH = path.join(os.homedir(), '.codebook');
const CODE_DATA_FILE_PATH = path.join(BASE_CODE_FOLDER_PATH, "code.json");

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

  // read code data
  ipcMain.on('read-code-file', (event) => {
    if (!fs.existsSync(BASE_CODE_FOLDER_PATH)) {
      fs.mkdirSync(BASE_CODE_FOLDER_PATH);
    }

    fs.access(CODE_DATA_FILE_PATH, fs.constants.F_OK, (err) => {
      if (err) {
        // file not exist
        const exampleData: string = createExampleData();
        fs.writeFile(CODE_DATA_FILE_PATH, exampleData, (createErr) => {
          if (createErr) {
            event.reply('read-code-file-response', { error: createErr.message });
          } else {
            event.reply('read-code-file-response', { data: exampleData });
          }
        });
      } else {
        // read
        fs.readFile(CODE_DATA_FILE_PATH, 'utf-8', (readErr, data) => {
          if (readErr) {
            event.reply('read-code-file-response', { error: readErr.message });
          } else {
            event.reply('read-code-file-response', { data });
          }
        });
      }
    });
  });
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(createWindow)
