
import { useEffect, useState } from 'react';

import './clock.scss';

type TimeFormat = '12h' | '24h';

interface TimeSettings {
  format: TimeFormat;
}

interface ClockProps {
  className?: string;
}

const DEFAULT_FORMAT: TimeFormat = '24h';

function getTime(format: TimeFormat) {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12h',
  });
}

export default function Clock({ className = '' }: ClockProps) {
  const { ipcRenderer } = window.electron;

  const [format, setFormat] = useState<TimeFormat>(DEFAULT_FORMAT);
  const [time, setTime] = useState(getTime(DEFAULT_FORMAT));

  // Load the saved time format.
  useEffect(() => {
    let cancelled = false;

    const loadTimeFormat = async () => {
      try {
        const settings = (await ipcRenderer.invoke(
          'store-get',
          'settings.time',
        )) as Partial<TimeSettings> | undefined;

        if (
          !cancelled &&
          (settings?.format === '12h' ||
            settings?.format === '24h')
        ) {
          setFormat(settings.format);
        }
      } catch (error) {
        console.error('Failed to load time format:', error);
      }
    };

    void loadTimeFormat();

    return () => {
      cancelled = true;
    };
  }, [ipcRenderer]);

  // Update the displayed time whenever the format changes.
  useEffect(() => {
    setTime(getTime(format));

    const interval = window.setInterval(() => {
      setTime(getTime(format));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [format]);

  return <span className={`clock ${className}`}>{time}</span>;
}
