/**
 * AnimationProvider.tsx
 * Centralized animation utilities for premium page transitions,
 * staggered reveals, and micro-interactions across the Starset app.
 *
 * Uses framer-motion for smooth, GPU-accelerated animations.
 */

import React, { useRef, useEffect, useState, createContext, useContext } from 'react';
import { motion, AnimatePresence, useInView, Variants } from 'framer-motion';

// ─── Animation configuration ───────────────────────────────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const EASE_OUT_QUART = [0.25, 1, 0.5, 1];

// ─── Reusable Variant Presets ───────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// ─── Animated Components ────────────────────────────────────────────

interface AnimatedProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  variants?: Variants;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * FadeIn — reveals a block with a smooth fade+slide when it enters the viewport.
 * Defaults to fade-up; pass a `variants` prop to customise direction.
 */
export const FadeIn: React.FC<AnimatedProps> = ({
  children,
  className = '',
  delay = 0,
  once = true,
  variants = fadeUp,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerGroup — staggers children's entrance one-by-one.
 * Wrap child elements in <motion.div variants={fadeUp}> etc.
 */
export const StaggerGroup: React.FC<AnimatedProps & { slow?: boolean }> = ({
  children,
  className = '',
  once = true,
  slow = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={slow ? staggerContainerSlow : staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem — child of StaggerGroup, animates with inherited stagger.
 */
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}> = ({ children, className = '', variants = fadeUp }) => (
  <motion.div variants={variants} className={className}>
    {children}
  </motion.div>
);

/**
 * PageTransition — wraps page content with a smooth enter/exit transition.
 */
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Card3D — gives a card a subtle 3D tilt effect on hover (desktop only).
 */
export const Card3D: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}> = ({ children, className = '', intensity = 8 }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;
    ref.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

/**
 * CountUp — animates a number counting up from 0 to the target value.
 */
export const CountUp: React.FC<{
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}> = ({ target, prefix = '', suffix = '', duration = 1.5, className = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
};

/**
 * GlowCard — card with animated gradient border glow on hover.
 */
export const GlowCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}> = ({ children, className = '', glowColor = 'rgba(59, 130, 246, 0.4)' }) => (
  <motion.div
    className={`relative group ${className}`}
    whileHover={{ scale: 1.01, y: -4 }}
    transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
  >
    {/* Glow effect */}
    <div
      className="absolute -inset-[1px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none -z-10"
      style={{ background: `radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 60%)` }}
    />
    {children}
  </motion.div>
);

/**
 * FloatingElement — adds a subtle floating animation to an element.
 */
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}> = ({ children, className = '', duration = 4, distance = 8 }) => (
  <motion.div
    className={className}
    animate={{ y: [-distance/2, distance/2, -distance/2] }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

/**
 * TextReveal — reveals text character by character or word by word.
 */
export const TextReveal: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = '', delay = 0 }) => {
  const words = text.split(' ');
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.05,
            ease: EASE_OUT_EXPO,
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};
