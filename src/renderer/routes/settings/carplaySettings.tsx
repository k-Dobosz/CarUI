import { useState } from 'react';
import { Link } from 'react-router-dom';
import KeyboardPopup from 'renderer/utils/keyboard_popup/keyboard_popup';

export default function CarplaySettings() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  return (
    <>
      <Link to="/settings" className="settings_row">
        Back
      </Link>
      <form>
        <label className="settings_row">
          dpi
          <input value="240" onClick={() => setKeyboardVisible(true)} />
        </label>
        <label className="settings_row">
          nightMode
          <input value="0" onClick={() => setKeyboardVisible(true)} />
        </label>
        <label className="settings_row">
          hand
          <input value="0" onClick={() => setKeyboardVisible(true)} />
        </label>
        <label className="settings_row">
          boxname
          <input value="nodePlay" onClick={() => setKeyboardVisible(true)} />
        </label>
        <label className="settings_row">
          width
          <input value="1920" onClick={() => setKeyboardVisible(true)} />
        </label>
        <label className="settings_row">
          height
          <input value="1125" onClick={() => setKeyboardVisible(true)} />
        </label>
        <label className="settings_row">
          fps
          <input value="60" onClick={() => setKeyboardVisible(true)} />
        </label>
      </form>
      <KeyboardPopup
        placeholder="Change setting..."
        visible={keyboardVisible}
        inputType="text"
        onSubmit={() => {
          setKeyboardVisible(false);
        }}
        onCancel={() => {
          setKeyboardVisible(false);
        }}
      />
    </>
  );
}
