# scratchable

https://github.com/HoseungJang/scratchable/assets/39669819/5e3e5e4b-ce97-47b5-877c-d04d8375e843

# Overview

`scratchable` is a scratch card renderer using HTML Canvas. It renders a scratchable canvas element on your content, and provides percentage of scratched pixels.

# Usage

First of all, you should pass `container` to `Scratchable`, which will be overlapped by a scratchable canvas.

```javascript
const container = document.getElementById("container");

const scratchable = new Scratable({
  container,
  /* ... */
});
```

```html
<div id="container">/* CONTENT */</div>
```

Or in React,

```typescript
const container = ref.current;

const scratchable = new Scratable({
  container,
  /* ... */
});
```

```tsx
<div ref={ref}>{/* CONTENT */}</div>
```

And then it will render the canvas on your `/* CONTENT */`, when you call `Scratchable.render()`.

```typescript
scratchable.render();
```

And you can also remove the rendered canvas.

```typescript
scratchable.destroy();
```

This is the basic. Now let's see another required option `background`.

## Background

You should pass `background` to `Scratchable`, which is the color of the rendered canvas.

It has two kinds of type, `single` and `linear-gradient`.

### Single Background

```typescript
new Scratable({
  /* ... */
  background: {
    type: "single",
    color: "#FA58D0",
  },
});
```

https://github.com/HoseungJang/scratchable/assets/39669819/7915c2af-8bbe-43d8-9169-631fd7124b91

### Linear Gradient Background

```typescript
new Scratable({
  /* ... */
  background: {
    type: "linear-gradient",
    gradients: [
      { offset: 0, color: "#FA58D0" },
      { offset: 0.5, color: "#DA81F5" },
      { offset: 1, color: "#BE81F7" },
    ],
  },
});
```

https://github.com/HoseungJang/scratchable/assets/39669819/bef24ef0-2860-4150-9133-35a922950936

## Radius

You can set radius of a circle which is rendered when you scratch the canvas. Let's compare between 20 and 40.

### 20

```typescript
new Scratable({
  /* ... */
  radius: 20,
});
```

https://github.com/HoseungJang/scratchable/assets/39669819/44c38fac-a130-427d-8c8e-874f03e132f1

### 40

```typescript
new Scratable({
  /* ... */
  radius: 40,
});
```

https://github.com/HoseungJang/scratchable/assets/39669819/b8421e3b-f79e-4114-a002-0f8c066e1c95

## Scratch Event

You can register a function which will be called when `scratch` event fires. The event fires when an user is scratching the canvas.

```typescript
const handler = (e: ScratchEvent) => {
  /* ... */
};

scratchable.addEventListener("scratch", handler);
scratchable.removeEventListener("scratch", handler);
```

## Scratched Percentage

You can get percentage(0 ~ 1) from `ScratchEvent` above. The percentage is ratio of scratched area to all scratchable area.

```typescript
const handler = (e: ScratchEvent) => {
  if (e.percentage > 0.5) {
    scratchable.destroy();
  }
};

scratchable.addEventListener("scratch", handler);
```

https://github.com/HoseungJang/scratchable/assets/39669819/877e7224-5311-443e-84d1-be24632f5d21
