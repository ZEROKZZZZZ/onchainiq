import React, { useState, useEffect } from 'react';
import {
  COINGECKO_LOGOS_DATABASE,
  TICKER_TO_COINGECKO_ID,
  getCoinGeckoLogoData,
  CoinGeckoCoinData,
} from '../data/coingeckoLogos';

interface TokenLogoProps {
  ticker: string;
  name?: string;
  logoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showRing?: boolean;
}

// Brand color configurations and vector SVG fallbacks for official crypto protocols
export const TOKEN_BRAND_CONFIG: Record<
  string,
  {
    brandColor: string;
    bgTint: string;
    borderColor: string;
    coingeckoId: string;
    renderSvg: (className?: string) => React.ReactNode;
  }
> = {
  UNI: {
    brandColor: '#FF007A',
    bgTint: 'rgba(255, 0, 122, 0.14)',
    borderColor: 'rgba(255, 0, 122, 0.4)',
    coingeckoId: 'uniswap',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M26.2 12.3c-.5-.7-1.3-1.2-2.1-1.3l-2.2-.3.9-2.1c.3-.8.2-1.7-.3-2.4-.5-.7-1.4-1.1-2.2-.9l-2.2.4.4-2.2C18.7 2.7 18.2 1.9 17.4 1.5c-.8-.4-1.7-.3-2.3.2L13.5 3l-.8-2.1C12.4.1 11.5-.2 10.7.1c-.8.3-1.4 1-1.4 1.9l-.1 2.2-2-.9C6.4 2.9 5.5 3 4.9 3.6c-.6.6-.8 1.5-.4 2.3l.9 2-2.1.2c-.9.1-1.6.7-1.9 1.5-.3.8-.1 1.7.5 2.3l1.6 1.5-2.2.8c-.8.3-1.3 1.1-1.3 1.9 0 .9.5 1.6 1.4 1.9l2.1.7-.8 2.1c-.3.8-.1 1.7.4 2.3.6.6 1.4.8 2.2.5l2.1-.8.2 2.2c.1.9.7 1.6 1.5 1.8.8.2 1.7-.1 2.2-.7l1.4-1.7 1.1 2c.4.8 1.2 1.2 2.1 1.2.9 0 1.6-.5 2-1.3l1-2 1.8 1.3c.7.5 1.6.6 2.3.2.7-.4 1.2-1.2 1.1-2l-.3-2.2 2.1-.4c.8-.2 1.5-.8 1.7-1.6.2-.8 0-1.7-.6-2.3l-1.5-1.6 2.1-.9c.8-.4 1.4-1.1 1.4-2 .1-.9-.5-1.7-1.3-2.1zm-8.4 4.5c-.7 1.8-2.6 2.8-4.4 2.1-1.8-.7-2.8-2.6-2.1-4.4.7-1.8 2.6-2.8 4.4-2.1 1.8.7 2.8 2.6 2.1 4.4z"
          fill="#FF007A"
        />
      </svg>
    ),
  },
  AAVE: {
    brandColor: '#B6509E',
    bgTint: 'rgba(182, 80, 158, 0.16)',
    borderColor: 'rgba(182, 80, 158, 0.4)',
    coingeckoId: 'aave',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#B6509E" />
        <path d="M19.8 22.3l-1.3-3.6h-5.1l-1.3 3.6h-2.5l5.1-13.6h2.6l5.1 13.6h-2.6zm-2-5.7L16 11.5l-1.8 5.1h3.6z" fill="#FFFFFF" />
      </svg>
    ),
  },
  ARB: {
    brandColor: '#28A0F0',
    bgTint: 'rgba(40, 160, 240, 0.15)',
    borderColor: 'rgba(40, 160, 240, 0.4)',
    coingeckoId: 'arbitrum',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#28A0F0" />
        <path d="M18.8 13.2l-4.7 7.8h-2.4l3.5-5.8-2-3.3h2.4l1.2 1.9 3.5-5.8h2.4l-3.9 5.2z" fill="#FFFFFF" />
        <path d="M19.7 17.6l2 3.4h-2.4l-1.2-1.9-1.2 1.9h-2.4l2-3.4h3.2z" fill="#1C274C" />
      </svg>
    ),
  },
  CRV: {
    brandColor: '#FF6B00',
    bgTint: 'rgba(255, 107, 0, 0.15)',
    borderColor: 'rgba(255, 107, 0, 0.4)',
    coingeckoId: 'curve-dao-token',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#1A1C29" />
        <path d="M6 19c0-6 4-11 10-11s10 5 10 11" stroke="#FF6B00" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="16" cy="12" r="2.5" fill="#FFFFFF" />
      </svg>
    ),
  },
  LDO: {
    brandColor: '#00A3FF',
    bgTint: 'rgba(0, 163, 255, 0.15)',
    borderColor: 'rgba(0, 163, 255, 0.4)',
    coingeckoId: 'lido-dao',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#00A3FF" fillOpacity="0.2" />
        <path d="M16 5l-7 11.5 7 4.5 7-4.5L16 5z" fill="#00A3FF" />
        <path d="M16 21l-7-4.5 7 10.5 7-10.5L16 21z" fill="#0077CC" />
      </svg>
    ),
  },
  EIGEN: {
    brandColor: '#6B46FF',
    bgTint: 'rgba(107, 70, 255, 0.18)',
    borderColor: 'rgba(107, 70, 255, 0.45)',
    coingeckoId: 'eigenlayer',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#160E36" />
        <rect x="8" y="9" width="16" height="3" rx="1.5" fill="#6B46FF" />
        <rect x="8" y="14.5" width="12" height="3" rx="1.5" fill="#A855F7" />
        <rect x="8" y="20" width="16" height="3" rx="1.5" fill="#6B46FF" />
        <circle cx="22" cy="16" r="2" fill="#00F59B" />
      </svg>
    ),
  },
  ETH: {
    brandColor: '#627EEA',
    bgTint: 'rgba(98, 126, 234, 0.15)',
    borderColor: 'rgba(98, 126, 234, 0.4)',
    coingeckoId: 'ethereum',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#1C2138" />
        <path d="M16 4.5l-6.5 10.7L16 19l6.5-3.8L16 4.5z" fill="#8A92B2" />
        <path d="M16 4.5v14.5l6.5-3.8L16 4.5z" fill="#627EEA" />
        <path d="M16 20.3L9.5 16.5 16 27.5l6.5-11-6.5 3.8z" fill="#8A92B2" />
        <path d="M16 20.3v7.2l6.5-11-6.5 3.8z" fill="#627EEA" />
      </svg>
    ),
  },
  MKR: {
    brandColor: '#1AAB9B',
    bgTint: 'rgba(26, 171, 155, 0.15)',
    borderColor: 'rgba(26, 171, 155, 0.4)',
    coingeckoId: 'maker',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#141E26" />
        <path d="M8 21.5V11l4.5 4.8L16 11l3.5 4.8L24 11v10.5h-2.2V14.8L18.5 19 16 15.5 13.5 19l-3.3-4.2v6.7H8z" fill="#1AAB9B" />
      </svg>
    ),
  },
  USDT: {
    brandColor: '#26A17B',
    bgTint: 'rgba(38, 161, 123, 0.15)',
    borderColor: 'rgba(38, 161, 123, 0.4)',
    coingeckoId: 'tether',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#26A17B" />
        <path d="M17.5 14.5v-2.2h5.5v-3.5h-14v3.5h5.5v2.2C10 14.7 7 15.6 7 16.7c0 1.2 3.5 2.1 8 2.2v4.8h2v-4.8c4.5-.1 8-1 8-2.2 0-1.1-3-2-7.5-2.2zm0 3.2c-3.6 0-6.2-.6-6.2-1.2s2.6-1.2 6.2-1.2 6.2.6 6.2 1.2-2.6 1.2-6.2 1.2z" fill="#FFFFFF" />
      </svg>
    ),
  },
  USDC: {
    brandColor: '#2775CA',
    bgTint: 'rgba(39, 117, 202, 0.15)',
    borderColor: 'rgba(39, 117, 202, 0.4)',
    coingeckoId: 'usd-coin',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#2775CA" />
        <path d="M16 5a11 11 0 100 22 11 11 0 000-22zm.8 17.5v1.2h-1.6v-1.2c-2-.2-3.3-1.3-3.4-2.8h2.1c.1.7.8 1.2 1.8 1.2 1 0 1.7-.5 1.7-1.3 0-.8-.6-1.1-1.9-1.5-2.2-.6-3.2-1.4-3.2-2.8 0-1.4 1.2-2.5 2.9-2.7V11h1.6v1.4c1.8.3 2.9 1.3 3 2.6h-2.1c-.1-.6-.6-1-1.5-1-.9 0-1.5.4-1.5 1.1 0 .6.5 1 1.8 1.3 2.3.6 3.4 1.4 3.4 2.9-.1 1.5-1.2 2.6-2.9 2.8z" fill="#FFFFFF" />
      </svg>
    ),
  },
  SOL: {
    brandColor: '#14F195',
    bgTint: 'rgba(20, 241, 149, 0.15)',
    borderColor: 'rgba(20, 241, 149, 0.4)',
    coingeckoId: 'solana',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#0D091B" />
        <rect x="8" y="9" width="16" height="3" rx="1.5" fill="#00FFA3" />
        <rect x="8" y="14.5" width="16" height="3" rx="1.5" fill="#DC1FFF" />
        <rect x="8" y="20" width="16" height="3" rx="1.5" fill="#00FFA3" />
      </svg>
    ),
  },
  BTC: {
    brandColor: '#F7931A',
    bgTint: 'rgba(247, 147, 26, 0.15)',
    borderColor: 'rgba(247, 147, 26, 0.4)',
    coingeckoId: 'bitcoin',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#F7931A" />
        <path d="M21.5 13.5c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.4-.3l.7-2.7-1.7-.4-.7 2.7c-.4-.1-.7-.2-1.1-.3l-2.3-.6-.5 1.8s1.2.3 1.2.3c.7.2.8.7.6 1.1l-1.5 6c.1 0 .2.1.3.1l-.3-.1-2.1 8.5c-.1.4-.4.8-1.1.6 0 0-1.2-.3-1.2-.3l-.8 2 2.2.6c.4.1.8.2 1.2.3l-.7 2.8 1.7.4.7-2.7c.5.1.9.2 1.4.3l-.7 2.7 1.7.4.7-2.8c2.9.5 5.1.3 6-2.3.8-2-.1-3.2-1.5-4 1.1-.3 1.9-1.1 2.1-2.8zm-3.8 5.7c-.5 2.1-4 1-5.1.7l.9-3.7c1.1.3 4.7.8 4.2 3zm.5-5.8c-.5 1.9-3.4.9-4.3.7l.8-3.3c.9.2 4 .7 3.5 2.6z" fill="#FFFFFF" />
      </svg>
    ),
  },
  DOGE: {
    brandColor: '#C2A633',
    bgTint: 'rgba(194, 166, 51, 0.15)',
    borderColor: 'rgba(194, 166, 51, 0.4)',
    coingeckoId: 'dogecoin',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#C2A633" />
        <path d="M12 9h4.5c3.5 0 6.5 2.5 6.5 7s-3 7-6.5 7H12V9zm3 3v8h1.5c2 0 3.5-1.5 3.5-4s-1.5-4-3.5-4H15z" fill="#FFFFFF" />
      </svg>
    ),
  },
  PEPE: {
    brandColor: '#479E47',
    bgTint: 'rgba(71, 158, 71, 0.15)',
    borderColor: 'rgba(71, 158, 71, 0.4)',
    coingeckoId: 'pepe',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#3B8132" />
        <ellipse cx="12" cy="14" rx="3.5" ry="4" fill="#FFFFFF" />
        <ellipse cx="20" cy="14" rx="3.5" ry="4" fill="#FFFFFF" />
        <circle cx="12" cy="14" r="2" fill="#000000" />
        <circle cx="20" cy="14" r="2" fill="#000000" />
        <path d="M10 21c2 2 10 2 12 0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  LINK: {
    brandColor: '#375BD2',
    bgTint: 'rgba(55, 91, 210, 0.15)',
    borderColor: 'rgba(55, 91, 210, 0.4)',
    coingeckoId: 'chainlink',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#375BD2" />
        <path d="M16 6l8.5 5v10L16 26l-8.5-5V11L16 6zm5.5 13.2V12.8L16 9.5l-5.5 3.3v6.4L16 22.5l5.5-3.3z" fill="#FFFFFF" />
      </svg>
    ),
  },
  AVAX: {
    brandColor: '#E84142',
    bgTint: 'rgba(232, 65, 66, 0.15)',
    borderColor: 'rgba(232, 65, 66, 0.4)',
    coingeckoId: 'avalanche-2',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#E84142" />
        <path d="M16 7l8 14H8l8-14z" fill="#FFFFFF" />
      </svg>
    ),
  },
  POL: {
    brandColor: '#8247E5',
    bgTint: 'rgba(130, 71, 229, 0.15)',
    borderColor: 'rgba(130, 71, 229, 0.4)',
    coingeckoId: 'polygon-ecosystem-token',
    renderSvg: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#8247E5" />
        <path d="M16 6l7 4v8l-7 4-7-4v-8l7-4z" fill="#FFFFFF" />
      </svg>
    ),
  },
};

export const TokenLogo: React.FC<TokenLogoProps> = ({
  ticker,
  name,
  logoUrl,
  size = 'md',
  className = '',
  showRing = true,
}) => {
  const cleanTicker = (ticker || '').toUpperCase().trim();
  const brand = TOKEN_BRAND_CONFIG[cleanTicker];
  const cgId = brand?.coingeckoId || TICKER_TO_COINGECKO_ID[cleanTicker];

  // Check CoinGecko direct database first
  const staticCg = cgId ? COINGECKO_LOGOS_DATABASE[cgId] : null;

  const [imageSrc, setImageSrc] = useState<string | null>(
    logoUrl || staticCg?.image.large || staticCg?.image.small || null
  );
  const [hasError, setHasError] = useState(false);

  // If no static CoinGecko match, attempt dynamic fetch from /api/coingecko/coins/:id
  useEffect(() => {
    if (logoUrl) {
      setImageSrc(logoUrl);
      return;
    }
    if (staticCg) {
      setImageSrc(staticCg.image.large || staticCg.image.small);
      return;
    }

    if (cgId) {
      getCoinGeckoLogoData(cgId).then((data) => {
        if (data?.image?.large || data?.image?.small) {
          setImageSrc(data.image.large || data.image.small);
        }
      });
    }
  }, [cleanTicker, cgId, logoUrl]);

  // Sizing map (32-40px baseline as requested)
  const sizeMap = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-xl',
  };

  const dimClass = sizeMap[size] || sizeMap.md;
  const brandColor = brand?.brandColor || staticCg?.brandColor || '#8B5CF6';
  const bgTint = brand?.bgTint || staticCg?.bgTint || 'rgba(139, 92, 246, 0.15)';
  const borderColor = brand?.borderColor || staticCg?.borderColor || 'rgba(139, 92, 246, 0.4)';

  // If token has a verified brand or CoinGecko logo
  if (brand || staticCg || imageSrc) {
    return (
      <div
        className={`relative rounded-full flex items-center justify-center shrink-0 overflow-hidden transition-all duration-150 ${dimClass} ${className}`}
        style={{
          backgroundColor: bgTint,
          borderColor: borderColor,
          borderWidth: showRing ? '1px' : '0px',
          boxShadow: 'none',
        }}
        title={`${name || cleanTicker} (${cleanTicker}) · Official CoinGecko Logo`}
      >
        {imageSrc && !hasError ? (
          <img
            src={imageSrc}
            alt={name || cleanTicker}
            className={`w-full h-full rounded-full ${cleanTicker === 'PEPE' ? 'object-cover' : 'object-contain p-0.5'}`}
            loading="lazy"
            onError={() => setHasError(true)}
          />
        ) : brand?.renderSvg ? (
          <div className="w-[82%] h-[82%] flex items-center justify-center">
            {brand.renderSvg()}
          </div>
        ) : (
          <span className="font-mono font-bold text-white uppercase text-[11px]">
            {cleanTicker.slice(0, 3)}
          </span>
        )}
      </div>
    );
  }

  // Neutral circular placeholder for unverified / custom / lesser-known tokens
  // Displays token's first letter in a muted gray-purple badge clearly distinct from branded icons
  const initial = cleanTicker ? cleanTicker[0] : (name ? name[0] : '?');

  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 bg-[#161026] border border-slate-700/60 text-slate-400 font-mono font-bold select-none transition-transform duration-150 ${dimClass} ${className}`}
      title={`${name || cleanTicker || 'Token'} · Unverified / Custom Protocol`}
    >
      <span>{initial}</span>
      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-slate-500 border border-[#0F0B1E]" />
    </div>
  );
};
