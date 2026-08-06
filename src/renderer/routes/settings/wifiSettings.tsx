import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import KeyboardPopup from '../../utils/keyboard_popup/keyboard_popup';
import Focusable from '../../components/focus/focusable';

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

    const cleanup = ipcRenderer.on('wifi-networks', (args) => {
      const networksArray = args as Array<Network>;

      setNetworks(networksArray);
      setIsLoading(false);
    });

    return () => {
      cleanup?.();
    };
  }, [ipcRenderer]);

  return (
    <>
      <Focusable id="back">
        <Link to="/settings" className="settings_row">
          Back
        </Link>
      </Focusable>

      <div className="settings_section_title">Networks:</div>

      {isLoading ? (
        <div className="settings_row">Loading...</div>
      ) : networks.length > 0 ? (
        networks.map((net) => (
          <Focusable key={net.ssid} id={`wifi-${net.ssid}`}>
            <button
              type="button"

              className="settings_row"

              onClick={() => {
                setSelectedNetwork(net.ssid);

                setKeyboardVisible(true);
              }}
            >
              {net.ssid}
            </button>
          </Focusable>
        ))
      ) : (
        <div className="settings_row">No wifi networks available</div>
      )}

      <KeyboardPopup
        placeholder="Type your wifi password..."
        visible={keyboardVisible}
        inputType="password"
        onSubmit={(password) => {
          setKeyboardVisible(false);
          connect(selectedNetwork, password);
        }}

        onCancel={() => {
          setKeyboardVisible(false);
        }}
      />
    </>
  );
}
