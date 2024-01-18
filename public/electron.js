const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
// nativeImage, Tray
const { nativeImage, Tray, Menu } = require('electron')
let mainWindow;
// create tray
let tray = null;
function createTray () {
    const icon = path.join(__dirname, 'logo.png')
    const trayicon = nativeImage.createFromPath(icon)
    tray = new Tray(trayicon.resize({ width: 16 }))
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: () => {
          createWindow()
        }
      },
      {
        label: 'Quit',
        click: () => {
          app.quit() // actually quit the app.
        }
      },
    ])
  
    tray.setContextMenu(contextMenu)
  }
function createWindow() {
    if (!tray) {
        createTray()
      }
mainWindow = new BrowserWindow({ width: 1050, height: 800, icon: path.join(__dirname, 'logo.png') });
    // disble menu bar and dev tools and maximize window
    mainWindow.setMenuBarVisibility(false);
    // disable resize
    mainWindow.setResizable(false);
    mainWindow.loadURL(isDev ? "http://localhost:3000": path.join(__dirname, "../build/index.html"));
    // set icon
    mainWindow.setIcon(path.join(__dirname, 'logo.png'));
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    // alert the user that app is still running
    

});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// run the node in the background
// on first run
app.on('ready', () => {
    // win documents/aves-data 
    // mac ~/Library/Application Support/aves-data
    // linux ~/.aves-data
    // https://github.com/Aves-Project/aves-go/releases
    //

    // check 

});

