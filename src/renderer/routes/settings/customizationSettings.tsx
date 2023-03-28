import { Link } from 'react-router-dom';

export default function CustomizationSettings() {
  return (
    <>
      <Link to="/settings" className="settings_row">
        Back
      </Link>
      <Link to="wallpaper" className="settings_row">
        Wallpaper
      </Link>
    </>
  );
}
