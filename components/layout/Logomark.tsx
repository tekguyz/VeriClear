
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

    {/* Phone Body */}
    <rect 
      x="8" 
      y="4" 
      width="24" 
      height="32" 
      rx="6" 
      className="text-text-primary" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      fill="none"
    />
    
    {/* Inner Screen Area */}
    <rect
       x="11"
       y="7"
       width="18"
       height="26"
       rx="3"
       fill="currentColor"
       fillOpacity="0.05"
       stroke="none"
    />

    {/* Gemini Sparkle - Centered and larger */}
    <path 
      d="M20 10C20 10 22.5 15.5 28 20C22.5 24.5 20 30 20 30C20 30 17.5 24.5 12 20C17.5 15.5 20 10 20 10Z" 
      fill="url(#gemini-gradient-logo)" 
      stroke="none"
      filter="drop-shadow(0px 0px 4px rgba(155, 114, 203, 0.4))"
    />
  </svg>
);
