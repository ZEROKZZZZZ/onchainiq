import React from 'react';
import { ProtocolMetrics } from '../types/crypto';
import { Layers, Database, Lock, PieChart, Shield, Activity } from 'lucide-react';

interface MetricTerminalBarProps {
  metrics: ProtocolMetrics;
  chains: string[];
}

export const MetricTerminalBar: React.FC<MetricTerminalBarProps> = ({ metrics, chains }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <div className="bg-[#0c1017]/90 border border-white/5 rounded-lg p-3 hover:border-cyan-500/30 transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Total Value Locked</span>
        </div>
        <div className="font-mono text-base font-bold text-white tracking-tight">{metrics.tvl}</div>
        <div className="text-[11px] text-gray-400 truncate mt-0.5">
          {chains.slice(0, 2).join(', ')}{chains.length > 2 ? ` +${chains.length - 2}` : ''}
        </div>
      </div>

      <div className="bg-[#0c1017]/90 border border-white/5 rounded-lg p-3 hover:border-emerald-500/30 transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Market Cap / FDV</span>
        </div>
        <div className="font-mono text-base font-bold text-emerald-400 tracking-tight">{metrics.marketCap}</div>
        <div className="text-[11px] text-gray-400 truncate mt-0.5">FDV: {metrics.fdv}</div>
      </div>

      <div className="bg-[#0c1017]/90 border border-white/5 rounded-lg p-3 hover:border-amber-500/30 transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <PieChart className="w-3.5 h-3.5 text-amber-400" />
          <span>Circulating Supply</span>
        </div>
        <div className="font-mono text-base font-bold text-white tracking-tight truncate">{metrics.circulatingSupply}</div>
        <div className="text-[11px] text-gray-400 truncate mt-0.5">Total: {metrics.totalSupply}</div>
      </div>

      <div className="bg-[#0c1017]/90 border border-white/5 rounded-lg p-3 hover:border-purple-500/30 transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Whale Concentration</span>
        </div>
        <div className="font-mono text-base font-bold text-white tracking-tight">{metrics.top10HoldersPct}</div>
        <div className="text-[11px] text-gray-400 truncate mt-0.5">Top 10 Wallets Share</div>
      </div>

      <div className="bg-[#0c1017]/90 border border-white/5 rounded-lg p-3 hover:border-cyan-500/30 transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multisig / Access</span>
        </div>
        <div className="font-mono text-xs font-semibold text-gray-200 line-clamp-2 leading-tight">
          {metrics.multisigThreshold}
        </div>
      </div>

      <div className="bg-[#0c1017]/90 border border-white/5 rounded-lg p-3 hover:border-emerald-500/30 transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Security Audits</span>
        </div>
        <div className="font-mono text-base font-bold text-emerald-400 tracking-tight">{metrics.auditCount} Audits</div>
        <div className="text-[11px] text-gray-400 truncate mt-0.5">0 Open Criticals</div>
      </div>
    </div>
  );
};
