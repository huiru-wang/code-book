import { app, BrowserWindow, screen, ipcMain } from 'electron'
import path from 'node:path'
import fs from 'fs';
import os from 'os';

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
    // win.webContents.toggleDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  // read code data
  ipcMain.on('read-code-file', (event) => {
    const userHomeDir = os.homedir();
    const folderPath = ".codebook";
    const filePath = path.join(userHomeDir, folderPath, "code-book.json");

    const folderFullPath = path.join(userHomeDir, folderPath);
    if (!fs.existsSync(folderFullPath)) {
      fs.mkdirSync(folderFullPath);
    }

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // file not exist
        const example = [{
          itemId: 1,
          itemKey: "Using double-click to copy the key or value",
          itemValue: "Example Code",
          description: "This is an example",
          frequency: 0,
          tags: ["example"]
        }]
        const exampleData: string = JSON.stringify(example);
        fs.writeFile(filePath, exampleData, (createErr) => {
          if (createErr) {
            event.reply('read-code-file-response', { error: createErr.message });
          } else {
            event.reply('read-code-file-response', { data: exampleData });
          }
        });
      } else {
        // read
        fs.readFile(filePath, 'utf-8', (readErr, data) => {
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
