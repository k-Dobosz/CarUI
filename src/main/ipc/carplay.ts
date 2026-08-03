import { BrowserWindow, ipcMain } from 'electron';

import CarplayService from '../services/carplay';

export function registerCarplayIPC(
  window: BrowserWindow,
  carplay: CarplayService,
) {
  carplay.on('quit', () => {
    window.webContents.send('carplay-quit-request');
  });

  ipcMain.on('carplay-sendkey', (_, args) => {
    const key = args[0]?.key;

    if (key) {
      carplay.sendKey(key);
    }
  });
}
