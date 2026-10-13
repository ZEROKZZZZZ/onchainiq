import React, { useState } from 'react';
import { UserCredits } from '../types/crypto';
import { User, BarChart2 } from 'lucide-react';

interface SettingsScreenProps {
  userCredits?: UserCredits;
  onRegenerateKey?: () => void;
  currency?: 'USD' | 'EUR';
  onToggleCurrency?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const [fullName, setFullName] = useState('Alex Vance');
  const [email, setEmail] = useState('alex.vance@cryptoresearch.xyz');
  const [org, setOrg] = useState('Parallax Capital Management');

  // Usage chart sample data points for the 7 past days
  const usageHistory = [
    { day: 'Mon', queries: 2 },
    { day: 'Tue', queries: 5 },
    { day: 'Wed', queries: 3 },
    { day: 'Thu', queries: 8 },
    { day: 'Fri', queries: 6 },
    { day: 'Sat', queries: 4 },
    { day: 'Sun', queries: 7 },
  ];
  const maxQueries = Math.max(...usageHistory.map((d) => d.queries));

  return (
    <div className="space-y-7 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide font-sans">
          Terminal Settings & Account
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          Inspect research analyst profile details and weekly activity metrics
        </p>
      </div>

      {/* 1. Profile Section */}
      <div className="copilot-card p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <User className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
            Research Analyst Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="text-slate-400 uppercase text-[10px] block mb-1.5 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#100B22] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>

          <div>
            <label className="text-slate-400 uppercase text-[10px] block mb-1.5 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#100B22] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-slate-400 uppercase text-[10px] block mb-1.5 font-semibold">
              Organization / Fund Entity
            </label>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="w-full bg-[#100B22] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>
        </div>
      </div>

      {/* 2. Usage Chart (Weekly Activity) */}
      <div className="copilot-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Weekly Research Activity & Query Volume
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total this week: 35 scans
          </span>
        </div>

        {/* Clean bar chart in purple */}
        <div className="pt-2">
          <div className="h-40 flex items-end justify-between gap-4 px-2 border-b border-white/5 pb-2">
            {usageHistory.map((item, idx) => {
              const heightPct = Math.round((item.queries / maxQueries) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.queries} scans
                  </span>
                  <div className="w-full max-w-[42px] bg-[#110B24] rounded-t-lg h-32 flex items-end justify-center p-0.5">
                    <div
                      className="w-full bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-md transition-all duration-500 group-hover:from-purple-600 group-hover:to-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-sans text-slate-400 font-semibold">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
