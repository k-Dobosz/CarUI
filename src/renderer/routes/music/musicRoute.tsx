import { Component } from 'react';
import Music from 'renderer/components/music/music';
import Navbar from 'renderer/components/navbar/navbar';
import Topbar from 'renderer/components/topbar/topbar';
import './music.scss';

export default function MusicRoute() {
  return (
    <main className="music-page">
      <Topbar />
      <Music />
      <Navbar />
    </main>
  );
}
