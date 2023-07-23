type Handler<E> = (e: E) => void;
type RegisteredHandlersByEvent<N extends string, E> = Map<N, Handler<E>[]>;

export class Events<N extends string, E> {
  private readonly registeredHandlersByEvent: RegisteredHandlersByEvent<N, E> = new Map();
  private readonly createEvent: () => E;

  constructor(createEvent: () => E) {
    this.createEvent = createEvent;
  }

  public on(event: N, handler: Handler<E>) {
    const handlers = this.registeredHandlersByEvent.get(event) ?? [];
    handlers.push(handler);
    this.registeredHandlersByEvent.set(event, handlers);
  }

  public off(event: N, handler: Handler<E>) {
    const handlers = this.registeredHandlersByEvent.get(event) ?? [];
    this.registeredHandlersByEvent.set(
      event,
      handlers.filter((h) => h !== handler)
    );
  }

  public emit(event: N) {
    const handlers = this.registeredHandlersByEvent.get(event) ?? [];
    handlers.forEach((handler) => handler(this.createEvent()));
  }

  public purge(event?: N) {
    if (event != null) {
      this.registeredHandlersByEvent.delete(event);
    } else {
      this.registeredHandlersByEvent.clear();
    }
  }
}
