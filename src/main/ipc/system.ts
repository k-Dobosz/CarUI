
import { ipcMain, app } from 'electron';

import { exec, execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export function registerSystemIPC() {
  ipcMain.on('system-shutdown', () => {
    if (process.env.NODE_ENV === 'development') {
      app.exit(0);
      return;
    }

    exec('poweroff', (error) => {
      if (error) {
        console.error('Failed to shut down system:', error);
      }
    });
  });

  // Set the Linux system clock to a Unix timestamp in milliseconds.
  ipcMain.handle(
    'system-time-set',
    async (_event, timestampMs: number) => {
      if (
        typeof timestampMs !== 'number' ||
        !Number.isFinite(timestampMs)
      ) {
        throw new Error('Invalid system time timestamp');
      }

      const timestampSeconds = Math.floor(timestampMs / 1000);

      try {
        await execFileAsync('date', [
          '--set',
          `@${timestampSeconds}`,
        ]);

        return {
          success: true,
          timestampMs,
        };
      } catch (error) {
        console.error('Failed to set system time:', error);

        throw new Error(
          'Unable to set system time. Check Linux permissions.',
        );
      }
    },
  );

  // Adjust the current Linux system clock by a number of minutes.
  ipcMain.handle(
    'system-time-adjust',
    async (_event, adjustmentMinutes: number) => {
      if (
        typeof adjustmentMinutes !== 'number' ||
        !Number.isInteger(adjustmentMinutes) ||
        Math.abs(adjustmentMinutes) > 1440
      ) {
        throw new Error('Invalid time adjustment');
      }

      try {
        const { stdout } = await execFileAsync('date', [
          '+%s',
        ]);

        const currentTimestamp = Number(stdout.trim());

        if (!Number.isFinite(currentTimestamp)) {
          throw new Error('Could not read current system time');
        }

        const newTimestamp =
          currentTimestamp + adjustmentMinutes * 60;

        await execFileAsync('date', [
          '--set',
          `@${newTimestamp}`,
        ]);

        return {
          success: true,
          timestampMs: newTimestamp * 1000,
        };
      } catch (error) {
        console.error('Failed to adjust system time:', error);

        throw new Error(
          'Unable to adjust system time. Check Linux permissions.',
        );
      }
    },
  );
}
