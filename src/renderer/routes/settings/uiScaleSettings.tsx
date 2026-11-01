import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Focusable from '../../components/focus/focusable';
import './uiScaleSettings.scss';

const DEFAULT_SCALE = 100;
const MIN_SCALE = 75;
const MAX_SCALE = 150;
const STEP = 5;

export default function UIScaleSettings() {
  const [scale, setScale] = useState(DEFAULT_SCALE);

  useEffect(() => {
    const loadScale = async () => {
      try {
        const savedScale = (await window.electron.ipcRenderer.invoke(
          'store-get',
          'settings.uiScale',
        )) as number | undefined;

        if (typeof savedScale === 'number' && Number.isFinite(savedScale)) {
          const value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale));
          setScale(value);

          document.documentElement.style.setProperty(
            '--ui-scale',
            String(value / 100),
          );
        }
      } catch (error) {
        console.error('Failed to load UI scale:', error);
      }
    };

    loadScale();
  }, []);

  const updateScale = async (value: number) => {
    const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

    setScale(nextScale);

    document.documentElement.style.setProperty(
      '--ui-scale',
      String(nextScale / 100),
    );

    window.dispatchEvent(
      new CustomEvent('ui-scale-change', {
        detail: nextScale,
      }),
    );

    try {
      await window.electron.ipcRenderer.invoke(
        'store-set',
        'settings.uiScale',
        nextScale,
      );
    } catch (error) {
      console.error('Failed to save UI scale:', error);
    }
  };

  return (
    <div className="ui_scale_settings">
      <Focusable id="back">
        <Link to="/settings" className="settings_row">
          Back
        </Link>
      </Focusable>

      <header className="settings_header">
        <h1>UI Scaling</h1>
        <p>Adjust the size of the dashboard interface.</p>
      </header>

      <div className="ui_scale_controls">
        <div className="ui_scale_control">
          <div className="ui_scale_control_info">
            <span className="ui_scale_control_label">Interface scale</span>
            <span className="ui_scale_control_value">
              Change the size of interface elements
            </span>
          </div>

          <div className="ui_scale_control_buttons">
            <Focusable id="ui-scale-decrease" scope="ui-scale">
              <button
                className="ui_scale_button"
                onClick={() => updateScale(scale - STEP)}
                disabled={scale <= MIN_SCALE}
              >
                −
              </button>
            </Focusable>

            <span className="ui_scale_value">{scale}%</span>

            <Focusable id="ui-scale-increase" scope="ui-scale">
              <button
                className="ui_scale_button"
                onClick={() => updateScale(scale + STEP)}
                disabled={scale >= MAX_SCALE}
              >
                +
              </button>
            </Focusable>
          </div>
        </div>
      </div>

      <section className="ui_scale_section">
        <div className="ui_scale_section_header">
          <span>Scale presets</span>
          <span className="ui_scale_section_description">
            Choose a predefined interface size
          </span>
        </div>

        <div className="ui_scale_presets">
          {[75, 90, 100, 110, 125, 150].map((value) => (
            <Focusable
              key={value}
              id={`ui-scale-preset-${value}`}
              scope="ui-scale"
            >
              <button
                className={`ui_scale_option ${
                  scale === value ? 'is_selected' : ''
                }`}
                onClick={() => updateScale(value)}
              >
                <span>{value}%</span>
              </button>
            </Focusable>
          ))}
        </div>
      </section>

      <Focusable id="ui-scale-reset" scope="ui-scale">
        <button
          className="ui_scale_reset"
          onClick={() => updateScale(DEFAULT_SCALE)}
        >
          Reset to default (100%)
        </button>
      </Focusable>
    </div>
  );
}
