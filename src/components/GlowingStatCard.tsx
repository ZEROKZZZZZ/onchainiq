import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GlowingStatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  glowColor: 'purple' | 'blue' | 'teal' | 'orange';
}

export const GlowingStatCard: React.FC<GlowingStatCardProps> = ({
  label,
  value,
  sublabel,
  icon: Icon,
  glowColor,
}) => {
  const colorMap = {
    purple: {
      badgeBg: 'bg-purple-950/40 border-purple-500/30 text-purple-400',
      glow: 'shadow-[0_0_24px_-4px_rgba(168,85,247,0.35)]',
      gradient: 'from-purple-500/20 to-purple-800/10',
    },
    blue: {
      badgeBg: 'bg-blue-950/40 border-blue-500/30 text-blue-400',
      glow: 'shadow-[0_0_24px_-4px_rgba(59,130,246,0.35)]',
      gradient: 'from-blue-500/20 to-blue-800/10',
    },
    teal: {
      badgeBg: 'bg-teal-950/40 border-teal-500/30 text-teal-400',
      glow: 'shadow-[0_0_24px_-4px_rgba(20,184,166,0.35)]',
      gradient: 'from-teal-500/20 to-teal-800/10',
    },
    orange: {
      badgeBg: 'bg-orange-950/40 border-orange-500/30 text-orange-400',
      glow: 'shadow-[0_0_24px_-4px_rgba(249,115,22,0.35)]',
      gradient: 'from-orange-500/20 to-orange-800/10',
    },
  };

  const style = colorMap[glowColor];

  return (
    <div className="copilot-card p-5 relative overflow-hidden flex flex-col justify-between group hover:border-purple-500/20 transition-all duration-200">
      {/* Subtle radial ambient background glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${style.gradient} rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase font-sans">
          {label}
        </span>
        {/* Soft glowing circular icon badge */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${style.badgeBg} ${style.glow} transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-sans">
          {value}
        </div>
        {sublabel && (
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-sans">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};
