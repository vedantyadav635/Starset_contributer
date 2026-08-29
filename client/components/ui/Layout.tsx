import React from 'react';
import { cn } from '../../lib/utils';

/* ═══════════════════════════════════════════════════════════════════════════
   Layout primitives.

   The container system is the single answer to the "giant empty sides on a
   2560px monitor" problem: content is capped and centred on one grid, while
   decorative backgrounds are free to span the full viewport behind it.
   ═══════════════════════════════════════════════════════════════════════════ */

type Width = 'default' | 'wide' | 'text';

const widthClass: Record<Width, string> = {
  default: 'shell',
  wide: 'shell shell-wide',
  text: 'shell shell-text',
};

export const Container: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { width?: Width; as?: React.ElementType }
> = ({ width = 'default', as: Tag = 'div', className, children, ...rest }) => (
  <Tag className={cn(widthClass[width], className)} {...rest}>
    {children}
  </Tag>
);

type Tone = 'paper' | 'sunk' | 'surface' | 'inverse';
type Space = 'sm' | 'md' | 'lg' | 'none';

const toneClass: Record<Tone, string> = {
  paper: '',
  sunk: 'band-sunk',
  surface: 'band-surface',
  inverse: 'band-inverse',
};

const spaceClass: Record<Space, string> = {
  none: '',
  sm: 'section-sm',
  md: 'section',
  lg: 'section-lg',
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  space?: Space;
  /** Draws a hairline above the section — used to separate adjacent bands. */
  bordered?: boolean;
  /** Content is wrapped in a Container unless `bare` is set. */
  bare?: boolean;
  width?: Width;
  containerClassName?: string;
}

export const Section: React.FC<SectionProps> = ({
  tone = 'paper',
  space = 'md',
  bordered = false,
  bare = false,
  width = 'default',
  className,
  containerClassName,
  children,
  ...rest
}) => (
  <section
    className={cn(
      'relative',
      toneClass[tone],
      spaceClass[space],
      bordered && 'border-t border-line',
      className,
    )}
    {...rest}
  >
    {bare ? children : (
      <Container width={width} className={cn('relative', containerClassName)}>
        {children}
      </Container>
    )}
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────── */

export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string; plain?: boolean }> = ({
  children,
  className,
  plain,
}) => (
  <span className={cn('eyebrow', plain && 'eyebrow-plain', className)}>{children}</span>
);

interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** `center` for editorial sections, `start` for dense/product sections. */
  align?: 'start' | 'center';
  level?: 1 | 2 | 3;
  size?: 'display' | 'h1' | 'h2' | 'h3';
  action?: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  lede,
  align = 'start',
  level = 2,
  size = 'h2',
  action,
  className,
  id,
}) => {
  const Tag = (`h${level}` as unknown) as React.ElementType;
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        centered ? 'items-center text-center' : 'items-start',
        action && !centered && 'sm:flex-row sm:items-end sm:justify-between sm:gap-8',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', centered ? 'items-center max-w-2xl' : 'max-w-2xl')}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Tag id={id} className={`t-${size}`}>{title}</Tag>
        {lede && <p className="t-lead">{lede}</p>}
      </div>
      {action && <div className={cn('flex-none', centered && 'mt-2')}>{action}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */

export const Divider: React.FC<{ className?: string; faint?: boolean }> = ({ className, faint }) => (
  <hr className={cn(faint ? 'rule-faint' : 'rule', className)} />
);

/**
 * A labelled key/value list. This is the visual signature of the brand —
 * everything on Starset is described the way a dataset is described.
 */
export const SpecList: React.FC<{
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}> = ({ items, className }) => (
  <dl className={cn('speclist', className)}>
    {items.map((item) => (
      <div className="specrow" key={item.label}>
        <dt>{item.label}</dt>
        <dd>{item.value}</dd>
      </div>
    ))}
  </dl>
);

export const Tag: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & { tone?: 'default' | 'signal' | 'ok' | 'warn' | 'danger' }
> = ({ tone = 'default', className, children, ...rest }) => (
  <span
    className={cn('tag', tone !== 'default' && `tag-${tone}`, className)}
    {...rest}
  >
    {children}
  </span>
);
