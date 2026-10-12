
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import KeyboardPopup from '../../utils/keyboard_popup/keyboard_popup';
import Focusable from '../../components/focus/focusable';

interface SettingsData {
  dpi: number;
  nightMode: number;
  hand: number;
  boxname: string;
  width: number;
  height: number;
  fps: number;
}

type SettingKey = keyof SettingsData;

const DEFAULT_SETTINGS: SettingsData = {
  dpi: 240,
  nightMode: 0,
  hand: 0,
  boxname: 'nodePlay',
  width: 1920,
  height: 1125,
  fps: 60,
};

const ROWS: SettingKey[] = [
  'dpi',
  'nightMode',
  'hand',
  'boxname',
  'width',
  'height',
  'fps',
];

export default function CarplaySettings() {
  const { ipcRenderer } = window.electron;

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<SettingKey | null>(
    null,
  );
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);

  // Load the persisted CarPlay settings.
  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const stored = await ipcRenderer.invoke(
          'store-get',
          'settings.carplay',
        );

        if (!cancelled && stored && typeof stored === 'object') {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...stored,
          });
        }
      } catch (error) {
        console.error('Failed to load CarPlay settings:', error);
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, [ipcRenderer]);

  const handleInput = useCallback((setting: SettingKey) => {
    setCurrentSetting(setting);
    setKeyboardVisible(true);
  }, []);

  const closeKeyboard = useCallback(() => {
    setKeyboardVisible(false);
    setCurrentSetting(null);
  }, []);

  // Save the entire object under the same key used by loadSettings.
  const saveSetting = useCallback(
    async (rawValue: string) => {
      if (!currentSetting) return;

      const previousValue = settings[currentSetting];
      let value: string | number = rawValue;

      // Keep numeric settings as numbers in persistent storage.
      if (typeof previousValue === 'number') {
        const parsed = Number(rawValue);

        if (!rawValue.trim() || !Number.isFinite(parsed)) {
          console.error(`Invalid numeric value for ${currentSetting}`);
          return;
        }

        value = parsed;
      }

      const nextSettings: SettingsData = {
        ...settings,
        [currentSetting]: value,
      };

      try {
        await ipcRenderer.invoke('store-set', [
          'settings.carplay',
          nextSettings,
        ]);

        // Update the displayed value after the save succeeds.
        setSettings(nextSettings);
        closeKeyboard();
      } catch (error) {
        console.error(`Failed to save ${currentSetting}:`, error);
      }
    },
    [closeKeyboard, currentSetting, ipcRenderer, settings],
  );

  return (
    <>
      <Focusable id="carplay-settings-back">
        <Link to="/settings" className="settings_row">
          Back
        </Link>
      </Focusable>

      <div className="carplay_settings_rows">
        {ROWS.map((key) => (
          <Focusable key={key} id={`carplay-${key}`}>
            <button
              type="button"
              className="settings_row carplay_setting_row"
              onClick={() => handleInput(key)}
              disabled={keyboardVisible}
            >
              <span>{key}</span>

              <span className="carplay_setting_value">
                {String(settings[key])}
              </span>
            </button>
          </Focusable>
        ))}
      </div>

      <KeyboardPopup
        placeholder={`Change ${currentSetting ?? 'setting'}...`}
        visible={keyboardVisible}
        inputType="text"
        initialValue={
          currentSetting ? settings[currentSetting] : ''
        }
        onSubmit={saveSetting}
        onCancel={closeKeyboard}
      />
    </>
  );
}
