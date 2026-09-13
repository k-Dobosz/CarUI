import { ipcMain, app } from 'electron';
import Store from 'electron-store';
import path from 'path';
import fs from 'fs';

export function registerStoreIPC(store: Store) {
  ipcMain.handle('store-get', (_, key) => {
    return store.get(key);
  });

  ipcMain.handle('store-set', (_, args) => {
    store.set(args[0], args[1]);
    const value = store.get(args[0]);
    return value;
  });

  ipcMain.on('store-reset', () => {
    store.clear();
  });

  ipcMain.handle('get-all-wallpaper-paths', () => {
    const wallpapersDir = app.isPackaged
      ? path.join(process.resourcesPath, 'public', 'wallpapers')
      : path.join(app.getAppPath(), 'public', 'wallpapers');

    if (!fs.existsSync(wallpapersDir)) {
      return [];
    }

    const imageExtensions = new Set([
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      '.gif',
      '.svg',
    ]);

    return fs
      .readdirSync(wallpapersDir, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isFile() &&
          imageExtensions.has(path.extname(entry.name).toLowerCase()),
      )
      .map((entry) => path.join(app.isPackaged ? wallpapersDir : 'wallpapers/', entry.name));
  });
}
