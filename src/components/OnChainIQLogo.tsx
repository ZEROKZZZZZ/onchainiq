import React from 'react';

export const OnChainIQLogo: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
  <svg className={className} viewBox="0 0 104 106" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGradSidebar" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="50%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
      <filter id="coreGlowSidebar" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Outer Hexagonal Perimeter (Security & On-chain Proof) */}
    <polygon points="52,4 96,29 96,77 52,102 8,77 8,29" fill="#170f2f" stroke="url(#shieldGradSidebar)" strokeWidth="4.5" strokeLinejoin="round" />
    
    {/* Inner Intelligence Nodes / Neural Circuit */}
    <path d="M52,24 L52,53 M32,65 L52,53 M72,65 L52,53 M52,53 L52,82" stroke="#a855f7" strokeWidth="3.2" strokeLinecap="round" />
    
    {/* Nodes */}
    <circle cx="52" cy="53" r="7" fill="#ffffff" filter="url(#coreGlowSidebar)" />
    <circle cx="52" cy="53" r="3.5" fill="#6366f1" />
    <circle cx="52" cy="24" r="4.8" fill="#c084fc" />
    <circle cx="32" cy="65" r="4.5" fill="#818cf8" />
    <circle cx="72" cy="65" r="4.5" fill="#818cf8" />
    <circle cx="52" cy="82" r="4.8" fill="#3b82f6" />
  </svg>
);
