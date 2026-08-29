import React, { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export interface FaqItem {
  q: string;
  a: React.ReactNode;
}

/**
 * Accessible disclosure list.
 *
 * Answers stay in the DOM (hidden with `hidden`) so in-page search and
 * assistive tech can reach them, and each button carries the aria-expanded /
 * aria-controls pair rather than relying on visuals alone.
 */
export const FAQ: React.FC<{
  items: FaqItem[];
  className?: string;
  /** Index open on first paint. Pass null for all closed. */
  defaultOpen?: number | null;
}> = ({ items, className, defaultOpen = 0 }) => {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-signal"
              >
                <span className="text-[0.9375rem] font-semibold text-ink sm:text-base">{item.q}</span>
                <Plus
                  className={cn(
                    'mt-0.5 h-4 w-4 flex-none text-muted transition-transform duration-200',
                    isOpen && 'rotate-45 text-signal',
                  )}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-6 pr-10"
            >
              <div className="max-w-prose text-body">{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
