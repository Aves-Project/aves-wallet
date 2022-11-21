const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
mainWindow = new BrowserWindow({ width: 900, height: 680, icon: path.join(__dirname, 'logo.png') });
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
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});