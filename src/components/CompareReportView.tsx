import React from 'react';
import { ComparisonReport, RiskSeverity } from '../types/crypto';
import { RiskGauge } from './RiskGauge';
import { CitationChip } from './CitationChip';
import { ShieldCheck, ArrowRightLeft, Award } from 'lucide-react';

interface CompareReportViewProps {
  comparison: ComparisonReport;
  onOpenCitationA: (id: number) => void;
  onOpenCitationB: (id: number) => void;
}

export const CompareReportView: React.FC<CompareReportViewProps> = ({
  comparison,
  onOpenCitationA,
  onOpenCitationB,
}) => {
  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">CRITICAL</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">MEDIUM</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">LOW</span>;
    }
  };

  // Helper for rendering citations
  const renderTextWithCitations = (
    text: string,
    citations: any[],
    onOpen: (id: number) => void
  ) => {
    if (!text) return null;
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citId = parseInt(match[1], 10);
        const cit = citations.find((c) => c.id === citId);
        return (
          <CitationChip
            key={idx}
            id={citId}
            citation={cit}
            onClick={onOpen}
          />
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* COMPARISON HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0c121e] via-[#101728] to-[#0c121e] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Project A Card */}
          <div className="flex items-center gap-4 bg-[#070a11]/80 p-4 rounded-xl border border-white/5 flex-1 w-full">
            <RiskGauge score={comparison.projectAScore} size="md" showSubtitle={false} />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                PROTOCOL A
              </span>
              <h2 className="text-xl font-bold text-white truncate">
                {comparison.projectA.name} ({comparison.projectA.ticker})
              </h2>
              <div className="text-xs text-gray-400 font-mono mt-0.5">
                TVL: <span className="text-white font-semibold">{comparison.projectA.metrics.tvl}</span> · Score: {comparison.projectAScore}/100
              </div>
            </div>
          </div>

          {/* Versus Center Icon */}
          <div className="shrink-0 flex flex-col items-center justify-center p-3 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
            <ArrowRightLeft className="w-6 h-6" />
          </div>

          {/* Project B Card */}
          <div className="flex items-center gap-4 bg-[#070a11]/80 p-4 rounded-xl border border-white/5 flex-1 w-full">
            <RiskGauge score={comparison.projectBScore} size="md" showSubtitle={false} />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                PROTOCOL B
              </span>
              <h2 className="text-xl font-bold text-white truncate">
                {comparison.projectB.name} ({comparison.projectB.ticker})
              </h2>
              <div className="text-xs text-gray-400 font-mono mt-0.5">
                TVL: <span className="text-white font-semibold">{comparison.projectB.metrics.tvl}</span> · Score: {comparison.projectBScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* VERDICT SUMMARY */}
        <div className="mt-5 pt-4 border-t border-white/10 bg-[#06080e]/90 p-4 rounded-xl border border-white/5 flex items-start gap-3">
          <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span>Auditor Comparative Verdict:</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {comparison.verdict.saferProtocol} Lower Risk Profile
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              {comparison.verdict.primaryTradeoff}
            </p>
          </div>
        </div>
      </div>

      {/* METRICS SIDE-BY-SIDE MATRIX */}
      <div className="bg-[#0b0f17] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="p-3 bg-[#0e1422] border-b border-white/10 text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
          On-Chain & Tokenomics Terminal Statistics
        </div>
        <div className="divide-y divide-white/5 text-xs font-mono">
          {[
            { label: 'Category & Sub-Sector', a: comparison.projectA.category, b: comparison.projectB.category },
            { label: 'Total Value Locked (TVL)', a: comparison.projectA.metrics.tvl, b: comparison.projectB.metrics.tvl },
            { label: 'Fully Diluted Valuation (FDV)', a: comparison.projectA.metrics.fdv, b: comparison.projectB.metrics.fdv },
            { label: 'Circulating Supply Float', a: comparison.projectA.metrics.circulatingSupply, b: comparison.projectB.metrics.circulatingSupply },
            { label: 'Whale Concentration (Top 10)', a: comparison.projectA.metrics.top10HoldersPct, b: comparison.projectB.metrics.top10HoldersPct },
            { label: 'Multisig Key / Timelock', a: comparison.projectA.metrics.multisigThreshold, b: comparison.projectB.metrics.multisigThreshold },
            { label: 'External Audits Count', a: `${comparison.projectA.metrics.auditCount} Audits`, b: `${comparison.projectB.metrics.auditCount} Audits` },
          ].map((stat, i) => (
            <div key={i} className="grid grid-cols-12 py-2.5 px-4 items-center hover:bg-white/[0.02]">
              <div className="col-span-5 font-bold text-gray-200 truncate">{stat.a}</div>
              <div className="col-span-2 text-center text-gray-400 text-[11px] uppercase tracking-wider">{stat.label}</div>
              <div className="col-span-5 text-right font-bold text-gray-200 truncate">{stat.b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SYNCED RISK CATEGORY SPINE LAYOUT (Mandatory requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Synchronized Risk Category Spine & Grounded Findings
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            Shared central category spine with parallel cited analysis
          </span>
        </div>

        <div className="space-y-3">
          {comparison.rows.map((row, index) => (
            <div
              key={index}
              className="bg-[#0c1018] border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all hover:border-white/20"
            >
              {/* Central Spine Category Bar */}
              <div className="bg-[#0f1625] px-4 py-2 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-bold text-white uppercase tracking-wider">
                    {row.categoryName}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  {row.description}
                </div>
              </div>

              {/* Parallel 2-Column Findings Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                {/* Column A */}
                <div className="p-4 space-y-2 bg-[#080b12]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      {comparison.projectA.name}
                    </span>
                    {getSeverityBadge(row.projectAFinding.severity)}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-mono">
                    {renderTextWithCitations(
                      row.projectAFinding.summary,
                      comparison.projectACitations,
                      onOpenCitationA
                    )}
                  </p>
                </div>

                {/* Column B */}
                <div className="p-4 space-y-2 bg-[#080b12]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {comparison.projectB.name}
                    </span>
                    {getSeverityBadge(row.projectBFinding.severity)}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-mono">
                    {renderTextWithCitations(
                      row.projectBFinding.summary,
                      comparison.projectBCitations,
                      onOpenCitationB
                    )}
                  </p>
                </div>
              </div>

              {/* Comparative Row Footer Difference */}
              <div className="bg-[#05070c] px-4 py-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span className="truncate">
                  <span className="text-gray-300 font-bold">Key Divergence:</span> {row.keyDifference}
                </span>
                <span className="shrink-0 pl-3">
                  {row.saferOption === 'Equal' ? (
                    <span className="text-gray-400">Parity Risk</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">
                      {row.saferOption === 'A' ? comparison.projectA.name : comparison.projectB.name} Advantaged
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
