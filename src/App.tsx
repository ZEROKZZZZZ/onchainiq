/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project, ResearchReport, ComparisonReport, UserCredits, AppScreen } from './types/crypto';
import { INITIAL_PROJECTS } from './data/protocolSources';
import { generateSynthesizedReport, generateComparisonReport } from './lib/retrievalEngine';
import { Sidebar } from './components/Sidebar';
import { DashboardScreen } from './components/DashboardScreen';
import { SearchScreen } from './components/SearchScreen';
import { ReportScreen } from './components/ReportScreen';
import { CompareScreen } from './components/CompareScreen';
import { PricingScreen } from './components/PricingScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { CitationDrawer } from './components/CitationDrawer';
import { IngestModal } from './components/IngestModal';
import { LiveIngestModal } from './components/LiveIngestModal';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('uniswap');
  const [selectedProjectBId, setSelectedProjectBId] = useState<string>('curve');
  const [currentQuery, setCurrentQuery] = useState<string>(
    'Comprehensive protocol risk and tokenomics scan'
  );
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [comparison, setComparison] = useState<ComparisonReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');

  // Citation Drawer state
  const [activeCitationId, setActiveCitationId] = useState<number | null>(null);
  const [activeCitationSourceMode, setActiveCitationSourceMode] = useState<'A' | 'B'>('A');

  // Modals state
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isLiveIngestOpen, setIsLiveIngestOpen] = useState(false);
  const [liveIngestTicker, setLiveIngestTicker] = useState('DOGE');

  const handlePullLiveData = (ticker: string) => {
    setLiveIngestTicker(ticker);
    setIsLiveIngestOpen(true);
  };

  // User Credits state
  const [userCredits, setUserCredits] = useState<UserCredits>({
    plan: 'Pro',
    creditsRemaining: 18,
    maxMonthlyCredits: 25,
    resetDate: '2026-11-01',
    apiKey: 'cr_copilot_live_89f4b1a20e',
  });

  // Listen to open-citation custom event
  useEffect(() => {
    const handleOpenCit = (e: any) => {
      if (e.detail) {
        setActiveCitationId(e.detail);
      }
    };
    window.addEventListener('open-citation', handleOpenCit);
    return () => window.removeEventListener('open-citation', handleOpenCit);
  }, []);

  // Fetch initial project list & credits from server if available
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.projects && Array.isArray(data.projects)) {
          const serverProjectsMap = new Map(data.projects.map((p: any) => [p.id, p]));
          const mergedInitial = INITIAL_PROJECTS.map((init) => {
            const found = serverProjectsMap.get(init.id);
            return found ? { ...init, ...found, chunks: init.chunks } : init;
          });

          const initialIds = new Set(INITIAL_PROJECTS.map((p) => p.id));
          const extraServerProjects = data.projects
            .filter((p: any) => !initialIds.has(p.id))
            .map((p: any) => ({
              ...p,
              chunks: p.chunks || [],
            }));

          setProjects([...mergedInitial, ...extraServerProjects]);
        }
      })
      .catch((err) => console.log('Running in local browser fallback mode', err));

    fetch('/api/usage')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.usage) setUserCredits(data.usage);
      })
      .catch(() => {});
  }, []);

  // Generate or refresh Single Scan report
  const runSingleScan = async (projectId: string, queryStr: string) => {
    setIsLoading(true);
    setCurrentQuery(queryStr);

    try {
      const response = await fetch('/api/research/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, query: queryStr }),
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
        if (data.creditsRemaining !== undefined) {
          setUserCredits((prev) => ({ ...prev, creditsRemaining: data.creditsRemaining }));
        }
      } else {
        throw new Error('Server returned non-200');
      }
    } catch {
      // Local deterministic fallback
      const proj = projects.find((p) => p.id === projectId) || projects[0];
      const localReport = generateSynthesizedReport(proj, queryStr);
      setReport(localReport);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate or refresh Compare report
  const runCompareScan = async (projAId: string, projBId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/research/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectAId: projAId, projectBId: projBId }),
      });

      if (response.ok) {
        const data = await response.json();
        setComparison(data.comparison);
        if (data.creditsRemaining !== undefined) {
          setUserCredits((prev) => ({ ...prev, creditsRemaining: data.creditsRemaining }));
        }
      } else {
        throw new Error('Comparison API error');
      }
    } catch {
      const pA = projects.find((p) => p.id === projAId) || projects[0];
      const pB = projects.find((p) => p.id === projBId) || projects[1];
      const localComp = generateComparisonReport(pA, pB);
      setComparison(localComp);
    } finally {
      setIsLoading(false);
    }
  };

  // Run scans when selection changes
  useEffect(() => {
    runSingleScan(selectedProjectId, currentQuery);
  }, [selectedProjectId]);

  useEffect(() => {
    runCompareScan(selectedProjectId, selectedProjectBId);
  }, [selectedProjectId, selectedProjectBId]);

  // Project selection handler (navigates straight to report)
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentScreen('report');
  };

  const handleSelectProjectAndQuery = (projectId: string, query?: string) => {
    setSelectedProjectId(projectId);
    if (query) setCurrentQuery(query);
    setCurrentScreen('report');
  };

  // Handle new custom or live project ingested
  const handleProjectIngested = (newProject: Project) => {
    setProjects((prev) => {
      const filtered = prev.filter(
        (p) => p.id !== newProject.id && p.ticker.toUpperCase() !== newProject.ticker.toUpperCase()
      );
      return [newProject, ...filtered];
    });
    setSelectedProjectId(newProject.id);
    setCurrentScreen('report');
  };

  // Handle credits top-up
  const handleTopUp = async (amount: number, newPlan?: any) => {
    try {
      const res = await fetch('/api/usage/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, plan: newPlan }),
      });
      if (res.ok) {
        const data = await res.json();
        setUserCredits(data.usage);
      } else {
        setUserCredits((prev) => ({
          ...prev,
          creditsRemaining: prev.creditsRemaining + amount,
          plan: newPlan || prev.plan,
        }));
      }
    } catch {
      setUserCredits((prev) => ({
        ...prev,
        creditsRemaining: prev.creditsRemaining + amount,
        plan: newPlan || prev.plan,
      }));
    }
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#E2E8F0] flex font-sans selection:bg-purple-500 selection:text-white">
      {/* Left Sidebar (Fixed) */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        userCredits={userCredits}
        onOpenUpload={() => setIsIngestOpen(true)}
        currency={currency}
        onToggleCurrency={() => setCurrency((c) => (c === 'USD' ? 'EUR' : 'USD'))}
      />

      {/* Main Content Area (Offset for fixed sidebar) */}
      <main className="ml-64 flex-1 min-h-screen p-8 max-w-7xl mx-auto overflow-y-auto">
        {isLoading && !report && !comparison ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
            <div className="text-center space-y-1">
              <span className="text-sm font-bold text-white uppercase tracking-wider block">
                Executing Multi-Source Vector Retrieval
              </span>
              <p className="text-xs text-slate-400">
                Evaluating docs, governance proposals, tokenomics, and on-chain proofs...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Screen 1: Dashboard */}
            {currentScreen === 'dashboard' && (
              <DashboardScreen
                projects={projects}
                onSelectProject={handleSelectProject}
                onNavigateToCompare={() => setCurrentScreen('compare')}
                onPullLiveData={handlePullLiveData}
                currency={currency}
              />
            )}

            {/* Screen 2: New Research / Search */}
            {currentScreen === 'search' && (
              <SearchScreen
                projects={projects}
                onSelectProjectAndQuery={handleSelectProjectAndQuery}
                onNavigateToCompare={() => setCurrentScreen('compare')}
                onOpenUpload={() => setIsIngestOpen(true)}
                onPullLiveData={handlePullLiveData}
                onProjectAdded={handleProjectIngested}
                currency={currency}
              />
            )}

            {/* Screen 3: Research Report */}
            {currentScreen === 'report' && report && (
              <ReportScreen
                project={currentProject}
                report={report}
                onOpenCitation={(citId) => {
                  setActiveCitationSourceMode('A');
                  setActiveCitationId(citId);
                }}
                currency={currency}
              />
            )}

            {/* Screen 4: Compare Mode */}
            {currentScreen === 'compare' && comparison && (
              <CompareScreen
                projects={projects}
                comparison={comparison}
                selectedProjectAId={selectedProjectId}
                selectedProjectBId={selectedProjectBId}
                onSelectProjectA={(id) => setSelectedProjectId(id)}
                onSelectProjectB={(id) => setSelectedProjectBId(id)}
                onOpenCitationA={(citId) => {
                  setActiveCitationSourceMode('A');
                  setActiveCitationId(citId);
                }}
                onOpenCitationB={(citId) => {
                  setActiveCitationSourceMode('B');
                  setActiveCitationId(citId);
                }}
              />
            )}

            {/* Screen 5: Pricing / Credits */}
            {currentScreen === 'pricing' && (
              <PricingScreen
                userCredits={userCredits}
                onTopUpCredits={handleTopUp}
                currency={currency}
              />
            )}

            {/* Screen 6: Settings */}
            {currentScreen === 'settings' && (
              <SettingsScreen
                userCredits={userCredits}
                currency={currency}
                onToggleCurrency={() => setCurrency((c) => (c === 'USD' ? 'EUR' : 'USD'))}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Citation Drawer */}
      <CitationDrawer
        citationId={activeCitationId}
        citations={
          currentScreen === 'compare'
            ? activeCitationSourceMode === 'A'
              ? comparison?.projectACitations || []
              : comparison?.projectBCitations || []
            : report?.citations || []
        }
        retrievedChunks={
          currentScreen === 'compare'
            ? activeCitationSourceMode === 'A'
              ? comparison?.projectARetrievedChunks || []
              : comparison?.projectBRetrievedChunks || []
            : report?.retrievedChunks || []
        }
        onClose={() => setActiveCitationId(null)}
      />

      {/* Ingest Protocol Modal */}
      <IngestModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onProjectIngested={handleProjectIngested}
      />

      {/* Live Token Ingest Modal (Checked list for unindexed tokens) */}
      <LiveIngestModal
        isOpen={isLiveIngestOpen}
        ticker={liveIngestTicker}
        onClose={() => setIsLiveIngestOpen(false)}
        onComplete={(newProj) => {
          setIsLiveIngestOpen(false);
          handleProjectIngested(newProj);
        }}
      />
    </div>
  );
}
