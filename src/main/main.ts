/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';

import {
  app,
  BrowserWindow,
  globalShortcut,
  shell,
  systemPreferences,
} from 'electron';

import Store from 'electron-store';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { resolveHtmlPath } from './util';

import { registerBrowserIPC } from './ipc/browser';
import { registerCarplayIPC } from './ipc/carplay';
import { registerStoreIPC } from './ipc/store';
import { registerSystemIPC } from './ipc/system';
import { registerWifiIPC } from './ipc/wifi';
import { registerVersionIPC } from './ipc/version';

import CarplayService from './services/carplay';

import defaults from './defaults.json';
import keys from './bindings.json';

let mainWindow: BrowserWindow | null = null;

const store = new Store({
  defaults,
});

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');

  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';

    autoUpdater.logger = log;

    autoUpdater.checkForUpdatesAndNotify();
  }
}

function getAssetPath(file: string) {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'public', file)
    : path.join(__dirname, '../../public', file);
}

async function createWindow() {
  if (isDebug) {
    await installExtensions();
  }

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

  if (process.platform !== 'darwin') {
    mainWindow.webContents.insertCSS('* { cursor:none!important; }');
  }

  mainWindow.webContents.session.setPermissionRequestHandler(
    (_webContents, permission, callback) => {
      if (permission === 'media') {
        callback(true);
      } else {
        callback(false);
      }
    },
  );

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('mainWindow missing');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);

    return {
      action: 'deny',
    };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

function setupPermissions() {
  if (process.platform === 'darwin') {
    systemPreferences.askForMediaAccess('camera').then((granted) => {
      if (!granted) {
        console.log('Camera permission denied');
      }
    });
  }
}

function setupUpdater() {
  new AppUpdater();
}

function setupShortcuts(carplay: CarplayService) {
  globalShortcut.register('q', () => {
    mainWindow?.webContents.reloadIgnoringCache();
  });

  if (isDebug) {
    return;
  }

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

async function start() {
  setupPermissions();

  const window = await createWindow();

  registerStoreIPC(store);

  registerSystemIPC();

  registerWifiIPC(window);

  registerBrowserIPC(window);

  registerVersionIPC();

  const carplay = new CarplayService(store.get('settings.carplay'));

  registerCarplayIPC(window, carplay);

  setupShortcuts(carplay);

  // Enable if wanted
  // setupUpdater();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  globalShortcut.unregisterAll();
});

app
  .whenReady()
  .then(() => {
    start();

    app.on('activate', () => {
      if (mainWindow === null) {
        createWindow();
      }
    });
  })
  .catch(console.error);
