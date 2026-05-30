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
      className={`${className} ${animated ? 'animate-[pulse_2s_ease-in-out_infinite]' : 'animate-[float_6s_ease-in-out_infinite]'} drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:brightness-125`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main 3D Metallic Gradient */}
        <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="text-blue-400 dark:text-blue-300" stopColor="currentColor" />
          <stop offset="25%" className="text-blue-500 dark:text-blue-400" stopColor="currentColor" />
          <stop offset="50%" className="text-blue-600 dark:text-blue-500" stopColor="currentColor" />
          <stop offset="75%" className="text-blue-700 dark:text-blue-600" stopColor="currentColor" />
          <stop offset="100%" className="text-blue-800 dark:text-blue-700" stopColor="currentColor" />
        </linearGradient>

        {/* Darker Metallic Gradient for Depth (Back elements) */}
        <linearGradient id="metal-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="text-blue-600 dark:text-blue-500" stopColor="currentColor" />
          <stop offset="40%" className="text-blue-800 dark:text-blue-600" stopColor="currentColor" />
          <stop offset="60%" className="text-blue-900 dark:text-blue-700" stopColor="currentColor" />
          <stop offset="100%" className="text-blue-950 dark:text-blue-900" stopColor="currentColor" />
        </linearGradient>

        {/* Highlight Gradient for Swooshes */}
        <linearGradient id="metal-highlight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" className="text-blue-300 dark:text-blue-200" stopColor="currentColor" />
          <stop offset="30%" className="text-blue-400 dark:text-blue-300" stopColor="currentColor" />
          <stop offset="70%" className="text-blue-500 dark:text-blue-400" stopColor="currentColor" />
          <stop offset="100%" className="text-blue-300 dark:text-blue-200" stopColor="currentColor" />
        </linearGradient>

        <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.5"/>
        </filter>
        
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* A-Frame (Back Layer) */}
      <path 
        d="M 50 5 L 15 85 L 28 85 L 50 25 L 72 85 L 85 85 Z" 
        fill="url(#metal-dark)" 
        filter="url(#shadow3d)"
        stroke="#60a5fa"
        strokeWidth="0.5"
      />

      {/* Left-bound Swoosh (Middle Layer) */}
      <path 
        d="M 85 85 Q 50 85 5 45 Q 50 65 72 85 Z" 
        fill="url(#metal)" 
        filter="url(#shadow3d)"
        stroke="#93c5fd"
        strokeWidth="0.5"
      />

      {/* Right-bound Swoosh (Front Layer) */}
      <path 
        d="M 15 85 Q 50 85 95 45 Q 50 65 28 85 Z" 
        fill="url(#metal-highlight)" 
        filter="url(#shadow3d)"
        stroke="#bfdbfe"
        strokeWidth="0.5"
      />

      {/* Diamond Star with glowing pulse */}
      <g className="origin-[50px_94px] animate-[pulse_2s_ease-in-out_infinite]">
        <path 
          d="M 50 88 Q 50 94 42 94 Q 50 94 50 100 Q 50 94 58 94 Q 50 94 50 88 Z" 
          fill="url(#metal-highlight)" 
          filter="url(#glow)"
          stroke="#ffffff"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};