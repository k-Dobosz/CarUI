import { Link } from 'react-router-dom';

import Focusable from '../../components/focus/focusable';

export default function SystemSettings() {
  const { ipcRenderer } = window.electron;

  const handleReset = (): void => {
    ipcRenderer.sendMessage('store-reset', []);
  };

  const handleShutdown = (): void => {
    ipcRenderer.sendMessage('system-shutdown', []);
  };

  return (
    <>
      <Focusable id="back">
        <Link to="/settings" className="settings_row">
          Back
        </Link>
      </Focusable>

      <Focusable id="about">
        <Link to="about" className="settings_row">
          About CarUI
        </Link>
      </Focusable>

      <Focusable id="reset">
        <button onClick={handleReset} type="button" className="settings_row">
          Reset settings
        </button>
      </Focusable>

      <Focusable id="shutdown">
        <button onClick={handleShutdown} type="button" className="settings_row">
          Shutdown
        </button>
      </Focusable>
    </>
  );
}
