import React, { useState } from 'react';
import { Project, ResearchReport, RiskSeverity, DataCoverage } from '../types/crypto';
import { GlowingStatCard } from './GlowingStatCard';
import { CitationChip } from './CitationChip';
import { TokenLogo } from './TokenLogo';
import { ChainLogo } from './ChainLogo';
import { SourcesAuditedPanel } from './SourcesAuditedPanel';
import { ExportModal } from './ExportModal';
import {
  Coins,
  Database,
  PieChart,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Vote,
  FileText,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  Info,
  Download,
  Share2,
} from 'lucide-react';

interface ReportScreenProps {
  project: Project;
  report: ResearchReport;
  onOpenCitation: (citationId: number) => void;
  currency: 'USD' | 'EUR';
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  project,
  report,
  onOpenCitation,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'tokenomics' | 'governance' | 'onchain' | 'audits' | 'sources'>('overview');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const isBaseLayer = !!(project.isBaseLayer || report.isBaseLayer);
  const baseNotice = project.baseLayerNotice || report.baseLayerNotice || (isBaseLayer ? `${project.name} is a base-layer protocol — governance and smart contract risk categories don't apply. Showing available market and security data only.` : undefined);

  const coverage: DataCoverage = report.dataCoverage || project.dataCoverage || {
    tokenomics: true,
    governance: !isBaseLayer,
    onChain: true,
    audits: !isBaseLayer,
  };

  const categoriesAvailableCount = [
    coverage.tokenomics,
    coverage.governance,
    coverage.onChain,
    coverage.audits,
  ].filter(Boolean).length;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'risks', label: `Risk Matrix (${report.riskFindings.length})` },
    { id: 'tokenomics', label: 'Tokenomics' },
    { id: 'governance', label: coverage.governance ? 'Governance' : 'Governance (N/A)' },
    { id: 'onchain', label: 'On-Chain' },
    { id: 'audits', label: coverage.audits ? 'Audits & CVEs' : 'Audits (N/A)' },
    { id: 'sources', label: `Sources Audited (${report.retrievedChunks.length})` },
  ];

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            92
          </span>
        );
      case 'high':
        return (
          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
            74
          </span>
        );
      case 'medium':
        return (
          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            55
          </span>
        );
      case 'low':
        return (
          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            20
          </span>
        );
    }
  };

  const getRiskPill = (score: number) => {
    if (score >= 85) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Low Risk
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
          Moderate Risk
        </span>
      );
    }
    if (score >= 50) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          Elevated Risk
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
        Critical Risk
      </span>
    );
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
    <div className="space-y-7">
      {/* Header Row */}
      <div className="copilot-card p-7 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <TokenLogo ticker={project.ticker} name={project.name} size="xl" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-3.5">
              <h1 className="text-2xl font-black text-white tracking-wide font-sans leading-none">
                {project.name}
              </h1>
              <span className="font-mono text-purple-300 font-bold text-sm bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-500/30">
                ${project.ticker}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-sans">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <ChainLogo chainName={project.chains[0]} size="sm" />
                {project.chains.join(', ')}
              </span>
              <span className="text-slate-600 font-bold">·</span>
              <span className="text-slate-400 font-medium">{project.category}</span>
              <span className="text-slate-600 font-bold">·</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Data: {report.dataSource || project.dataSource || 'CoinGecko API + Real On-Chain Telemetry'}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Circular Risk Score Badge and Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'sources'
                ? 'bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'bg-[#110B24] hover:bg-[#181033] text-slate-300 border border-white/5 hover:border-purple-500/30'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>Sources ({report.retrievedChunks.length})</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 transition-all shadow-[0_0_16px_rgba(168,85,247,0.35)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          <div className="flex items-center gap-4 bg-[#110B24] p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              {/* Circular score ring */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#2D224C"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={report.securityScore >= 80 ? '#10B981' : report.securityScore >= 65 ? '#A855F7' : '#EF4444'}
                    strokeWidth="3.5"
                    strokeDasharray={125.6}
                    strokeDashoffset={125.6 - (125.6 * report.securityScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute font-mono font-extrabold text-sm text-white">
                  {report.securityScore}
                </span>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">
                  Risk Score
                </div>
                <div className="mt-0.5">
                  {getRiskPill(report.securityScore)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chain-Not-Supported State Banner */}
      {baseNotice && (
        <div className="copilot-card p-4.5 bg-amber-950/20 border border-amber-500/35 rounded-2xl flex items-start gap-3.5 shadow-[0_0_20px_rgba(245,158,11,0.06)] animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs font-sans">
            <span className="font-bold text-amber-300 uppercase tracking-wider block text-[11px]">
              Base-Layer Architecture Notice
            </span>
            <p className="text-amber-200/90 leading-relaxed font-sans">
              {baseNotice}
            </p>
          </div>
        </div>
      )}

      {/* Data Coverage Indicator */}
      <div className="copilot-card p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Data Coverage</span>
          <span className="text-[10px] text-slate-600">·</span>
          <span className="text-slate-300 font-medium">
            {categoriesAvailableCount} of 4 Categories Indexed {categoriesAvailableCount < 4 ? '(Partial Coverage)' : '(Full Coverage)'}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5" title={coverage.tokenomics ? "Tokenomics data available" : "Tokenomics data unavailable"}>
            <span className={`w-2 h-2 rounded-full ${coverage.tokenomics ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'border border-slate-600 bg-transparent'}`} />
            <span className={coverage.tokenomics ? 'text-slate-200 font-medium' : 'text-slate-500'}>Tokenomics</span>
          </div>
          <div className="flex items-center gap-1.5" title={coverage.governance ? "Governance data available" : "Governance data unavailable"}>
            <span className={`w-2 h-2 rounded-full ${coverage.governance ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'border border-slate-600 bg-transparent'}`} />
            <span className={coverage.governance ? 'text-slate-200 font-medium' : 'text-slate-500'}>Governance</span>
          </div>
          <div className="flex items-center gap-1.5" title={coverage.onChain ? "On-Chain data available" : "On-Chain data unavailable"}>
            <span className={`w-2 h-2 rounded-full ${coverage.onChain ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'border border-slate-600 bg-transparent'}`} />
            <span className={coverage.onChain ? 'text-slate-200 font-medium' : 'text-slate-500'}>On-Chain</span>
          </div>
          <div className="flex items-center gap-1.5" title={coverage.audits ? "Audits data available" : "Audits data unavailable"}>
            <span className={`w-2 h-2 rounded-full ${coverage.audits ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'border border-slate-600 bg-transparent'}`} />
            <span className={coverage.audits ? 'text-slate-200 font-medium' : 'text-slate-500'}>Audits</span>
          </div>
        </div>
      </div>

      {/* 4 Glowing Stat Cards with Project-Specific Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowingStatCard
          label="Total Value Locked"
          value={project.metrics.tvl}
          sublabel="Secured on Ethereum L1"
          icon={Database}
          glowColor="purple"
        />
        <GlowingStatCard
          label="Market Cap"
          value={currency === 'EUR' ? project.metrics.marketCap.replace('$', '€') : project.metrics.marketCap}
          sublabel={`FDV: ${project.metrics.fdv}`}
          icon={Coins}
          glowColor="blue"
        />
        <GlowingStatCard
          label="Circulating Supply"
          value={project.metrics.circulatingSupply.split(' ')[0]}
          sublabel={project.metrics.circulatingSupply}
          icon={PieChart}
          glowColor="teal"
        />
        <GlowingStatCard
          label="Whale Concentration"
          value={project.metrics.top10HoldersPct}
          sublabel="Top 10 wallets holdings"
          icon={Users}
          glowColor="orange"
        />
      </div>

      {/* Unsupported Claims Callout if needed */}
      {report.unsupportedClaimsFlags && report.unsupportedClaimsFlags.length > 0 && (
        <div className="copilot-card p-4 border border-amber-500/30 bg-amber-950/15 flex items-start gap-3">
          <FileQuestion className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-amber-300 font-sans uppercase tracking-wider block">
              Anti-Hallucination Guard: Low-Evidence Items Flagged
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-amber-200/90 font-mono">
              {report.unsupportedClaimsFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Horizontal Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/5 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Under Tabs: Clean Data Table Layout */}
      <div className="copilot-card overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide font-sans">
              {activeTab === 'overview' && 'Executive Audit Overview & Findings'}
              {activeTab === 'risks' && 'Security Risk Matrix & Vulnerabilities'}
              {activeTab === 'tokenomics' && 'Tokenomics, Vesting & Dilution Analysis'}
              {activeTab === 'governance' && 'Governance Decentralization & Multisig Structure'}
              {activeTab === 'onchain' && 'On-Chain Liquidity & Reserve Health'}
              {activeTab === 'audits' && 'Independent Audits & Historical CVE Track Record'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every row maps to grounded excerpts — click citation numbers to inspect proof
            </p>
          </div>
        </div>

        {/* Chain Not Applicable Banner on Smart Contract Risk for Base-Layer (Requirement 3) */}
        {project.isBaseLayer && (activeTab === 'risks' || activeTab === 'overview') && (
          <div className="p-4 mx-5 mt-4 rounded-xl border border-amber-500/35 bg-amber-950/20 flex items-start gap-3 shadow-[0_0_20px_rgba(245,158,11,0.06)]">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 text-xs font-sans">
              <span className="font-bold text-amber-300 uppercase tracking-wider block text-[11px]">
                Smart Contract Risk Category N/A
              </span>
              <p className="text-amber-200/90 leading-relaxed font-sans">
                {baseNotice || "Bitcoin is a base-layer protocol — governance and smart contract risk categories don't apply. Showing available market and security data only."}
              </p>
            </div>
          </div>
        )}

        {/* OVERVIEW OR RISKS: TABLE ROWS OF FINDINGS */}
        {(activeTab === 'overview' || activeTab === 'risks') && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-[#110B24]/40">
                  <th className="py-3.5 px-5">Finding & Category</th>
                  <th className="py-3.5 px-4 text-center">Severity Badge</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Citation Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {report.riskFindings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 px-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-2">
                        <Shield className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="font-bold text-white text-xs font-sans">
                        No risk findings flagged for this protocol
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed font-sans mt-1">
                        All verified evidence chunks indicate standard protocol operation without open critical or high vulnerability vectors.
                      </p>
                    </td>
                  </tr>
                ) : (
                  report.riskFindings.map((finding) => {
                  const isExpanded = expandedRow === finding.id;
                  return (
                    <React.Fragment key={finding.id}>
                      <tr
                        onClick={() => setExpandedRow(isExpanded ? null : finding.id)}
                        className="table-row-hover cursor-pointer group"
                      >
                        {/* Title & Category Column */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm flex items-center gap-2">
                                {finding.title}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                <span className="text-purple-400 font-semibold">{finding.category}</span>
                                <span>·</span>
                                <span className="line-clamp-1">{finding.description}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Severity Number Badge */}
                        <td className="py-4 px-4 text-center">
                          {getSeverityBadge(finding.severity)}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            finding.status === 'Mitigated'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : finding.status === 'Monitoring'
                              ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          }`}>
                            {finding.status}
                          </span>
                        </td>

                        {/* Citation Reference Column */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {finding.citationIds.map((cid) => (
                              <CitationChip
                                key={cid}
                                id={cid}
                                citation={report.citations.find((c) => c.id === cid)}
                                onClick={onOpenCitation}
                              />
                            ))}
                            <button className="text-slate-500 group-hover:text-purple-300 ml-2">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Evidence Row */}
                      {isExpanded && (
                        <tr className="bg-[#120B27]/80">
                          <td colSpan={4} className="py-4 px-6 text-xs border-y border-purple-500/20 font-sans space-y-2">
                            <div>
                              <span className="text-purple-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
                                Verifiable Grounded Evidence Excerpt
                              </span>
                              <div className="p-3 rounded-xl bg-[#0B071A] border border-white/5 text-slate-200 leading-relaxed font-mono">
                                {renderTextWithCitations(finding.evidence)}
                              </div>
                            </div>
                            <div className="text-emerald-400 pt-1">
                              <span className="text-slate-400 font-bold uppercase text-[10px]">Auditor Recommendation: </span>
                              <span className="text-slate-300 font-sans">{finding.recommendation}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }))}
              </tbody>
            </table>
          </div>
        )}

        {/* TOKENOMICS TAB */}
        {activeTab === 'tokenomics' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr className="py-4 px-5 hover:bg-white/[0.02]">
                  <td className="py-4 px-5 font-semibold text-white w-1/4">Supply & Issuance Schedule</td>
                  <td className="py-4 px-5 font-mono text-slate-300">
                    {renderTextWithCitations(report.tokenomicsAnalysis.summary)}
                  </td>
                  <td className="py-4 px-5 text-right w-28">
                    {report.tokenomicsAnalysis.citationIds.map((cid) => (
                      <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                    ))}
                  </td>
                </tr>
                <tr className="py-4 px-5 hover:bg-white/[0.02]">
                  <td className="py-4 px-5 font-semibold text-white w-1/4">Unlock Cliff & Overhang Risk</td>
                  <td className="py-4 px-5 font-mono text-slate-300">
                    {renderTextWithCitations(report.tokenomicsAnalysis.unlockRisk)}
                  </td>
                  <td className="py-4 px-5 text-right w-28">
                    {report.tokenomicsAnalysis.citationIds.map((cid) => (
                      <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                    ))}
                  </td>
                </tr>
                <tr className="py-4 px-5 hover:bg-white/[0.02]">
                  <td className="py-4 px-5 font-semibold text-white w-1/4">Whale Float & Concentration</td>
                  <td className="py-4 px-5 font-mono text-slate-300">
                    {renderTextWithCitations(report.tokenomicsAnalysis.holderConcentrationRisk)}
                  </td>
                  <td className="py-4 px-5 text-right w-28">
                    {report.tokenomicsAnalysis.citationIds.map((cid) => (
                      <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* GOVERNANCE TAB */}
        {activeTab === 'governance' && (
          coverage.governance ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr className="py-4 px-5 hover:bg-white/[0.02]">
                    <td className="py-4 px-5 font-semibold text-white w-1/4">Governance Quorum Framework</td>
                    <td className="py-4 px-5 font-mono text-slate-300">
                      {renderTextWithCitations(report.governanceAnalysis.summary)}
                    </td>
                    <td className="py-4 px-5 text-right w-28">
                      {report.governanceAnalysis.citationIds.map((cid) => (
                        <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                      ))}
                    </td>
                  </tr>
                  <tr className="py-4 px-5 hover:bg-white/[0.02]">
                    <td className="py-4 px-5 font-semibold text-white w-1/4">Multisig Admin Key Privileges</td>
                    <td className="py-4 px-5 font-mono text-slate-300">
                      {renderTextWithCitations(report.governanceAnalysis.multisigAdminRisk)}
                    </td>
                    <td className="py-4 px-5 text-right w-28">
                      {report.governanceAnalysis.citationIds.map((cid) => (
                        <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                      ))}
                    </td>
                  </tr>
                  <tr className="py-4 px-5 hover:bg-white/[0.02]">
                    <td className="py-4 px-5 font-semibold text-white w-1/4">Voter Turnout & Delegate Power</td>
                    <td className="py-4 px-5 font-mono text-slate-300">
                      {renderTextWithCitations(report.governanceAnalysis.voterParticipation)}
                    </td>
                    <td className="py-4 px-5 text-right w-28">
                      {report.governanceAnalysis.citationIds.map((cid) => (
                        <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : project.isBaseLayer ? (
            <div className="p-6 m-5 rounded-2xl border border-amber-500/35 bg-amber-950/20 flex items-start gap-3.5 shadow-[0_0_20px_rgba(245,158,11,0.06)] animate-fade-in">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs font-sans">
                <span className="font-bold text-amber-300 uppercase tracking-wider block text-[11px]">
                  Chain Not Applicable: Governance Category N/A
                </span>
                <p className="text-amber-200/90 leading-relaxed font-sans text-xs">
                  {baseNotice || "Bitcoin is a base-layer protocol — governance and smart contract risk categories don't apply. Showing available market and security data only."}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 m-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                <Vote className="w-4 h-4" />
              </div>
              <div className="font-bold text-white text-xs font-sans">
                No governance data available for this protocol
              </div>
              <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
                No active on-chain DAO voting proposals, Snapshot spaces, or administrative multisig registries are currently indexed for {project.name}.
              </p>
            </div>
          )
        )}

        {/* ON-CHAIN TAB */}
        {activeTab === 'onchain' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr className="py-4 px-5 hover:bg-white/[0.02]">
                  <td className="py-4 px-5 font-semibold text-white w-1/4">Total Value Locked & Distribution</td>
                  <td className="py-4 px-5 font-mono text-slate-300">
                    {renderTextWithCitations(report.onChainEvidence.summary)}
                  </td>
                  <td className="py-4 px-5 text-right w-28">
                    {report.onChainEvidence.citationIds.map((cid) => (
                      <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                    ))}
                  </td>
                </tr>
                <tr className="py-4 px-5 hover:bg-white/[0.02]">
                  <td className="py-4 px-5 font-semibold text-white w-1/4">Liquidity Depth & Slippage Risk</td>
                  <td className="py-4 px-5 font-mono text-slate-300">
                    {renderTextWithCitations(report.onChainEvidence.liquidityDepth)}
                  </td>
                  <td className="py-4 px-5 text-right w-28">
                    {report.onChainEvidence.citationIds.map((cid) => (
                      <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                    ))}
                  </td>
                </tr>
                <tr className="py-4 px-5 hover:bg-white/[0.02]">
                  <td className="py-4 px-5 font-semibold text-white w-1/4">Treasury Reserves & DAO Runway</td>
                  <td className="py-4 px-5 font-mono text-slate-300">
                    {renderTextWithCitations(report.onChainEvidence.treasuryHealth)}
                  </td>
                  <td className="py-4 px-5 text-right w-28">
                    {report.onChainEvidence.citationIds.map((cid) => (
                      <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* AUDITS & CVES TAB */}
        {activeTab === 'audits' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr className="py-4 px-5 hover:bg-white/[0.02]">
                  <td className="py-4 px-5 font-semibold text-white w-1/4">Independent Security Audits</td>
                  <td className="py-4 px-5 font-mono text-slate-300">
                    {renderTextWithCitations(report.auditHistory.summary)}
                  </td>
                  <td className="py-4 px-5 text-right w-28">
                    {report.auditHistory.citationIds.map((cid) => (
                      <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                    ))}
                  </td>
                </tr>
                <tr className="py-4 px-5 hover:bg-white/[0.02]">
                  <td className="py-4 px-5 font-semibold text-white w-1/4">Verified Security Firms</td>
                  <td className="py-4 px-5 font-sans">
                    <div className="flex flex-wrap gap-1.5">
                      {report.auditHistory.firms?.map((f, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right w-28">
                    <span className="text-emerald-400 font-mono font-bold">Passed</span>
                  </td>
                </tr>
                <tr className="py-4 px-5 hover:bg-white/[0.02]">
                  <td className="py-4 px-5 font-semibold text-white w-1/4">Exploit History & Immunefi Bounties</td>
                  <td className="py-4 px-5 font-mono text-slate-300">
                    {renderTextWithCitations(report.auditHistory.criticalPastBugs)}
                  </td>
                  <td className="py-4 px-5 text-right w-28">
                    {report.auditHistory.citationIds.map((cid) => (
                      <CitationChip key={cid} id={cid} citation={report.citations.find((c) => c.id === cid)} onClick={onOpenCitation} />
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* SOURCES AUDITED / GROUNDING INDEX TAB */}
        {activeTab === 'sources' && (
          <div className="p-2">
            <SourcesAuditedPanel
              retrievedChunks={report.retrievedChunks}
              citations={report.citations}
              totalSourcesEvaluated={report.retrievedChunks.length}
              onSelectCitation={onOpenCitation}
            />
          </div>
        )}
      </div>

      {/* Export & Share Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        report={report}
      />
    </div>
  );
};
