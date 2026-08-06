import { useEffect, useState } from 'react';
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
  [key: string]: string | number;
}

export default function CarplaySettings() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<string>();
  const [settings, setSettings] = useState<SettingsData>({
    dpi: 240,
    nightMode: 0,
    hand: 0,
    boxname: 'nodePlay',
    width: 1920,
    height: 1125,
    fps: 60,
  });

  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer
      .invoke('store-get', ['settings.carplay'])
      .then(({ settings: data }) => {
        setSettings(data.carplay);
      })
      .catch(console.error);
  }, [ipcRenderer]);

  const handleInput = (setting: string) => {
    setCurrentSetting(setting);
    setKeyboardVisible(true);
  };

  const saveSetting = (value: string) => {
    if (!currentSetting) {
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [currentSetting]: value,
    }));

    ipcRenderer
      .invoke('store-set', [`settings.carplay.${currentSetting}`, value])
      .catch(console.error);

    setKeyboardVisible(false);
  };

  const rows = [
    'dpi',
    'nightMode',
    'hand',
    'boxname',
    'width',
    'height',
    'fps',
  ];

  return (
    <>
      <Focusable id="back">
        <Link to="/settings" className="settings_row">
          Back
        </Link>
      </Focusable>

      <form>
        {rows.map((key) => (
          <Focusable key={key} id={`carplay-${key}`}>
            <label htmlFor={key} className="settings_row">
              <span>{key}</span>

              <input
                id={key}
                value={settings[key]}
                readOnly
                onClick={() => handleInput(key)}
              />
            </label>
          </Focusable>
        ))}
      </form>

      <KeyboardPopup
        placeholder="Change setting..."
        visible={keyboardVisible}
        inputType="text"
        initialValue={settings[currentSetting ?? '']}
        onSubmit={saveSetting}
        onCancel={() => setKeyboardVisible(false)}
      />
    </>
  );
}
