export type SourceType = 'docs' | 'governance' | 'tokenomics' | 'on-chain' | 'audit';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SourceChunk {
  id: string;
  projectId: string;
  projectName: string;
  sourceType: SourceType;
  title: string;
  urlOrFile: string;
  date?: string;
  content: string;
  metadata?: {
    author?: string;
    section?: string;
    verified?: boolean;
    txHash?: string;
    auditFirm?: string;
    proposalId?: string;
  };
}

export interface ProtocolMetrics {
  tvl: string;
  marketCap: string;
  fdv: string;
  circulatingSupply: string;
  totalSupply: string;
  top10HoldersPct: string;
  multisigThreshold: string;
  auditCount: number;
  unresolvedVulnerabilities: number;
  securityScore: number; // 0-100 (100 is safest)
  riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'Critical';
}

export type AppScreen = 'dashboard' | 'search' | 'report' | 'compare' | 'pricing' | 'settings';

export interface DataCoverage {
  tokenomics: boolean;
  governance: boolean;
  onChain: boolean;
  audits: boolean;
}

export interface Project {
  id: string;
  name: string;
  ticker: string;
  logo: string;
  category: string; // DEX, Lending, Liquid Staking, Restaking, L2, Base Layer, etc.
  description: string;
  chains: string[];
  website: string;
  docsUrl: string;
  metrics: ProtocolMetrics;
  chunks: SourceChunk[];
  isCustom?: boolean;
  governanceType?: 'DAO' | 'Multisig' | 'Renounced' | 'Foundation' | 'Consensus' | 'None';
  governanceHealth?: boolean[]; // 4 checks: timelock, quorum, open proposals, multisig threshold
  audited?: boolean;
  coingeckoId?: string;
  logoUrl?: string;
  dataSource?: string;
  dataCoverage?: DataCoverage;
  isBaseLayer?: boolean;
  baseLayerNotice?: string;
  chainType?: string;
}

export interface Citation {
  id: number; // [1], [2], etc.
  chunkId: string;
  sourceType: SourceType;
  sourceTitle: string;
  urlOrFile: string;
  excerpt: string;
  confidence: number; // 0.0 - 1.0
  isDirectQuote: boolean;
}

export interface RiskFinding {
  id: string;
  category: 'Centralization' | 'Smart Contract' | 'Tokenomics & Dilution' | 'Governance & Voting' | 'Liquidity & Market' | 'Oracle & Economic' | 'Regulatory';
  title: string;
  severity: RiskSeverity;
  description: string;
  evidence: string;
  citationIds: number[];
  recommendation: string;
  status: 'Open' | 'Mitigated' | 'Monitoring';
}

export interface ResearchReport {
  id: string;
  projectId: string;
  projectName: string;
  projectTicker: string;
  query: string;
  timestamp: string;
  securityScore: number; // 0-100
  riskSummary: string;
  severityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  executiveSummary: {
    overview: string;
    citationIds: number[];
    keyTakeaway: string;
  };
  riskFindings: RiskFinding[];
  tokenomicsAnalysis: {
    summary: string;
    unlockRisk: string;
    holderConcentrationRisk: string;
    citationIds: number[];
  };
  governanceAnalysis: {
    summary: string;
    multisigAdminRisk: string;
    voterParticipation: string;
    citationIds: number[];
  };
  onChainEvidence: {
    summary: string;
    liquidityDepth: string;
    treasuryHealth: string;
    citationIds: number[];
  };
  auditHistory: {
    summary: string;
    firms: string[];
    criticalPastBugs: string;
    citationIds: number[];
  };
  unsupportedClaimsFlags: string[]; // Explicit list of areas where no supporting document was found
  citations: Citation[];
  retrievedChunks: SourceChunk[];
  totalSourcesEvaluated: number;
  sourcesDistribution: Record<SourceType, number>;
  dataSource?: string;
  dataCoverage?: DataCoverage;
  isBaseLayer?: boolean;
  baseLayerNotice?: string;
}

export interface ComparisonCategoryRow {
  categoryName: string;
  description: string;
  projectAFinding: {
    severity: RiskSeverity;
    summary: string;
    citationIds: number[];
  };
  projectBFinding: {
    severity: RiskSeverity;
    summary: string;
    citationIds: number[];
  };
  keyDifference: string;
  saferOption: 'A' | 'B' | 'Equal';
}

export interface ComparisonReport {
  id: string;
  timestamp: string;
  projectA: Project;
  projectB: Project;
  projectAScore: number;
  projectBScore: number;
  verdict: {
    summary: string;
    saferProtocol: string;
    primaryTradeoff: string;
  };
  rows: ComparisonCategoryRow[];
  projectACitations: Citation[];
  projectBCitations: Citation[];
  projectARetrievedChunks: SourceChunk[];
  projectBRetrievedChunks: SourceChunk[];
}

export interface UserCredits {
  plan: 'Researcher' | 'Pro' | 'Team' | 'Enterprise';
  creditsRemaining: number;
  maxMonthlyCredits: number;
  resetDate: string;
  apiKey: string;
}
