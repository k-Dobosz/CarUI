import { Link } from 'react-router-dom';
import { RiNetflixFill, RiYoutubeFill, RiSettings4Fill } from 'react-icons/ri';
import './topbar.scss';
import Clock from '../clock/clock';
import { useEffect, useState } from 'react';
import { RiWifiFill } from 'react-icons/ri';

export default function Topbar() {
  const { ipcRenderer } = window.electron;
  const [currentNetwork, setCurrentNetwork] = useState('');

  useEffect(() => {
    ipcRenderer.sendMessage('wifi-current-request', []);

    ipcRenderer.on('wifi-current', (args: any) => {
      setCurrentNetwork(args.ssid);
    });
  }, [ipcRenderer]);

  return (
    <div className="topbar">
      {currentNetwork != '' ? (
        <p className="currentNetwork">
          <RiWifiFill /> {currentNetwork}
        </p>
      ) : (
        ''
      )}
      <Clock />
    </div>
  );
}
