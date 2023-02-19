import { Application } from 'pixi.js';

type PixiAppProps = {
  el: HTMLDivElement;
};

export class PixiApp extends Application {
  constructor({ el }: PixiAppProps) {
    super({ width: el.offsetWidth, height: el.offsetHeight, resizeTo: el, backgroundAlpha: 0 });

    el.appendChild(this.view as HTMLCanvasElement);
  }

  createSpine = () => {
    console.log('creating spine animation');
  };
}
