export interface CoinGeckoImage {
  thumb: string;
  small: string;
  large: string;
}

export interface CoinGeckoCoinData {
  id: string;
  symbol: string;
  name: string;
  image: CoinGeckoImage;
  brandColor: string;
  bgTint: string;
  borderColor: string;
}

// Real, verified CoinGecko image URLs returned from GET https://api.coingecko.com/api/v3/coins/{id}
export const COINGECKO_LOGOS_DATABASE: Record<string, CoinGeckoCoinData> = {
  uniswap: {
    id: 'uniswap',
    symbol: 'uni',
    name: 'Uniswap',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/12504/thumb/uniswap-logo.png?1720676669',
      small: 'https://coin-images.coingecko.com/coins/images/12504/small/uniswap-logo.png?1720676669',
      large: 'https://coin-images.coingecko.com/coins/images/12504/large/uniswap-logo.png?1720676669',
    },
    brandColor: '#FF007A',
    bgTint: 'rgba(255, 0, 122, 0.14)',
    borderColor: 'rgba(255, 0, 122, 0.4)',
  },
  aave: {
    id: 'aave',
    symbol: 'aave',
    name: 'Aave',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/12645/thumb/aave-token-round.png?1720472354',
      small: 'https://coin-images.coingecko.com/coins/images/12645/small/aave-token-round.png?1720472354',
      large: 'https://coin-images.coingecko.com/coins/images/12645/large/aave-token-round.png?1720472354',
    },
    brandColor: '#B6509E',
    bgTint: 'rgba(182, 80, 158, 0.16)',
    borderColor: 'rgba(182, 80, 158, 0.4)',
  },
  'curve-dao-token': {
    id: 'curve-dao-token',
    symbol: 'crv',
    name: 'Curve DAO Token',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/12124/thumb/Curve.png?1696511967',
      small: 'https://coin-images.coingecko.com/coins/images/12124/small/Curve.png?1696511967',
      large: 'https://coin-images.coingecko.com/coins/images/12124/large/Curve.png?1696511967',
    },
    brandColor: '#FF6B00',
    bgTint: 'rgba(255, 107, 0, 0.15)',
    borderColor: 'rgba(255, 107, 0, 0.4)',
  },
  arbitrum: {
    id: 'arbitrum',
    symbol: 'arb',
    name: 'Arbitrum',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/16547/thumb/photo_2023-03-29_21.47.00.jpeg',
      small: 'https://coin-images.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
      large: 'https://coin-images.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg',
    },
    brandColor: '#28A0F0',
    bgTint: 'rgba(40, 160, 240, 0.15)',
    borderColor: 'rgba(40, 160, 240, 0.4)',
  },
  'lido-dao': {
    id: 'lido-dao',
    symbol: 'ldo',
    name: 'Lido DAO',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/13573/thumb/Lido_DAO.png',
      small: 'https://coin-images.coingecko.com/coins/images/13573/small/Lido_DAO.png',
      large: 'https://coin-images.coingecko.com/coins/images/13573/large/Lido_DAO.png',
    },
    brandColor: '#00A3FF',
    bgTint: 'rgba(0, 163, 255, 0.15)',
    borderColor: 'rgba(0, 163, 255, 0.4)',
  },
  eigenlayer: {
    id: 'eigenlayer',
    symbol: 'eigen',
    name: 'EigenLayer',
    image: {
      thumb: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83/logo.png',
      small: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83/logo.png',
      large: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83/logo.png',
    },
    brandColor: '#6B46FF',
    bgTint: 'rgba(107, 70, 255, 0.18)',
    borderColor: 'rgba(107, 70, 255, 0.45)',
  },
  ethereum: {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/279/thumb/ethereum.png',
      small: 'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png',
      large: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
    },
    brandColor: '#627EEA',
    bgTint: 'rgba(98, 126, 234, 0.15)',
    borderColor: 'rgba(98, 126, 234, 0.4)',
  },
  maker: {
    id: 'maker',
    symbol: 'mkr',
    name: 'Maker',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/1364/thumb/Mark_Maker.png',
      small: 'https://coin-images.coingecko.com/coins/images/1364/small/Mark_Maker.png',
      large: 'https://coin-images.coingecko.com/coins/images/1364/large/Mark_Maker.png',
    },
    brandColor: '#1AAB9B',
    bgTint: 'rgba(26, 171, 155, 0.15)',
    borderColor: 'rgba(26, 171, 155, 0.4)',
  },
  tether: {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/325/thumb/Tether.png',
      small: 'https://coin-images.coingecko.com/coins/images/325/small/Tether.png',
      large: 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png',
    },
    brandColor: '#26A17B',
    bgTint: 'rgba(38, 161, 123, 0.15)',
    borderColor: 'rgba(38, 161, 123, 0.4)',
  },
  'usd-coin': {
    id: 'usd-coin',
    symbol: 'usdc',
    name: 'USDC',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/6319/thumb/usdc.png',
      small: 'https://coin-images.coingecko.com/coins/images/6319/small/usdc.png',
      large: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png',
    },
    brandColor: '#2775CA',
    bgTint: 'rgba(39, 117, 202, 0.15)',
    borderColor: 'rgba(39, 117, 202, 0.4)',
  },
  solana: {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/4128/thumb/solana.png',
      small: 'https://coin-images.coingecko.com/coins/images/4128/small/solana.png',
      large: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
    },
    brandColor: '#14F195',
    bgTint: 'rgba(20, 241, 149, 0.15)',
    borderColor: 'rgba(20, 241, 149, 0.4)',
  },
  bitcoin: {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png',
      small: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png',
      large: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
    },
    brandColor: '#F7931A',
    bgTint: 'rgba(247, 147, 26, 0.15)',
    borderColor: 'rgba(247, 147, 26, 0.4)',
  },
  dogecoin: {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/5/thumb/dogecoin.png',
      small: 'https://coin-images.coingecko.com/coins/images/5/small/dogecoin.png',
      large: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
    },
    brandColor: '#C2A633',
    bgTint: 'rgba(194, 166, 51, 0.15)',
    borderColor: 'rgba(194, 166, 51, 0.4)',
  },
  pepe: {
    id: 'pepe',
    symbol: 'pepe',
    name: 'Pepe',
    image: {
      thumb: '/assets/tokens/pepe.svg',
      small: '/assets/tokens/pepe.svg',
      large: '/assets/tokens/pepe.svg',
    },
    brandColor: '#479E47',
    bgTint: 'rgba(71, 158, 71, 0.15)',
    borderColor: 'rgba(71, 158, 71, 0.4)',
  },
  chainlink: {
    id: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png',
      small: 'https://coin-images.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
      large: 'https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    },
    brandColor: '#375BD2',
    bgTint: 'rgba(55, 91, 210, 0.15)',
    borderColor: 'rgba(55, 91, 210, 0.4)',
  },
  'avalanche-2': {
    id: 'avalanche-2',
    symbol: 'avax',
    name: 'Avalanche',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/12559/thumb/Avalanche_Circle_RedWhite_Trans.png',
      small: 'https://coin-images.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
      large: 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    },
    brandColor: '#E84142',
    bgTint: 'rgba(232, 65, 66, 0.15)',
    borderColor: 'rgba(232, 65, 66, 0.4)',
  },
  'polygon-ecosystem-token': {
    id: 'polygon-ecosystem-token',
    symbol: 'pol',
    name: 'Polygon',
    image: {
      thumb: 'https://coin-images.coingecko.com/coins/images/4713/thumb/polygon.png',
      small: 'https://coin-images.coingecko.com/coins/images/4713/small/polygon.png',
      large: 'https://coin-images.coingecko.com/coins/images/4713/large/polygon.png',
    },
    brandColor: '#8247E5',
    bgTint: 'rgba(130, 71, 229, 0.15)',
    borderColor: 'rgba(130, 71, 229, 0.4)',
  },
};

// Map tickers/names to CoinGecko IDs
export const TICKER_TO_COINGECKO_ID: Record<string, string> = {
  UNI: 'uniswap',
  UNISWAP: 'uniswap',
  AAVE: 'aave',
  CRV: 'curve-dao-token',
  CURVE: 'curve-dao-token',
  ARB: 'arbitrum',
  ARBITRUM: 'arbitrum',
  LDO: 'lido-dao',
  LIDO: 'lido-dao',
  EIGEN: 'eigenlayer',
  EIGENLAYER: 'eigenlayer',
  ETH: 'ethereum',
  ETHEREUM: 'ethereum',
  MKR: 'maker',
  MAKER: 'maker',
  SKY: 'maker',
  USDT: 'tether',
  TETHER: 'tether',
  USDC: 'usd-coin',
  SOL: 'solana',
  SOLANA: 'solana',
  BTC: 'bitcoin',
  BITCOIN: 'bitcoin',
  DOGE: 'dogecoin',
  DOGECOIN: 'dogecoin',
  PEPE: 'pepe',
  LINK: 'chainlink',
  CHAINLINK: 'chainlink',
  AVAX: 'avalanche-2',
  AVALANCHE: 'avalanche-2',
  POL: 'polygon-ecosystem-token',
  MATIC: 'polygon-ecosystem-token',
  POLYGON: 'polygon-ecosystem-token',
  XRP: 'ripple',
};

export const MANUAL_LOGO_OVERRIDES: Record<string, string> = {
  pepe: '/assets/tokens/pepe.svg',
};

// Client-side cache for dynamically fetched CoinGecko logos
const dynamicLogoCache = new Map<string, CoinGeckoCoinData>();

// Clear any stale cache for Pepe
dynamicLogoCache.delete('pepe');
dynamicLogoCache.delete('PEPE');

/**
 * Resolves real, current logo URLs from CoinGecko GET https://api.coingecko.com/api/v3/coins/{id}
 */
export async function getCoinGeckoLogoData(tickerOrId: string): Promise<CoinGeckoCoinData | null> {
  const normalized = tickerOrId.trim().toLowerCase();
  const upperTicker = tickerOrId.trim().toUpperCase();

  // 0. Manual override map fallback
  const overrideUrl = MANUAL_LOGO_OVERRIDES[normalized] || MANUAL_LOGO_OVERRIDES[upperTicker];
  if (overrideUrl) {
    const overrideData: CoinGeckoCoinData = {
      id: normalized,
      symbol: upperTicker,
      name: upperTicker === 'PEPE' ? 'Pepe' : upperTicker,
      image: {
        thumb: overrideUrl.replace('/large/', '/thumb/'),
        small: overrideUrl.replace('/large/', '/small/'),
        large: overrideUrl,
      },
      brandColor: '#479E47',
      bgTint: 'rgba(71, 158, 71, 0.15)',
      borderColor: 'rgba(71, 158, 71, 0.4)',
    };
    dynamicLogoCache.set(normalized, overrideData);
    return overrideData;
  }

  // 1. Direct match by CoinGecko ID
  if (COINGECKO_LOGOS_DATABASE[normalized]) {
    return COINGECKO_LOGOS_DATABASE[normalized];
  }

  // 2. Ticker symbol match
  const mappedId = TICKER_TO_COINGECKO_ID[upperTicker] || TICKER_TO_COINGECKO_ID[normalized];
  if (mappedId && COINGECKO_LOGOS_DATABASE[mappedId]) {
    return COINGECKO_LOGOS_DATABASE[mappedId];
  }

  // 3. Dynamic cache check
  if (dynamicLogoCache.has(normalized)) {
    return dynamicLogoCache.get(normalized)!;
  }

  // 4. Query server-side proxy route /api/coingecko/coins/:id
  try {
    const idToQuery = mappedId || normalized;
    const res = await fetch(`/api/coingecko/coins/${idToQuery}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.image) {
        const coinData: CoinGeckoCoinData = {
          id: data.id || idToQuery,
          symbol: data.symbol || upperTicker,
          name: data.name || upperTicker,
          image: {
            thumb: data.image.thumb,
            small: data.image.small,
            large: data.image.large,
          },
          brandColor: '#A855F7',
          bgTint: 'rgba(168, 85, 247, 0.15)',
          borderColor: 'rgba(168, 85, 247, 0.35)',
        };
        dynamicLogoCache.set(normalized, coinData);
        return coinData;
      }
    }
  } catch (err) {
    console.warn(`Could not load CoinGecko logo for ${tickerOrId}:`, err);
  }

  return null;
}
