import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Focusable from '../../components/focus/focusable';

export default function SystemAboutSettings() {
  const { ipcRenderer } = window.electron;
  const [versions, setVersions] = useState({});

  useEffect(() => {
    ipcRenderer
      .invoke('get-version', ['node', 'chrome', 'electron', 'app'])
      .then((data) => setVersions(data))
      .catch((err) => console.error(err));
  }, [ipcRenderer]);

  return (
    <>

      <Focusable id="back">
        <Link to="/settings/system" className="settings_row">
          Back
        </Link>
      </Focusable>
      <div style={{ padding: '1.5rem' }}>
        <p>App version {versions.app}</p>
        <p>Node.js {versions.node}</p>
        <p>Chromium {versions.chrome}</p>
        <p>Electron {versions.electron}</p>
      </div>
    </>
  );
}
