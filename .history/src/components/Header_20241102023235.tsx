'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop' | 'large'>('desktop');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedConnectionState = localStorage.getItem('walletConnected');
    setIsConnected(savedConnectionState === 'true');
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else if (width < 1728) {
        setDeviceType('desktop');
      } else {
        setDeviceType('large');
      }
    };
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const navItems = useMemo(() => [
    { href: '/', label: 'TON Wallets', isActive: pathname === '/' },
    { label: 'Ethereum Wallets', soon: true },
    { label: 'Solana Wallets', soon: true },
    { href: 'https://t.me/woodogs_support', label: 'Support', external: true },
    { href: '/airdrop', label: 'Airdrop', isButton: true },
  ], [pathname]);

  const isMobileOrTablet = deviceType === 'mobile' || deviceType === 'tablet';

  const handleConnect = () => {
    setIsConnected(true);
    localStorage.setItem('walletConnected', 'true');
  };

  const handleLogout = () => {
    setIsConnected(false);
    setIsDropdownOpen(false);
    localStorage.removeItem('walletConnected');
  };

  const handleProfileClick = () => {
    sessionStorage.setItem('profileData', JSON.stringify({
      address: 'EQD....abc',
      id: Math.random().toString(36).substring(7)
    }));
    
    setIsDropdownOpen(false);
    router.push('/profile');
  };

  const renderWalletButton = () => {
    if (!mounted || isConnected === null) {
      return (
        <div className="bg-[#141414] text-white py-2 px-4 rounded-full text-[14px] font-medium h-8 w-[140px] flex items-center justify-center border border-[#2A2A2E]">
          <div className="w-3 h-3 rounded-full border-2 border-[#3AABEE] border-t-transparent animate-spin"></div>
        </div>
      );
    }

    if (isConnected) {
      return (
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-[#141414] text-white py-2 px-4 rounded-full text-[14px] font-medium flex items-center hover:bg-[#2A2A2E] transition-colors duration-300 h-8 border border-[#2A2A2E] min-w-[120px] justify-between"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#3AABEE]"></div>
            <span className="text-white/90">0xF13df1</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-white/70" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      );
    }

    return (
      <button
        onClick={handleConnect}
        className="bg-[#3AABEE] text-white py-2 px-4 rounded-full text-[14px] font-medium hover:bg-[#2691D9] transition-colors duration-300 h-8 flex items-center justify-center"
      >
        Connect Wallet
      </button>
    );
  };

  return (
    <>
      <header className="bg-black/80 backdrop-blur-md text-white fixed top-0 left-0 right-0 z-50 border-b border-[#2A2A2E]/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[72px]">
            <Link href="/" className="flex items-center">
              <Image src="/woodogslogo.svg" alt="WooDogs Logo" width={36} height={36} className="mr-3 invert" />
              <span className="font-bold text-[22px]">WooDogs</span>
            </Link>
            
            {(deviceType === 'desktop' || deviceType === 'large') && (
              <nav className="hidden lg:flex items-center space-x-8">
                {navItems.map((item, index) => (
                  item.isButton ? (
                    <Link key={index} href={item.href}>
                      <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-2 px-4 rounded-full text-[14px] font-medium h-8 flex items-center justify-center hover:brightness-110 transition-all duration-300">
                        <span>{item.label}</span>
                      </button>
                    </Link>
                  ) : (
                    <Link 
                      key={index}
                      href={item.href || '#'}
                      className={`text-[15px] font-medium ${
                        item.isActive ? 'text-[#3AABEE]' : 'text-white/90 hover:text-white'
                      } ${item.soon ? 'opacity-50 cursor-not-allowed' : ''}`}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      {item.label}
                      {item.soon && <span className="ml-1.5 text-[12px] bg-[#2A2A2E]/50 px-2 py-0.5 rounded">Soon</span>}
                    </Link>
                  )
                ))}
              </nav>
            )}

            <div className="flex items-center space-x-4">
              <div className="relative">
                {renderWalletButton()}
                {isConnected && isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#141414]/95 backdrop-blur-sm border border-[#2A2A2E]/50 shadow-lg">
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          handleProfileClick();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-[14px] text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2.5 text-[14px] text-red-400 hover:bg-[#2A2A2E] hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l-3-3a1 1 0 000-1.414l3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {(deviceType === 'mobile' || deviceType === 'tablet') && (
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (deviceType === 'mobile' || deviceType === 'tablet') && (
        <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-filter backdrop-blur-md z-40 pt-16">
          <div className="max-w-md mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                item.isButton ? (
                  <Link 
                    key={index}
                    href={item.href}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-2 px-4 rounded-full text-[14px] font-medium h-8 flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link 
                    key={index}
                    href={item.href || '#'}
                    className={`text-[20px] font-semibold ${
                      item.isActive ? 'text-[#3AABEE]' : 'text-white'
                    } ${item.soon ? 'opacity-50' : ''}`}
                    onClick={() => item.soon ? null : setIsMenuOpen(false)}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    {item.label}
                    {item.soon && <span className="ml-2 text-[16px] bg-[#2A2A2E] px-2 py-1 rounded">Soon</span>}
                  </Link>
                )
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
