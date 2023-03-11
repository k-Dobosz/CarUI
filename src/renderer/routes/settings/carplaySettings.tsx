import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import KeyboardPopup from 'renderer/utils/keyboard_popup/keyboard_popup';

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
      .then(({ settings: data }) => setSettings(data.carplay))
      .catch((err) => console.error(err));
  }, [ipcRenderer]);

  const handleInput = (e) => {
    setCurrentSetting(e.target.id);
    setKeyboardVisible(true);
  };

  return (
    <>
      <Link to="/settings" className="settings_row">
        Back
      </Link>
      <form>
        <label htmlFor="dpi" className="settings_row">
          dpi
          <input value={settings.dpi} id="dpi" onClick={handleInput} readOnly />
        </label>
        <label htmlFor="nightMode" className="settings_row">
          nightMode
          <input
            value={settings.nightMode}
            id="nightMode"
            onClick={handleInput}
            readOnly
          />
        </label>
        <label htmlFor="hand" className="settings_row">
          hand
          <input
            value={settings.hand}
            id="hand"
            onClick={handleInput}
            readOnly
          />
        </label>
        <label htmlFor="boxname" className="settings_row">
          boxname
          <input
            value={settings.boxname}
            id="boxname"
            onClick={handleInput}
            readOnly
          />
        </label>
        <label htmlFor="width" className="settings_row">
          width
          <input
            value={settings.width}
            id="width"
            onClick={handleInput}
            readOnly
          />
        </label>
        <label htmlFor="height" className="settings_row">
          height
          <input
            value={settings.height}
            id="height"
            onClick={handleInput}
            readOnly
          />
        </label>
        <label htmlFor="fps" className="settings_row">
          fps
          <input value={settings.fps} id="fps" onClick={handleInput} readOnly />
        </label>
      </form>
      <KeyboardPopup
        placeholder="Change setting..."
        visible={keyboardVisible}
        inputType="text"
        onSubmit={(value) => {
          if (currentSetting != null) {
            settings[currentSetting] = value;

            ipcRenderer
              .invoke('store-set', [
                `settings.carplay.${currentSetting}`,
                value,
              ])
              .catch((err) => console.error(err));
          }

          setKeyboardVisible(false);
        }}
        onCancel={() => {
          setKeyboardVisible(false);
        }}
      />
    </>
  );
}
