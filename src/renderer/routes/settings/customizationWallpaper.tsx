import { Link } from 'react-router-dom';
import Focusable from '../../components/focus/focusable';
import './customization.scss';

export default function CustomizationWallpaper() {
  const { ipcRenderer } = window.electron;

  const handleChange = (value: string): void => {
    ipcRenderer
      .invoke('store-set', [`settings.customization.wallpaperUrl`, value])
      .catch((err) => console.error(err));

    document.querySelector('body')!.style.backgroundImage = `url('${value}')`;
  };

  const items = [
    'wallpapers/1.png',
    'wallpapers/2.png',
    'wallpapers/3.png',
    'wallpapers/4.png',
    'wallpapers/4.png',
  ];

  return (
    <>
      <Focusable id="back">
        <Link to="/settings/customization" className="settings_row">
          Back
        </Link>
      </Focusable>
      <ul className="settings_wallpaper_list">
        {items.map((item, index) => (
          <li>
            <Focusable id={`wallpaper-${index}`}>
              <button onClick={() => handleChange(item)} type="button">
                <img src={item} alt="Wallpaper" />
              </button>
            </Focusable>
          </li>
        ))}
        <li></li>
      </ul>
    </>
  );
}
