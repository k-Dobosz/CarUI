import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Carplay, CarplayAudio } from 'react-js-carplay';
import io from 'socket.io-client';
import Topbar from 'renderer/components/topbar/topbar';
import Navbar from '../../components/navbar/navbar';

const socket = io('ws://localhost:5005');

export default function CarplayRoute() {
  const location = useLocation();
  const [visibility, setVisibility] = useState(
    (location.state != null ? location.state.visibility : null) ?? true
  );
  const navigate = useNavigate();

  const touchHandler = (type: number, x: number, y: number) => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.sendMessage('carplay-click', [{ type, x, y }]);
  };

  useEffect(() => {
    socket.on('status', ({ status }) => {
      setVisibility(!status);
      console.log('visibility: ', !status);
    });

    socket.emit('statusReq');

    socket.on('quit', () => {
      console.log('quit event');
      navigate('/');
    });

    return () => {
      socket.off('status');
      socket.off('quit');
    };
  }, [navigate]);

  return (
    <>
      {visibility ? <Topbar /> : ''}
      <Carplay
        settings={{
          dpi: 240,
          nightMode: 0,
          hand: 1,
          boxName: 'nodePlay',
          width: 1024,
          height: 625,
          fps: 60,
        }}
        touchEvent={touchHandler}
        style={{ height: visibility ? 'calc(100% - 23.5vh)' : '' }}
      />
      <CarplayAudio />
      {visibility ? <Navbar /> : ''}
    </>
  );
}
