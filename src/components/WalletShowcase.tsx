'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { finalWalletOffers, WalletOffer } from '@/data/walletOffers';
import WalletCardSkeleton from './WalletCardSkeleton';
import { useSearch } from './SearchContext';

interface WalletCardProps {
  offer: WalletOffer;
}

const WalletCard: React.FC<WalletCardProps> = ({ offer }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  const auctionEndTime = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    const storedEndTime = localStorage.getItem(`auctionEndTime_${offer.id}`);
    if (storedEndTime) {
      return parseInt(storedEndTime, 10);
    }
    const seed = offer.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = Math.sin(seed) * 10000;
    const hours = Math.floor(random % 48); // От 0 до 47 часов
    const endTime = Date.now() + hours * 3600000;
    localStorage.setItem(`auctionEndTime_${offer.id}`, endTime.toString());
    return endTime;
  }, [offer.id]);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const difference = auctionEndTime - now;

      if (difference <= 0) {
        setIsAuctionEnded(true);
        setTimeLeft('Ended');
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        setTimeLeft(`${hours}h ${minutes}m`);
        setIsAuctionEnded(false);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Обновляем каждую минуту

    return () => clearInterval(timer);
  }, [auctionEndTime]);

  return (
    <Link href={`/wallet/${offer.id}`}>
      <div className="bg-[#141414] rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl flex flex-col h-full cursor-pointer border border-[#2A2A2E]">
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-[22%] overflow-hidden mr-4">
                <Image src={offer.icon} alt={offer.name} width={48} height={48} className="object-cover" />
              </div>
              <h3 className="text-xl font-bold titanium-gradient">{offer.name}</h3>
            </div>
            <span className="text-yellow-400 font-semibold text-xs bg-yellow-400/10 px-2 py-1 rounded-full">
              {offer.priceRange}
            </span>
          </div>
          <div className="flex items-center text-gray-300 mb-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#3AABEE]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{offer.createdAt}</span>
          </div>
          <p className="text-gray-300 text-sm mb-4 flex-grow">{offer.description}</p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-lg font-bold titanium-gradient">${offer.priceUSD}</span>
            <div className="flex items-center">
              <span className="text-gray-300 mr-2 text-sm">Bid ends:</span>
              <span className={`font-semibold ${isAuctionEnded ? 'text-red-500' : 'text-[#FFA500]'}`}>{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const WalletShowcase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tonPrice, setTonPrice] = useState<number | null>(null);
  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchTonPrice = async () => {
      try {
        const response = await fetch('/api/ton-price');
        if (!response.ok) {
          throw new Error('Error fetching TON price');
        }
        const data = await response.json();
        setTonPrice(data.price);
      } catch (error) {
        console.error('Error fetching TON price:', error);
      }
      setIsLoading(false);
    };

    fetchTonPrice();
  }, []);

  const filteredOffers = useMemo(() => {
    return finalWalletOffers.filter(offer =>
      offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const offersWithTonAmount = useMemo(() => {
    return filteredOffers.map(offer => ({
      ...offer,
      tonAmount: tonPrice ? (offer.priceUSD / tonPrice).toFixed(2) : 'N/A'
    }));
  }, [filteredOffers, tonPrice]);

  const hotOffers = useMemo(() => offersWithTonAmount.filter(offer => offer.isHot), [offersWithTonAmount]);
  const regularOffers = useMemo(() => offersWithTonAmount.filter(offer => !offer.isHot), [offersWithTonAmount]);

  if (isLoading) {
    return (
      <div className="bg-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2AABEE] to-[#1E88E5] text-transparent bg-clip-text mb-8 text-center">Hot TON Wallets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[...Array(3)].map((_, index) => (
              <WalletCardSkeleton key={index} />
            ))}
          </div>
          
          <div className="border-t border-[#2A2A2E] my-16"></div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2AABEE] to-[#1E88E5] text-transparent bg-clip-text mb-8 text-center">More TON Wallets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <WalletCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (filteredOffers.length === 0) {
    return (
      <div className="bg-black pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full text-center">
          <div className="mb-4 transition-all duration-300" style={{ height: '160px' }}>
            <Image 
              src="/notfound.gif" 
              alt="Not Found" 
              width={160} 
              height={160} 
              className="mx-auto object-contain rounded-[22%]"
            />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
            <span className="titanium-gradient">Oops, nothing found</span>
          </h2>
          <p className="text-sm sm:text-base mb-4 text-gray-300 max-w-2xl mx-auto">
            We couldn't find any wallets matching your search. Try different keywords or browse our available options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {hotOffers.length > 0 && (
          <>
            <h2 className="text-3xl font-bold titanium-gradient mb-8 text-center">Hot TON Wallets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {hotOffers.map((offer) => <WalletCard key={offer.id} offer={offer} />)}
            </div>
            
            <div className="border-t border-[#2A2A2E] my-16"></div>
          </>
        )}
        
        {regularOffers.length > 0 && (
          <>
            <h2 className="text-3xl font-bold titanium-gradient mb-8 text-center">More TON Wallets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularOffers.map((offer) => <WalletCard key={offer.id} offer={offer} />)}
            </div>
          </>
        )}
      </div>
      <style jsx global>{`
        .titanium-gradient {
          background: linear-gradient(
             45deg,
            #E8E8E8,
            #D3D3D3,
            #BEBEBE,
            #A9A9A9
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: titanium 10s ease infinite;
        }

        @keyframes titanium {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default WalletShowcase;
