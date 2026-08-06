import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../../components/navbar/navbar';
import Clock from '../../components/clock/clock';
import './home.scss';

const socket = io('ws://localhost:5005');

export default function HomeRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('status', ({ status }) => {
      if (status === true)
        navigate('/carplay', { state: { visibility: false } });
    });

    return () => {
      socket.off('status');
    };
  }, [navigate]);
  return (
    <main>
      <Clock className="home-clock" />
      <Navbar />
    </main>
  );
}
