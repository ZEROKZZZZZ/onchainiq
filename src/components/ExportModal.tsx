import React, { useState } from 'react';
import { ResearchReport, ComparisonReport } from '../types/crypto';
import { X, Printer, Download, Share2, Copy, Check, FileJson, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: ResearchReport | null;
  comparison?: ComparisonReport | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  report,
  comparison,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  const generateMarkdownMemo = (): string => {
    if (report) {
      return `# CRYPTO RESEARCH COPILOT AUDIT MEMO
Project: ${report.projectName} (${report.projectTicker})
Security Risk Score: ${report.securityScore}/100
Date: ${new Date(report.timestamp).toUTCString()}
Query: ${report.query}

---

## 1. EXECUTIVE AUDIT SUMMARY
${report.executiveSummary.overview}

Key Takeaway: ${report.executiveSummary.keyTakeaway}

---

## 2. RISK FINDINGS & VULNERABILITY CHECKLIST
${report.riskFindings
  .map(
    (f, i) => `### ${i + 1}. [${f.severity.toUpperCase()}] ${f.title} (${f.category})
Status: ${f.status}
Evidence: ${f.evidence}
Recommendation: ${f.recommendation}
`
  )
  .join('\n')}

---

## 3. TOKENOMICS & INFLATION
${report.tokenomicsAnalysis.summary}
- Unlock Risk: ${report.tokenomicsAnalysis.unlockRisk}
- Concentration: ${report.tokenomicsAnalysis.holderConcentrationRisk}

---

## 4. GOVERNANCE & MULTISIG
${report.governanceAnalysis.summary}
- Admin Privileges: ${report.governanceAnalysis.multisigAdminRisk}
- Participation: ${report.governanceAnalysis.voterParticipation}

---

## 5. CITATION INDEX
${report.citations
  .map((c) => `[${c.id}] ${c.sourceTitle} (${c.sourceType}) - ${c.urlOrFile}`)
  .join('\n')}
`;
    }

    if (comparison) {
      return `# PROTOCOL COMPARATIVE AUDIT MEMORANDUM
Comparing: ${comparison.projectA.name} (${comparison.projectA.ticker}) vs ${comparison.projectB.name} (${comparison.projectB.ticker})
Date: ${new Date(comparison.timestamp).toUTCString()}
Verdict: ${comparison.verdict.summary}

---

## SYNCHRONIZED RISK MATRIX
${comparison.rows
  .map(
    (r) => `### ${r.categoryName}
- ${comparison.projectA.name}: [${r.projectAFinding.severity.toUpperCase()}] ${r.projectAFinding.summary}
- ${comparison.projectB.name}: [${r.projectBFinding.severity.toUpperCase()}] ${r.projectBFinding.summary}
- Key Divergence: ${r.keyDifference}
`
  )
  .join('\n')}
`;
    }

    return '';
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownMemo();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report?.projectTicker || 'Comparison'}_Audit_Report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const data = report || comparison;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report?.projectTicker || 'Comparison'}_Audit_Data.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in no-print font-sans">
      <div className="w-full max-w-lg bg-[#0F0B1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-5 border-b border-white/5 bg-[#140E29]/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.35)] shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Export & Share Research Report
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                {report
                  ? `Grounded token audit findings for ${report.projectName} ($${report.projectTicker})`
                  : `Side-by-side comparison memorandum`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-600/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Action 1: Print / Save as PDF */}
            <button
              onClick={handlePrintPdf}
              className="p-4 rounded-xl border border-white/10 bg-[#120B27]/60 hover:bg-[#181033] hover:border-purple-500/50 hover:shadow-[0_0_16px_rgba(168,85,247,0.15)] text-left transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Printer className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">PDF</span>
              </div>
              <div>
                <span className="font-bold text-white text-xs block group-hover:text-purple-300 transition-colors">
                  Print to PDF
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Clean printer-friendly styles with citations intact
                </span>
              </div>
            </button>

            {/* Action 2: Markdown Memo */}
            <button
              onClick={handleDownloadMarkdown}
              className="p-4 rounded-xl border border-white/10 bg-[#120B27]/60 hover:bg-[#181033] hover:border-purple-500/50 hover:shadow-[0_0_16px_rgba(168,85,247,0.15)] text-left transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">MD</span>
              </div>
              <div>
                <span className="font-bold text-white text-xs block group-hover:text-purple-300 transition-colors">
                  Download Markdown
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Structured memo formatted for Notion or Obsidian
                </span>
              </div>
            </button>

            {/* Action 3: JSON Audit */}
            <button
              onClick={handleDownloadJson}
              className="p-4 rounded-xl border border-white/10 bg-[#120B27]/60 hover:bg-[#181033] hover:border-purple-500/50 hover:shadow-[0_0_16px_rgba(168,85,247,0.15)] text-left transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <FileJson className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">JSON</span>
              </div>
              <div>
                <span className="font-bold text-white text-xs block group-hover:text-purple-300 transition-colors">
                  Raw JSON Data
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Complete citations, source chunks, and score vectors
                </span>
              </div>
            </button>

            {/* Action 4: Shareable Link */}
            <button
              onClick={handleCopyShareLink}
              className="p-4 rounded-xl border border-white/10 bg-[#120B27]/60 hover:bg-[#181033] hover:border-purple-500/50 hover:shadow-[0_0_16px_rgba(168,85,247,0.15)] text-left transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Link</span>
              </div>
              <div>
                <span className="font-bold text-white text-xs block group-hover:text-purple-300 transition-colors">
                  {copiedLink ? 'Copied to Clipboard!' : 'Shareable Permalink'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Copy direct report link to clipboard
                </span>
              </div>
            </button>
          </div>

          {/* Quick link display box */}
          <div className="flex items-center justify-between bg-[#100B22] border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-300">
            <span className="truncate pr-3 select-all text-purple-300">
              {typeof window !== 'undefined' ? window.location.href : 'https://cryptocopilot.ai'}
            </span>
            <button
              onClick={handleCopyShareLink}
              className="text-purple-400 hover:text-purple-300 font-sans font-semibold shrink-0 cursor-pointer flex items-center gap-1"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0D081B] flex items-center justify-between font-sans text-xs">
          <span className="text-slate-400 text-[11px]">Grounded Deterministic Research Copilot</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
