import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NetflixRoute extends Component {
  componentDidMount() {
    const { ipcRenderer } = window.electron;

    ipcRenderer.sendMessage('open-netflix', []);
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <Link to="/">Back</Link>
      </div>
    );
  }
}
