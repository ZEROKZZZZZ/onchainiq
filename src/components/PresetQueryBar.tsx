import React, { useState } from 'react';
import { Search, Sparkles, Loader2, Play } from 'lucide-react';

interface PresetQueryBarProps {
  currentQuery: string;
  onRunQuery: (query: string) => void;
  isLoading: boolean;
  projectTicker: string;
}

export const PresetQueryBar: React.FC<PresetQueryBarProps> = ({
  currentQuery,
  onRunQuery,
  isLoading,
  projectTicker,
}) => {
  const [inputVal, setInputVal] = useState(currentQuery);

  const presets = [
    { label: '🚨 Biggest Protocol & Centralization Risks', query: `What are the biggest centralization, admin key, and protocol risks for ${projectTicker}?` },
    { label: '📊 Tokenomics & Unlock Cliff Breakdown', query: `Break down the tokenomics, circulating float, unlock cliffs, and dilution schedule for ${projectTicker}.` },
    { label: '🏛️ Governance Health & Whale Dominance', query: `Analyze governance decentralization, voting quorum thresholds, and VC delegate concentration.` },
    { label: '🚩 Red Flags vs Peer Protocols', query: `Identify any structural red flags, bad debt history, or exploit vectors compared to peer protocols.` },
    { label: '🛡️ Smart Contract Audits & CVE History', query: `Summarize independent security audits, verified fixes, and past exploit or reentrancy incidents.` },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onRunQuery(inputVal.trim());
  };

  return (
    <div className="bg-[#0b0f17] border border-white/10 rounded-xl p-4 shadow-xl space-y-3 font-mono">
      {/* Input bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Ask any research question about ${projectTicker} docs, governance, or tokenomics...`}
          className="w-full bg-[#06080e] border border-white/10 rounded-xl pl-10 pr-28 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 shadow-inner"
        />
        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,245,155,0.3)]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning...
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" /> Run Scan
            </>
          )}
        </button>
      </form>

      {/* Preset template tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-gray-500 text-[10px] uppercase font-bold shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Presets:
        </span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInputVal(preset.query);
              onRunQuery(preset.query);
            }}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 hover:border-cyan-500/30 text-[11px] whitespace-nowrap transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};
