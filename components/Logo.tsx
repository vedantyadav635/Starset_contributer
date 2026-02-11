import React, { useId } from 'react';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-10", animated = false }) => {
  const id = useId();

  // 5-point Star Network Topology
  // Coordinates based on 100x100 viewBox
  
  // Outer Pentagon Points (Radius 45)
  const outer = [
    { x: 50, y: 5 },      // Top
    { x: 92.8, y: 36.1 }, // Top Right
    { x: 76.5, y: 86.4 }, // Bottom Right
    { x: 23.5, y: 86.4 }, // Bottom Left
    { x: 7.2, y: 36.1 }   // Top Left
  ];

  // Inner Pentagon Points (Radius 25)
  const inner = [
    { x: 50, y: 25 },     // Top
    { x: 73.8, y: 42.3 }, // Top Right
    { x: 64.7, y: 70.2 }, // Bottom Right
    { x: 35.3, y: 70.2 }, // Bottom Left
    { x: 26.2, y: 42.3 }  // Top Left
  ];

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
          <stop offset="50%" stopColor="#3b82f6" /> {/* Blue */}
          <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
        </linearGradient>
        
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter={`url(#${id}-glow)`}>
        {/* Network Lines */}
        <path
          d={`
            M ${outer[0].x} ${outer[0].y} L ${outer[1].x} ${outer[1].y} L ${outer[2].x} ${outer[2].y} L ${outer[3].x} ${outer[3].y} L ${outer[4].x} ${outer[4].y} Z
            M ${inner[0].x} ${inner[0].y} L ${inner[1].x} ${inner[1].y} L ${inner[2].x} ${inner[2].y} L ${inner[3].x} ${inner[3].y} L ${inner[4].x} ${inner[4].y} Z
            M 50 50 L ${inner[0].x} ${inner[0].y} L ${outer[0].x} ${outer[0].y}
            M 50 50 L ${inner[1].x} ${inner[1].y} L ${outer[1].x} ${outer[1].y}
            M 50 50 L ${inner[2].x} ${inner[2].y} L ${outer[2].x} ${outer[2].y}
            M 50 50 L ${inner[3].x} ${inner[3].y} L ${outer[3].x} ${outer[3].y}
            M 50 50 L ${inner[4].x} ${inner[4].y} L ${outer[4].x} ${outer[4].y}
          `}
          stroke={`url(#${id}-gradient)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />

        {/* Nodes */}
        {outer.map((p, i) => (
          <circle key={`o-${i}`} cx={p.x} cy={p.y} r="3" fill={`url(#${id}-gradient)`} stroke="white" strokeWidth="0.5" />
        ))}
        {inner.map((p, i) => (
          <circle key={`i-${i}`} cx={p.x} cy={p.y} r="2.5" fill={`url(#${id}-gradient)`} stroke="white" strokeWidth="0.5" />
        ))}

        {/* Central Hexagon */}
        <g transform="translate(50, 50)">
          <path 
            d="M 0 -16 L 14 -8 L 14 8 L 0 16 L -14 8 L -14 -8 Z" 
            fill="#0f172a" 
            stroke={`url(#${id}-gradient)`}
            strokeWidth="1.5"
          />
          
          {/* Inner 'S' Shape */}
          {/* Stylized S using thick stroke */}
          <path
              d="M 6 -8 L -6 -8 L -6 0 L 6 0 L 6 8 L -6 8"
              fill="none"
              stroke={`url(#${id}-gradient)`}
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="round"
              filter={`drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))`}
          />
        </g>
      </g>
    </svg>
  );
};