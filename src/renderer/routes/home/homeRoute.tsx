import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../../components/navbar/navbar';
import clock from '../../utils/clock';
import './home.css';
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
      <p id="home-clock">{clock()}</p>
      <Navbar />
    </main>
  );
}
