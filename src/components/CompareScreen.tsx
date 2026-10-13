import React, { useState } from 'react';
import { Project, ComparisonReport, RiskSeverity } from '../types/crypto';
import { CitationChip } from './CitationChip';
import { TokenLogo } from './TokenLogo';
import { ExportModal } from './ExportModal';
import { ArrowLeftRight, ChevronDown, ChevronUp, Download, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CompareScreenProps {
  projects: Project[];
  comparison: any;
  selectedProjectAId: string;
  selectedProjectBId: string;
  onSelectProjectA: (id: string) => void;
  onSelectProjectB: (id: string) => void;
  onOpenCitationA: (id: number) => void;
  onOpenCitationB: (id: number) => void;
}

export const CompareScreen: React.FC<CompareScreenProps> = ({
  projects,
  comparison,
  selectedProjectAId,
  selectedProjectBId,
  onSelectProjectA,
  onSelectProjectB,
  onOpenCitationA,
  onOpenCitationB,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (categoryName: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) {
      return (
        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {score} · Low Risk
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          {score} · Moderate
        </span>
      );
    }
    if (score >= 50) {
      return (
        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {score} · Elevated
        </span>
      );
    }
    return (
      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
        {score} · Critical
      </span>
    );
  };

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'critical':
        return <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">Critical</span>;
      case 'high':
        return <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">High</span>;
      case 'medium':
        return <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Medium</span>;
      case 'low':
        return <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Low</span>;
    }
  };

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

  // Helper to get short one-line finding (approx 10 words or first sentence)
  const getShortFinding = (summary: string) => {
    if (!summary) return 'No open risks flagged';
    // Remove citation tags for length check
    const clean = summary.replace(/\[\d+\]/g, '').trim();
    const words = clean.split(/\s+/);
    if (words.length <= 10) return summary;
    return words.slice(0, 10).join(' ') + '...';
  };

  const saferProtocolName = comparison.verdict.saferProtocol;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. HEADER SECTION: Two Project Cards + VS Divider */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
        {/* Project A Card */}
        <div className="md:col-span-5 copilot-card p-7 relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TokenLogo
                ticker={comparison.projectA.ticker}
                name={comparison.projectA.name}
                size="xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-sans tracking-wide">
                    {comparison.projectA.name}
                  </h2>
                  <span className="font-mono text-purple-400 font-bold text-xs bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                    ${comparison.projectA.ticker}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-sans">
                  TVL: {comparison.projectA.metrics.tvl} · {comparison.projectA.category}
                </div>
              </div>
            </div>

            {/* Score Ring / Badge */}
            <div className="flex flex-col items-end">
              <div className="font-mono font-black text-2xl text-purple-200 px-3.5 py-1.5 rounded-2xl bg-[#110B24] border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                {comparison.projectAScore}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1 font-sans">
                {comparison.projectAScore >= 85 ? 'Low Risk' : comparison.projectAScore >= 70 ? 'Moderate Risk' : 'Elevated Risk'}
              </div>
            </div>
          </div>

          {/* Switcher */}
          <div className="pt-5 mt-4 border-t border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
            <span className="text-slate-300 font-semibold text-sm flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-purple-400" />
              Switch Protocol A:
            </span>
            <div className="relative w-full sm:w-[220px]">
              <select
                value={selectedProjectAId}
                onChange={(e) => onSelectProjectA(e.target.value)}
                className="w-full bg-[#140E29] border-2 border-purple-500/50 rounded-xl px-4 py-3 pr-10 text-white text-sm font-bold focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:border-purple-400 cursor-pointer appearance-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === selectedProjectBId} className="bg-[#120B24] text-white py-2 font-medium">
                    {p.name} ({p.ticker})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-purple-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 'VS' Divider */}
        <div className="md:col-span-1 flex items-center justify-center my-2 md:my-0">
          <div className="w-12 h-12 rounded-full bg-[#17112E] border border-purple-500/40 flex items-center justify-center text-purple-300 font-extrabold text-sm shadow-[0_0_24px_rgba(168,85,247,0.4)]">
            VS
          </div>
        </div>

        {/* Project B Card */}
        <div className="md:col-span-5 copilot-card p-7 relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TokenLogo
                ticker={comparison.projectB.ticker}
                name={comparison.projectB.name}
                size="xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-sans tracking-wide">
                    {comparison.projectB.name}
                  </h2>
                  <span className="font-mono text-purple-400 font-bold text-xs bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                    ${comparison.projectB.ticker}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-sans">
                  TVL: {comparison.projectB.metrics.tvl} · {comparison.projectB.category}
                </div>
              </div>
            </div>

            {/* Score Ring / Badge */}
            <div className="flex flex-col items-end">
              <div className="font-mono font-black text-2xl text-purple-200 px-3.5 py-1.5 rounded-2xl bg-[#110B24] border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                {comparison.projectBScore}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1 font-sans">
                {comparison.projectBScore >= 85 ? 'Low Risk' : comparison.projectBScore >= 70 ? 'Moderate Risk' : 'Elevated Risk'}
              </div>
            </div>
          </div>

          {/* Switcher */}
          <div className="pt-5 mt-4 border-t border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
            <span className="text-slate-300 font-semibold text-sm flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-purple-400" />
              Switch Protocol B:
            </span>
            <div className="relative w-full sm:w-[220px]">
              <select
                value={selectedProjectBId}
                onChange={(e) => onSelectProjectB(e.target.value)}
                className="w-full bg-[#140E29] border-2 border-purple-500/50 rounded-xl px-4 py-3 pr-10 text-white text-sm font-bold focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:border-purple-400 cursor-pointer appearance-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === selectedProjectAId} className="bg-[#120B24] text-white py-2 font-medium">
                    {p.name} ({p.ticker})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-purple-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. VERDICT SECTION */}
      <div className="copilot-card p-6 border-purple-500/40 bg-gradient-to-r from-[#170F2E] to-[#120B24] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider font-sans">
              Auditor Comparative Verdict
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white tracking-wide font-sans">
            {saferProtocolName} is the lower-risk choice based on grounded verification
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {comparison.verdict.summary} {comparison.verdict.primaryTradeoff}
          </p>
        </div>

        <div className="shrink-0 flex items-center">
          <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-sans flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {saferProtocolName} Preferred
          </span>
        </div>
      </div>

      {/* 3. RISK COMPARISON TABLE (Quick-scan default, expandable rows) */}
      <div className="copilot-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide font-sans">
              Synchronized Risk Category Comparison
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any row to expand full findings, divergence analysis, and grounded citations
            </p>
          </div>
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 transition-all shadow-[0_0_16px_rgba(168,85,247,0.35)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Comparison</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-[#110B24]/50">
                <th className="py-4 px-6 w-1/4">Risk Category</th>
                <th className="py-4 px-5 w-[37%]">{comparison.projectA.name}</th>
                <th className="py-4 px-5 w-[37%]">{comparison.projectB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {comparison.rows.map((row: any, idx: number) => {
                const isExpanded = !!expandedRows[row.categoryName];
                return (
                  <React.Fragment key={idx}>
                    {/* Collapsed / Main Row */}
                    <tr
                      onClick={() => toggleRow(row.categoryName)}
                      className="table-row-hover cursor-pointer group transition-colors"
                    >
                      {/* Category Name & Expand Indicator */}
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm">
                            {row.categoryName}
                          </span>
                          <div className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-purple-600/20 flex items-center justify-center text-slate-400 group-hover:text-purple-300 transition-all">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </td>

                      {/* Project A Finding Summary */}
                      <td className="py-5 px-5">
                        <div className="flex items-center gap-3">
                          {getSeverityBadge(row.projectAFinding.severity)}
                          <span className="text-slate-300 text-xs font-mono truncate max-w-[280px]">
                            {getShortFinding(row.projectAFinding.summary)}
                          </span>
                        </div>
                      </td>

                      {/* Project B Finding Summary */}
                      <td className="py-5 px-5">
                        <div className="flex items-center gap-3">
                          {getSeverityBadge(row.projectBFinding.severity)}
                          <span className="text-slate-300 text-xs font-mono truncate max-w-[280px]">
                            {getShortFinding(row.projectBFinding.summary)}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Detail View */}
                    {isExpanded && (
                      <tr className="bg-[#100A21]/70 border-y border-purple-500/25 animate-fade-in">
                        <td colSpan={3} className="p-6 space-y-5">
                          {/* Category Description & Key Divergence */}
                          <div className="space-y-1.5 pb-3 border-b border-white/5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Evaluation Scope & Divergence
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              {row.description}
                            </p>
                            <div className="text-xs text-purple-300 font-mono font-semibold pt-1 flex items-center gap-2">
                              <span className="text-purple-400">⚡ Divergence:</span> {row.keyDifference}
                            </div>
                          </div>

                          {/* Full Side-by-Side Findings & Citations */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Project A Detail */}
                            <div className="p-4 rounded-xl bg-[#140E29] border border-white/10 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-xs flex items-center gap-2">
                                  <TokenLogo ticker={comparison.projectA.ticker} name={comparison.projectA.name} size="sm" />
                                  {comparison.projectA.name} Finding
                                </span>
                                {getSeverityBadge(row.projectAFinding.severity)}
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed font-mono">
                                {renderTextWithCitations(
                                  row.projectAFinding.summary,
                                  comparison.projectACitations,
                                  onOpenCitationA
                                )}
                              </p>
                            </div>

                            {/* Project B Detail */}
                            <div className="p-4 rounded-xl bg-[#140E29] border border-white/10 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-xs flex items-center gap-2">
                                  <TokenLogo ticker={comparison.projectB.ticker} name={comparison.projectB.name} size="sm" />
                                  {comparison.projectB.name} Finding
                                </span>
                                {getSeverityBadge(row.projectBFinding.severity)}
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed font-mono">
                                {renderTextWithCitations(
                                  row.projectBFinding.summary,
                                  comparison.projectBCitations,
                                  onOpenCitationB
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        comparison={comparison}
      />
    </div>
  );
};
