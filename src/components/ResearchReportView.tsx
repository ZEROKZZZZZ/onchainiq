import React, { useState } from 'react';
import { ResearchReport, RiskSeverity, RiskFinding } from '../types/crypto';
import { RiskGauge } from './RiskGauge';
import { CitationChip } from './CitationChip';
import { SourcesAuditedPanel } from './SourcesAuditedPanel';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock,
  Coins,
  Vote,
  Database,
  Shield,
  FileQuestion,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ResearchReportViewProps {
  report: ResearchReport;
  onOpenCitation: (id: number) => void;
}

export const ResearchReportView: React.FC<ResearchReportViewProps> = ({ report, onOpenCitation }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'risks' | 'tokenomics' | 'governance' | 'onchain' | 'audits'>('all');
  const [expandedFindings, setExpandedFindings] = useState<Record<string, boolean>>({ 'f-1': true });

  const toggleFinding = (id: string) => {
    setExpandedFindings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <ShieldAlert className="w-3 h-3" /> CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
            <AlertTriangle className="w-3 h-3" /> HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3" /> MEDIUM
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" /> LOW
          </span>
        );
    }
  };

  // Helper to render text with clickable citation chips
  const renderTextWithCitations = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citId = parseInt(match[1], 10);
        const cit = report.citations.find((c) => c.id === citId);
        return (
          <CitationChip
            key={idx}
            id={citId}
            citation={cit}
            onClick={onOpenCitation}
          />
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* SCAN RESULT HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0c121d] via-[#0d1525] to-[#0c121d] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Protocol & Score */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <RiskGauge score={report.securityScore} size="lg" />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
                  AUDIT SCAN COMPLETED
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                {report.projectName} <span className="text-emerald-400 font-mono">(${report.projectTicker})</span>
              </h1>
              <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                {report.riskSummary}
              </p>
            </div>
          </div>

          {/* Right: Severity Counter Pills */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 bg-[#070a10]/80 p-3 rounded-xl border border-white/5 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <span className="font-extrabold text-sm">{report.severityCounts.critical}</span>
              <span className="text-[10px] uppercase">Critical</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <span className="font-extrabold text-sm">{report.severityCounts.high}</span>
              <span className="text-[10px] uppercase">High</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <span className="font-extrabold text-sm">{report.severityCounts.medium}</span>
              <span className="text-[10px] uppercase">Medium</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="font-extrabold text-sm">{report.severityCounts.low}</span>
              <span className="text-[10px] uppercase">Low</span>
            </div>
          </div>
        </div>

        {/* Current Query Banner */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2 truncate">
            <span className="text-cyan-400 font-bold uppercase">Research Brief:</span>
            <span className="text-gray-200 truncate">"{report.query}"</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-emerald-400 font-semibold">{report.citations.length} Verified Citations</span>
          </div>
        </div>
      </div>

      {/* UNSUPPORTED CLAIMS CALLOUT (Mandatory requirement) */}
      {report.unsupportedClaimsFlags && report.unsupportedClaimsFlags.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <FileQuestion className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-amber-300 font-mono uppercase tracking-wider">
              Verification Notice: Unsupported / Unverifiable Areas Flagged
            </div>
            <p className="text-gray-300">
              In accordance with our strict anti-hallucination policy, no claims were fabricated for areas lacking official documentation:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-200/90 font-mono pt-1">
              {report.unsupportedClaimsFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono border-b border-white/10">
        {[
          { key: 'all', label: 'All Audit Findings' },
          { key: 'risks', label: `Risk Matrix (${report.riskFindings.length})` },
          { key: 'tokenomics', label: 'Tokenomics & Unlocks' },
          { key: 'governance', label: 'Governance & Multisig' },
          { key: 'onchain', label: 'On-Chain & Liquidity' },
          { key: 'audits', label: 'Security & CVEs' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-2 rounded-t-lg transition-all duration-150 whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-[#121927] text-cyan-400 border-b-2 border-cyan-400 font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* EXECUTIVE SUMMARY */}
      {(activeTab === 'all' || activeTab === 'risks') && (
        <div className="bg-[#0b0f17]/90 border border-white/10 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Executive Security Audit Summary
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">
            {renderTextWithCitations(report.executiveSummary.overview)}
          </p>
          <div className="bg-[#06080e] p-3 rounded-lg border border-white/5 text-xs text-gray-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white font-mono uppercase">Key Auditor Takeaway: </span>
              {renderTextWithCitations(report.executiveSummary.keyTakeaway)}
            </div>
          </div>
        </div>
      )}

      {/* RISK FINDINGS CHECKLIST / AUDIT CARDS */}
      {(activeTab === 'all' || activeTab === 'risks') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Identified Risk Vectors & Vulnerability Matrix
            </h2>
            <span className="text-xs text-gray-400 font-mono">
              Click finding to toggle full technical evidence & citations
            </span>
          </div>

          <div className="space-y-3">
            {report.riskFindings.map((finding) => {
              const isExpanded = !!expandedFindings[finding.id];
              return (
                <div
                  key={finding.id}
                  className="bg-[#0c1018] border border-white/10 hover:border-white/20 rounded-xl overflow-hidden transition-all shadow-md"
                >
                  {/* Card Header / Row */}
                  <div
                    onClick={() => toggleFinding(finding.id)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none bg-[#0e1422]/70 hover:bg-[#11192b]/90 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {getSeverityBadge(finding.severity)}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white leading-tight">
                            {finding.title}
                          </span>
                          <span className="text-[10px] font-mono uppercase text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {finding.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {finding.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        finding.status === 'Mitigated'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : finding.status === 'Monitoring'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {finding.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Card Details */}
                  {isExpanded && (
                    <div className="p-4 border-t border-white/5 bg-[#080b11] space-y-3 font-mono text-xs">
                      <div>
                        <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">
                          Grounded Technical Evidence & Source Excerpt
                        </span>
                        <div className="bg-[#04060a] p-3 rounded-lg border border-white/5 text-gray-200 leading-relaxed">
                          {renderTextWithCitations(finding.evidence)}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-white/5">
                        <div className="text-emerald-300">
                          <span className="text-gray-400 font-bold uppercase text-[10px]">Recommendation: </span>
                          <span className="text-gray-300 font-sans">{finding.recommendation}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-gray-400 text-[10px]">Referenced Sources:</span>
                          {finding.citationIds.map((cid) => (
                            <CitationChip
                              key={cid}
                              id={cid}
                              citation={report.citations.find((c) => c.id === cid)}
                              onClick={onOpenCitation}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOKENOMICS SECTION */}
      {(activeTab === 'all' || activeTab === 'tokenomics') && (
        <div className="bg-[#0c1018] border border-white/10 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Tokenomics & Inflation Architecture
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Vesting Schedules & Dilution Risks
            </span>
          </div>

          <p className="text-xs text-gray-200 leading-relaxed font-mono">
            {renderTextWithCitations(report.tokenomicsAnalysis.summary)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#07090f] p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-amber-400 font-bold uppercase text-[10px] block">
                Unlock Cliff & Overhang Risk
              </span>
              <p className="text-gray-300 font-sans leading-relaxed">
                {renderTextWithCitations(report.tokenomicsAnalysis.unlockRisk)}
              </p>
            </div>
            <div className="bg-[#07090f] p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-amber-400 font-bold uppercase text-[10px] block">
                Holder Concentration & Whale Float
              </span>
              <p className="text-gray-300 font-sans leading-relaxed">
                {renderTextWithCitations(report.tokenomicsAnalysis.holderConcentrationRisk)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GOVERNANCE & MULTISIG SECTION */}
      {(activeTab === 'all' || activeTab === 'governance') && (
        <div className="bg-[#0c1018] border border-white/10 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Governance Structure & Admin Privileges
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Multisig Thresholds & Voting Dynamics
            </span>
          </div>

          <p className="text-xs text-gray-200 leading-relaxed font-mono">
            {renderTextWithCitations(report.governanceAnalysis.summary)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#07090f] p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-purple-400 font-bold uppercase text-[10px] flex items-center gap-1">
                <Lock className="w-3 h-3" /> Multisig Key / Emergency Powers
              </span>
              <p className="text-gray-300 font-sans leading-relaxed">
                {renderTextWithCitations(report.governanceAnalysis.multisigAdminRisk)}
              </p>
            </div>
            <div className="bg-[#07090f] p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-purple-400 font-bold uppercase text-[10px] block">
                Quorum Requirements & Whale Turnout
              </span>
              <p className="text-gray-300 font-sans leading-relaxed">
                {renderTextWithCitations(report.governanceAnalysis.voterParticipation)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ON-CHAIN SIGNALS & LIQUIDITY */}
      {(activeTab === 'all' || activeTab === 'onchain') && (
        <div className="bg-[#0c1018] border border-white/10 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                On-Chain Signals & Liquidity Depth
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Capital Retention & Runway
            </span>
          </div>

          <p className="text-xs text-gray-200 leading-relaxed font-mono">
            {renderTextWithCitations(report.onChainEvidence.summary)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#07090f] p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold uppercase text-[10px] block">
                Order Flow & Slippage Depth
              </span>
              <p className="text-gray-300 font-sans leading-relaxed">
                {renderTextWithCitations(report.onChainEvidence.liquidityDepth)}
              </p>
            </div>
            <div className="bg-[#07090f] p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold uppercase text-[10px] block">
                Treasury Reserves & DAO Runway
              </span>
              <p className="text-gray-300 font-sans leading-relaxed">
                {renderTextWithCitations(report.onChainEvidence.treasuryHealth)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY AUDITS & BUG BOUNTIES */}
      {(activeTab === 'all' || activeTab === 'audits') && (
        <div className="bg-[#0c1018] border border-white/10 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Smart Contract Audits & Exploit Track Record
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Independent Verifications & Bounties
            </span>
          </div>

          <p className="text-xs text-gray-200 leading-relaxed font-mono">
            {renderTextWithCitations(report.auditHistory.summary)}
          </p>

          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
            <span className="text-gray-400 text-xs py-1">Auditors:</span>
            {report.auditHistory.firms?.map((firm, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-white/5 text-emerald-400 border border-emerald-500/20 text-[11px]"
              >
                ✓ {firm}
              </span>
            ))}
          </div>

          <div className="bg-[#07090f] p-3 rounded-lg border border-white/5 text-xs text-gray-300 font-mono">
            <span className="text-emerald-400 font-bold uppercase text-[10px] block mb-1">
              Historical Exploits & Immunefi Defense
            </span>
            <p className="font-sans leading-relaxed">
              {renderTextWithCitations(report.auditHistory.criticalPastBugs)}
            </p>
          </div>
        </div>
      )}

      {/* VISIBLE SOURCES USED PANEL (Mandatory Requirement) */}
      <SourcesAuditedPanel
        retrievedChunks={report.retrievedChunks}
        citations={report.citations}
        totalSourcesEvaluated={report.totalSourcesEvaluated}
        onSelectCitation={onOpenCitation}
      />
    </div>
  );
};
