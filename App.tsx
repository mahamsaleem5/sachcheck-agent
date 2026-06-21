import { useEffect, useState } from "react";
import Header from "./components/Header";
import CheckForm from "./components/CheckForm";
import VerdictReportCard from "./components/VerdictReportCard";
import HistoryList from "./components/HistoryList";
import { HistoryItem, VerdictReport } from "./types";
import { 
  ShieldAlert, AlertTriangle, ClipboardCheck, ArrowRight, Sparkles, 
  Layers, HelpCircle, CheckCircle2, ShieldCheck, HeartPulse
} from "lucide-react";

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<VerdictReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Search collision match state (when searching an already checked company)
  const [matchCandidate, setMatchCandidate] = useState<{
    item: HistoryItem;
    companyName: string;
    jobText: string;
  } | null>(null);

  // Load history from backend preloaded list + local browser storage on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        
        let initialList: HistoryItem[] = [];
        if (data.success && data.history) {
          initialList = data.history;
        }

        // Merge with any client-side browser user history saved under a unique local key
        const userSaved = localStorage.getItem("sachcheck_user_history");
        if (userSaved) {
          const userList: HistoryItem[] = JSON.parse(userSaved);
          
          // Deduplicate by company name to keep them unique, preferring user's custom records
          const mergedList = [...userList];
          initialList.forEach((preload) => {
            if (!mergedList.some((item) => item.companyName.toLowerCase() === preload.companyName.toLowerCase())) {
              mergedList.push(preload);
            }
          });

          // Sort by checkedAt date descending (newest first)
          mergedList.sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime());
          setHistory(mergedList);
        } else {
          setHistory(initialList);
        }
      } catch (err) {
        console.error("Failed to load preloaded scan records:", err);
        // Fallback robustly to local state on fetch failures
        const userSaved = localStorage.getItem("sachcheck_user_history");
        if (userSaved) {
          setHistory(JSON.parse(userSaved));
        }
      }
    };

    fetchHistory();
  }, []);

  // Save changes to localStorage whenever local user list mutates
  const saveUserHistoryLocally = (newList: HistoryItem[]) => {
    // We only preserve files explicitly check-added during user session to keep local state lightweight
    const userOnlyList = newList.filter(item => !item.id.startsWith("pre-"));
    localStorage.setItem("sachcheck_user_history", JSON.stringify(userOnlyList));
  };

  // Submit fresh search to fullstack Express API
  const handleCheckOffer = async (companyName: string, jobText: string, forceFresh = false) => {
    setApiError("");
    setSelectedReport(null);

    // If not forced and company already exists in database, trigger collision match alert
    if (!forceFresh) {
      const match = history.find(
        (item) => item.companyName.toLowerCase() === companyName.trim().toLowerCase()
      );
      if (match) {
        setMatchCandidate({
          item: match,
          companyName: companyName.trim(),
          jobText: jobText.trim(),
        });
        // Scroll smoothly to collision warning block at top
        window.scrollTo({ top: 120, behavior: "smooth" });
        return;
      }
    }

    // Terminate match indicator
    setMatchCandidate(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, jobText }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "A problem occurred invoking the AI analyst engine.");
      }

      const report: VerdictReport = result.report;
      setSelectedReport(report);

      // Create new history item
      const newItem: HistoryItem = {
        id: "verify-" + Date.now(),
        companyName: report.companyName,
        verdict: report.verdict,
        confidence: report.confidence,
        score: report.score,
        checkedAt: report.checkedAt,
        report: report,
      };

      // Append and sort
      setHistory((prev) => {
        const filtered = prev.filter(item => item.companyName.toLowerCase() !== companyName.toLowerCase());
        const updated = [newItem, ...filtered];
        saveUserHistoryLocally(updated);
        return updated;
      });

      // Scroll smoothly to result panel
      setTimeout(() => {
        const node = document.getElementById("audit-result-viewport");
        if (node) {
          node.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);

    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "An unexpected error occurred during report generation.");
    } finally {
      setIsLoading(false);
    }
  };

  // Select previous check history item to view in focus
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setApiError("");
    setMatchCandidate(null);
    setSelectedReport(item.report);
    
    // Scroll smoothly to results card viewport
    setTimeout(() => {
      const node = document.getElementById("audit-result-viewport");
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Clear user-created history items
  const handleClearHistory = () => {
    localStorage.removeItem("sachcheck_user_history");
    // Preserve ONLY the global preloaded items
    setHistory((prev) => {
      const preloaded = prev.filter(item => item.id.startsWith("pre-"));
      return preloaded;
    });
    setSelectedReport(null);
    setMatchCandidate(null);
    setApiError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-[#f8fafc] font-sans antialiased selection:bg-[#38bdf8]/30 selection:text-sky-300">
      <Header />

      {/* Main Content body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 space-y-8">
        
        {/* Decorative background visual elements */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-550/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none translate-x-1/2"></div>

        {/* Brand Hero Callout */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border border-[#334155] text-[11px] font-mono font-semibold text-[#38bdf8]">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Dual-Agent Safety Protocol Online</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-white">
            Verify Your Job Offer <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-[#38bdf8] to-slate-200 decoration-none">
              Before Charging Forward
            </span>
          </h2>
          <p className="text-sm md:text-base text-[#94a3b8] leading-relaxed max-w-2xl mx-auto">
            SachCheck combines real-time international company audits (Step 1) with formal recruit analysis (Step 2) to protect job seekers from complex upfront pay, spoofed domains, and messaging app scams.
          </p>
        </section>

        {apiError && (
          <div className="max-w-4xl mx-auto bg-rose-500/10 border border-rose-500/20 text-rose-450 p-4 rounded-xl text-sm flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-rose-450 mt-0.5" />
            <div>
              <span className="font-semibold block">verification Audit Stopped:</span>
              <p className="text-xs text-rose-300/90 mt-1 leading-relaxed">
                {apiError}
              </p>
            </div>
          </div>
        )}

        {/* COLLISION MATCH INDICATOR (Searched company was saved previously) */}
        {matchCandidate && (
          <div className="max-w-4xl mx-auto bg-amber-500/10 border border-amber-500/30 p-5 rounded-xl shadow-xl relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
                <AlertTriangle className="h-6 w-6 shrink-0 animate-[bounce_1s]" />
              </div>
              <div className="space-y-3 flex-1">
                <h4 className="text-base font-semibold text-white font-display">
                  Verification Records Found
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Our system discovered an existing inspection report for <strong className="text-white">"{matchCandidate.companyName}"</strong> from <strong>{new Date(matchCandidate.item.checkedAt).toLocaleDateString()}</strong>. The previous evaluation scored <strong className="text-amber-400">{matchCandidate.item.score}/100 Hazard profile</strong> ({matchCandidate.item.verdict}).
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    id="load-matching-prev-btn"
                    onClick={() => handleSelectHistoryItem(matchCandidate.item)}
                    className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <span>Load Stored Report</span>
                    <ClipboardCheck className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id="trigger-force-fresh-btn"
                    onClick={() => handleCheckOffer(matchCandidate.companyName, matchCandidate.jobText, true)}
                    className="text-xs font-bold bg-[#0f172a] hover:bg-[#0f172a]/80 text-[#f8fafc] px-4 py-2 rounded-lg border border-[#334155] hover:border-slate-500 transition-all flex items-center gap-1.5"
                  >
                    <span>Verify Fresh Real-Time Web Check</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#38bdf8]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input form panel */}
        <section className="max-w-4xl mx-auto">
          <CheckForm onSubmit={handleCheckOffer} isLoading={isLoading} />
        </section>

        {/* Report cards container */}
        {selectedReport && (
          <section id="audit-result-viewport" className="max-w-4xl mx-auto scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 bg-sky-500/10 text-[#38bdf8] rounded-lg border border-sky-500/20">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-bold text-white font-display">
                Active Audit Diagnosis
              </h3>
            </div>
            <VerdictReportCard report={selectedReport} />
          </section>
        )}

        {/* Previous audit checklist list table */}
        <section className="max-w-4xl mx-auto">
          <HistoryList 
            history={history} 
            onSelect={handleSelectHistoryItem} 
            onClearHistory={handleClearHistory}
            selectedId={selectedReport?.companyName ? history.find(it => it.companyName.toLowerCase() === selectedReport.companyName.toLowerCase())?.id : undefined}
          />
        </section>

        {/* Educational safety guidelines */}
        <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#334155]">
          <div className="p-4 bg-[#1e293b]/70 border border-[#334155] rounded-xl space-y-2">
            <div className="p-2 bg-sky-500/10 text-[#38bdf8] border border-sky-500/20 rounded-lg w-fit">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h5 className="font-bold text-white font-display text-sm">Step 1: Footprint Check</h5>
            <p className="text-xs text-[#cbd5e1] leading-relaxed font-sans">
              Legitimate businesses possess clear, documented official domains and active registered employee logs on LinkedIn. A complete lack of presence means danger.
            </p>
          </div>
          
          <div className="p-4 bg-[#1e293b]/70 border border-[#334155] rounded-xl space-y-2">
            <div className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg w-fit">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h5 className="font-semibold text-white font-display text-sm">Step 2: Phrasing Check</h5>
            <p className="text-xs text-[#cbd5e1] leading-relaxed font-sans">
              Scammers trigger indicators by pushing fast chat-only message interviews (Telegram/WhatsApp) or asking for money deposits to send training kits.
            </p>
          </div>

          <div className="p-4 bg-[#1e293b]/70 border border-[#334155] rounded-xl space-y-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg w-fit">
              <HeartPulse className="h-5 w-5" />
            </div>
            <h5 className="font-semibold text-white font-display text-sm">Empowering Seekers</h5>
            <p className="text-xs text-[#cbd5e1] leading-relaxed font-sans">
              Knowledge is defense. Never deliver upfront cash, never hand over identity card scans before video interviews, and report recruiters using standard gmail portals.
            </p>
          </div>
        </section>
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-[#334155] py-6 px-6 text-center text-xs text-[#94a3b8] mt-12 bg-[#0f172a]">
        <p>© 2026 SachCheck. Defending job seekers safety internationally.</p>
        <p className="mt-1 font-mono text-[10px]">All audit models are fully secure, grounded, and compliant.</p>
      </footer>
    </div>
  );
}
