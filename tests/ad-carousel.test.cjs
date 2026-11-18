const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(
  readFileSync(join(__dirname, '../components/home/ad-carousel/use-ad-carousel.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } },
).outputText;

// A small hook-state harness exercises the gesture logic without browser globals.
function createCarousel(count = 8) {
  const slots = [];
  const timers = new Map();
  let nextTimer = 0;
  let now = 0;
  let cursor = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], (next) => {
        slots[index] = typeof next === 'function' ? next(slots[index]) : next;
      }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect(setup, dependencies) {
      const index = cursor++;
      const previous = slots[index];
      if (previous && dependencies.every((value, i) => Object.is(value, previous.dependencies[i]))) return;
      previous?.cleanup?.();
      slots[index] = { dependencies, cleanup: setup() };
    },
  };
  const exports = {};
  const window = {
    setTimeout(callback, delay) {
      const id = ++nextTimer;
      timers.set(id, { callback, due: now + delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
  };
  runInNewContext(source, { exports, require: () => react, window });
  const render = () => {
    cursor = 0;
    return exports.useAdCarousel(count);
  };
  render.advance = (milliseconds) => {
    render();
    const target = now + milliseconds;
    while (true) {
      const next = [...timers].sort((a, b) => a[1].due - b[1].due)[0];
      if (!next || next[1].due > target) break;
      now = next[1].due;
      timers.delete(next[0]);
      next[1].callback();
      render();
    }
    now = target;
  };
  render.unmount = () => slots.forEach((slot) => slot?.cleanup?.());
  render.timerCount = () => timers.size;
  return render;
}

function pointer(x, y = 0, overrides = {}) {
  return {
    isPrimary: true, button: 0, pointerId: 1, clientX: x, clientY: y,
    currentTarget: { setPointerCapture() {} }, ...overrides,
  };
}

test('arrow navigation wraps and dot selection selects any image', () => {
  const render = createCarousel();
  assert.equal(render().selectedIndex, 0);
  render().move(-1);
  assert.equal(render().selectedIndex, 7);
  render().move(1);
  assert.equal(render().selectedIndex, 0);
  render().select(4);
  assert.equal(render().selectedIndex, 4);
});

test('preview clicks still work after normal pointer capture release', () => {
  const render = createCarousel();
  render().onPointerDown(pointer(200));
  render().onPointerUp(pointer(200));
  render().onPointerCancel();
  render().selectFromPreview(2, false);
  assert.equal(render().selectedIndex, 2);
});

test('swiping selects once and ignores the following synthetic click', () => {
  const render = createCarousel();
  render().onPointerDown(pointer(200));
  render().onPointerUp(pointer(100));
  render().onPointerCancel();
  render().selectFromPreview(0, false);
  assert.equal(render().selectedIndex, 1);
  render().onPointerDown(pointer(100));
  render().onPointerUp(pointer(200));
  assert.equal(render().selectedIndex, 0);
});

test('vertical gestures and cancelled gestures do not change the image', () => {
  const render = createCarousel();
  render().onPointerDown(pointer(200));
  render().onPointerUp(pointer(190, 100));
  render().selectFromPreview(2, false);
  assert.equal(render().selectedIndex, 0);
  render().onPointerDown(pointer(200));
  render().onPointerCancel();
  render().onPointerUp(pointer(50));
  assert.equal(render().selectedIndex, 0);
  render().selectFromPreview(3, true);
  assert.equal(render().selectedIndex, 3);
});

test('keyboard arrows, Home and End select images', () => {
  const render = createCarousel();
  for (const [key, index] of [['End', 7], ['ArrowRight', 0], ['ArrowLeft', 7], ['Home', 0]]) {
    let prevented = false;
    render().onKeyDown({ key, preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    assert.equal(render().selectedIndex, index);
  }
});

test('single-image and empty carousels do not advance', () => {
  for (const count of [0, 1]) {
    const render = createCarousel(count);
    render().move(1);
    render.advance(8000);
    assert.equal(render().selectedIndex, 0);
    assert.equal(render.timerCount(), 0);
  }
});

test('autoplay advances every four seconds and wraps to the first image', () => {
  const render = createCarousel(3);
  render.advance(3999);
  assert.equal(render().selectedIndex, 0);
  render.advance(1);
  assert.equal(render().selectedIndex, 1);
  render.advance(8000);
  assert.equal(render().selectedIndex, 0);
});

test('autoplay pauses for hover, focus, and gestures then resumes', () => {
  const render = createCarousel();
  render().setHovered(true);
  render.advance(8000);
  assert.equal(render().selectedIndex, 0);
  render().setFocused(true);
  render().setHovered(false);
  render.advance(8000);
  assert.equal(render().selectedIndex, 0);
  render().setFocused(false);
  render().onPointerDown(pointer(200));
  render.advance(8000);
  assert.equal(render().selectedIndex, 0);
  render().onPointerCancel();
  render.advance(4000);
  assert.equal(render().selectedIndex, 1);
});

test('manual selection resets the delay and unmount clears the timer', () => {
  const render = createCarousel();
  render.advance(3000);
  render().select(4);
  render.advance(3999);
  assert.equal(render().selectedIndex, 4);
  render.advance(1);
  assert.equal(render().selectedIndex, 5);
  render.unmount();
  assert.equal(render.timerCount(), 0);
});
