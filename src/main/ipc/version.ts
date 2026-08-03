import { ipcMain, app } from 'electron';

export function registerVersionIPC() {
  ipcMain.handle('get-version', (_, args: string[]) => {
    const result: Record<string, string> = {};

    for (const type of args) {
      switch (type) {
        case 'app':
          result[type] = app.getVersion();
          break;

        default:
          result[type] = process.versions[type] ?? '';
          break;
      }
    }

    return result;
  });
}
