import { Link } from 'react-router-dom';
import Focusable from '../../components/focus/focusable';

export default function CustomizationSettings() {
  return (
    <>
      <Focusable id="back">
        <Link to="/settings" className="settings_row">
          Back
        </Link>
      </Focusable>
      <Focusable id="wallpaper">
        <Link to="wallpaper" className="settings_row">
          Wallpaper
        </Link>
      </Focusable>
    </>
  );
}
