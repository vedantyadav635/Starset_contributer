import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Milliseconds to hold before the element animates in. */
  delay?: number;
  as?: React.ElementType;
  /** How much of the element must be visible before it reveals (0–1). */
  amount?: number;
}

/**
 * A single IntersectionObserver-backed scroll reveal.
 *
 * Deliberately CSS-driven: no animation library, no layout thrash, and it
 * degrades to "just visible" when the visitor prefers reduced motion or the
 * browser has no IntersectionObserver.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  as: Tag = 'div',
  amount = 0.15,
  className,
  style,
  ...rest
}) => {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: amount, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <Tag
      ref={ref as never}
      data-reveal={shown ? 'in' : 'out'}
      className={cn(className)}
      style={{ ...style, ['--reveal-delay' as string]: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

/**
 * Reveals its children one after another. Useful for card grids and lists
 * where a single group reveal would feel abrupt.
 */
export const RevealGroup: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { step?: number; startDelay?: number; as?: React.ElementType }
> = ({ children, step = 70, startDelay = 0, as: Tag = 'div', className, ...rest }) => (
  <Tag className={className} {...rest}>
    {React.Children.map(children, (child, i) =>
      React.isValidElement(child)
        ? <Reveal delay={startDelay + i * step}>{child}</Reveal>
        : child,
    )}
  </Tag>
);
