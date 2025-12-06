
import React from 'react';

export const Logomark: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 40 40" 
    fill="none" 
    className={className}
    aria-labelledby="vericlear-logo-title"
    role="img"
  >
    <title id="vericlear-logo-title">VeriClear Logo</title>
    
    <defs>
      <linearGradient id="gemini-gradient-logo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="50%" stopColor="#9B72CB" />
        <stop offset="100%" stopColor="#D96570" />
      </linearGradient>
    </defs>

    {/* Hexagon Container Shape */}
    <path
      d="M20 2L35.5885 11V29L20 38L4.41154 29V11L20 2Z"
      stroke="url(#gemini-gradient-logo)"
      strokeWidth="2.5"
      fill="currentColor"
      fillOpacity="0.05"
      strokeLinejoin="round"
    />

    {/* Sound Wave forming the Left side of V */}
    <rect x="11" y="14" width="3" height="12" rx="1.5" fill="currentColor" className="text-text-primary" />
    <rect x="16" y="18" width="3" height="8" rx="1.5" fill="currentColor" className="text-text-primary" />

    {/* Checkmark forming the Right side of V */}
    <path
      d="M21 22L24 25L30 15"
      stroke="url(#gemini-gradient-logo)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
