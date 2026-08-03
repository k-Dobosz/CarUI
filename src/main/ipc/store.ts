import { ipcMain } from 'electron';
import Store from 'electron-store';

export function registerStoreIPC(store: Store) {
  ipcMain.handle('store-get', (_, key) => {
    return store.get(key);
  });

  ipcMain.handle('store-set', (_, args) => {
    return store.set(args[0], args[1]);
  });

  ipcMain.on('store-reset', () => {
    store.clear();
  });
}
