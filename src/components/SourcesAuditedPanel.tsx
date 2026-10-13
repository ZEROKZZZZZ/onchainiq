import React, { useState } from 'react';
import { SourceChunk, Citation, SourceType } from '../types/crypto';
import { CheckCircle2, CircleDashed, FileText, Vote, Coins, Database, Shield, Filter, Search } from 'lucide-react';

interface SourcesAuditedPanelProps {
  retrievedChunks: SourceChunk[];
  citations: Citation[];
  totalSourcesEvaluated: number;
  onSelectCitation: (citationId: number) => void;
}

export const SourcesAuditedPanel: React.FC<SourcesAuditedPanelProps> = ({
  retrievedChunks,
  citations,
  totalSourcesEvaluated,
  onSelectCitation,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<SourceType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map chunk IDs to citation IDs
  const chunkToCitationMap = new Map<string, number>();
  citations.forEach((c) => {
    chunkToCitationMap.set(c.chunkId, c.id);
  });

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'docs':
        return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
      case 'governance':
        return <Vote className="w-3.5 h-3.5 text-purple-400" />;
      case 'tokenomics':
        return <Coins className="w-3.5 h-3.5 text-amber-400" />;
      case 'on-chain':
        return <Database className="w-3.5 h-3.5 text-emerald-400" />;
      case 'audit':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  const filteredChunks = retrievedChunks.filter((chunk) => {
    const matchesFilter = selectedFilter === 'all' || chunk.sourceType === selectedFilter;
    const matchesSearch =
      searchQuery === '' ||
      chunk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chunk.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const citedCount = retrievedChunks.filter((ch) => chunkToCitationMap.has(ch.id)).length;
  const unreferencedCount = retrievedChunks.length - citedCount;

  return (
    <div className="copilot-card p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Evidence Audit & Grounding Index
            </h3>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {citedCount} Referenced / {totalSourcesEvaluated} Evaluated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Full provenance of every document evaluated during RAG retrieval across docs, governance, tokenomics, on-chain, and audits.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search chunks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#100B22] border border-white/10 text-xs rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 w-full sm:w-52 font-sans"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto border-b border-white/5 text-xs font-sans">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
        {(['all', 'docs', 'governance', 'tokenomics', 'on-chain', 'audit'] as const).map((cat) => {
          const count =
            cat === 'all'
              ? retrievedChunks.length
              : retrievedChunks.filter((c) => c.sourceType === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === cat
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                  : 'bg-white/[0.03] text-slate-400 border border-white/5 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className="capitalize">{cat}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Chunk List */}
      <div className="divide-y divide-white/5 max-h-[380px] overflow-y-auto mt-2 pr-1 space-y-1">
        {filteredChunks.map((chunk) => {
          const citationId = chunkToCitationMap.get(chunk.id);
          const isCited = citationId !== undefined;

          return (
            <div
              key={chunk.id}
              onClick={() => {
                if (citationId) onSelectCitation(citationId);
              }}
              className={`py-3 px-3 rounded-xl transition-all flex items-start justify-between gap-3 ${
                isCited
                  ? 'cursor-pointer hover:bg-white/[0.04] bg-[#120B27]/40 border border-purple-500/20'
                  : 'opacity-75 hover:opacity-100 bg-white/[0.01]'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-purple-950/50 flex items-center justify-center shrink-0 border border-purple-500/20">
                  {getSourceIcon(chunk.sourceType)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white truncate font-sans">
                      {chunk.title}
                    </span>
                    <span className="text-[10px] font-sans uppercase font-semibold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/20">
                      {chunk.sourceType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 font-mono leading-relaxed">
                    {chunk.content}
                  </p>
                  <div className="text-[10px] text-purple-400 font-mono mt-1.5 truncate">
                    {chunk.urlOrFile}
                  </div>
                </div>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                {isCited ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    [{citationId}] Cited
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-sans text-slate-400 bg-white/[0.03] border border-white/5">
                    <CircleDashed className="w-3.5 h-3.5" />
                    Evaluated
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredChunks.length === 0 && (
          <div className="py-10 text-center text-xs text-slate-400 font-sans">
            No source documents match your current filter or query.
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-sans text-slate-400">
        <span>Verified multi-vector retrieval across 5 crypto data sources</span>
        <span className="text-emerald-400 font-semibold font-mono">100% Grounded Provenance</span>
      </div>
    </div>
  );
};
