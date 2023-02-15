import { Component } from 'react';
import Music from 'renderer/components/music/music';
import Navbar from 'renderer/components/navbar/navbar';
import Topbar from 'renderer/components/topbar/topbar';

export default function MusicRoute() {
  return (
    <main>
      <Topbar />
      <Music />
      <Navbar />
    </main>
  );
}
