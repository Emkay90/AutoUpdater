const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });


}

function autoUpdate () {
    const server = 'git+https://github.com/Emkay90/AutoUpdater.git';
    const feed = `${server}/update/${process.platform}/${app.getVersion()}`
    autoUpdater.setFeedURL(feed)
    console.log('Suche alle 10 sek nach Updates')
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify()
     }, 10000)
}

app.on('ready', () => {
   
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('check_for_update', () => {
    autoUpdate();
})

autoUpdater.on('update-available', (info) => {
    sendStatustoWindow('Update verfuegbar')
  
  
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
  });