'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import Avatar from 'boring-avatars';

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop' | 'large'>('desktop');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const isMobileOrTablet = deviceType === 'mobile' || deviceType === 'tablet';

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else if (width < 1920) {
        setDeviceType('desktop');
      } else {
        setDeviceType('large');
      }
    };
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    // Функция для проверки состояния кошелька
    const checkWallet = () => {
      const buttonText = document.querySelector('.tc-button__text');
      if (buttonText && buttonText.textContent && buttonText.textContent !== 'Connect Wallet') {
        setWalletAddress(buttonText.textContent);
      } else {
        setWalletAddress(null);
      }
    };

    // Проверяем каждые 100ms
    const interval = setInterval(checkWallet, 100);

    // Наблюдаем за изменениями в DOM
    const observer = new MutationObserver(checkWallet);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('resize', checkDeviceType);
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const navItems = useMemo(() => [
    { href: '/', label: 'TON Wallets', isActive: pathname === '/' },
    { label: 'Ethereum Wallets', soon: true },
    { label: 'Solana Wallets', soon: true },
    { href: 'https://t.me/woodogs_support', label: 'Support', external: true },
    { href: '/airdrop', label: 'Airdrop', isButton: true },
  ], [pathname]);

  // Функция для генерации цветов на основе адреса
  const getAvatarColors = (address: string) => {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ['#3AABEE', '#229ED9', '#1E88E5', '#1976D2', '#1565C0'];
  };

  return (
    <header className="bg-black/80 backdrop-blur-md text-white fixed top-0 left-0 right-0 z-50 border-b border-[#2A2A2E]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/woodogslogo.svg" alt="WooDogs Logo" width={32} height={32} className="mr-2 invert" />
            <span className="font-bold text-[20px] whitespace-nowrap">WooDogs</span>
          </Link>

          {!isMobileOrTablet && (
            <nav className="hidden lg:flex items-center space-x-8 flex-shrink-0">
              {navItems.map((item, index) => (
                item.isButton ? (
                  <Link key={index} href={item.href} className="flex-shrink-0">
                    <button className="relative group h-10 px-6 rounded-xl overflow-hidden flex items-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF3366] via-[#FF6B6B] to-[#FF3366] group-hover:from-[#FF6B6B] group-hover:via-[#FF3366] group-hover:to-[#FF6B6B] transition-all duration-500 bg-[length:200%_100%] animate-gradient"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
                      <span className="text-[14px] font-semibold text-white z-10">{item.label}</span>
                    </button>
                  </Link>
                ) : (
                  <Link 
                    key={index}
                    href={item.href || '#'}
                    className={`relative group flex items-center ${
                      item.isActive 
                        ? 'text-[#3AABEE]' 
                        : 'text-white/80 hover:text-white'
                    } ${item.soon ? 'cursor-not-allowed' : ''} flex-shrink-0`}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    <span className="text-[14px] font-medium whitespace-nowrap relative">
                      {item.label}
                      {item.isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3AABEE] rounded-full transform scale-x-100 transition-transform duration-300"></span>
                      )}
                      {!item.isActive && !item.soon && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                      )}
                    </span>
                    {item.soon && (
                      <span className="ml-2 text-[12px] font-medium px-2 py-0.5 rounded-full bg-[#2A2A2E]/80 text-white/60 backdrop-blur-sm border border-[#2A2A2E] whitespace-nowrap">
                        Soon
                      </span>
                    )}
                  </Link>
                )
              ))}
            </nav>
          )}

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {walletAddress && (
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <Avatar
                    size={28}
                    name={walletAddress}
                    variant="beam"
                    colors={getAvatarColors(walletAddress)}
                  />
                </div>
              )}
              <TonConnectButton />
            </div>
            {isMobileOrTablet && (
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white flex-shrink-0">
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobileOrTablet && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 pt-20">
          <div className="max-w-md mx-auto px-4 h-[calc(100vh-80px)] flex flex-col">
            <nav className="flex flex-col space-y-6 flex-1">
              {walletAddress && (
                <Link 
                  href="/profile"
                  className="flex items-center space-x-3 px-4 py-3 bg-[#141414] rounded-xl border border-[#2A2A2E]/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Avatar
                    size={40}
                    name={walletAddress}
                    variant="beam"
                    colors={getAvatarColors(walletAddress)}
                  />
                  <div>
                    <span className="text-[16px] font-semibold text-white">My Profile</span>
                    <p className="text-[14px] text-gray-400">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                </Link>
              )}
              {navItems.map((item, index) => (
                <Link 
                  key={index}
                  href={item.href || '#'}
                  className={`group flex items-center justify-between ${
                    item.isActive ? 'text-[#3AABEE]' : 'text-white/90'
                  } ${item.soon ? 'cursor-not-allowed' : ''}`}
                  onClick={() => item.soon ? null : setIsMenuOpen(false)}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                >
                  <span className="text-[18px] font-medium relative">
                    {item.label}
                    {item.isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3AABEE] rounded-full"></span>
                    )}
                  </span>
                  {item.soon && (
                    <span className="text-[14px] font-medium px-3 py-1 rounded-full bg-[#2A2A2E]/80 text-white/60 backdrop-blur-sm border border-[#2A2A2E]">
                      Soon
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="pb-[calc(120px+env(safe-area-inset-bottom))]">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="relative group h-12 rounded-xl overflow-hidden flex items-center justify-center bg-[#141414] hover:bg-[#2A2A2E] border border-[#2A2A2E]/50 transition-all duration-300 w-full"
              >
                <span className="text-[16px] font-semibold text-white/90 group-hover:text-white z-10">Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;