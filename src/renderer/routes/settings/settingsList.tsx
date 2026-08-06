import { Link } from 'react-router-dom';
import Focusable from '../../components/focus/focusable';


export default function SettingsList() {
  return (
    <>
      <Focusable id="back">
        <Link to="/" className="settings_row">
          Back
        </Link>
      </Focusable>

      <Focusable id="wifi">
        <Link to="wifi" className="settings_row">
          Wifi
        </Link>
      </Focusable>

      <Focusable id="customization">
        <Link to="customization" className="settings_row">
          Customization
        </Link>
      </Focusable>

      <Focusable id="carplay">
        <Link to="carplay" className="settings_row">
          Carplay settings
        </Link>
      </Focusable>
      <Focusable id="system">
        <Link to="system" className="settings_row">
          System settings
        </Link>
      </Focusable>
    </>
  );
}