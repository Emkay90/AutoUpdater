const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');




let mainWindow;

autoUpdater.logger = log;
log.info('App startet');

function createWindow() {
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

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
    console.log("wurde ausgeführt")
  });


}

// function autoUpdate() {
//   const server = 'git+https://github.com/Emkay90/AutoUpdater.git';
//   const feed = `${server}/update/${process.platform}/${app.getVersion()}`
//   autoUpdater.setFeedURL(feed)
//   setInterval(() => {
//     autoUpdater.checkForUpdatesAndNotify()
//   }, 10000)

//   console.log('Suche alle 10 sek nach Updates')
//   log.info('Suche alle 10 sek nach Updates')

// };

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
};

app.on('ready', () => {
  createWindow();
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify()
    console.log('Suche alle 60 sek nach Update')
  }, 60000)
  

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

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// ipcMain.on('check_for_updates', () => {
//   setInterval(() => {
//     autoUpdater.checkForUpdatesAndNotify()
//   }, 10000)
//   console.log('Suche alle 10 sek nach Updates')
  
// });



autoUpdater.on('update-available', (event) => {
  console.log("Update verfügbar");
  mainWindow.webContents.send('update_available', { event });
});

autoUpdater.on('update-not-available', (event) => {
  mainWindow.webContents.send('update_not_available');
  sendStatusToWindow(event);
  console.log("Kein Update verfügbar")
});

autoUpdater.on('update-downloaded', () => {
  console.log("Update heruntergeladen");
  mainWindow.webContents.send('update_downloaded');
});