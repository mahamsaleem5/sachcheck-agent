import { VerdictReport } from "../types";
import { 
  ShieldCheck, AlertTriangle, Skull, CheckCircle, XCircle, Info, 
  Globe, Linkedin, FileSpreadsheet, Star, HelpCircle, ArrowRight,
  ExternalLink, Calendar, Compass, ShieldAlert, Award
} from "lucide-react";

interface VerdictReportCardProps {
  report: VerdictReport;
}

export default function VerdictReportCard({ report }: VerdictReportCardProps) {
  const {
    companyName,
    verdict,
    confidence,
    score,
    reasons,
    recommendations,
    companyResearch,
    textAnalysis,
    checkedAt,
    sources
  } = report;

  // Decide colors, icons, and gradients based on verdict
  const getThemeProps = () => {
    switch (verdict) {
      case "Likely Legit":
        return {
          textColor: "text-[#10b981]",
          bgColor: "bg-[#10b981]/10",
          borderColor: "border-[#10b981]/25",
          headerBg: "bg-[#10b981]/5 border-b border-[#10b981]/20",
          icon: <ShieldCheck className="h-10 w-10 text-[#10b981]" />,
          title: "Likely Legit",
          badgeColor: "bg-[#10b981] text-white text-[13px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow",
          progressColor: "bg-[#10b981]"
        };
      case "Suspicious":
        return {
          textColor: "text-[#f59e0b]",
          bgColor: "bg-[#f59e0b]/10",
          borderColor: "border-[#f59e0b]/25",
          headerBg: "bg-[#f59e0b]/5 border-b border-[#f59e0b]/20",
          icon: <AlertTriangle className="h-10 w-10 text-[#f59e0b] animate-pulse" />,
          title: "Suspicious Offer",
          badgeColor: "bg-[#f59e0b] text-white text-[13px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow",
          progressColor: "bg-[#f59e0b]"
        };
      case "Likely Scam":
      default:
        return {
          textColor: "text-[#ef4444]",
          bgColor: "bg-[#ef4444]/10",
          borderColor: "border-[#ef4444]/25",
          headerBg: "bg-[#ef4444]/5 border-b border-[#ef4444]/20",
          icon: <Skull className="h-10 w-10 text-[#ef4444]" />,
          title: "Likely Scam / Fraud",
          badgeColor: "bg-[#ef4444] text-white text-[13px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow",
          progressColor: "bg-[#ef4444]"
        };
    }
  };

  const theme = getThemeProps();

  // Helper to render check/cross badge
  const renderStatusBadge = (found: boolean) => {
    if (found) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans bg-rose-500/10 text-rose-450 border border-rose-500/20 shrink-0">
          <XCircle className="h-3.5 w-3.5" /> Direct Risk Flag
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 shrink-0">
        <CheckCircle className="h-3.5 w-3.5" /> Passed Safe
      </span>
    );
  };

  return (
    <div className="border border-[#334155] bg-[#1e293b] rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Top Banner Ribbon */}
      <div className={`p-6 ${theme.headerBg} flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${theme.bgColor} border ${theme.borderColor}`}>
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={theme.badgeColor}>
                {theme.title}
              </span>
              <span className="text-xs uppercase font-mono bg-[#0f172a] border border-[#334155] text-[#94a3b8] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Checked {new Date(checkedAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-2xl font-bold font-display tracking-tight text-white mt-2">
              {companyName}
            </h3>
          </div>
        </div>

        {/* Dynamic Risk Gauge */}
        <div className="bg-[#0f172a] border border-[#334155] px-4 py-3.5 rounded-xl flex items-center gap-4 w-full md:w-auto self-stretch md:self-auto shadow-inner">
          <div className="text-center">
            <span className="text-[10px] uppercase font-mono text-[#94a3b8] block tracking-wider font-semibold">
              Hazard Threat Score
            </span>
            <span className="text-3xl font-extrabold font-mono text-white tracking-tighter">
              {score}<span className="text-slate-500 text-lg">/100</span>
            </span>
          </div>
          <div className="flex-1 md:w-32">
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-[#334155] p-0.5">
              <div 
                className={`h-full rounded-full transition-all ${theme.progressColor}`} 
                style={{ width: `${score}%` }} 
              />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono block text-[#94a3b8] mt-1.5 text-right font-semibold">
              Confidence: {confidence}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Core Findings Section */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#94a3b8] font-mono font-semibold mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#38bdf8]" />
            Core Investigator Findings
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reasons.map((reason, i) => (
              <li 
                key={i} 
                id={`reason-item-${i}`}
                className="bg-[#0f172a] border border-[#334155] p-4 rounded-xl text-sm text-[#cbd5e1] flex items-start gap-3 hover:border-slate-600 transition-all shadow-sm"
              >
                <div className={`mt-0.5 p-1 rounded-full ${theme.bgColor} shrink-0 text-xs font-mono font-bold flex items-center justify-center h-5 w-5 border ${theme.borderColor}`}>
                  {i + 1}
                </div>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Double Column: Digital Footprint (Grounding) vs Job Text Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* STEP 1: Research Agent Findings */}
          <div className="bg-[#0f172a] border border-[#334155] p-5 rounded-xl">
            <div className="flex items-center gap-2 border-b border-[#334155] pb-3 mb-4">
              <Globe className="h-4 w-4 text-[#38bdf8]" />
              <h4 className="text-sm font-semibold font-display text-white">
                Step 1: Background & Footprint Audit
              </h4>
            </div>

            <div className="space-y-4">
              {/* Official Website */}
              <div className="flex items-start justify-between gap-4 p-2.5 rounded-lg bg-[#1e293b]/50 hover:bg-[#1e293b] transition-all border border-[#334155]/45">
                <div className="flex items-start gap-3 text-sm">
                  <Star className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#cbd5e1] block text-xs">Official Web Portal</span>
                    <span className="text-slate-400 text-xs">
                      {companyResearch.officialWebsite ? (
                        <a 
                          id="company-website-link"
                          href={companyResearch.officialWebsite} 
                          target="_blank" 
                          referrerPolicy="no-referrer"
                          rel="noopener noreferrer" 
                          className="text-[#38bdf8] hover:underline inline-flex items-center gap-1 font-mono break-all mt-0.5"
                        >
                          {companyResearch.officialWebsite} <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[#ef4444] font-mono block mt-0.5 font-semibold">NOT DETECTED ONLINE</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* LinkedIn Presence */}
              <div className="flex items-start justify-between gap-4 p-2.5 rounded-lg bg-[#1e293b]/50 hover:bg-[#1e293b] transition-all border border-[#334155]/45">
                <div className="flex items-start gap-3 text-sm">
                  <Linkedin className="h-4 w-4 text-sky-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#cbd5e1] block text-xs font-display">LinkedIn Footprint</span>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                      {companyResearch.linkedInSummary}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 font-mono tracking-wider font-bold ${companyResearch.hasLinkedInPresence ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  {companyResearch.hasLinkedInPresence ? "VERIFIED" : "ABSENT"}
                </span>
              </div>

              {/* Corporate Registration */}
              <div className="flex items-start justify-between gap-4 p-2.5 rounded-lg bg-[#1e293b]/50 hover:bg-[#1e293b] transition-all border border-[#334155]/45">
                <div className="flex items-start gap-3 text-sm">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#cbd5e1] block text-xs">Corporate Registration</span>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                      {companyResearch.registrationSummary}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 font-mono tracking-wider font-bold ${companyResearch.hasRegistration ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  {companyResearch.hasRegistration ? "FOUND" : "ABSENT"}
                </span>
              </div>

              {/* Reviews or Fraud Reports */}
              <div className="flex items-start justify-between gap-4 p-2.5 rounded-lg bg-[#1e293b]/50 hover:bg-[#1e293b] transition-all border border-[#334155]/45">
                <div className="flex items-start gap-3 text-sm">
                  <Award className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#cbd5e1] block text-xs font-display">Public Reports & Scam Alerts</span>
                    <p className="text-[#cbd5e1] text-xs mt-0.5 leading-relaxed">
                      {companyResearch.reviewsSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Digital Footprint Summary */}
              <div className="mt-4 p-3 bg-[#1e293b] border border-[#334155] rounded-lg">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#94a3b8] block mb-1 font-semibold">
                  Overall Footprint Diagnosis:
                </span>
                <p className="text-xs text-[#cbd5e1] leading-relaxed italic">
                  "{companyResearch.overallResearchSummary}"
                </p>
              </div>
            </div>
          </div>

          {/* STEP 2: Text Risk Analysis */}
          <div className="bg-[#0f172a] border border-[#334155] p-5 rounded-xl">
            <div className="flex items-center gap-2 border-b border-[#334155] pb-3 mb-4">
              <ShieldAlert className="h-4 w-4 text-[#ef4444]" />
              <h4 className="text-sm font-semibold font-display text-white">
                Step 2: Message/Description Phrasing Check
              </h4>
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {textAnalysis.redFlags.map((rf, i) => (
                <div 
                  key={i} 
                  id={`red-flag-indicator-${i}`}
                  className={`p-3.5 rounded-lg border transition-all ${
                    rf.found 
                      ? "bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10" 
                      : "bg-[#1e293b] border-[#334155] hover:bg-[#1e293b]/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-white tracking-tight">
                      {rf.flag}
                    </span>
                    {renderStatusBadge(rf.found)}
                  </div>
                  {rf.found && rf.evidence && (
                    <p className="text-xs font-mono text-rose-300 bg-rose-500/5 border border-rose-500/15 rounded-md p-2 mt-2 leading-relaxed">
                      <span className="text-[10px] font-bold block uppercase text-rose-450 tracking-wider mb-0.5">Evidence Identified:</span>
                      "{rf.evidence}"
                    </p>
                  )}
                  {!rf.found && (
                    <span className="text-[10px] text-[#94a3b8] font-mono mt-1.5 block">
                      No matching phrasing pattern discovered.
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Recommendations next steps */}
        <div className="p-5 bg-[#38bdf8]/10 border border-[#38bdf8]/20 rounded-2xl">
          <h4 className="text-sm uppercase tracking-wider text-[#38bdf8] font-mono font-bold mb-3 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-[#38bdf8]" /> Actionable Analyst Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recommendations.map((rec, i) => (
              <div 
                key={i} 
                id={`recommendation-item-${i}`}
                className="bg-[#0f172a] border border-[#334155] p-4 rounded-xl flex gap-3 text-sm hover:border-slate-500 transition-all"
              >
                <div className="p-2 bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] rounded-lg shrink-0 h-8 w-8 flex items-center justify-center font-bold text-xs font-mono">
                  {i + 1}
                </div>
                <div>
                  <p className="text-[#e2e8f0] text-xs leading-relaxed font-sans font-medium">
                    {rec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cited Web Resources (Google Grounding Sources) */}
        {sources && sources.length > 0 && (
          <div className="border-t border-[#334155] pt-5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#94a3b8] block mb-3 font-semibold flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#94a3b8]" />
              Dynamic Grounded Research Citations (Real-time Google Results)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sources.map((src, idx) => (
                <a
                  key={idx}
                  id={`grounding-source-link-${idx}`}
                  href={src.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="bg-[#0f172a] border border-[#334155] p-3 rounded-lg flex items-center justify-between text-xs hover:border-[#38bdf8]/40 hover:text-white transition-all group overflow-hidden"
                >
                  <div className="truncate flex-1 mr-3">
                    <span className="text-slate-300 font-medium group-hover:text-[#38bdf8] transition-all font-display block truncate">
                      {src.title}
                    </span>
                    <span className="text-[10px] text-[#94a3b8] font-mono block truncate">
                      {src.url}
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-[#94a3b8] shrink-0 group-hover:text-[#38bdf8] transition-all" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
