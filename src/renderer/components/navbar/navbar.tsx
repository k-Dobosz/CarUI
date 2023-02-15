import { Link } from 'react-router-dom';
import {
  RiMusic2Fill,
  RiSettings4Fill,
  RiTimeFill,
  RiCarFill,
  RiLockFill,
} from 'react-icons/ri';
import './navbar.scss';

export default function Navbar() {
  const handleShutdown = (event: Event) => {
    const { ipcRenderer } = window.electron;
    event.preventDefault();

    ipcRenderer.sendMessage('system-shutdown', []);
  };

  return (
    <nav className="navbar">
      <button className="navbar_btn" onClick={handleShutdown} type="button">
        <RiLockFill /> Shutdown
      </button>
      <Link to="/" className="navbar_link">
        <RiTimeFill /> Clock
      </Link>
      <Link to="/music" className="navbar_link">
        <RiMusic2Fill /> Music
      </Link>
      <Link to="/settings" className="navbar_link">
        <RiSettings4Fill /> Settings
      </Link>
      <Link to="/carplay" className="navbar_link">
        <RiCarFill /> Carplay
      </Link>
    </nav>
  );
}
