import path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { BrowserWindow } from 'electron';
import { app, ipcMain } from 'electron';

let reverseProcess: ChildProcessWithoutNullStreams | null = null;
let reverseState = false;

function getReverseScriptPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'public', 'reverse-monitor.py');
  }

  return path.join(__dirname, '../../public', 'reverse-monitor.py');
}

export function registerReverseMonitorIPC() {
  ipcMain.handle('reverse-state', () => {
    return reverseState;
  });
}

export function startReverseMonitor(window: BrowserWindow) {
  if (reverseProcess) {
    return;
  }

  reverseProcess = spawn('python3', ['-u', getReverseScriptPath()], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let buffer = '';

  reverseProcess.stdout.setEncoding('utf8');

  reverseProcess.stdout.on('data', (data: string) => {
    buffer += data;

    const lines = buffer.split('\n');

    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const value = line.trim();

      if (value !== '0' && value !== '1') {
        continue;
      }

      const isReversing = value === '1';

      if (reverseState === isReversing) {
        continue;
      }

      reverseState = isReversing;

      console.log(`[Reverse] ${reverseState ? 'ON' : 'OFF'}`);

      if (!window.isDestroyed()) {
        window.webContents.send('reverse-changed', reverseState);
      }
    }
  });

  reverseProcess.stderr.setEncoding('utf8');

  reverseProcess.stderr.on('data', (data: string) => {
    console.error('[Reverse monitor]', data.trim());
  });

  reverseProcess.on('error', (error) => {
    console.error('[Reverse monitor] error:', error);
  });

  reverseProcess.on('exit', () => {
    reverseProcess = null;
  });
}

export function stopReverseMonitor() {
  if (!reverseProcess) {
    return;
  }

  reverseProcess.kill();
  reverseProcess = null;
}
