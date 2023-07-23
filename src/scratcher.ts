import { Events } from "./events";
import { Renderer, RendererOptions } from "./renderer";

export type ScratcherEvent = "scratch";

export interface ScratchEvent {
  percentage: number;
}

export type ScratcherEventHandler = (e: ScratchEvent) => void;

export interface ScratcherOptions extends RendererOptions {
  container: HTMLElement;
  radius?: number;
  onScratch?: ScratcherEventHandler;
}

export class Scratcher {
  protected readonly container: HTMLElement;
  private readonly renderer: Renderer;
  private readonly radius: number;
  public readonly events: Events<ScratcherEvent, ScratchEvent>;

  private prevScratchPosition: { x: number; y: number } | null = null;

  constructor(options: ScratcherOptions) {
    this.container = options.container;
    this.renderer = new Renderer(options);
    this.radius = options.radius ?? 50;
    this.events = new Events(() => ({ percentage: this.renderer.percentage }));

    if (options.onScratch != null) {
      this.events.on("scratch", options.onScratch);
    }
  }

  protected move(x: number, y: number) {
    this.renderer.circle(x, y, this.radius);

    if (this.prevScratchPosition != null) {
      this.renderer.line(this.prevScratchPosition, { x, y }, this.radius * 2);
    }

    this.prevScratchPosition = { x, y };
    this.events.emit("scratch");
  }

  protected end() {
    this.prevScratchPosition = null;
  }

  public async render() {
    await this.renderer.render();
  }

  public destroy() {
    this.renderer.destroy();
    this.events.purge();
  }
}

export class TouchScratcher extends Scratcher {
  private prevScrollY: number | null = null;

  constructor(options: ScratcherOptions) {
    super(options);
  }

  private lockBodyScroll() {
    if (this.prevScrollY == null) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0px";
      document.body.style.right = "0px";
      document.body.style.overflow = "hidden";

      this.prevScrollY = scrollY;
    }
  }

  private unlockBodyScroll() {
    if (this.prevScrollY != null) {
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("left");
      document.body.style.removeProperty("right");
      document.body.style.removeProperty("overflow");
      window.scrollTo({ top: this.prevScrollY });
      this.prevScrollY = null;
    }
  }

  private touchstart = () => {
    this.lockBodyScroll();
  };

  private touchmove = (e: TouchEvent) => {
    const { left, top } = this.container.getBoundingClientRect();
    const { clientX, clientY } = e.changedTouches[0];

    const x = clientX - left;
    const y = clientY - top;
    this.move(x, y);
  };

  private touchend = () => {
    this.unlockBodyScroll();
    this.end();
  };

  public async render() {
    this.container.addEventListener("touchstart", this.touchstart);
    this.container.addEventListener("touchmove", this.touchmove);
    this.container.addEventListener("touchend", this.touchend);
    await super.render();
  }

  public destory() {
    this.container.removeEventListener("touchstart", this.touchstart);
    this.container.removeEventListener("touchmove", this.touchmove);
    this.container.removeEventListener("touchend", this.touchend);
    super.destroy();
  }
}

export class MouseScratcher extends Scratcher {
  constructor(options: ScratcherOptions) {
    super(options);
  }

  private mousemove = (e: MouseEvent) => {
    if (e.buttons === 0) {
      this.end();
      return;
    }

    const { left, top } = this.container.getBoundingClientRect();
    const { clientX, clientY } = e;

    const x = clientX - left;
    const y = clientY - top;
    this.move(x, y);
  };

  public async render() {
    this.container.addEventListener("mousemove", this.mousemove);
    await super.render();
  }

  public destroy() {
    this.container.removeEventListener("mousemove", this.mousemove);
    super.destroy();
  }
}
