import React, { useState } from 'react';
import { Citation, SourceChunk } from '../types/crypto';
import { X, ExternalLink, Copy, Check, FileText, Database, Shield, Vote, Coins } from 'lucide-react';

interface CitationDrawerProps {
  citationId: number | null;
  citations: Citation[];
  retrievedChunks: SourceChunk[];
  onClose: () => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({
  citationId,
  citations,
  retrievedChunks,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (citationId === null) return null;

  const citation = citations.find((c) => c.id === citationId);
  const chunk = citation
    ? retrievedChunks.find((ch) => ch.id === citation.chunkId)
    : retrievedChunks[citationId - 1];

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'docs':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'governance':
        return <Vote className="w-4 h-4 text-purple-400" />;
      case 'tokenomics':
        return <Coins className="w-4 h-4 text-amber-400" />;
      case 'on-chain':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'audit':
        return <Shield className="w-4 h-4 text-rose-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#140E29] border-l border-white/10 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#191133]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono px-2 py-0.5 rounded bg-purple-600/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
              SOURCE [{citationId}]
            </span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-sans">
              Grounded Evidence
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {citation && chunk ? (
            <>
              {/* Source metadata card */}
              <div className="bg-[#17112E] border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSourceTypeIcon(citation.sourceType)}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      {citation.sourceType}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800/80 px-2.5 py-0.5 rounded-full">
                    {Math.round(citation.confidence * 100)}% Grounding Match
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white leading-snug">
                  {citation.sourceTitle}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5 font-mono">
                  <span className="truncate max-w-[260px] text-purple-300">
                    {citation.urlOrFile}
                  </span>
                  {chunk.date && <span>Indexed: {chunk.date}</span>}
                </div>
              </div>

              {/* Exact Quote Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans">
                    Verbatim Evidence Excerpt
                  </span>
                  <button
                    onClick={() => copyToClipboard(chunk.content)}
                    className="flex items-center gap-1 text-xs text-purple-300 hover:text-purple-200 font-mono transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Excerpt'}
                  </button>
                </div>

                <div className="bg-[#0D091B] border border-purple-500/30 rounded-2xl p-4 font-mono text-xs text-slate-200 leading-relaxed relative">
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  "{chunk.content}"
                </div>
              </div>

              {/* Metadata details */}
              {chunk.metadata && Object.keys(chunk.metadata).length > 0 && (
                <div className="bg-[#0e1422] border border-white/5 rounded-xl p-3.5 space-y-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Source Provenance & Tags
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {chunk.metadata.section && (
                      <div className="bg-black/30 p-2 rounded border border-white/5">
                        <span className="text-gray-400 block text-[10px]">Section</span>
                        <span className="text-gray-200">{chunk.metadata.section}</span>
                      </div>
                    )}
                    {chunk.metadata.auditFirm && (
                      <div className="bg-black/30 p-2 rounded border border-white/5">
                        <span className="text-gray-400 block text-[10px]">Auditor</span>
                        <span className="text-emerald-300">{chunk.metadata.auditFirm}</span>
                      </div>
                    )}
                    {chunk.metadata.proposalId && (
                      <div className="bg-black/30 p-2 rounded border border-white/5">
                        <span className="text-gray-400 block text-[10px]">Governance ID</span>
                        <span className="text-purple-300">{chunk.metadata.proposalId}</span>
                      </div>
                    )}
                    {chunk.metadata.txHash && (
                      <div className="bg-black/30 p-2 rounded border border-white/5">
                        <span className="text-gray-400 block text-[10px]">On-Chain Ref</span>
                        <span className="text-cyan-300 truncate block">{chunk.metadata.txHash}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* All other cited sources quick-jump list */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Other Cited Sources in this Report
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {citations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        // Switch citation in drawer
                        onClose();
                        setTimeout(() => {
                          // open this citation
                          const ev = new CustomEvent('open-citation', { detail: c.id });
                          window.dispatchEvent(ev);
                        }, 50);
                      }}
                      className={`px-2 py-1 rounded text-xs font-mono border transition-all ${
                        c.id === citationId
                          ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      [{c.id}] {c.sourceType}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Source details could not be found for citation index [{citationId}].</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0c101a] flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Anti-Hallucination Policy: Verified Grounding</span>
          {citation && (
            <a
              href={`https://${citation.urlOrFile}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            >
              Verify Origin <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
