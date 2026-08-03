import EventEmitter from 'events';
import Carplay from 'node-carplay/node';

export default class CarplayService extends EventEmitter {
  private instance: any;

  constructor(settings: any) {
    super();

    this.instance = new Carplay(settings);

    this.instance.on('quit', () => {
      this.emit('quit');
    });

    this.instance.on('error', (error: Error) => {
      this.emit('error', error);
    });
  }

  sendKey(key: string) {
    this.instance.sendKey(key);
  }

  destroy() {
    this.instance.destroy?.();
  }
}