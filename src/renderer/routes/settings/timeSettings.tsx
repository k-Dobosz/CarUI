import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Focusable from '../../components/focus/focusable';

import './timeSettings.scss';

type TimeFormat = '12h' | '24h';

interface TimeSettingsData {
  format: TimeFormat;
}

const DEFAULT_SETTINGS: TimeSettingsData = {
  format: '24h',
};

export default function TimeSettings() {
  const { ipcRenderer } = window.electron;

  const [settings, setSettings] = useState<TimeSettingsData>(DEFAULT_SETTINGS);

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [error, setError] = useState('');

  // Load the persisted time format.
  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const stored = await ipcRenderer.invoke('store-get', 'settings.time');

        if (!cancelled && stored && typeof stored === 'object') {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...stored,
          });
        }
      } catch (error) {
        console.error('Failed to load time settings:', error);
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, [ipcRenderer]);

  // Keep the displayed system time updated.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  // Save the 12/24-hour preference.
  const saveSettings = useCallback(
    async (nextSettings: TimeSettingsData) => {
      setError('');

      try {
        await ipcRenderer.invoke('store-set', ['settings.time', nextSettings]);

        setSettings(nextSettings);
      } catch (error) {
        console.error('Failed to save time settings:', error);
        setError('Failed to save time format.');
      }
    },
    [ipcRenderer],
  );

  const setFormat = useCallback(
    (format: TimeFormat) => {
      void saveSettings({
        ...settings,
        format,
      });
    },
    [settings, saveSettings],
  );

  // Adjust the actual Linux system clock.
  const adjustSystemTime = useCallback(
    async (minutes: number) => {
      setError('');

      try {
        await ipcRenderer.invoke('system-time-adjust', minutes);

        setCurrentTime(Date.now());
      } catch (error) {
        console.error('Failed to adjust Linux system time:', error);

        setError('Unable to change system time. Check Linux permissions.');
      }
    },
    [ipcRenderer],
  );

  // Reset the system clock to the current real time.
  const resetSystemTime = useCallback(async () => {
    setError('');

    try {
      await ipcRenderer.invoke('system-time-set', Date.now());

      setCurrentTime(Date.now());

      await saveSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error('Failed to reset system time:', error);

      setError('Unable to reset system time. Check Linux permissions.');
    }
  }, [ipcRenderer, saveSettings]);

  const formattedTime = new Date(currentTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: settings.format === '12h',
  });

  return (
    <div className="time_settings">
      <Focusable id="back">
        <Link to="/settings" className="settings_row">
          Back
        </Link>
      </Focusable>

      <header className="time_settings_header">
        <h1>Time</h1>
        <p>Configure the clock format and adjust the Linux system time.</p>
      </header>

      <section className="time_settings_section">
        <div className="time_settings_section_header">
          <span>System time</span>

          <span className="time_settings_description">
            Current Linux system clock
          </span>
        </div>

        <div className="time_settings_clock">{formattedTime}</div>
      </section>

      <section className="time_settings_section">
        <div className="time_settings_section_header">
          <span>Time format</span>

          <span className="time_settings_description">
            Choose how the clock is displayed
          </span>
        </div>

        <div className="time_settings_options">
          <Focusable id="time-format-12h" scope="time-format">
            <button
              type="button"
              className={`time_settings_option ${
                settings.format === '12h' ? 'is_selected' : ''
              }`}
              onClick={() => setFormat('12h')}
              aria-pressed={settings.format === '12h'}
            >
              <span>12-hour</span>

              <span className="time_settings_option_example">1:30 PM</span>

              {settings.format === '12h' && (
                <span className="time_settings_check">✓</span>
              )}
            </button>
          </Focusable>

          <Focusable id="time-format-24h" scope="time-format">
            <button
              type="button"
              className={`time_settings_option ${
                settings.format === '24h' ? 'is_selected' : ''
              }`}
              onClick={() => setFormat('24h')}
              aria-pressed={settings.format === '24h'}
            >
              <span>24-hour</span>

              <span className="time_settings_option_example">13:30</span>

              {settings.format === '24h' && (
                <span className="time_settings_check">✓</span>
              )}
            </button>
          </Focusable>
        </div>
      </section>

      <section className="time_settings_section">
        <div className="time_settings_section_header">
          <span>Adjust system time</span>

          <span className="time_settings_description">
            Changes the Linux system clock
          </span>
        </div>

        <div className="time_settings_adjust_row">
          <span className="time_settings_adjust_label">Hours</span>

          <div className="time_settings_adjust_controls">
            <Focusable id="time-hours-minus-1">
              <button
                type="button"
                className="time_settings_adjust_button"
                aria-label="Decrease system time by one hour"
                onClick={() => void adjustSystemTime(-60)}
              >
                −1
              </button>
            </Focusable>

            <Focusable id="time-hours-plus-1">
              <button
                type="button"
                className="time_settings_adjust_button"
                aria-label="Increase system time by one hour"
                onClick={() => void adjustSystemTime(60)}
              >
                +1
              </button>
            </Focusable>
          </div>
        </div>

        <div className="time_settings_adjust_row">
          <span className="time_settings_adjust_label">Minutes</span>

          <div className="time_settings_adjust_controls">
            <Focusable id="time-minutes-minus-10">
              <button
                type="button"
                className="time_settings_adjust_button"
                aria-label="Decrease system time by ten minutes"
                onClick={() => void adjustSystemTime(-10)}
              >
                −10
              </button>
            </Focusable>

            <Focusable id="time-minutes-minus-1">
              <button
                type="button"
                className="time_settings_adjust_button"
                aria-label="Decrease system time by one minute"
                onClick={() => void adjustSystemTime(-1)}
              >
                −1
              </button>
            </Focusable>

            <Focusable id="time-minutes-plus-1">
              <button
                type="button"
                className="time_settings_adjust_button"
                aria-label="Increase system time by one minute"
                onClick={() => void adjustSystemTime(1)}
              >
                +1
              </button>
            </Focusable>

            <Focusable id="time-minutes-plus-10">
              <button
                type="button"
                className="time_settings_adjust_button"
                aria-label="Increase system time by ten minutes"
                onClick={() => void adjustSystemTime(10)}
              >
                +10
              </button>
            </Focusable>
          </div>
        </div>

        <Focusable id="time-reset">
          <button
            type="button"
            className="time_settings_reset"
            onClick={() => void resetSystemTime()}
          >
            Reset system time
          </button>
        </Focusable>
      </section>

      {error && (
        <p className="time_settings_error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
