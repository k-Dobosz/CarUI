import { Link } from 'react-router-dom';
import {
  RiMusic2Fill,
  RiSettings4Fill,
  RiTimeFill,
  RiCarFill,
  RiLockFill,
} from 'react-icons/ri';
import './navbar.css';

export default function Navbar() {
  const handleShutdown = (event: Event) => {
    const { ipcRenderer } = window.electron;
    event.preventDefault();

    ipcRenderer.sendMessage('system-shutdown', []);
  };

  return (
    <nav>
      <button onClick={handleShutdown} type="button">
        <RiLockFill /> Shutdown
      </button>
      <Link to="/">
        <RiTimeFill /> Clock
      </Link>
      <Link to="/music">
        <RiMusic2Fill /> Music
      </Link>
      <Link to="/settings">
        <RiSettings4Fill /> Settings
      </Link>
      <Link to="/carplay">
        <RiCarFill /> Carplay
      </Link>
    </nav>
  );
}
