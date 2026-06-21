export interface RedFlag {
  flag: string;
  found: boolean;
  evidence: string;
}

export interface CompanyResearch {
  officialWebsite: string | null;
  hasReviewsOrScamReports: boolean;
  reviewsSummary: string;
  hasLinkedInPresence: boolean;
  linkedInSummary: string;
  hasRegistration: boolean;
  registrationSummary: string;
  overallResearchSummary: string;
}

export interface TextAnalysis {
  redFlags: RedFlag[];
}

export interface WebSource {
  title: string;
  url: string;
}

export interface VerdictReport {
  companyName: string;
  jobText: string;
  verdict: 'Likely Legit' | 'Suspicious' | 'Likely Scam';
  confidence: 'Low' | 'Medium' | 'High';
  score: number; // 0 to 100
  reasons: string[];
  recommendations: string[];
  companyResearch: CompanyResearch;
  textAnalysis: TextAnalysis;
  checkedAt: string;
  sources?: WebSource[];
}

export interface HistoryItem {
  id: string;
  companyName: string;
  verdict: 'Likely Legit' | 'Suspicious' | 'Likely Scam';
  confidence: 'Low' | 'Medium' | 'High';
  score: number;
  checkedAt: string;
  report: VerdictReport;
}
