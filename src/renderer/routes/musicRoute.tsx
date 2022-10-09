import { Component } from 'react';
import { Link } from 'react-router-dom';
import Music from 'renderer/components/music/music';
import Navbar from 'renderer/components/navbar/navbar';

export default class MusicRoute extends Component {
  componentDidMount() {
    const { ipcRenderer } = window.electron;
  }

  render() {
    return (
      <main>
        <Music />
        <Navbar />
      </main>
    );
  }
}
