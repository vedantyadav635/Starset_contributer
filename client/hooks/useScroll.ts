import type { MutableRefObject, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   Scroll engine.

   One rAF-throttled listener for the whole page, shared by every effect.
   Consumers that drive a canvas read progress from a ref and never re-render;
   consumers that drive React UI subscribe to a discrete step instead, so a
   component repaints a handful of times per section rather than every frame.
   ═══════════════════════════════════════════════════════════════════════════ */

type Listener = () => void;

const listeners = new Set<Listener>();
let attached = false;
let frame = 0;

function flush() {
  frame = 0;
  listeners.forEach((fn) => fn());
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

function subscribe(fn: Listener) {
  listeners.add(fn);

  if (!attached) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    attached = true;
  }

  fn();

  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && attached) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      attached = false;
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }
  };
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Progress through a tall, pinned section: 0 when its top reaches the top of
 * the viewport, 1 when its bottom does. This is what drives sticky stories.
 */
export function usePinProgress(ref: RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      progress.current = 1;
      return;
    }

    // Resolve the node on every tick rather than capturing it at mount: a
    // section that swaps its own subtree (responsive branches) would otherwise
    // leave this subscribed to a detached element, or to nothing at all.
    return subscribe(() => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      progress.current = travel <= 0 ? 0 : clamp01(-rect.top / travel);
    });
  }, [ref]);

  return progress;
}

/**
 * Progress as an element crosses the viewport: 0 as its top enters from the
 * bottom, 1 as its bottom leaves through the top. Used for parallax.
 */
export function useCrossProgress(ref: RefObject<HTMLElement | null>) {
  const progress = useRef(0.5);

  useEffect(() => {
    if (prefersReducedMotion()) {
      progress.current = 0.5;
      return;
    }

    return subscribe(() => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      progress.current = clamp01((window.innerHeight - rect.top) / travel);
    });
  }, [ref]);

  return progress;
}

/**
 * The active step of a pinned section, as React state.
 *
 * Only re-renders when the index actually changes, so a four-stage story
 * costs four renders across its entire scroll rather than one per frame.
 */
export function usePinStep(ref: RefObject<HTMLElement | null>, steps: number) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (steps < 1 || prefersReducedMotion()) return;

    let current = 0;

    return subscribe(() => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel <= 0 ? 0 : clamp01(-rect.top / travel);

      // Bias slightly forward so a stage commits just before its midpoint.
      const next = Math.min(steps - 1, Math.floor(p * steps + 0.08));
      if (next !== current) {
        current = next;
        setStep(next);
      }
    });
  }, [ref, steps]);

  return step;
}

/**
 * Whether an element is currently on screen. Used to park animation loops
 * for anything scrolled out of view.
 */
export function useInView(ref: RefObject<HTMLElement | null>, rootMargin = '120px') {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/**
 * Applies a small vertical offset to an element as it crosses the viewport.
 * Written straight to `transform` on the animation frame — never through
 * React state — so parallax costs no renders.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  distance = 40,
) {
  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    node.style.willChange = 'transform';

    const unsubscribe = subscribe(() => {
      const rect = node.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

      const travel = window.innerHeight + rect.height;
      const p = clamp01((window.innerHeight - rect.top) / travel);
      node.style.transform = `translate3d(0, ${((p - 0.5) * -2 * distance).toFixed(2)}px, 0)`;
    });

    return () => {
      unsubscribe();
      node.style.willChange = '';
      node.style.transform = '';
    };
  }, [ref, distance]);
}


/* ─────────────────────────── Smooth wheel scroll ─────────────────────────── */

/** Walks up from the wheel target: does some region own this gesture? */
function ownsWheel(node: EventTarget | null, delta: number) {
  let el = node instanceof Element ? node : null;

  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    const scrollable =
      (style.overflowY === 'auto' || style.overflowY === 'scroll')
      && el.scrollHeight > el.clientHeight + 1;

    if (scrollable) {
      const room = delta > 0
        ? el.scrollTop < el.scrollHeight - el.clientHeight - 1
        : el.scrollTop > 1;
      if (room) return true;
    }
    el = el.parentElement;
  }

  return false;
}

/**
 * Inertial wheel scrolling for the document.
 *
 * The wheel sets a target; a rAF loop eases the real scroll position toward it.
 * Because the page's actual scrollTop is what moves, `position: sticky`, the
 * pinned story sections and every IntersectionObserver keep working exactly as
 * they do with native scroll — unlike transform-based smooth-scroll libraries.
 *
 * It stays out of the way of: touch (native momentum is better), reduced
 * motion, pinch-zoom, and any nested region that can still scroll itself.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;
    // A wheel is a coarse, chunky input worth smoothing. Touch already has
    // momentum, and smoothing it twice feels like lag.
    if (!window.matchMedia?.('(pointer: fine)').matches) return;

    const root = document.documentElement;
    // CSS `scroll-behavior: smooth` would animate each of our own frame-by-frame
    // hops and fight the easing. Calls that pass `behavior: 'smooth'` explicitly
    // — nav changes, the marketplace anchors — override this and still glide.
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    let target = window.scrollY;
    let current = target;
    let frameId = 0;
    let last = 0;

    const limit = () => Math.max(0, root.scrollHeight - window.innerHeight);

    const step = (now: number) => {
      const dt = last ? Math.min(now - last, 50) : 16.7;
      last = now;

      const diff = target - current;
      if (Math.abs(diff) < 0.4) {
        current = target;
        window.scrollTo(0, Math.round(current));
        frameId = 0;
        last = 0;
        return;
      }

      // Frame-rate independent easing, so 60Hz and 120Hz feel the same.
      current += diff * (1 - Math.pow(1 - 0.14, dt / 16.7));
      window.scrollTo(0, Math.round(current));
      frameId = requestAnimationFrame(step);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;      // pinch zoom
      if (event.defaultPrevented) return;
      if (ownsWheel(event.target, event.deltaY)) return;

      // Between gestures the page may have moved by other means — a keyboard,
      // the scrollbar, an anchor jump. Adopt wherever it actually is.
      if (!frameId) current = target = window.scrollY;

      const unit = event.deltaMode === 1
        ? 16                                            // lines
        : event.deltaMode === 2
          ? window.innerHeight                          // pages
          : 1;                                          // pixels

      event.preventDefault();
      target = Math.min(Math.max(target + event.deltaY * unit, 0), limit());

      if (!frameId) frameId = requestAnimationFrame(step);
    };

    // Anything that scrolls the page itself outruns us: stop and hand it over.
    const release = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
        last = 0;
      }
      current = target = window.scrollY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', release, { passive: true });
    window.addEventListener('keydown', release);
    window.addEventListener('mousedown', release);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', release);
      window.removeEventListener('keydown', release);
      window.removeEventListener('mousedown', release);
      if (frameId) cancelAnimationFrame(frameId);
      root.style.scrollBehavior = previousBehavior;
    };
  }, [enabled]);
}
