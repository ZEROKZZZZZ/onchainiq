import React, { useState } from 'react';
import { Project } from '../types/crypto';
import { GlowingStatCard } from './GlowingStatCard';
import { TokenLogo } from './TokenLogo';
import { ChainLogo } from './ChainLogo';
import {
  Search,
  AlertTriangle,
  Coins,
  Vote,
  ArrowLeftRight,
  Database,
  ShieldAlert,
  FileCheck,
  ArrowRight,
  Shield,
  UploadCloud,
  Radio,
  Loader2,
  AlertCircle,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

export interface DisambiguationCandidate {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank?: number | null;
}

interface SearchScreenProps {
  projects: Project[];
  onSelectProjectAndQuery: (projectId: string, query?: string) => void;
  onNavigateToCompare: () => void;
  onOpenUpload: () => void;
  onPullLiveData?: (ticker: string) => void;
  onProjectAdded?: (project: Project) => void;
  currency: 'USD' | 'EUR';
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  projects,
  onSelectProjectAndQuery,
  onNavigateToCompare,
  onOpenUpload,
  onPullLiveData,
  onProjectAdded,
  currency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [notFoundQuery, setNotFoundQuery] = useState<string | null>(null);
  const [disambiguationCandidates, setDisambiguationCandidates] = useState<DisambiguationCandidate[] | null>(null);

  const presets = [
    { label: 'Biggest Risks', icon: AlertTriangle, query: 'What are the biggest centralization and smart contract risks?' },
    { label: 'Tokenomics Breakdown', icon: Coins, query: 'Break down tokenomics, vesting schedules, and dilution overhang.' },
    { label: 'Governance Health', icon: Vote, query: 'Analyze governance quorum, voting concentration, and multisig threshold.' },
    { label: 'Compare Projects', icon: ArrowLeftRight, action: onNavigateToCompare },
  ];

  const cleanedTicker = searchTerm.replace(/[$#\s]/g, '').toUpperCase().trim();

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    setInlineError(null);
    setNotFoundQuery(null);
    setDisambiguationCandidates(null);

    // 1. Session state check (Requirement 6: Cache resolved tokens in local state so re-searching doesn't re-fetch)
    const match = projects.find(
      (p) =>
        p.ticker.toUpperCase() === cleanedTicker ||
        p.name.toLowerCase() === query.toLowerCase() ||
        p.id.toLowerCase() === cleanedTicker.toLowerCase()
    );

    if (match) {
      onSelectProjectAndQuery(match.id, query);
      return;
    }

    // 2. Not in local cache -> Call live resolver API (Requirements 1, 2, 3, 4, 5)
    setIsResolving(true);
    try {
      const response = await fetch('/api/tokens/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (response.status === 429) {
        setInlineError('Live data temporarily unavailable, try again in a moment');
        setIsResolving(false);
        return;
      }

      if (!response.ok) {
        setInlineError("Couldn't verify this token from live data — try again or refine your search");
        setIsResolving(false);
        return;
      }

      const data = await response.json();

      if (!data.found || !data.project) {
        if (data.error === 'rate_limited') {
          setInlineError('Live data temporarily unavailable, try again in a moment');
        } else if (data.disambiguation && data.disambiguation.length > 0) {
          setDisambiguationCandidates(data.disambiguation);
        } else {
          setNotFoundQuery(query);
          setInlineError("Couldn't verify this token from live data — try again or refine your search");
        }
        setIsResolving(false);
        return;
      }

      // Success: add to state, table, and project count
      setIsResolving(false);
      onProjectAdded?.(data.project);
      onSelectProjectAndQuery(data.project.id, query);
    } catch (err) {
      console.warn('Token resolution error:', err);
      setInlineError("Couldn't verify this token from live data — try again or refine your search");
      setIsResolving(false);
    }
  };

  const handleResolveWithCoinId = async (candidate: DisambiguationCandidate) => {
    setIsResolving(true);
    setInlineError(null);
    setNotFoundQuery(null);
    setDisambiguationCandidates(null);
    try {
      const response = await fetch('/api/tokens/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: candidate.name, coinId: candidate.id }),
      });

      if (response.status === 429) {
        setInlineError('Live data temporarily unavailable, try again in a moment');
        setIsResolving(false);
        return;
      }

      if (!response.ok) {
        setInlineError("Couldn't verify this token from live data — try again or refine your search");
        setIsResolving(false);
        return;
      }

      const data = await response.json();
      if (!data.found || !data.project) {
        setInlineError("Couldn't verify this token from live data — try again or refine your search");
        setIsResolving(false);
        return;
      }

      setIsResolving(false);
      onProjectAdded?.(data.project);
      onSelectProjectAndQuery(data.project.id, candidate.name);
    } catch (err) {
      console.warn('Token resolution error:', err);
      setInlineError("Couldn't verify this token from live data — try again or refine your search");
      setIsResolving(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) {
      return (
        <span className="inline-flex items-center justify-center font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          {score}
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="inline-flex items-center justify-center font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
          {score}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
        {score}
      </span>
    );
  };

  return (
    <div className="space-y-7">
      {/* Search Header Banner */}
      <div className="copilot-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-wide font-sans">
                New Crypto Research Query
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Retrieve grounded documentation, governance proposals, and on-chain risk vectors
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="text-xs text-purple-300 hover:text-white font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 transition-all hover:bg-purple-600/30"
            >
              <UploadCloud className="w-3.5 h-3.5 text-purple-400" /> Upload Whitepaper
            </button>
          </div>

          {/* Prominent Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-5 h-5 text-purple-400 absolute left-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (inlineError) setInlineError(null);
                if (notFoundQuery) setNotFoundQuery(null);
              }}
              placeholder="Search or paste any token ticker (e.g. $BTC, $DOGE, $SOL, $PEPE) or project name..."
              className="w-full bg-[#100B22] border border-white/10 rounded-2xl pl-12 pr-28 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 shadow-inner font-sans"
            />
            <button
              type="submit"
              disabled={isResolving}
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-[0_0_16px_rgba(168,85,247,0.4)] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isResolving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                'Analyze'
              )}
            </button>
          </form>

          {/* Loading State: While Resolving (Requirement 4) */}
          {isResolving && (
            <div className="p-4 rounded-xl bg-[#140E29] border border-purple-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center gap-3.5 animate-fade-in text-xs font-sans">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/50 flex items-center justify-center text-purple-400 shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="space-y-0.5">
                <div className="text-white font-bold tracking-wide">
                  Fetching live protocol data...
                </div>
                <div className="text-slate-400 text-[11px]">
                  Resolving <span className="font-mono text-purple-300 font-semibold">${cleanedTicker || searchTerm}</span> across CoinGecko & live market networks...
                </div>
              </div>
            </div>
          )}

          {/* Graceful Error State: Rate-limit or network failure (Requirement 5) */}
          {inlineError && !isResolving && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 animate-fade-in text-xs font-sans">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-rose-200 font-medium">{inlineError}</span>
              </div>
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* Disambiguation State: Did you mean (Requirement 3) */}
          {disambiguationCandidates && disambiguationCandidates.length > 0 && !isResolving && (
            <div className="p-4 rounded-xl bg-[#140E29] border border-purple-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] space-y-3 animate-fade-in text-xs font-sans">
              <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>Did you mean:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {disambiguationCandidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => handleResolveWithCoinId(candidate)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 transition-all text-left group cursor-pointer"
                  >
                    {candidate.thumb ? (
                      <img
                        src={candidate.thumb}
                        alt={candidate.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 bg-white/5"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center text-[10px] text-purple-200 font-bold shrink-0">
                        {candidate.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white group-hover:text-purple-200 truncate text-xs">
                        {candidate.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-purple-300 font-bold">${candidate.symbol}</span>
                        {candidate.market_cap_rank && (
                          <span className="text-[10px] text-slate-500">#{candidate.market_cap_rank}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Not Found State: Zero CoinGecko Results (Requirement 4) */}
          {notFoundQuery && !isResolving && !inlineError && !disambiguationCandidates && (
            <div className="p-4 rounded-xl bg-[#140E29] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center gap-3 animate-fade-in text-xs font-sans">
              <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <span className="text-white font-semibold">No crypto protocol found for "{notFoundQuery}"</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  CoinGecko search returned zero results. Please verify the coin ticker or protocol name spelling.
                </p>
              </div>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
            <span className="text-[11px] text-slate-400 font-sans uppercase tracking-wider font-semibold mr-1">
              Quick Presets:
            </span>
            {presets.map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (preset.action) {
                      preset.action();
                    } else if (preset.query) {
                      setSearchTerm(preset.query);
                      onSelectProjectAndQuery(projects[0].id, preset.query);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-purple-300 border border-purple-500/40 hover:bg-purple-600/25 hover:border-purple-400 hover:text-white transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Icon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Context 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowingStatCard
          label="Protocols Indexed"
          value={projects.length.toString()}
          sublabel={`${projects.length} verified tokens`}
          icon={Database}
          glowColor="purple"
        />
        <GlowingStatCard
          label="Total Risks Found"
          value="46"
          sublabel="Verifiable across protocols"
          icon={AlertTriangle}
          glowColor="blue"
        />
        <GlowingStatCard
          label="Flagged Admin Keys"
          value="8"
          sublabel="Centralization signals tracked"
          icon={ShieldAlert}
          glowColor="teal"
        />
        <GlowingStatCard
          label="Reports Generated"
          value="124"
          sublabel="Full citation provenance"
          icon={FileCheck}
          glowColor="orange"
        />
      </div>

      {/* Recent Reports Table */}
      <div className="copilot-card overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide font-sans">
              Recent Reports & Verified Profiles
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any project to inspect citations, risk score, and governance architecture
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-[#110B24]/40">
                <th className="py-3.5 px-5">Project</th>
                <th className="py-3.5 px-4">Chain</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4">Market Cap</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Audit Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredProjects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onSelectProjectAndQuery(p.id)}
                  className="table-row-hover cursor-pointer group"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <TokenLogo ticker={p.ticker} name={p.name} logoUrl={p.logoUrl} size="md" />
                      <div>
                        <div className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {p.ticker}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <ChainLogo chainName={p.chains[0]} size="sm" />
                      <span className="font-medium text-xs">{p.chains[0]}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {getScoreBadge(p.metrics.securityScore)}
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-white">
                    {currency === 'EUR' ? p.metrics.marketCap.replace('$', '€') : p.metrics.marketCap}
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {p.category}
                  </td>
                  <td className="py-4 px-4 font-medium">
                    {p.isBaseLayer && p.metrics.auditCount === 0 ? (
                      <span className="text-blue-400 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        Core Consensus
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        {p.metrics.auditCount} Audits
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProjectAndQuery(p.id);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-purple-600/20 text-slate-400 group-hover:text-purple-300 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
