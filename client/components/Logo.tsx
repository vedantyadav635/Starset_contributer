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
    <svg 
      viewBox="-5 -5 110 115" 
      className={`${className} ${animated ? 'animate-pulse' : ''} drop-shadow-xl`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main 3D Metallic Gradient */}
        <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="text-slate-400 dark:text-slate-50" stopColor="currentColor" />
          <stop offset="25%" className="text-slate-600 dark:text-slate-300" stopColor="currentColor" />
          <stop offset="50%" className="text-slate-800 dark:text-slate-400" stopColor="currentColor" />
          <stop offset="75%" className="text-slate-600 dark:text-slate-300" stopColor="currentColor" />
          <stop offset="100%" className="text-slate-900 dark:text-slate-500" stopColor="currentColor" />
        </linearGradient>

        {/* Darker Metallic Gradient for Depth (Back elements) */}
        <linearGradient id="metal-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="text-slate-500 dark:text-slate-200" stopColor="currentColor" />
          <stop offset="40%" className="text-slate-800 dark:text-slate-400" stopColor="currentColor" />
          <stop offset="60%" className="text-slate-900 dark:text-slate-500" stopColor="currentColor" />
          <stop offset="100%" className="text-black dark:text-slate-700" stopColor="currentColor" />
        </linearGradient>

        {/* Highlight Gradient for Swooshes */}
        <linearGradient id="metal-highlight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" className="text-slate-300 dark:text-white" stopColor="currentColor" />
          <stop offset="30%" className="text-slate-500 dark:text-slate-300" stopColor="currentColor" />
          <stop offset="70%" className="text-slate-700 dark:text-slate-400" stopColor="currentColor" />
          <stop offset="100%" className="text-slate-400 dark:text-slate-200" stopColor="currentColor" />
        </linearGradient>

        <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4"/>
        </filter>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* A-Frame (Back Layer) */}
      <path 
        d="M 50 5 L 15 85 L 28 85 L 50 25 L 72 85 L 85 85 Z" 
        fill="url(#metal-dark)" 
        filter="url(#shadow3d)"
        stroke="#cbd5e1"
        strokeWidth="0.5"
      />

      {/* Left-bound Swoosh (Middle Layer) */}
      <path 
        d="M 85 85 Q 50 85 5 45 Q 50 65 72 85 Z" 
        fill="url(#metal)" 
        filter="url(#shadow3d)"
        stroke="#f8fafc"
        strokeWidth="0.5"
      />

      {/* Right-bound Swoosh (Front Layer) */}
      <path 
        d="M 15 85 Q 50 85 95 45 Q 50 65 28 85 Z" 
        fill="url(#metal-highlight)" 
        filter="url(#shadow3d)"
        stroke="#ffffff"
        strokeWidth="0.5"
      />

      {/* Diamond Star */}
      <path 
        d="M 50 88 Q 50 94 42 94 Q 50 94 50 100 Q 50 94 58 94 Q 50 94 50 88 Z" 
        fill="url(#metal-highlight)" 
        filter="url(#glow)"
        stroke="#ffffff"
        strokeWidth="0.5"
      />
    </svg>
  );
};