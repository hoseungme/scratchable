export interface RendererOptions {
  container: HTMLElement;
  background:
    | { type: "single"; color: string }
    | {
        type: "linear-gradient";
        gradients: { offset: number; color: string }[];
      };
}

export class Renderer {
  private readonly container: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly background: RendererOptions["background"];

  constructor(options: RendererOptions) {
    this.container = options.container;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.background = options.background;
  }

  public get dpr() {
    return window.devicePixelRatio;
  }

  public get percentage() {
    const { data } = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const stride = 32;
    const totalPixels = data.length / stride;
    let scratchedPixels = 0;

    for (let i = 0; i < data.length; i += stride) {
      if (data[i] === 0) {
        scratchedPixels++;
      }
    }
    return scratchedPixels / totalPixels;
  }

  public render() {
    this.container.style.position = "relative";

    const dpr = window.devicePixelRatio;
    const canvasWidth = this.container.offsetWidth * dpr;
    const canvasHeight = this.container.offsetHeight * dpr;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.right = "0";
    this.canvas.style.bottom = "0";

    switch (this.background.type) {
      case "single": {
        this.ctx.fillStyle = this.background.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        break;
      }
      case "linear-gradient": {
        const grd = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);

        this.background.gradients.forEach((gradient) => {
          grd.addColorStop(gradient.offset, gradient.color);
        });

        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        break;
      }
    }

    this.ctx.globalCompositeOperation = "destination-out";

    this.container.appendChild(this.canvas);
  }

  public circle(x: number, y: number, radius: number) {
    const dpr = this.dpr;

    this.ctx.beginPath();
    this.ctx.arc(x * dpr, y * dpr, radius * dpr, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  public line(from: { x: number; y: number }, to: { x: number; y: number }, width: number) {
    const dpr = this.dpr;

    this.ctx.beginPath();
    this.ctx.moveTo(from.x * dpr, from.y * dpr);
    this.ctx.lineTo(to.x * dpr, to.y * dpr);
    this.ctx.lineWidth = width * dpr;
    this.ctx.stroke();
  }

  public destroy() {
    this.container.removeChild(this.canvas);
  }
}
