import { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import JMuxer from 'jmuxer';
import Navbar from '../../components/navbar/navbar';
import './carplay.css';

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

  videoRef: any;

  constructor(props: any) {
    super(props);

    this.state = {
      status: false,
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
    this.videoRef = createRef();
  }

  componentDidMount() {
    const { ipcRenderer } = window.electron;
    const { fps, running } = this.state;
    const { ws } = this;

    console.log('creating carplay video window');
    this.jmuxer = new JMuxer({
      node: 'player',
      mode: 'video',
      maxDelay: 30,
      fps,
      flushingTime: 100,
      debug: false,
    });
    const { clientHeight } = this.videoRef.current;
    const { clientWidth } = this.videoRef.current;

    this.setState(
      {
        height: clientHeight,
        width: clientWidth,
      },
      () => {
        console.log(clientHeight, clientWidth);
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

    ipcRenderer.on('carplay-quit-request', () => {
      this.setState({ status: false });
      this.jmuxer.destroy();
      this.ws.close();
      console.log('carplay quit');
    });

    ipcRenderer.sendMessage('carplay-status-request', []);

    ipcRenderer.on('carplay-status-reply', (status) => {
      this.setState({ status });
      console.log('showing carplay from store', status);
    });
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
      <div id="carplay-wrapper" ref={this.videoRef} tabIndex={-1}>
        <video
          id="player"
          role="button"
          style={{
            display: status ? 'block' : 'none',
          }}
          autoPlay
          muted
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
        />
        {!status ? (
          <>
            <button
              type="button"
              id="carplay-open"
              onClick={() => {
                console.log('Showing carplay');
                this.setState({ status: true });
              }}
            >
              Open carplay
            </button>
            <Navbar />
          </>
        ) : (
          ''
        )}
      </div>
    );
  }
}
