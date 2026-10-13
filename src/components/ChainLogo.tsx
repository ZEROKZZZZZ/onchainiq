import React from 'react';

interface ChainLogoProps {
  chainName: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const ChainLogo: React.FC<ChainLogoProps> = ({ chainName, size = 'sm', className = '' }) => {
  const norm = (chainName || '').toLowerCase();

  const dim = size === 'xs' ? 'w-3 h-3' : size === 'md' ? 'w-4.5 h-4.5' : 'w-3.5 h-3.5';

  if (norm.includes('eth')) {
    return (
      <svg className={`${dim} ${className} shrink-0`} viewBox="0 0 32 32" fill="none">
        <path d="M16 2L7 16.5l9 5.3 9-5.3L16 2z" fill="#8A92B2" />
        <path d="M16 2v19.8l9-5.3L16 2z" fill="#627EEA" />
        <path d="M16 23.3L7 18.2 16 30l9-11.8-9 5.1z" fill="#8A92B2" />
        <path d="M16 23.3v6.7l9-11.8-9 5.1z" fill="#627EEA" />
      </svg>
    );
  }

  if (norm.includes('arbitrum')) {
    return (
      <svg className={`${dim} ${className} shrink-0`} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#28A0F0" fillOpacity="0.2" />
        <path d="M16 5l8 4.6v9.2L16 23.4 8 18.8V9.6L16 5z" fill="#28A0F0" />
        <path d="M18 12l-4 6h-2l3-4.5-1.5-2.5h2l1 1.5 3-4.5h2L18 12z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (norm.includes('optimism')) {
    return (
      <svg className={`${dim} ${className} shrink-0`} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#FF0420" />
        <path d="M11 11h3.5c2.5 0 4 1.5 4 4s-1.5 4-4 4H11V11z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (norm.includes('polygon')) {
    return (
      <svg className={`${dim} ${className} shrink-0`} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#8247E5" fillOpacity="0.2" />
        <path d="M16 6l7 4v8l-7 4-7-4v-8l7-4z" fill="#8247E5" />
      </svg>
    );
  }

  if (norm.includes('base')) {
    return (
      <svg className={`${dim} ${className} shrink-0`} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#0052FF" />
        <path d="M16 7a9 9 0 100 18 9 9 0 000-18zm0 14a5 5 0 110-10 5 5 0 010 10z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (norm.includes('bitcoin') || norm.includes('btc')) {
    return (
      <svg className={`${dim} ${className} shrink-0`} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#F7931A" />
        <path d="M21.5 13.5c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.4-.3l.7-2.7-1.7-.4-.7 2.7c-.4-.1-.7-.2-1.1-.3l-2.3-.6-.5 1.8s1.2.3 1.2.3c.7.2.8.7.6 1.1l-1.5 6c.1 0 .2.1.3.1l-.3-.1-2.1 8.5c-.1.4-.4.8-1.1.6 0 0-1.2-.3-1.2-.3l-.8 2 2.2.6c.4.1.8.2 1.2.3l-.7 2.8 1.7.4.7-2.7c.5.1.9.2 1.4.3l-.7 2.7 1.7.4.7-2.8c2.9.5 5.1.3 6-2.3.8-2-.1-3.2-1.5-4 1.1-.3 1.9-1.1 2.1-2.8zm-3.8 5.7c-.5 2.1-4 1-5.1.7l.9-3.7c1.1.3 4.7.8 4.2 3zm.5-5.8c-.5 1.9-3.4.9-4.3.7l.8-3.3c.9.2 4 .7 3.5 2.6z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (norm.includes('solana') || norm.includes('sol')) {
    return (
      <svg className={`${dim} ${className} shrink-0`} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#0D091B" />
        <rect x="8" y="9" width="16" height="3" rx="1.5" fill="#00FFA3" />
        <rect x="8" y="14.5" width="16" height="3" rx="1.5" fill="#DC1FFF" />
        <rect x="8" y="20" width="16" height="3" rx="1.5" fill="#00FFA3" />
      </svg>
    );
  }

  if (norm.includes('avalanche') || norm.includes('avax')) {
    return (
      <svg className={`${dim} ${className} shrink-0`} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#E84142" />
        <path d="M16 7l8 14H8l8-14z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (norm.includes('doge')) {
    return (
      <svg className={`${dim} ${className} shrink-0`} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#C2A633" />
        <path d="M12 9h4.5c3.5 0 6.5 2.5 6.5 7s-3 7-6.5 7H12V9zm3 3v8h1.5c2 0 3.5-1.5 3.5-4s-1.5-4-3.5-4H15z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Default network node icon
  return (
    <svg className={`${dim} ${className} shrink-0 text-slate-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
    </svg>
  );
};
