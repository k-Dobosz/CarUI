import { Link } from 'react-router-dom';

import Focusable from '../../components/focus/focusable';
import { useDashboard } from '../../components/dashboard/dashboardProvider';
import './viewport.scss'

type SafeAreaSide =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

const SIDES: {
  key: SafeAreaSide;
  label: string;
}[] = [
  {
    key: 'top',
    label: 'Top',
  },
  {
    key: 'right',
    label: 'Right',
  },
  {
    key: 'bottom',
    label: 'Bottom',
  },
  {
    key: 'left',
    label: 'Left',
  },
];

export default function ViewportSettings() {
  const {
    safeArea,
    changeSide,
    setBackground,
    resetSafeArea,
  } = useDashboard();

  return (
    <div className="viewport_settings">
      <Focusable id="back">
        <Link
          to="/settings/display"
          className="settings_row settings_back"
        >
          <span className="settings_back_icon">
            ‹
          </span>

          <span>Display</span>
        </Link>
      </Focusable>

      <div className="settings_header">
        <h1>Viewport</h1>

        <p>
          Adjust the usable display area to match
          the physical dashboard.
        </p>
      </div>

      <div className="viewport_controls">
        {SIDES.map(({ key, label }) => (
          <div
            key={key}
            className="viewport_control"
          >
            <div className="viewport_control_info">
              <span className="viewport_control_label">
                {label}
              </span>

              <span className="viewport_control_value">
                {safeArea[key]} px
              </span>
            </div>

            <div className="viewport_control_buttons">
              <Focusable
                id={`${key}-minus-10`}
              >
                <button
                  type="button"
                  className="viewport_button"
                  aria-label={`${label}, decrease by 10 pixels`}
                  onClick={() =>
                    changeSide(key, -10)
                  }
                >
                  −10
                </button>
              </Focusable>

              <Focusable
                id={`${key}-minus-1`}
              >
                <button
                  type="button"
                  className="viewport_button"
                  aria-label={`${label}, decrease by 1 pixel`}
                  onClick={() =>
                    changeSide(key, -1)
                  }
                >
                  −1
                </button>
              </Focusable>

              <div className="viewport_value">
                {safeArea[key]}
              </div>

              <Focusable
                id={`${key}-plus-1`}
              >
                <button
                  type="button"
                  className="viewport_button"
                  aria-label={`${label}, increase by 1 pixel`}
                  onClick={() =>
                    changeSide(key, 1)
                  }
                >
                  +1
                </button>
              </Focusable>

              <Focusable
                id={`${key}-plus-10`}
              >
                <button
                  type="button"
                  className="viewport_button"
                  aria-label={`${label}, increase by 10 pixels`}
                  onClick={() =>
                    changeSide(key, 10)
                  }
                >
                  +10
                </button>
              </Focusable>
            </div>
          </div>
        ))}
      </div>

      <div className="viewport_section">
        <div className="viewport_section_header">
          <span>Inset background</span>

          <span className="viewport_section_description">
            Appearance of the unused display area
          </span>
        </div>

        <div className="viewport_background_options">
          <Focusable id="background-black">
            <button
              type="button"
              className={`viewport_option ${
                safeArea.background === 'black'
                  ? 'is_selected'
                  : ''
              }`}
              onClick={() =>
                setBackground('black')
              }
              aria-pressed={
                safeArea.background === 'black'
              }
            >
              <span className="viewport_option_preview viewport_option_preview_black" />

              <span>Black</span>

              {safeArea.background ===
                'black' && (
                <span className="viewport_option_check">
                  ✓
                </span>
              )}
            </button>
          </Focusable>

          <Focusable id="background-transparent">
            <button
              type="button"
              className={`viewport_option ${
                safeArea.background ===
                'transparent'
                  ? 'is_selected'
                  : ''
              }`}
              onClick={() =>
                setBackground('transparent')
              }
              aria-pressed={
                safeArea.background ===
                'transparent'
              }
            >
              <span className="viewport_option_preview viewport_option_preview_transparent" />

              <span>Transparent</span>

              {safeArea.background ===
                'transparent' && (
                <span className="viewport_option_check">
                  ✓
                </span>
              )}
            </button>
          </Focusable>
        </div>
      </div>

      <Focusable id="reset">
        <button
          type="button"
          className="viewport_reset"
          onClick={resetSafeArea}
        >
          Reset viewport
        </button>
      </Focusable>
    </div>
  );
}