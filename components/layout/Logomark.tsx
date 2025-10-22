
import React from 'react';

export const Logomark: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    aria-label="VeriClear Logomark"
  >
    <title>VeriClear Logomark</title>
    <circle cx="16" cy="16" r="15" stroke="#4285F4" strokeWidth="2"></circle>
    <path d="M 13 10 L 9 13 L 13 16" stroke="#EA4335" strokeWidth="2.5"></path>
    <path d="M 19 10 L 23 13 L 19 16" stroke="#FBBC05" strokeWidth="2.5"></path>
    <path d="M 10 21 Q 16 26 22 21" stroke="#34A853" strokeWidth="2.5"></path>
  </svg>
);
