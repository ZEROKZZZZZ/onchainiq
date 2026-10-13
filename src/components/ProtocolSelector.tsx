import React from 'react';
import { Project } from '../types/crypto';
import { TokenLogo } from './TokenLogo';
import { Check, ChevronDown, Plus } from 'lucide-react';

interface ProtocolSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  // For compare mode
  isCompareMode?: boolean;
  selectedProjectBId?: string;
  onSelectProjectB?: (id: string) => void;
  onOpenIngest: () => void;
}

export const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  isCompareMode = false,
  selectedProjectBId,
  onSelectProjectB,
  onOpenIngest,
}) => {
  return (
    <div className="bg-[#140E29] border border-white/5 rounded-2xl p-4 shadow-lg space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
          {isCompareMode ? 'Select Two Protocols For Parallel Risk Matrix' : 'Active Protocol Database'}
        </span>
        <button
          onClick={onOpenIngest}
          className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Ingest New Whitepaper / Protocol
        </button>
      </div>

      {!isCompareMode ? (
        /* Single Mode Pills */
        <div className="flex flex-wrap gap-2">
          {projects.map((p) => {
            const isSelected = p.id === selectedProjectId;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all border ${
                  isSelected
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)] font-bold'
                    : 'bg-[#100B22] text-slate-300 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <TokenLogo ticker={p.ticker} name={p.name} size="xs" showRing={false} />
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span>{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({p.ticker})</span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      ) : (
        /* Compare Mode Dual Selectors */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project A Selector */}
          <div className="bg-[#06080e] p-3 rounded-xl border border-cyan-500/30 space-y-2">
            <span className="text-[10px] uppercase text-cyan-400 font-bold block">
              Protocol A (Primary)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  disabled={p.id === selectedProjectBId}
                  className={`px-2.5 py-1.5 rounded-lg text-xs truncate transition-all text-left flex items-center gap-1.5 border ${
                    p.id === selectedProjectId
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                      : p.id === selectedProjectBId
                      ? 'opacity-30 cursor-not-allowed border-transparent text-gray-600'
                      : 'bg-white/5 text-gray-300 border-transparent hover:bg-white/10'
                  }`}
                >
                  <span>{p.logo}</span>
                  <span className="truncate">{p.ticker}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project B Selector */}
          <div className="bg-[#06080e] p-3 rounded-xl border border-emerald-500/30 space-y-2">
            <span className="text-[10px] uppercase text-emerald-400 font-bold block">
              Protocol B (Comparison)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProjectB?.(p.id)}
                  disabled={p.id === selectedProjectId}
                  className={`px-2.5 py-1.5 rounded-lg text-xs truncate transition-all text-left flex items-center gap-1.5 border ${
                    p.id === selectedProjectBId
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold'
                      : p.id === selectedProjectId
                      ? 'opacity-30 cursor-not-allowed border-transparent text-gray-600'
                      : 'bg-white/5 text-gray-300 border-transparent hover:bg-white/10'
                  }`}
                >
                  <span>{p.logo}</span>
                  <span className="truncate">{p.ticker}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
