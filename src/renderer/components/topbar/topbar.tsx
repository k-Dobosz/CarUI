import { Link } from 'react-router-dom';
import { RiNetflixFill, RiYoutubeFill, RiSettings4Fill } from 'react-icons/ri';
import './topbar.css';
import clock from 'renderer/utils/clock';

export default function Topbar() {
  return (
    <div className="topbar">
      <p className="clock">{clock()}</p>
    </div>
  );
}
