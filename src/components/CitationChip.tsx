import React from 'react';
import { Citation } from '../types/crypto';

interface CitationChipProps {
  id: number;
  citation?: Citation;
  onClick?: (id: number) => void;
  className?: string;
}

export const CitationChip: React.FC<CitationChipProps> = ({ id, citation, onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(id);
      }}
      title={citation ? `Source [${id}]: ${citation.sourceTitle} (${citation.sourceType})` : `Source [${id}]`}
      className={`inline-flex items-center justify-center font-mono text-[11px] font-bold px-1.5 py-0.5 mx-0.5 rounded cursor-pointer transition-all duration-150 border select-none
        bg-purple-950/60 text-purple-300 border-purple-500/40 hover:bg-purple-600 hover:text-white hover:border-purple-400 hover:shadow-[0_0_8px_rgba(168,85,247,0.4)]
        active:scale-95 ${className}`}
    >
      [{id}]
    </button>
  );
};
