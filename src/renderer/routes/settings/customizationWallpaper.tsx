import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Focusable from '../../components/focus/focusable';
import './customization.scss';

export default function CustomizationWallpaper() {
  const { ipcRenderer } = window.electron;

  const [items, setItems] = useState<string[]>([]);
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    const loadWallpapers = async () => {
      try {
        const path = await ipcRenderer.invoke('get-public-path') as string;
        setPath(path);

        const wallpapers = await ipcRenderer.invoke('get-all-wallpaper-paths') as string[];        
        setItems(wallpapers);
      } catch (error) {
        console.error(error);
      }
    };

    loadWallpapers();
  }, [ipcRenderer]);

  const handleChange = (value: string): void => {
    ipcRenderer
      .invoke('store-set', ['settings.customization.wallpaperUrl', value])
      .catch((err) => console.error(err));

    document.body.style.backgroundImage = `url("${path}${value}")`;
  };

  return (
    <>
      <Focusable id="back">
        <Link to="/settings/customization" className="settings_row">
          Back
        </Link>
      </Focusable>

      <ul className="settings_wallpaper_list">
        {items.map((item, index) => (
          <li key={item}>
            <Focusable id={`wallpaper-${index}`}>
              <button onClick={() => handleChange(item)} type="button">
                <img src={`${path}${item}`} alt="Wallpaper" />
              </button>
            </Focusable>
          </li>
        ))}
      </ul>
    </>
  );
}
