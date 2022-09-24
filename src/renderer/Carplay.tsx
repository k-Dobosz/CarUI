import { Component } from 'react';
import { Link } from 'react-router-dom';
import JMuxer from 'jmuxer';

interface State {
  status: boolean;
  height: number;
  width: number;
  mouseDown: boolean;
  lastX: number;
  lastY: number;
  fps: number;
  running: boolean;
}

export default class CarplayRoute extends Component<unknown, State> {
  ws: WebSocket;

  jmuxer: any;

  constructor(props: any) {
    super(props);

    this.state = {
      status: true,
      height: 0,
      width: 0,
      mouseDown: false,
      lastX: 0,
      lastY: 0,
      fps: 30,
      running: false,
    };

    this.ws = new WebSocket('ws://localhost:3001');
    this.ws.binaryType = 'arraybuffer';
    this.jmuxer = null;
  }

  componentDidMount() {
    const { ipcRenderer } = window.electron;
    const { fps, height, width, running } = this.state;
    const { ws } = this;

    console.log('creating carplay');
    this.jmuxer = new JMuxer({
      node: 'player',
      mode: 'video',
      maxDelay: 30,
      fps,
      flushingTime: 100,
      debug: false,
    });
    // const clientHeight = this.divElement.clientHeight;
    // const clientWidth = this.divElement.clientWidth;
    const clientHeight = 768;
    const clientWidth = 1368;

    this.setState(
      {
        height: clientHeight,
        width: clientWidth,
      },
      () => {
        console.log(height, width);
      }
    );

    ws.onmessage = (event) => {
      if (!running) {
        const video = document.getElementById('player') as HTMLVideoElement;
        video.play();
        this.setState({
          running: true,
        });
      }

      const buf = Buffer.from(event.data);
      const video = buf.slice(4);
      this.jmuxer.feed({
        video: new Uint8Array(video),
      });
    };

    ipcRenderer.on('plugged', () => {
      this.setState({ status: true });
      console.log('plugged');
    });
    ipcRenderer.on('unplugged', () => {
      this.setState({ status: false });
      console.log('unplugged');
    });

    ipcRenderer.on('carplay-quit-request', () => {
      this.setState({ status: false });
      this.jmuxer.destroy();
      this.ws.close();
      console.log('carplay quit');
    });

    ipcRenderer.sendMessage('carplay-status-request', []);
  }

  componentWillUnmount() {
    this.jmuxer.destroy();
    this.ws.close();
  }

  render() {
    const { ipcRenderer } = window.electron;
    const { status } = this.state;

    const reload = () => {
      ipcRenderer.sendMessage('carplay-reload-request', []);
    };

    const touchHandler = (type: number, x: number, y: number) => {
      ipcRenderer.sendMessage('carplay-click', [{ type, x, y }]);
    };

    return (
      <div
        role="button"
        tabIndex={-1}
        style={{ height: '100%' }}
        onMouseDown={(e) => {
          const { width, height } = this.state;

          const currentTargetRect = e.target.getBoundingClientRect();
          let x = e.clientX - currentTargetRect.left;
          let y = e.clientY - currentTargetRect.top;
          x /= width;
          y /= height;
          this.setState({
            lastX: x,
            lastY: y,
          });
          this.setState({
            mouseDown: true,
          });
          touchHandler(14, x, y);
        }}
        onMouseMove={(e) => {
          const { width, height, mouseDown } = this.state;

          if (mouseDown) {
            const currentTargetRect = e.target.getBoundingClientRect();
            let x = e.clientX - currentTargetRect.left;
            let y = e.clientY - currentTargetRect.top;
            x /= width;
            y /= height;
            touchHandler(15, x, y);
          }
        }}
        onMouseUp={(e) => {
          const { width, height } = this.state;

          const currentTargetRect = e.target.getBoundingClientRect();
          let x = e.clientX - currentTargetRect.left;
          let y = e.clientY - currentTargetRect.top;
          x /= width;
          y /= height;
          this.setState({
            mouseDown: false,
          });
          touchHandler(16, x, y);
        }}
        onTouchStart={(e) => {
          const { width, height } = this.state;

          const currentTargetRect = e.target.getBoundingClientRect();
          let x = e.touches[0].clientX - currentTargetRect.left;
          let y = e.touches[0].clientY - currentTargetRect.top;
          x /= width;
          y /= height;
          this.setState({
            lastX: x,
            lastY: y,
          });
          this.setState({
            mouseDown: true,
          });
          touchHandler(14, x, y);
          e.preventDefault();
        }}
        onTouchMove={(e) => {
          const { width, height, mouseDown } = this.state;

          if (mouseDown) {
            const currentTargetRect = e.target.getBoundingClientRect();
            let x = e.touches[0].clientX - currentTargetRect.left;
            let y = e.touches[0].clientY - currentTargetRect.top;
            x /= width;
            y /= height;
            touchHandler(15, x, y);
          }
        }}
        onTouchEnd={(e) => {
          const { lastX, lastY } = this.state;

          const x = lastX;
          const y = lastY;
          this.setState({
            mouseDown: false,
          });
          touchHandler(16, x, y);
          e.preventDefault();
        }}
      >
        {status}
        {status === true ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video id="player" autoPlay muted />
        ) : (
          <div>
            Nothing in here <Link to="/">Back</Link>
          </div>
        )}
      </div>
    );
  }
}
