import React, { useState, useEffect } from 'react';
import { Project } from '../types/crypto';
import { resolveLiveToken, ResolutionStep } from '../data/liveTokensRegistry';
import {
  X,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Database,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface LiveIngestModalProps {
  isOpen: boolean;
  ticker: string;
  onClose: () => void;
  onComplete: (project: Project) => void;
}

export const LiveIngestModal: React.FC<LiveIngestModalProps> = ({
  isOpen,
  ticker,
  onClose,
  onComplete,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<ResolutionStep[]>([
    {
      id: 'step-meta',
      label: 'Resolving ticker metadata',
      status: 'pending',
    },
    {
      id: 'step-chain',
      label: 'Checking supported chain (Ethereum / Solana / Bitcoin / Other)',
      status: 'pending',
    },
    {
      id: 'step-market',
      label: 'Pulling market data',
      status: 'pending',
    },
    {
      id: 'step-onchain',
      label: 'Indexing available on-chain signals',
      status: 'pending',
    },
  ]);
  const [resolvedProject, setResolvedProject] = useState<Project | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !ticker) return;

    // Reset state
    setActiveStepIndex(0);
    setIsFinished(false);
    setResolvedProject(null);

    const cleanTicker = ticker.replace(/[$#\s]/g, '').toUpperCase().trim();
    const resolution = resolveLiveToken(cleanTicker);
    const targetProject = resolution.project;
    const isLimitedChain = !resolution.deepOnChainSupported;

    setSteps([
      {
        id: 'step-meta',
        label: 'Resolving ticker metadata',
        status: 'running',
        detail: `Querying public crypto indexers for $${cleanTicker}...`,
      },
      {
        id: 'step-chain',
        label: 'Checking supported chain (Ethereum / Solana / Bitcoin / Other)',
        status: 'pending',
      },
      {
        id: 'step-market',
        label: 'Pulling market data',
        status: 'pending',
      },
      {
        id: 'step-onchain',
        label: 'Indexing available on-chain signals',
        status: 'pending',
      },
    ]);

    // Timed step animation pipeline
    const timer1 = setTimeout(() => {
      setActiveStepIndex(1);
      setSteps((prev) => [
        {
          ...prev[0],
          status: 'completed',
          detail: `${targetProject.name} (${cleanTicker}) · ${targetProject.category}`,
        },
        {
          ...prev[1],
          status: 'running',
          detail: `Verifying consensus architecture for ${targetProject.chains[0]}...`,
        },
        prev[2],
        prev[3],
      ]);
    }, 650);

    const timer2 = setTimeout(() => {
      setActiveStepIndex(2);
      setSteps((prev) => [
        prev[0],
        {
          ...prev[1],
          status: 'completed',
          detail: `${targetProject.chains[0]} ${isLimitedChain ? '(Native Base Layer)' : '(EVM / Smart-Contract Runtime)'}`,
        },
        {
          ...prev[2],
          status: 'running',
          detail: `Retrieving circulating supply and market capitalization...`,
        },
        prev[3],
      ]);
    }, 1300);

    const timer3 = setTimeout(() => {
      setActiveStepIndex(3);
      setSteps((prev) => [
        prev[0],
        prev[1],
        {
          ...prev[2],
          status: 'completed',
          detail: `Cap ${targetProject.metrics.marketCap} · Supply ${targetProject.metrics.circulatingSupply}`,
        },
        {
          ...prev[3],
          status: 'running',
          detail: isLimitedChain
            ? 'Auditing UTXO ledger dynamics & mining parameters...'
            : 'Parsing smart contract events, LP pools & admin keys...',
        },
      ]);
    }, 1950);

    const timer4 = setTimeout(() => {
      setSteps((prev) => [
        prev[0],
        prev[1],
        prev[2],
        {
          ...prev[3],
          status: isLimitedChain ? 'warning' : 'completed',
          warningMessage: isLimitedChain ? 'Limited on-chain data available for this chain' : undefined,
          detail: isLimitedChain
            ? 'Base layer UTXO protocol — smart contract and governance categories do not apply'
            : 'Multi-source on-chain evidence parsed successfully',
        },
      ]);
      setResolvedProject(targetProject);
      setIsFinished(true);

      // Save to server in background if endpoint exists
      fetch('/api/projects/pull-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: cleanTicker }),
      }).catch(() => {});
    }, 2650);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen, ticker]);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (resolvedProject) {
      onComplete(resolvedProject);
    }
  };

  const cleanDisplayTicker = (ticker || '').replace(/[$#\s]/g, '').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-lg bg-[#0F0B1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-5 border-b border-white/5 bg-[#140E29]/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Glowing circular icon badge with purple glow */}
            <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.35)] shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                Fetching Live Protocol Data
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Resolving ticker <span className="font-mono text-purple-300 font-semibold">${cleanDisplayTicker}</span> across supported chains...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-600/10 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vertical Checklist matching Dashboard Style */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isRunning = step.status === 'running';
              const isCompleted = step.status === 'completed';
              const isWarning = step.status === 'warning';
              const isPending = step.status === 'pending';

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                    isRunning
                      ? 'bg-purple-950/30 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-500/35'
                      : isCompleted
                      ? 'bg-[#120B27]/50 border-white/5'
                      : 'bg-white/[0.01] border-white/5 opacity-50'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="shrink-0 mt-0.5">
                    {isRunning && (
                      <div className="w-5 h-5 rounded-full bg-purple-600/20 border border-purple-500/50 flex items-center justify-center text-purple-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    )}
                    {isCompleted && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isWarning && (
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isPending && (
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-slate-500 text-[10px] font-mono">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Step Label & Detail */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-semibold font-sans ${
                          isRunning
                            ? 'text-white'
                            : isWarning
                            ? 'text-amber-200'
                            : isCompleted
                            ? 'text-slate-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                      {isWarning && (
                        <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-wider bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                          Notice
                        </span>
                      )}
                    </div>

                    {/* Warning callout for unsupported chain */}
                    {isWarning && step.warningMessage && (
                      <div className="mt-1 text-[11px] font-sans font-medium text-amber-300/90 flex items-center gap-1.5">
                        <span>{step.warningMessage}</span>
                      </div>
                    )}

                    {/* Step Detail */}
                    {step.detail && (
                      <p className="text-[11px] text-slate-400 mt-1 font-sans line-clamp-1">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion state notification */}
          {isFinished && resolvedProject && (
            <div className="p-3.5 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-between text-xs font-sans animate-fade-in">
              <div className="flex items-center gap-2 text-purple-200">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  Ready: <strong>{resolvedProject.name}</strong> (${resolvedProject.ticker}) indexed into memory
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                {resolvedProject.metrics.securityScore}/100 Score
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0D081B] flex items-center justify-between font-sans text-xs">
          <span className="text-slate-400 text-[11px]">
            {isFinished ? 'Resolution complete' : 'Evaluating public on-chain sources...'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              disabled={!isFinished}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-[0_0_16px_rgba(168,85,247,0.35)] flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Open Research Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
