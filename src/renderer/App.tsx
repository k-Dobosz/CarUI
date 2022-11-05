import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeRoute from './routes/home/homeRoute';
import CarplayRoute from './routes/carplay/carplayRoute';
import NetflixRoute from './routes/netflixRoute';
import YoutubeRoute from './routes/youtubeRoute';
import SettingsRoute from './routes/settingsRoute';
import MusicRoute from './routes/musicRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/carplay" element={<CarplayRoute />} />
        <Route path="/youtube" element={<YoutubeRoute />} />
        <Route path="/netflix" element={<NetflixRoute />} />
        <Route path="/music" element={<MusicRoute />} />
        <Route path="/settings" element={<SettingsRoute />} />
      </Routes>
    </Router>
  );
}
