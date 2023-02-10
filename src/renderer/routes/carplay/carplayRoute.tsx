import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carplay, CarplayAudio } from 'react-js-carplay';
import io from 'socket.io-client';
import Navbar from '../../components/navbar/navbar';
import './carplay.css';
import Topbar from 'renderer/components/topbar/topbar';

const socket = io('ws://localhost:5005');

export default function CarplayRoute() {
  const [visibility, setVisibility] = useState(true);
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
