import { ipcMain, app } from 'electron';

import { exec } from 'child_process';

export function registerSystemIPC() {
  ipcMain.on('system-shutdown', () => {
    if (process.env.NODE_ENV === 'development') {
      app.exit(0);

      return;
    }

    exec('poweroff', (error) => {
      if (error) {
        console.error(error);
      }
    });
  });
}
