import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { CarplayAudio } from 'react-js-carplay';
import HomeRoute from './routes/home/homeRoute';
import CarplayRoute from './routes/carplay/carplayRoute';
import NetflixRoute from './routes/netflixRoute';
import YoutubeRoute from './routes/youtubeRoute';
import SettingsRoute from './routes/settings/settingsRoute';
import MusicRoute from './routes/musicRoute';
import WifiSettings from './routes/settings/wifiSettings';
import SettingsList from './routes/settings/settingsList';
import CustomizationSettings from './routes/settings/customizationSettings';
import CarplaySettings from './routes/settings/carplaySettings';
import SystemSettings from './routes/settings/systemSettings';
import SystemAboutSettings from './routes/settings/systemAboutSettings';
import CustomizationWallpaper from './routes/settings/customizationWallpaper';
import CameraRoute from './routes/camera/cameraRoute';
import { FocusProvider } from './components/focus/focusContext';
import { useEffect } from 'react';
import ReverseCameraController from './components/camera/cameraController';

export default function App() {
  const { ipcRenderer } = window.electron;

  const changeBg = (wallpaperUrl: string): void => {
    document.querySelector('body')!.style.backgroundImage =
      `url('${wallpaperUrl}')`;
  };


  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        const path = await ipcRenderer.invoke('get-public-path') as string;
        const wallpaper = await ipcRenderer.invoke('store-get', 'settings.customization.wallpaperUrl') as string;

        changeBg(path + wallpaper);
      } catch (error) {
        console.error(error);
      }
    };

    loadWallpaper();
  }, [ipcRenderer]);

  return (
    <FocusProvider>
      <Router>
        <ReverseCameraController />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="camera" element={<CameraRoute />} />
          <Route path="carplay" element={<CarplayRoute />} />
          <Route path="youtube" element={<YoutubeRoute />} />
          <Route path="netflix" element={<NetflixRoute />} />
          <Route path="music" element={<MusicRoute />} />
          <Route path="settings" element={<SettingsRoute />}>
            <Route index element={<SettingsList />} />
            <Route path="wifi" element={<WifiSettings />} />
            <Route path="customization" element={<CustomizationSettings />} />
            <Route
              path="customization/wallpaper"
              element={<CustomizationWallpaper />}
            />
            <Route path="carplay" element={<CarplaySettings />} />
            <Route path="system" element={<SystemSettings />} />
            <Route path="system/about" element={<SystemAboutSettings />} />
          </Route>
        </Routes>
        <CarplayAudio />
      </Router>
    </FocusProvider>
  );
}
