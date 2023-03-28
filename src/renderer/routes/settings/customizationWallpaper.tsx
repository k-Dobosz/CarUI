import { Link } from 'react-router-dom';
import './customization.scss';

export default function CustomizationWallpaper() {
  const { ipcRenderer } = window.electron;

  const handleChange = (value: string): void => {
    ipcRenderer
      .invoke('store-set', [`settings.customization.wallpaperUrl`, value])
      .catch((err) => console.error(err));

    document.querySelector('body').style.backgroundImage = `url('${value}')`;
  };

  return (
    <>
      <Link to="/settings/customization" className="settings_row">
        Back
      </Link>
      <ul className="settings_wallpaper_list">
        <li>
          <button
            onClick={() => handleChange('wallpapers/1.png')}
            type="button"
          >
            <img src="wallpapers/1.png" alt="Wallpaper 1" />
          </button>
          <button
            onClick={() => handleChange('wallpapers/2.png')}
            type="button"
          >
            <img src="wallpapers/2.png" alt="Wallpaper 2" />
          </button>
          <button
            onClick={() => handleChange('wallpapers/3.png')}
            type="button"
          >
            <img src="wallpapers/3.png" alt="Wallpaper 3" />
          </button>
          <button
            onClick={() => handleChange('wallpapers/4.png')}
            type="button"
          >
            <img src="wallpapers/4.png" alt="Wallpaper 4" />
          </button>
        </li>
      </ul>
    </>
  );
}
