import { Link } from 'react-router-dom';
import { RiNetflixFill, RiYoutubeFill, RiSettings4Fill } from 'react-icons/ri';
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
        Shutdown
      </button>
      <Link to="/netflix">
        <RiNetflixFill /> Netflix
      </Link>
      <Link to="/youtube">
        <RiYoutubeFill /> Youtube
      </Link>
      <Link to="/settings">
        <RiSettings4Fill /> Settings
      </Link>
      <Link to="/carplay">Carplay</Link>
    </nav>
  );
}
