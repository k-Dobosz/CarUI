import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import KeyboardPopup from 'renderer/utils/keyboard_popup/keyboard_popup';

type Network = {
  ssid: string;
};

export default function WifiSettings() {
  const [networks, setNetworks] = useState<Array<Network>>([]);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { ipcRenderer } = window.electron;

  const connect = (ssid: string, password: string) => {
    ipcRenderer.sendMessage('wifi-connect', [{ ssid, password }]);
  };

  useEffect(() => {
    ipcRenderer.sendMessage('wifi-networks-request', []);

    ipcRenderer.on('wifi-networks', (args) => {
      const networksArray = args as Array<Network>;
      setNetworks(networksArray);
      setIsLoading(false);
      console.log(args);
    });
  }, [ipcRenderer]);

  const list =
    networks.length > 0 ? (
      networks.map((net) => {
        return (
          <button
            onClick={() => {
              setSelectedNetwork(net.ssid);
              setKeyboardVisible(true);
            }}
            type="button"
            className="settings_row"
            key={net.ssid}
          >
            {net.ssid}
          </button>
        );
      })
    ) : (
      <span>No wifi networks available</span>
    );

  return (
    <>
      <Link to="/settings" className="settings_row">
        Back
      </Link>
      Networks:
      {isLoading ? 'Loading...' : list}
      <KeyboardPopup
        placeholder="Type your wifi password..."
        visible={keyboardVisible}
        inputType="password"
        onSubmit={(password) => {
          setKeyboardVisible(false);
          console.log(
            'Submitted!, selected network:',
            selectedNetwork,
            ', password:',
            password
          );
          connect(selectedNetwork, password);
        }}
        onCancel={() => {
          setKeyboardVisible(false);
        }}
      />
    </>
  );
}
