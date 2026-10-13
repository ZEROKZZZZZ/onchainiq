import React from 'react';
import { UserCredits } from '../types/crypto';
import { Shield, Sparkles, UploadCloud, Terminal, Share2, ArrowRightLeft } from 'lucide-react';

interface NavbarProps {
  mode: 'single' | 'compare';
  onSetMode: (mode: 'single' | 'compare') => void;
  userCredits: UserCredits;
  onOpenIngest: () => void;
  onOpenApi: () => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onSetMode,
  userCredits,
  onOpenIngest,
  onOpenApi,
  onOpenExport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#07090e]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(0,245,155,0.2)]">
            <Shield className="w-5 h-5" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm tracking-wider text-white">
                CRYPTO RESEARCH COPILOT
              </span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                GROUNDED RAG v1.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono">
              Institutional token security scanner & multi-source evidence synthesis
            </p>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex items-center p-1 bg-[#0c1018] rounded-xl border border-white/10 font-mono text-xs">
          <button
            onClick={() => onSetMode('single')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'single'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_8px_rgba(0,210,255,0.2)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Single Audit Scan
          </button>
          <button
            onClick={() => onSetMode('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'compare'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-[0_0_8px_rgba(0,245,155,0.2)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Compare Mode
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Ingest Protocol Button */}
          <button
            onClick={onOpenIngest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Ingest Docs</span>
          </button>

          {/* Credits & API Button */}
          <button
            onClick={onOpenApi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1424] hover:bg-[#121c33] text-emerald-300 border border-emerald-500/30 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>{userCredits.creditsRemaining} Credits</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors"
            title="Export / Share Report"
          >
            <Share2 className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden lg:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
