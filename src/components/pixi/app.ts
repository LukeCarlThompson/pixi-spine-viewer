import { Application } from 'pixi.js';

type PixiAppProps = {
  el: HTMLDivElement;
};

export class PixiApp extends Application {
  constructor({ el }: PixiAppProps) {
    super({ width: el.offsetWidth, height: el.offsetHeight, resizeTo: el });

    el.appendChild(this.view as HTMLCanvasElement);
  }

  createSpine = () => {
    console.log('creating spine animation');
  };
}
