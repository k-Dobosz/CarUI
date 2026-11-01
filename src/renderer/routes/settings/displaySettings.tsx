import { Link } from 'react-router-dom';

import Focusable from '../../components/focus/focusable';

export default function DisplaySettings() {
  return (
    <>
      <Focusable id="back">
        <Link to="/settings" className="settings_row">
          Back
        </Link>
      </Focusable>
      <Focusable id="viewport">
        <Link to="viewport" className="settings_row">
          Viewport
        </Link>
      </Focusable>
      <Focusable id="ui-scale">
        <Link to="ui-scale" className="settings_row">
          UI Scale
        </Link>
      </Focusable>
    </>
  );
}