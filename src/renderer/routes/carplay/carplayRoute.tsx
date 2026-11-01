import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Carplay } from 'react-js-carplay';
import io from 'socket.io-client';

import Topbar from 'renderer/components/topbar/topbar';
import Navbar from '../../components/navbar/navbar';

import './carplay.scss';

const socket = io('ws://localhost:5005');

interface CarplayLocationState {
  visibility?: boolean;
}

interface StatusPayload {
  status: boolean;
}

const CARPLAY_SETTINGS = {
  dpi: 240,
  nightMode: 0,
  hand: 1,
  boxName: 'nodePlay',
  width: 1024,
  height: 625,
  fps: 60,
};

export default function CarplayRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as CarplayLocationState | null;

  const [visibility, setVisibility] = useState(
    locationState?.visibility ?? true,
  );
  const [ready, setReady] = useState(false);
  const [carplayKey, setCarplayKey] = useState(0);

  useEffect(() => {
    const handleStatus = ({ status }: StatusPayload) => {
      setVisibility(!status);
    };

    const handleQuit = () => {
      navigate('/');
    };

    socket.on('status', handleStatus);
    socket.on('quit', handleQuit);
    socket.emit('statusReq');

    return () => {
      socket.off('status', handleStatus);
      socket.off('quit', handleQuit);
    };
  }, [navigate]);

  useEffect(() => {
    const keys: Record<string, string> = {
      ArrowUp: 'back',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ' ': 'selectDown',
      n: 'next',
      m: 'siri',
      v: 'prev',
      h: 'home',
      q: 'wifi',
      w: 'wifiOk',
      e: 'auto',
    };

    let selectTimer: ReturnType<typeof setTimeout> | undefined;

    const sendKey = (key: string) => {
      const { ipcRenderer } = window.electron;
      ipcRenderer.sendMessage('carplay-sendkey', [{ key }]);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKey =
        event.key.length === 1 ? event.key.toLowerCase() : event.key;

      const key = keys[pressedKey];

      if (!key) return;

      // Ignore OS/browser key-repeat events.
      if (event.repeat) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      console.log(`[CarPlay] Keyboard: ${event.key} -> ${key}`);
      sendKey(key);

      if (key === 'selectDown') {
        if (selectTimer) clearTimeout(selectTimer);

        selectTimer = setTimeout(() => {
          sendKey('selectUp');
          selectTimer = undefined;
        }, 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);

      if (selectTimer) {
        clearTimeout(selectTimer);
        sendKey('selectUp');
      }
    };
  }, []);

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;

    setReady(false);

    firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setCarplayKey((key) => key + 1);
        setReady(true);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  return (
    <div className="carplay_page">
      {visibility && <Topbar />}

      <div className="carplay-container">
        {ready && <Carplay key={carplayKey} settings={CARPLAY_SETTINGS} />}
      </div>

      {visibility && <Navbar />}
    </div>
  );
}
