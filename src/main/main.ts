/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  BrowserView,
  globalShortcut,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import Carplay from 'node-carplay';
import log from 'electron-log';
import wifi from 'node-wifi';
import Store from 'electron-store';
import { resolveHtmlPath } from './util';

const { exec } = require('node:child_process');
const keys = require('./bindings.json');

wifi.init({
  iface: 'wlan0',
});

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('open-youtube', async (event, arg) => {
  const view = new BrowserView();
  mainWindow?.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: 1024, height: 600 });
  view.webContents.loadURL('https://youtube.com/', {
    userAgent:
      'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.71 Mobile Safari/537.36',
  });
});

ipcMain.on('open-netflix', async (event, arg) => {
  const view = new BrowserView();
  mainWindow?.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: 1024, height: 600 });
  view.webContents.loadURL('https://netflix.com/', {
    userAgent:
      'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.71 Mobile Safari/537.36',
  });
});

ipcMain.on('close-browserview', async (event, arg) => {
  mainWindow?.setBrowserView(null);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'public')
    : path.join(__dirname, '../../public');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 625,
    icon: getAssetPath('icon.png'),
    backgroundColor: '#000000',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    kiosk: app.isPackaged,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  if (process.platform !== 'darwin')
    mainWindow.webContents.insertCSS('* { cursor: none !important; }');

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // new AppUpdater();

  const config = {
    dpi: 240,
    nightMode: 0,
    hand: 0,
    boxName: 'nodePlay',
    width: 1920,
    height: 1125,
    fps: 60,
  };

  const carplay = new Carplay(config);

  carplay.on('quit', () => {
    mainWindow?.webContents.send('carplay-quit-request');
  });

  ipcMain.on('carplay-click', (_, args) => {
    const data = args[0];
    carplay.sendTouch(data.type, data.x, data.y);
    console.log(data.type, data.x, data.y);
  });

  ipcMain.on('system-shutdown', () => {
    if (isDebug) {
      app.exit(0);
      return;
    }

    exec('sudo shutdown now', (error: Error) => {
      if (error) {
        console.error(error);
      }
    });
  });

  ipcMain.on('wifi-networks-request', () => {
    wifi.scan((error, networks) => {
      if (error) {
        console.log(error);
        mainWindow?.webContents.send('wifi-networks', []);
      } else {
        mainWindow?.webContents.send('wifi-networks', networks);
      }
    });
  });

  ipcMain.on('wifi-connect', (_, args: any) => {
    const { ssid, password } = args[0];

    wifi.connect({ ssid, password }, () => {
      console.log(`Connected to ${ssid}`);
    });
  });

  ipcMain.on('wifi-current-request', (_, args: any) => {
    wifi.getCurrentConnections((error, currentConnections) => {
      if (error) {
        console.log(error);
      } else {
        mainWindow?.webContents.send('wifi-current', currentConnections[0]);
      }
    });
  });

  globalShortcut.register('q', () => {
    mainWindow?.webContents.reloadIgnoringCache();
    mainWindow?.setBrowserView(null);
  });

  if (!isDebug) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(keys)) {
      globalShortcut.register(key, () => {
        carplay.sendKey(value);

        if (value === 'selectDown') {
          setTimeout(() => {
            carplay.sendKey('selectUp');
          }, 200);
        }
      });
    }
  }
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);