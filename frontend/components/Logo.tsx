import React from 'react';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

/**
 * Starset hexagonal "S" logo.
 * Uses the brand PNG with mix-blend-mode to ensure
 * the white background is invisible on dark surfaces.
 */
export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-10" }) => {
  return (
    <img
      src="/logo.png"
      alt="Starset Logo"
      className={className}
      style={{ objectFit: 'contain', mixBlendMode: 'lighten' }}
      draggable={false}
    />
  );
};