import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, size = 'md', showSubtitle = true }) => {
  // Score interpretation: higher is safer (0 = high vulnerability, 100 = bulletproof)
  const isHighSafety = score >= 85;
  const isModerate = score >= 70 && score < 85;
  const isElevated = score >= 50 && score < 70;
  const isCritical = score < 50;

  let colorClass = 'text-emerald-400';
  let strokeColor = '#00F59B';
  let label = 'Low Risk';
  let riskBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let Icon = ShieldCheck;

  if (isModerate) {
    colorClass = 'text-cyan-400';
    strokeColor = '#00D2FF';
    label = 'Moderate Risk';
    riskBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    Icon = ShieldCheck;
  } else if (isElevated) {
    colorClass = 'text-amber-400';
    strokeColor = '#F59E0B';
    label = 'Elevated Risk';
    riskBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    Icon = AlertTriangle;
  } else if (isCritical) {
    colorClass = 'text-rose-500';
    strokeColor = '#FF4757';
    label = 'Critical Risk';
    riskBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    Icon = ShieldAlert;
  }

  const radius = size === 'lg' ? 54 : size === 'sm' ? 28 : 42;
  const stroke = size === 'lg' ? 7 : size === 'sm' ? 4 : 6;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const dim = (radius + stroke) * 2;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center justify-center">
        <svg width={dim} height={dim} className="transform -rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke="#1c2436"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-extrabold ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-xl'} ${colorClass}`}>
            {score}
          </span>
          <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">/100</span>
        </div>
      </div>

      {showSubtitle && (
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border ${riskBg}`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-[180px] leading-tight">
            Comprehensive audit gauge synthesizing code, governance & on-chain health.
          </p>
        </div>
      )}
    </div>
  );
};
