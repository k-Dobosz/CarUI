import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Network = {
  ssid: string;
};

export default function WifiSettings() {
  const [networks, setNetworks] = useState<Array<Network>>([]);
  const { ipcRenderer } = window.electron;

  const connect = (ssid: string) => {
    console.log(ssid);
    ipcRenderer.sendMessage('wifi-connect', [{ ssid, password: '12345678' }]);
  };

  useEffect(() => {
    ipcRenderer.sendMessage('wifi-networks-request', []);

    ipcRenderer.on('wifi-networks', (args) => {
      const networksArray = args as Array<Network>;
      setNetworks(networksArray);
      console.log(args);
    });
  }, [ipcRenderer]);

  return (
    <>
      <Link to="/settings" className="settings_row">
        Back
      </Link>
      Networks:
      {networks.map((net) => (
        <button
          onClick={() => connect(net.ssid)}
          type="button"
          className="settings_row"
          key={net.ssid}
        >
          {net.ssid}
        </button>
      ))}
    </>
  );
}
