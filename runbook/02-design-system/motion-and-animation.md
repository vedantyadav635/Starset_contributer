# Motion & Animation

> Last Updated: 2026-09-14  
> Source: `client/index.css` lines 90–95

## Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Primary easing — smooth deceleration |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Exit animations — quick start, gentle end |
| `--dur-fast` | `140ms` | Micro-interactions: hover, focus, toggle |
| `--dur` | `220ms` | Standard transitions: open/close, state changes |
| `--dur-slow` | `420ms` | Page transitions, large reveals |

## Animation Libraries

### Framer Motion — Component Animations

| Use For | Example |
|---------|---------|
| Mount/unmount transitions | `<AnimatePresence>` for page transitions |
| Layout animations | `layout` prop for smooth reflows |
| Hover/tap states | `whileHover`, `whileTap` |
| Simple scroll reveals | `useInView` + `motion.div` |

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
>
  Content
</motion.div>
```

### GSAP — Cinematic Animations

| Use For | Example |
|---------|---------|
| Scroll-triggered timelines | `ScrollTrigger` for parallax sections |
| Complex sequences | Multi-step animations with `gsap.timeline()` |
| Performance-critical | Canvas-based visualizations |
| Text splitting | Character-by-character reveals |

```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

useGSAP(() => {
  gsap.from('.hero-text', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.05,
  });
}, { scope: containerRef });
```

## Animation Components

| Component | Type | Purpose |
|-----------|------|---------|
| `AnimationProvider.tsx` | GSAP Context | Shared GSAP context for cleanup |
| `Reveal.tsx` | Framer Motion | Scroll-reveal wrapper for any content |
| `SplitText.jsx` | GSAP | Letter-by-letter text animation |
| `PixelTransition.tsx` | GSAP/Canvas | Pixel dissolve transition effect |
| `AudioVisualizer.tsx` | Canvas | Real-time audio waveform rendering |
| `Waveform.tsx` | SVG | Static waveform display component |
| `SignalMorph.tsx` | GSAP | Animated signal/morphing visualization |
| `ShapeGrid.jsx` | CSS/GSAP | Animated background pattern |

## Animation Patterns

### Page Enter
```tsx
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1], // matches --ease
};
```

### Staggered List
```tsx
const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};
```

### Hover Card Lift
```tsx
<motion.div
  whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
/>
```

## Rules

> 📌 **Prefer CSS transitions** for simple hover/focus states. Use `transition: all var(--dur) var(--ease)`.

> 📌 **Use Framer Motion** for component mount/unmount and layout changes.

> 📌 **Use GSAP** for scroll-driven timelines and performance-critical sequences.

> ⚠️ **Always clean up GSAP** — use `useGSAP` hook or `gsap.context()` with proper scope.

> 📌 **Respect `prefers-reduced-motion`** — disable animations for accessibility.
