import { BrowserWindow, WebContentsView, ipcMain } from 'electron';

let browserView: WebContentsView | null = null;

export function registerBrowserIPC(window: BrowserWindow) {
  ipcMain.on('open-youtube', () => {
    openBrowser(window, 'https://youtube.com/');
  });

  ipcMain.on('open-netflix', () => {
    openBrowser(window, 'https://netflix.com/');
  });

  ipcMain.on('close-browserview', () => {
    closeBrowser();
  });
}

function openBrowser(window: BrowserWindow, url: string) {
  closeBrowser();

  browserView = new WebContentsView();

  window.contentView.addChildView(browserView);

  browserView.setBounds({
    x: 0,
    y: 0,
    width: 1024,
    height: 600,
  });

  browserView.webContents.loadURL(url, {
    userAgent:
      'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/103 Mobile Safari/537.36',
  });
}

function closeBrowser() {
  if (!browserView) {
    return;
  }

  browserView.webContents.close();

  browserView = null;
}
