
import React from 'react';

export const Logomark: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className}
    aria-labelledby="vericlear-logo-title"
    role="img"
  >
    <title id="vericlear-logo-title">VeriClear Logo</title>
    
    <defs>
      <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="50%" stopColor="#9B72CB" />
        <stop offset="100%" stopColor="#D96570" />
      </linearGradient>
    </defs>

    {/* Phone Frame */}
    <rect 
      x="7" 
      y="2" 
      width="18" 
      height="28" 
      rx="4" 
      className="stroke-icon-primary" 
      strokeWidth="2.5" 
      fill="none"
    />

    {/* Phone Screen/Interior */}
    <rect 
      x="9" 
      y="4" 
      width="14" 
      height="24" 
      rx="2" 
      fill="currentColor" 
      fillOpacity="0.05" 
      className="text-text-primary"
    />
    
    {/* Gemini Sparkle */}
    <path 
      d="M 16 8 C 16 8 18 13 22 16 C 18 19 16 24 16 24 C 16 24 14 19 10 16 C 14 13 16 8 16 8 Z" 
      fill="url(#gemini-gradient)" 
      stroke="none"
      filter="drop-shadow(0px 0px 2px rgba(66, 133, 244, 0.3))"
    />
  </svg>
);
