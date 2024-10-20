'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Image from 'next/image';

const slogans = [
  "WOOFWOOFBONANZA",
  "BARKBARKBONANZA",
  "PAWSOMEPARTY",
  "TAILWAGGINTIME",
  "HOWLHAPPYHOUR",
  "SNOUTSNIFFINSUCCESS",
  "FURBULOUSFIESTA",
  "CANINECRAZE",
  "PUPPYPALOOZA",
  "DOGGODAYDELIGHT",
  "BONEAPPETITBASH"
];

const RainbowText: React.FC = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const intervalOffset = setInterval(() => {
      setOffset((prevOffset) => (prevOffset + 1) % 3);
    }, 100);

    return () => {
      clearInterval(intervalOffset);
    };
  }, []);

  const getColor = (index: number) => {
    const colors = ['#D3D3D3', '#A9A9A9', '#808080']; // Светло-серый, темно-серый, серый
    return colors[(index + offset) % 3];
  };

  const repeatedSlogans = [...slogans, ...slogans]; // Повторяем слоганы для непрерывной анимации

  return (
    <div className="overflow-hidden py-6">
      <div className="whitespace-nowrap inline-block animate-marquee">
        {repeatedSlogans.map((slogan, sloganIndex) => (
          <span key={sloganIndex} className="inline-block mx-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
            {slogan.split('').map((char, charIndex) => (
              <span
                key={charIndex}
                className="inline-block metallic-text"
                style={{
                  '--color': getColor(charIndex + sloganIndex * slogan.length),
                } as React.CSSProperties}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </div>
      <style jsx>{`
        .metallic-text {
          color: var(--color);
          text-shadow: 
            0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0,0,0,.1),
            0 0 5px rgba(0,0,0,.1),
            0 1px 3px rgba(0,0,0,.3),
            0 3px 5px rgba(0,0,0,.2),
            0 5px 10px rgba(0,0,0,.25),
            0 10px 10px rgba(0,0,0,.2),
            0 20px 20px rgba(0,0,0,.15);
          transform: skew(-15deg);
          transition: all 0.3s ease;
        }
        .metallic-text:hover {
          text-shadow: 
            0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0,0,0,.1),
            0 0 5px rgba(0,0,0,.1),
            0 1px 3px rgba(0,0,0,.3),
            0 3px 5px rgba(0,0,0,.2),
            0 5px 10px rgba(0,0,0,.25),
            0 10px 10px rgba(0,0,0,.2),
            0 20px 20px rgba(0,0,0,.15),
            0 0 20px rgba(255,255,255,0.5);
        }
      `}</style>
    </div>
  );
};

const AirdropPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mint');
  const [mintResult, setMintResult] = useState<string | null>(null);

  const handleMint = () => {
    const random = Math.random();
    if (random < 0.1) {
      const amount = Math.floor(Math.random() * (120000 - 86000 + 1) + 86000);
      setMintResult(`Congratulations! You've won ${amount} $WOOF tokens!`);
    } else {
      setMintResult("Sorry, you didn't win any tokens this time.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-4 mt-8 xl:py-8 xl:mt-16">
        <RainbowText />
        
        <div className="mb-8">
          <div className="flex justify-center border-b border-[#333333]">
            <button
              className={`py-2 px-4 ${activeTab === 'mint' ? 'border-b-2 border-[#999999]' : ''}`}
              onClick={() => setActiveTab('mint')}
            >
              Mint $WOOF
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'invite' ? 'border-b-2 border-[#999999]' : ''}`}
              onClick={() => setActiveTab('invite')}
            >
              Invite & Earn
            </button>
          </div>
        </div>

        {activeTab === 'mint' && (
          <section className="mb-12 text-center">
            <div className="max-w-4xl mx-auto bg-[#1E1E1E] shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-[#333333] xl:max-w-5xl">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[#E0E0E0]">Mint $WOOF Tokens</h2>
                <div className="mb-6">
                  <Image 
                    src="/dogs.gif" 
                    alt="Dogs GIF" 
                    width={150} 
                    height={150} 
                    className="mx-auto rounded-lg"
                    priority
                  />
                </div>
                <p className="text-xl mb-8 text-[#CCCCCC]">
                  Mint 1000 $WOOF tokens and get a chance to win a random wallet with $86k-$120k worth of tokens!
                </p>
                <button
                  onClick={handleMint}
                  className="bg-[#333333] text-white py-3 px-12 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 hover:bg-[#444444] hover:scale-105"
                >
                  Mint $WOOF
                </button>
                {mintResult && (
                  <p className="mt-6 text-xl font-semibold text-[#E0E0E0]">{mintResult}</p>
                )}
                <p className="mt-8 text-sm text-[#999999] max-w-2xl mx-auto">
                  <span className="font-semibold text-[#CCCCCC]">Warning:</span> By participating, you acknowledge that you&apos;re risking your funds. You may win or lose your investment. Proceed at your own risk.
                </p>
              </div>
              <div className="bg-[#2A2A2A] p-6">
                <h3 className="text-xl font-semibold mb-4 text-[#E0E0E0]">Why Mint $WOOF?</h3>
                <ul className="text-left list-disc list-inside space-y-2 text-[#CCCCCC]">
                  <li>Chance to win up to $120k worth of tokens</li>
                  <li>Join a thriving community of WOOF holders</li>
                  <li>Participate in exclusive WOOF events and airdrops</li>
                  <li>Be part of the future of decentralized finance</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'invite' && (
          <section className="mb-12 text-center">
            <div className="max-w-4xl mx-auto bg-[#1E1E1E] shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-[#333333] xl:max-w-5xl">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-[#E0E0E0]">Invite & Earn</h2>
                <div className="mb-6">
                  <Image 
                    src="/invite.gif" 
                    alt="Invite GIF" 
                    width={150} 
                    height={150} 
                    className="mx-auto rounded-lg"
                    priority
                  />
                </div>
                <p className="text-xl mb-8 text-[#CCCCCC]">
                  Invite your friends and earn additional $WOOF tokens! For each friend who successfully mints $WOOF tokens, you&apos;ll receive a 5% bonus.
                </p>
                <div className="bg-[#2A2A2A] p-4 mb-6 text-left rounded-lg">
                  <p className="font-semibold mb-2 text-[#E0E0E0]">Your Referral Link:</p>
                  <input
                    type="text"
                    value="https://woodogs.com/airdrop?ref=YOUR_ID"
                    readOnly
                    className="w-full bg-[#333333] text-[#E0E0E0] py-2 px-3 rounded border border-[#444444]"
                  />
                </div>
                <button
                  className="bg-[#333333] text-white py-3 px-12 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 hover:bg-[#444444] hover:scale-105"
                >
                  Copy Link
                </button>
                <p className="mt-8 text-sm text-[#999999] max-w-2xl mx-auto">
                  Share your referral link with friends to start earning bonuses!
                </p>
              </div>
              <div className="bg-[#2A2A2A] p-6">
                <h3 className="text-xl font-semibold mb-4 text-[#E0E0E0]">Your Referral Stats</h3>
                <ul className="text-left list-disc list-inside space-y-2 text-[#CCCCCC]">
                  <li>Invited Friends: 0</li>
                  <li>Total Bonus Earned: 0 $WOOF</li>
                  <li>Potential Earnings: Unlimited!</li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AirdropPage;