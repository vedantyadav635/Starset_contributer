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
export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-10", animated = false }) => {
  return (
    <div className={`relative ${className} ${animated ? 'animate-pulse' : ''} transition-transform duration-500 hover:scale-105 hover:-translate-y-1`} style={{ perspective: '1000px' }}>
      <img
        src="/logo.png"
        alt="Starset Logo"
        className="w-full h-full mix-blend-multiply dark:mix-blend-lighten drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_10px_15px_rgba(255,255,255,0.15)] transition-all duration-300"
        style={{ objectFit: 'contain', filter: 'drop-shadow(0px 8px 10px rgba(0,0,0,0.6)) contrast(1.1) brightness(1.1)' }}
        draggable={false}
      />
    </div>
  );
};