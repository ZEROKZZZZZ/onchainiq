import React, { useState } from 'react';
import { Project } from '../types/crypto';
import { GlowingStatCard } from './GlowingStatCard';
import { TokenLogo } from './TokenLogo';
import { ChainLogo } from './ChainLogo';
import {
  Database,
  AlertTriangle,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  XCircle,
  Shield,
  ArrowRight,
  Search,
  Radio,
} from 'lucide-react';

interface DashboardScreenProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onNavigateToCompare: () => void;
  onPullLiveData?: (ticker: string) => void;
  currency: 'USD' | 'EUR';
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  projects,
  onSelectProject,
  onNavigateToCompare,
  onPullLiveData,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'most-researched' | 'recent' | 'market-cap' | 'trending' | 'compare'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'base' | 'defi' | 'l2' | 'infra' | 'meme'>('all');

  const tabs = [
    { id: 'all', label: 'All Tokens' },
    { id: 'most-researched', label: 'Most Researched' },
    { id: 'market-cap', label: 'By Market Cap' },
    { id: 'recent', label: 'Recent Scans' },
    { id: 'trending', label: 'Trending' },
    { id: 'compare', label: 'Compare' },
  ];

  const parseMarketCap = (capStr: string): number => {
    if (!capStr || capStr === 'N/A') return 0;
    const clean = capStr.replace(/[^0-9.TBMK]/gi, '').toUpperCase();
    const num = parseFloat(clean) || 0;
    if (clean.includes('T')) return num * 1e12;
    if (clean.includes('B')) return num * 1e9;
    if (clean.includes('M')) return num * 1e6;
    if (clean.includes('K')) return num * 1e3;
    return num;
  };

  const cleanedTicker = searchFilter.replace(/[$#\s]/g, '').toUpperCase().trim();
  const hasIndexedMatch = projects.some(
    (p) =>
      p.ticker.toUpperCase() === cleanedTicker ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase().trim()) ||
      p.id.toLowerCase() === cleanedTicker.toLowerCase()
  );
  const isLikelyUnindexed = searchFilter.trim().length >= 2 && !hasIndexedMatch;

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchFilter.trim() ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.ticker.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.chains.some((c) => c.toLowerCase().includes(searchFilter.toLowerCase()));

    const catLower = p.category.toLowerCase();
    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'base' && (p.isBaseLayer || catLower.includes('base layer') || catLower.includes('layer 1'))) ||
      (categoryFilter === 'defi' && (catLower.includes('dex') || catLower.includes('lending') || catLower.includes('liquid staking') || catLower.includes('market') || catLower.includes('cdp') || catLower.includes('amm'))) ||
      (categoryFilter === 'l2' && (catLower.includes('layer 2') || catLower.includes('rollup') || catLower.includes('agglayer'))) ||
      (categoryFilter === 'infra' && (catLower.includes('oracle') || catLower.includes('restaking') || catLower.includes('infrastructure'))) ||
      (categoryFilter === 'meme' && catLower.includes('meme'));

    return matchesSearch && matchesCategory;
  });

  // Sort projects depending on tab
  const displayedProjects = [...filteredProjects].sort((a, b) => {
    if (activeTab === 'market-cap' || activeTab === 'all') {
      return parseMarketCap(b.metrics.marketCap) - parseMarketCap(a.metrics.marketCap);
    }
    if (activeTab === 'recent') {
      return b.metrics.auditCount - a.metrics.auditCount;
    }
    if (activeTab === 'trending') {
      return (b.chunks?.length || 0) - (a.chunks?.length || 0);
    }
    return b.metrics.securityScore - a.metrics.securityScore;
  });

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

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'DAO':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            DAO
          </span>
        );
      case 'Multisig':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Multisig
          </span>
        );
      case 'Renounced':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Renounced
          </span>
        );
      case 'Consensus':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Consensus
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            {cat || 'Foundation'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-7">
      {/* Top 4 Glowing Stat Cards */}
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
          sublabel="100% cited evidence"
          icon={FileCheck}
          glowColor="orange"
        />
      </div>

      {/* Horizontal Tab / Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'compare') {
                  onNavigateToCompare();
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-sans hidden sm:block">
          Showing <span className="text-white font-semibold">{displayedProjects.length}</span> of {projects.length} available tokens
        </div>
      </div>
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Sectors' },
          { id: 'base', label: 'Layer 1 & Base Layers' },
          { id: 'defi', label: 'DeFi & DEX' },
          { id: 'l2', label: 'Layer 2 & Rollups' },
          { id: 'infra', label: 'Infrastructure & Oracles' },
          { id: 'meme', label: 'Community & Memes' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              categoryFilter === cat.id
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/[0.02] text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Content: Clean Data Table */}
      <div className="copilot-card overflow-hidden">
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide font-sans">
              Projects: {tabs.find((t) => t.id === activeTab)?.label || 'Most Researched'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live token security indicators, governance health checks, and audit ratings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Lookup or filter ticker..."
                className="bg-[#100B22] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 font-sans w-48 sm:w-56"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={onNavigateToCompare}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              Compare Protocols →
            </button>
          </div>
        </div>

        {/* Unindexed Ticker Suggestion Banner on Dashboard */}
        {isLikelyUnindexed && (
          <div className="mx-5 mt-4 p-3.5 rounded-xl bg-[#140E29] border border-purple-500/35 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-wrap items-center justify-between gap-3 animate-fade-in text-xs font-sans">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                <Radio className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-slate-300">
                <strong className="text-white font-mono font-bold">${cleanedTicker || searchFilter.trim()}</strong> isn't in your research database yet
              </span>
            </div>
            <button
              type="button"
              onClick={() => onPullLiveData?.(cleanedTicker || searchFilter.trim())}
              className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <span>Pull live data & ingest now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-[#110B24]/40">
                <th className="py-3.5 px-5">Project</th>
                <th className="py-3.5 px-4">Chain</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4">Market Cap</th>
                <th className="py-3.5 px-4">Governance Health</th>
                <th className="py-3.5 px-4">Audit Status</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {displayedProjects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className="table-row-hover cursor-pointer group"
                >
                  {/* Project Column */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <TokenLogo ticker={p.ticker} name={p.name} logoUrl={p.logoUrl} size="md" />
                      <div>
                        <div className="font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5 text-sm">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {p.ticker}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Chain Column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <ChainLogo chainName={p.chains[0]} size="sm" />
                      <span className="truncate max-w-[110px] font-medium text-xs">
                        {p.chains[0]}
                      </span>
                    </div>
                  </td>

                  {/* Risk Score Column */}
                  <td className="py-4 px-4 text-center">
                    {getScoreBadge(p.metrics.securityScore)}
                  </td>

                  {/* Market Cap Column */}
                  <td className="py-4 px-4 font-mono font-semibold text-white">
                    {currency === 'EUR' ? p.metrics.marketCap.replace('$', '€') : p.metrics.marketCap}
                  </td>

                  {/* Governance Health Column (small check/x icons in a row or Consensus badge) */}
                  <td className="py-4 px-4">
                    {p.isBaseLayer ? (
                      <span className="text-[11px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        Consensus Soft-Fork
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {(p.governanceHealth || [true, true, true, false]).map((health, idx) => (
                          <span key={idx} title={`Health Check #${idx + 1}: ${health ? 'Passed' : 'Attention'}`}>
                            {health ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400" />
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Audit Status Column */}
                  <td className="py-4 px-4">
                    {p.isBaseLayer && p.metrics.auditCount === 0 ? (
                      <div className="flex items-center gap-1.5 font-medium text-blue-400">
                        <Shield className="w-3.5 h-3.5 fill-blue-500/20" />
                        <span>Core Consensus</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                        <Shield className="w-3.5 h-3.5 fill-emerald-500/20" />
                        <span>{p.metrics.auditCount} Audits</span>
                      </div>
                    )}
                  </td>

                  {/* Category Tag */}
                  <td className="py-4 px-4">
                    {getCategoryBadge(p.governanceType)}
                  </td>

                  {/* Action Column */}
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(p.id);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-purple-600/20 text-slate-400 group-hover:text-purple-300 border border-transparent group-hover:border-purple-500/30 transition-all"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
