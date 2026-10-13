import React from 'react';
import { AppScreen, UserCredits } from '../types/crypto';
import { OnChainIQLogo } from './OnChainIQLogo';
import {
  Shield,
  LayoutDashboard,
  Search,
  FileText,
  ArrowLeftRight,
  UploadCloud,
  Bookmark,
  Coins,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  userCredits?: UserCredits;
  onOpenUpload: () => void;
  currency: 'USD' | 'EUR';
  onToggleCurrency: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  onOpenUpload,
  currency,
  onToggleCurrency,
}) => {
  const researchNavItems = [
    { screen: 'dashboard' as AppScreen, label: 'Dashboard', icon: LayoutDashboard },
    { screen: 'search' as AppScreen, label: 'New Research', icon: Search },
    { screen: 'report' as AppScreen, label: 'Reports', icon: FileText },
    { screen: 'compare' as AppScreen, label: 'Compare', icon: ArrowLeftRight },
  ];

  const toolsNavItems = [
    { screen: 'upload' as any, label: 'Upload Docs', icon: UploadCloud, action: onOpenUpload },
    { screen: 'saved' as any, label: 'Saved Projects', icon: Bookmark, action: () => onNavigate('dashboard') },
    { screen: 'pricing' as AppScreen, label: 'Pricing & Credits', icon: Coins },
    { screen: 'settings' as AppScreen, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#140E29] border-r border-white/5 flex flex-col justify-between h-screen fixed left-0 top-0 z-40 select-none">
      {/* Top Branding */}
      <div>
        <div className="p-4 flex items-center gap-3 border-b border-white/5">
          <OnChainIQLogo className="w-9 h-9 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-black text-white tracking-wide font-sans flex items-center">
              <span>OnChain</span>
              <span className="text-blue-400">IQ</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-wider uppercase font-bold truncate">
              AI Protocol Intelligence
            </div>
          </div>
        </div>

        {/* Section 1: RESEARCH */}
        <div className="px-3 pt-5">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase font-sans">
            Research
          </div>
          <nav className="space-y-1">
            {researchNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.screen;
              return (
                <button
                  key={item.screen}
                  onClick={() => onNavigate(item.screen)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-4 mx-4 border-t border-white/5" />

        {/* Section 2: TOOLS */}
        <div className="px-3">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase font-sans">
            Tools
          </div>
          <nav className="space-y-1">
            {toolsNavItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.screen;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.screen) {
                      onNavigate(item.screen);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Area: Valuation Currency selector (Credits balance widget removed) */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between px-3 py-2 bg-[#100B22] rounded-lg border border-white/5 text-[11px] font-sans">
          <span className="text-slate-400">Valuation Currency</span>
          <button
            onClick={onToggleCurrency}
            className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors font-bold font-mono"
          >
            {currency}
          </button>
        </div>
      </div>
    </aside>
  );
};
