import { Link } from 'react-router-dom';

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
      <Link to="/settings" className="settings_row">
        Back
      </Link>
      <Link to="about" className="settings_row">
        About CarUI
      </Link>
      <button onClick={handleReset} type="button" className="settings_row">
        Reset settings
      </button>
      <button onClick={handleShutdown} type="button" className="settings_row">
        Shutdown
      </button>
    </>
  );
}
