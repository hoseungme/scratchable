import {
  MouseScratcher,
  Scratcher,
  ScratcherEventName,
  ScratcherEvent,
  ScratcherEventHandler,
  ScratcherOptions,
  TouchScratcher,
} from "./scratcher";
import { RendererOptions } from "./renderer";

export type ScratchableEventName = ScratcherEventName;

export type ScratchableEvent = ScratcherEvent;

export type ScratchableEventHandler = ScratcherEventHandler;

export type ScratchableOptions = ScratcherOptions & RendererOptions;

export class Scratchable {
  private readonly scratcher: Scratcher;

  constructor(options: ScratchableOptions) {
    this.scratcher = this.isTouchDevice ? new TouchScratcher(options) : new MouseScratcher(options);
  }

  private get isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  public async render() {
    await this.scratcher.render();
  }

  public destroy() {
    this.scratcher.destroy();
  }

  public addEventListener(event: ScratcherEventName, handler: ScratcherEventHandler) {
    this.scratcher.events.on(event, handler);
  }

  public removeEventListener(event: ScratcherEventName, handler: ScratcherEventHandler) {
    this.scratcher.events.off(event, handler);
  }
}
