import { connect } from 'http2';
import { Component } from 'react';
import { Link } from 'react-router-dom';

interface State {
  networks: Array<any>;
}

export default class SettingsRoute extends Component<unknown, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      networks: [],
    };
  }

  componentDidMount() {
    const { ipcRenderer } = window.electron;

    ipcRenderer.sendMessage('wifi-networks-request', []);

    ipcRenderer.on('wifi-networks', (args) => {
      const networks = args as Array<any>;
      this.setState({ networks });
    });
  }

  conn = (ssid: string) => {
    const { ipcRenderer } = window.electron;
    console.log(ssid);
    ipcRenderer.sendMessage('wifi-connect', [{ ssid, password: '' }]);
  };

  render() {
    const { networks } = this.state;
    const list = networks.map((network) => (
      <button
        onClick={() => this.conn(network.ssid)}
        type="button"
        key={network.ssid}
      >
        {network.ssid}
      </button>
    ));

    return (
      <div style={{ height: '100%' }}>
        {list}
        <Link to="/">Back</Link>
      </div>
    );
  }
}
