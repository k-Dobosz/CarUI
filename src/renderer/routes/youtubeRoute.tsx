import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class YoutubeRoute extends Component {
  componentDidMount() {
    const { ipcRenderer } = window.electron;

    ipcRenderer.sendMessage('open-youtube', []);
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <Link to="/">Back</Link>
      </div>
    );
  }
}
