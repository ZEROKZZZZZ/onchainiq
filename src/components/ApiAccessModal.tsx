import React, { useState } from 'react';
import { UserCredits } from '../types/crypto';
import { X, Key, Terminal, Copy, Check, Zap, CheckCircle, ShieldCheck } from 'lucide-react';

interface ApiAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCredits: UserCredits;
  onTopUp: (amount: number, plan?: any) => void;
}

export const ApiAccessModal: React.FC<ApiAccessModalProps> = ({
  isOpen,
  onClose,
  userCredits,
  onTopUp,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<'api' | 'tiers'>('api');

  if (!isOpen) return null;

  const curlExample = `curl -X POST https://api.cryptocopilot.xyz/api/research/query \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${userCredits.apiKey}" \\
  -d '{
    "projectId": "uniswap",
    "query": "What are the biggest centralization and liquidity risks?"
  }'`;

  const copyToClipboard = (text: string, type: 'key' | 'curl') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-2xl bg-[#0F0B1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-5 border-b border-white/5 bg-[#140E29]/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.35)] shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                API Terminal & Quant Monetization
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Integrate grounded crypto risk reports directly into hedge fund pipelines
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

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/5 font-sans text-xs">
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-2.5 transition-all border-b-2 font-bold cursor-pointer ${
              activeTab === 'api'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            REST API Endpoint & Keys
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`pb-2.5 transition-all border-b-2 font-bold cursor-pointer ${
              activeTab === 'tiers'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Subscription Plans & Credit Top-Up
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {activeTab === 'api' ? (
            <>
              {/* API Key box */}
              <div className="bg-[#120B27]/60 p-4 rounded-xl border border-white/10 space-y-2 font-sans">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Active Live API Key</span>
                  <span className="text-purple-300 text-[11px] font-mono flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Plan: {userCredits.plan} Tier
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#100B22] p-3 rounded-xl border border-white/10">
                  <span className="text-xs text-purple-300 truncate select-all font-mono">{userCredits.apiKey}</span>
                  <button
                    onClick={() => copyToClipboard(userCredits.apiKey, 'key')}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-purple-300 ml-2 shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* cURL Example */}
              <div className="space-y-2 font-sans text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-purple-400" /> Real HTTP REST Request
                  </span>
                  <button
                    onClick={() => copyToClipboard(curlExample, 'curl')}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-semibold cursor-pointer"
                  >
                    {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCurl ? 'Copied Snippet' : 'Copy cURL'}</span>
                  </button>
                </div>

                <div className="bg-[#100B22] border border-white/10 rounded-xl p-4 text-purple-200 overflow-x-auto text-[11px] font-mono leading-relaxed">
                  <pre>{curlExample}</pre>
                </div>
              </div>

              {/* JSON Response Preview */}
              <div className="space-y-1 font-sans text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  Output: Structured Grounded JSON Payload
                </span>
                <div className="bg-[#100B22] border border-white/10 rounded-xl p-3.5 text-slate-300 text-[11px] font-mono">
                  {`{
  "securityScore": 91,
  "riskFindings": [ { "category": "Governance", "severity": "medium", "citationIds": [1, 3] } ],
  "citations": [ { "id": 1, "sourceType": "governance", "excerpt": "..." } ]
}`}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Subscription Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-sans text-xs">
                {/* Researcher */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  userCredits.plan === 'Researcher'
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                    : 'bg-[#120B27]/60 border-white/10 text-slate-300'
                }`}>
                  <div className="space-y-2">
                    <div className="font-bold text-white uppercase text-sm">Researcher</div>
                    <div className="text-2xl font-black text-white">$49<span className="text-xs font-normal text-slate-400">/mo</span></div>
                    <p className="text-[11px] text-slate-400 font-sans">Ideal for solo web3 analysts & smart contract auditors.</p>
                    <ul className="space-y-1 text-[11px] pt-2">
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> 10 Deep Scans/mo</li>
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Basic Compare Mode</li>
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Standard Citations</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onTopUp(10, 'Researcher')}
                    className="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-colors cursor-pointer text-xs"
                  >
                    Select Plan
                  </button>
                </div>

                {/* Pro Tier (Current) */}
                <div className="p-4 rounded-xl border bg-[#170E33] border-purple-500/50 text-white flex flex-col justify-between shadow-[0_0_20px_rgba(168,85,247,0.2)] relative">
                  <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] uppercase shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                    Current Active
                  </div>
                  <div className="space-y-2">
                    <div className="font-bold text-purple-300 uppercase text-sm">Pro Quant</div>
                    <div className="text-2xl font-black text-white">$149<span className="text-xs font-normal text-slate-400">/mo</span></div>
                    <p className="text-[11px] text-slate-300 font-sans">For DeFi asset managers and venture investment committees.</p>
                    <ul className="space-y-1 text-[11px] pt-2">
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> 25 Deep Scans/mo</li>
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Dual-Protocol Compare</li>
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Custom Whitepaper Ingestion</li>
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Full REST API Access</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onTopUp(25, 'Pro')}
                    className="mt-4 w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] cursor-pointer text-xs"
                  >
                    Top-Up 25 Credits ($149)
                  </button>
                </div>

                {/* Team Tier */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  userCredits.plan === 'Team'
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                    : 'bg-[#120B27]/60 border-white/10 text-slate-300'
                }`}>
                  <div className="space-y-2">
                    <div className="font-bold text-white uppercase text-sm">Institutional</div>
                    <div className="text-2xl font-black text-white">$499<span className="text-xs font-normal text-slate-400">/mo</span></div>
                    <p className="text-[11px] text-slate-400 font-sans">For hedge funds, security DAOs, and institutional LP desks.</p>
                    <ul className="space-y-1 text-[11px] pt-2">
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Unlimited API Queries</li>
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Dedicated Vector Index</li>
                      <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Real-time Alerting Webhooks</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onTopUp(100, 'Team')}
                    className="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-colors cursor-pointer text-xs"
                  >
                    Upgrade Team
                  </button>
                </div>
              </div>

              {/* Pay-as-you-go credit top-up */}
              <div className="bg-[#120B27]/60 p-4 rounded-xl border border-white/10 flex items-center justify-between font-sans text-xs">
                <div>
                  <span className="text-white font-bold block">Need Pay-Per-Report Research Credits?</span>
                  <span className="text-slate-400 text-[11px]">Instant top-up for occasional research reports ($5/scan)</span>
                </div>
                <button
                  onClick={() => onTopUp(5)}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold hover:bg-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Buy 5 Credits ($25)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0D081B] flex items-center justify-between font-sans text-xs text-slate-400">
          <span>Remaining Balance: <strong className="text-purple-300 font-mono font-bold">{userCredits.creditsRemaining} / {userCredits.maxMonthlyCredits}</strong> Credits</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-semibold"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
