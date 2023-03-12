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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="carplay" element={<CarplayRoute />} />
        <Route path="youtube" element={<YoutubeRoute />} />
        <Route path="netflix" element={<NetflixRoute />} />
        <Route path="music" element={<MusicRoute />} />
        <Route path="settings" element={<SettingsRoute />}>
          <Route index element={<SettingsList />} />
          <Route path="wifi" element={<WifiSettings />} />
          <Route path="customization" element={<CustomizationSettings />} />
          <Route path="carplay" element={<CarplaySettings />} />
          <Route path="system" element={<SystemSettings />} />
        </Route>
      </Routes>
      <CarplayAudio />
    </Router>
  );
}
