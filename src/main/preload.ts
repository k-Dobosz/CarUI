import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'carplay-sendkey'
  | 'carplay-quit-request'
  | 'store-get'
  | 'store-set'
  | 'store-reset'
  | 'system-shutdown'
  | 'open-youtube'
  | 'open-netflix'
  | 'wifi-networks-request'
  | 'wifi-networks'
  | 'wifi-connect'
  | 'wifi-current-request'
  | 'wifi-current'
  | 'get-version';

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
    invoke(channel: Channels, args: unknown[]) {
      return ipcRenderer.invoke(channel, args);
    },
  },
});
