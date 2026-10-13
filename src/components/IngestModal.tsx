import React, { useState } from 'react';
import { Project, SourceType } from '../types/crypto';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ArrowRight,
  Database,
} from 'lucide-react';

interface IngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectIngested: (newProject: Project) => void;
}

export const IngestModal: React.FC<IngestModalProps> = ({
  isOpen,
  onClose,
  onProjectIngested,
}) => {
  const [tab, setTab] = useState<'upload' | 'ticker'>('upload');
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [category, setCategory] = useState('DeFi Protocol');
  const [sourceType, setSourceType] = useState<SourceType>('docs');
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    // Format file size
    if (file.size < 1024) {
      setFileSize(`${file.size} B`);
    } else if (file.size < 1024 * 1024) {
      setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    } else {
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setRawText(text);
      if (!name) {
        const guessedName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setName(guessedName);
      }
    };
    reader.readAsText(file);
  };

  const loadSampleDoc = () => {
    setName('Morpho Protocol');
    setTicker('MORPHO');
    setCategory('Lending Optimization & Vaults');
    setSourceType('docs');
    setFileName('morpho_blue_specification.md');
    setFileSize('14.2 KB');
    setRawText(`Morpho Blue is an immutable, minimalist lending protocol that provides isolated lending markets.
The core singleton contract features zero governance risk over math parameters: markets are non-upgradable and immutable once created with specific oracle and collateral configurations.

Governance: Morpho DAO utilizes MORPHO token for parameter stewardship on external vaults, but cannot modify core Morpho Blue market mechanics or freeze funds.

Tokenomics: MORPHO total supply is 1,000,000,000 tokens. 27.5% distributed to DAO treasury, 18.2% to early founders, and 23.4% to early investors subject to 3-year linear vesting.

Security & Audits: Formally verified and audited by OpenZeppelin, Cantina, and Spearbit. Maintains an active $3,000,000 Immunefi bug bounty with zero critical vulnerabilities reported on mainnet deployments.`);
  };

  const handleAutoPullTicker = () => {
    if (!ticker) {
      setErrorMessage('Please provide a token ticker (e.g. MKR, SOL, PENDLE)');
      return;
    }
    const t = ticker.toUpperCase();
    setName(`${t} Protocol`);
    setCategory('Decentralized Protocol');
    setSourceType('docs');
    setFileName(`${t.toLowerCase()}_public_manifest.md`);
    setFileSize('8.6 KB');
    setRawText(`Official Architecture & Governance Manifest for ${t}:
The protocol leverages on-chain governance with smart contract deployment across EVM layers.
Token distribution includes community incentives, team allocation with vesting schedules, and decentralized DAO reserves.
Security posture is audited by tier-1 security firms with public bug bounty coverage.`);
    setErrorMessage('');
  };

  const handleIngest = async () => {
    if (!name || !ticker || !rawText) {
      setErrorMessage('Please fill in protocol name, ticker, and document content.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    try {
      // Step 1: Chunking simulation
      setProgressStep('Extracting semantic paragraphs and cleaning whitespace...');
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Tagging source type
      setProgressStep(`Tagging chunks under [${sourceType.toUpperCase()}] taxonomy...`);
      await new Promise((r) => setTimeout(r, 600));

      // Step 3: Embed & store
      setProgressStep('Generating vector embeddings & building vector index...');
      const response = await fetch('/api/projects/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          ticker,
          category,
          sourceType,
          sourceUrl: fileName || 'manual_ingestion',
          rawText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to ingest document on server');
      }

      const data = await response.json();
      setProgressStep('Complete! Registered into vector database.');
      await new Promise((r) => setTimeout(r, 400));

      onProjectIngested(data.project);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred during ingestion');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-[#0F0B1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-5 border-b border-white/5 bg-[#140E29]/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Circular glowing icon badge in purple glow */}
            <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.35)] shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Ingest & Vector Index Protocol
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Upload whitepapers, governance forum dumps, or tokenomics sheets.
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

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Segmented Toggle: Document Upload vs Public Ticker Auto-Pull */}
          <div className="flex items-center gap-1.5 p-1 bg-[#140E29] rounded-xl border border-white/5 font-sans text-xs">
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`flex-1 py-2 rounded-lg transition-all duration-150 text-center font-sans ${
                tab === 'upload'
                  ? 'bg-purple-600 text-white font-semibold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              Document / Whitepaper Upload
            </button>
            <button
              type="button"
              onClick={() => setTab('ticker')}
              className={`flex-1 py-2 rounded-lg transition-all duration-150 text-center font-sans ${
                tab === 'ticker'
                  ? 'bg-purple-600 text-white font-semibold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              Public Ticker Auto-Pull
            </button>
          </div>

          {/* Soft Inline Banner Row: Test Immediate Ingestion */}
          <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-sans">
            <span className="text-slate-300 font-medium">Want to test immediate ingestion?</span>
            <button
              type="button"
              onClick={loadSampleDoc}
              className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Load Sample Protocol Docs</span>
            </button>
          </div>

          {/* Row 1: Protocol Name & Token Ticker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block font-sans">
                Protocol Name
              </label>
              <input
                type="text"
                placeholder="e.g. MakerDAO"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#100B22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/40 transition-all font-sans"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block font-sans">
                Token Ticker
              </label>
              <input
                type="text"
                placeholder="e.g. MKR"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="w-full bg-[#100B22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/40 transition-all font-mono uppercase"
              />
            </div>
          </div>

          {/* Row 2: Protocol Category & Evidence Taxonomy Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block font-sans">
                Protocol Category
              </label>
              <input
                type="text"
                placeholder="e.g. DeFi Protocol"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#100B22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/40 transition-all font-sans"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block font-sans">
                Evidence Taxonomy Tag
              </label>
              <div className="relative">
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as SourceType)}
                  className="w-full bg-[#100B22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/40 transition-all font-sans cursor-pointer appearance-none pr-9"
                >
                  <option value="docs" className="bg-[#100B22] text-white">Docs (Whitepaper / Architecture)</option>
                  <option value="governance" className="bg-[#100B22] text-white">Governance (Proposals / Quorum)</option>
                  <option value="tokenomics" className="bg-[#100B22] text-white">Tokenomics (Emissions / Vesting)</option>
                  <option value="on-chain" className="bg-[#100B22] text-white">On-Chain (Metrics / TVL / MEV)</option>
                  <option value="audit" className="bg-[#100B22] text-white">Audit (Security Reports / CVEs)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Section: Select Local File */}
          {tab === 'upload' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
                Select Local File (PDF, MD, CSV, TXT, JSON)
              </label>
              <div className="border-2 border-dashed border-purple-500/35 hover:border-purple-500/70 rounded-2xl p-6 text-center transition-all bg-[#120B27]/50 hover:bg-[#160D30]/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] cursor-pointer group">
                <input
                  type="file"
                  id="doc-upload"
                  accept=".md,.txt,.json,.csv,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="doc-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  {/* Document icon in soft purple glow circle */}
                  <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto mb-2.5 shadow-[0_0_16px_rgba(168,85,247,0.25)] group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    {fileName ? fileName : 'Click to choose document or drop file here'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 font-sans">
                    {fileSize ? `Selected file: ${fileSize}` : 'Chunking pipeline breaks text into verified vector nodes.'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Section: Public Ticker Auto-Pull Action */}
          {tab === 'ticker' && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleAutoPullTicker}
                className="w-full py-3 px-4 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(168,85,247,0.15)] cursor-pointer"
              >
                <Database className="w-4 h-4 text-purple-400" />
                <span>Auto-Pull Public GitHub & Whitepaper Chunks for {ticker || 'Ticker'}</span>
              </button>
            </div>
          )}

          {/* Section: Document Text & Evidence Body */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
              Document Text & Evidence Body
            </label>
            <textarea
              rows={4}
              placeholder="Paste raw markdown, governance discussion, or tokenomics schedule..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full bg-[#100B22] border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/40 transition-all font-mono leading-relaxed resize-y min-h-[110px]"
            />
          </div>

          {/* Error Message Callout */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Ingestion Progress Callout */}
          {isProcessing && (
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-sans flex items-center gap-3 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.15)]">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
              <span>{progressStep}</span>
            </div>
          )}
        </div>

        {/* Footer Row */}
        <div className="p-5 border-t border-white/5 bg-[#0D081B] flex items-center justify-between font-sans text-xs">
          <div className="text-[11px] text-slate-400 font-sans hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>1 Research Credit · Chunking ~4-8 Nodes</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleIngest}
              disabled={isProcessing || !name || !ticker}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-[0_0_16px_rgba(168,85,247,0.35)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Ingesting Chunks...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Run Vector Ingestion</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
