import { tonTokens, TonToken } from './tonTokens';

export interface WalletOffer {
  id: string;
  name: string;
  icon: string;
  priceRange: string;
  priceUSD: number;
  isHot: boolean;
  createdAt: string;
  description: string;
  available: string;
  tokens: {
    token: TonToken;
    balance: number;
    address: string;
    value: number;
  }[];
}

const generateTokenData = (token: TonToken, seed: number): { balance: number; address: string; value: number } => {
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  return {
    balance: parseFloat((random() * 10000).toFixed(2)),
    address: `EQ${Array.from({length: 20}, () => '0123456789ABCDEF'[Math.floor(random() * 16)]).join('')}`,
    value: parseFloat((random() * 100).toFixed(2))
  };
};

export const walletOffers: WalletOffer[] = [
  {
    id: "ton-wallet-1",
    name: "TON Wallet",
    icon: "/ton-wallet-icon.png",
    priceRange: "~23kk",
    priceUSD: 2918,
    isHot: true,
    createdAt: "2024-07-03",
    description: "TON Wallet with various features and balance. Great for intermediate users.",
    available: "23/93",
    tokens: tonTokens.slice(0, 6).map((token, index) => ({
      token,
      ...generateTokenData(token, index)
    }))
  },
  // Добавьте другие предложения кошельков здесь
];

export const getWalletOfferById = (id: string): WalletOffer | undefined => {
  return walletOffers.find(offer => offer.id === id);
};