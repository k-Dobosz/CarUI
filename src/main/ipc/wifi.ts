import { BrowserWindow, ipcMain } from 'electron';

import wifi from 'node-wifi';

wifi.init({
  iface: 'wlan0',
});

export function registerWifiIPC(window: BrowserWindow) {
  ipcMain.on('wifi-networks-request', () => {
    wifi.scan((error, networks) => {
      if (error) {
        window.webContents.send('wifi-networks', []);

        return;
      }

      window.webContents.send('wifi-networks', networks);
    });
  });

  ipcMain.on('wifi-connect', (_, args) => {
    const { ssid, password } = args[0];

    wifi.connect(
      {
        ssid,
        password,
      },
      console.error,
    );
  });

  ipcMain.on('wifi-current-request', () => {
    wifi.getCurrentConnections((error, connections) => {
      if (error) {
        return;
      }

      window.webContents.send('wifi-current', connections[0]);
    });
  });
}
