import { app, BrowserWindow, ipcMain, dialog, Tray, Menu } from 'electron'
import path from 'node:path'
import schedule from 'node-schedule';
import fs from 'fs-extra';

const fileJson = 'data.json';
let directoriesJson:any;

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
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    autoHideMenuBar: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  // Open the DevTools.
  // win.webContents.openDevTools();
  // win.webContents.reloadIgnoringCache();
  win.removeMenu();
  win.maximize();

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(async function () {
  const tray = new Tray(path.join(__dirname, '../favicon.ico'))
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Abrir',
      click: () => {
        win?.show()
      }
    },
    {
      label: 'Salir',
      click: () => {
        app.quit()
      }
    }
  ]))

  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!canceled)
      return filePaths[0];
  });

  ipcMain.handle('db:directories', async () => {

    if (fs.existsSync(fileJson)) {
      let readFileJson:any = fs.readFileSync(fileJson);

      directoriesJson = JSON.parse(readFileJson);

      return directoriesJson;
    }

    let createStream = fs.createWriteStream(fileJson);

    createStream.write(JSON.stringify([]));

    createStream.end();

    directoriesJson = [];

    return {};
  });

  ipcMain.handle('db:directories:destroy', async (data:any) => {
    let readFileJson:any = fs.readFileSync(fileJson);
    let directories = JSON.parse(readFileJson);
    directoriesJson = directories.filter(directory => directory.id !== data.id);
    fs.writeFileSync(fileJson, directoriesJson);
  });

  ipcMain.handle('directories:backup', async (data:any) => {
    fs.copySync(data.from, data.to);
    return true;
  });

  ipcMain.handle('db:directories:update', async (data:any) => {
    console.log(data)
    // let readFileJson:any = fs.readFileSync(fileJson);
    // let directories = JSON.parse(readFileJson);
  });

  ipcMain.handle('db:directories:write', async (data:any) => {
    if (!fs.existsSync(fileJson)) {
      let createStream = fs.createWriteStream(fileJson);
      createStream.write(JSON.stringify([]));
      createStream.end();
    }

    directoriesJson = JSON.parse(data);

    fs.writeFileSync(fileJson, data);
  });

  schedule.scheduleJob('* * * * *', () => {
    directoriesJson.forEach(directory => {
      let schedule = directory.schedule;
      let date = new Date();
      if (
        directory.active
        && schedule.hours == date.getHours()
        && schedule.minutes == date.getMinutes()
      ) {
        fs.copySync(directory.from, directory.to);
      }
    });
  });

  createWindow();

  app.on('before-quit', () => {
    // Mostrar un mensaje de confirmación
    // const respuesta = dialog.showMessageBoxSync(win, {
    //   type: 'question',
    //   buttons: ['Sí', 'No'],
    //   title: 'Confirmación',
    //   message: '¿Estás seguro de que quieres salir de la aplicación?'
    // })
  
    // if (respuesta === 0) {
      if (process.platform !== 'darwin') {
        app.exit(0);
      }
    // } else {
      // event.preventDefault();
    // }
  })
  
})
