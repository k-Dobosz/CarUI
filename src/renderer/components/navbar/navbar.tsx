import { Link } from 'react-router-dom';
import {
  RiMusic2Fill,
  RiSettings4Fill,
  RiTimeFill,
  RiCarFill,
} from 'react-icons/ri';
import './navbar.scss';
import Focusable from '../focus/focusable';

export default function Navbar() {
  const items = [
    { icon: <RiTimeFill />, title: 'Clock', destination: '/' },
    { icon: <RiMusic2Fill />, title: 'Music', destination: '/music' },
    { icon: <RiSettings4Fill />, title: 'Settings', destination: '/settings' },
    { icon: <RiCarFill />, title: 'Carplay', destination: '/carplay' },
  ];

  return (
    <nav className="navbar">
      <div
        className="main-grid"
        role="navigation"
        aria-label="Main navigation"
      >
        {items.map((item) => (
          <Focusable
            id={`navbar-${item.title.toLowerCase()}`}
          >
            <Link
              to={item.destination}
              className="navbar_link grid-item"
            >
              <div
                className="grid-item-icon"
                aria-hidden="true"
              >
                {item.icon}
              </div>

              <div className="grid-item-title">
                {item.title}
              </div>
            </Link>
          </Focusable>
        ))}
      </div>
    </nav>
  );
}
