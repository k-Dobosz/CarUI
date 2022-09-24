import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'carplay-click'
  | 'carplay-status-request'
  | 'carplay-fps-request'
  | 'carplay-reload-request'
  | 'carplay-quit-request'
  | 'carplay-plugged'
  | 'carplay-unplugged'
  | 'system-shutdown'
  | 'open-youtube'
  | 'open-netflix'
  | 'wifi-networks-request'
  | 'wifi-networks'
  | 'wifi-connect';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
