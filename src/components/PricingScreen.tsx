import React from 'react';
import { Sparkles } from 'lucide-react';
import { UserCredits } from '../types/crypto';

interface PricingScreenProps {
  userCredits?: UserCredits;
  onTopUpCredits?: (amount: number, plan?: any) => void;
  currency?: 'USD' | 'EUR';
}

export const PricingScreen: React.FC<PricingScreenProps> = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-white tracking-wide font-sans">
          Pricing
        </h1>
        <p className="text-xs text-slate-400 font-sans">
          Transparent, accessible crypto intelligence
        </p>
      </div>

      {/* Large Centered Card */}
      <div className="copilot-card p-10 md:p-12 border-purple-500/30 bg-[#160F2E] relative overflow-hidden text-center rounded-2xl shadow-[0_0_35px_rgba(168,85,247,0.15)]">
        {/* Soft purple glow in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-5 max-w-md mx-auto">
          {/* Glowing circular icon badge in purple */}
          <div className="w-14 h-14 rounded-full bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_24px_rgba(168,85,247,0.35)]">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>

          {/* Headline text */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
            Free For Now
          </h2>

          {/* Subtext below in muted gray */}
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Crypto Copilot is currently free to use while we're in early access. Pricing will be introduced later — enjoy unlimited research in the meantime.
          </p>
        </div>
      </div>
    </div>
  );
};
