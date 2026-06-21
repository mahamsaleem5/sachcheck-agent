import React, { useState } from "react";
import { Search, Sparkles, AlertCircle, FileText, Delete, RefreshCw } from "lucide-react";

interface CheckFormProps {
  onSubmit: (companyName: string, jobText: string) => Promise<void>;
  isLoading: boolean;
}

const TEMPLATES = [
  {
    label: "Scam Email (Telegram fee)",
    companyName: "Global Tech Solutions LLC",
    jobText: `URGENT CAREER OFFER: We selected your resume from Indeed! We are looking for an Online Virtual Assistant to earn $45/hour. Work only 10 hours a week from home! 
    
    No video interview is needed, we will do a fast text chat interview on Telegram with our manager @HRAdvisor_Steve. 
    
    Note: You must pay a fully refundable safety onboarding registration fee of $65 via CashApp or Crypto to receive your pre-configured Apple laptop training kit. Apply right now, slots are filling fast!`
  },
  {
    label: "Legit Offer (Stripe Remote)",
    companyName: "Stripe",
    jobText: `Hi Alex, thank you for your interest in the Technical Support Specialist (Remote) vacancy at Stripe. 
    
    We would love to invite you to an initial 30-minute Google Meet video session with our Team Lead next Tuesday. All our correspondences will solely be dispatched from official '@stripe.com' email portals. 
    
    We do not charge any training deposits, standard office equipment is supplied entirely at our corporate cost following successful selection.`
  }
];

export default function CheckForm({ onSubmit, isLoading }: CheckFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [jobText, setJobText] = useState("");
  const [formError, setFormError] = useState("");
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Rotate helpful loading statements during API resolution
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev + 1) % 4);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setFormError("Please supply the target company name.");
      return;
    }
    if (jobText.trim().length < 20) {
      setFormError("Please drop or supply a longer description or offer text (at least 20 chars).");
      return;
    }
    setFormError("");
    onSubmit(companyName.trim(), jobText.trim());
  };

  const loadTemplate = (company: string, text: string) => {
    setCompanyName(company);
    setJobText(text);
    setFormError("");
  };

  const getLoadingMessage = () => {
    switch (loadingPhase) {
      case 0: return "Step 1: Spawning international search workers to inspect web databases...";
      case 1: return "Step 1: Finding verified corporate website, Glassdoor reports, and LinkedIn team logs...";
      case 2: return "Step 2: Spawning risk analyst agent to inspect syntax, payment indicators, and emails...";
      case 3: return "Compiling multi-agent outputs, search links, and calculating safety scores...";
      default: return "Analyzing job offering...";
    }
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 text-slate-750 pointer-events-none">
        <Sparkles className="h-20 w-20 opacity-5" />
      </div>

      <h2 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-[#38bdf8]" />
        New Verification Audit
      </h2>

      {formError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#94a3b8] mb-1.5 font-mono">
            Company Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="company-name-input"
            type="text"
            required
            disabled={isLoading}
            placeholder="e.g. Acme Corporation, Apex Global Recruiting"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (formError) setFormError("");
            }}
            className="w-full bg-[#0f172a] border border-[#334155] text-[#f8fafc] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/40 focus:border-[#38bdf8] transition-all placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#94a3b8] mb-1.5 font-mono">
            Job Offer Text / Recruiter Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="job-text-textarea"
            required
            disabled={isLoading}
            rows={6}
            placeholder="Paste the job description, social media pitch, Telegram message, or raw recruiter outreach email here..."
            value={jobText}
            onChange={(e) => {
              setJobText(e.target.value);
              if (formError) setFormError("");
            }}
            className="w-full bg-[#0f172a] border border-[#334155] text-[#f8fafc] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/40 focus:border-[#38bdf8] transition-all placeholder:text-slate-500 font-sans"
          />
        </div>

        {/* Templates Shortcuts */}
        <div className="pt-1">
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#94a3b8] block mb-2">
            Instant Simulation Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                id={`preset-btn-${i}`}
                type="button"
                disabled={isLoading}
                onClick={() => loadTemplate(tpl.companyName, tpl.jobText)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  companyName === tpl.companyName
                    ? "bg-[#38bdf8]/10 border-[#38bdf8]/40 text-[#38bdf8]"
                    : "bg-[#0f172a] border-[#334155] text-slate-300 hover:bg-[#1e293b] hover:border-slate-500"
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear and Submit Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            id="clear-form-btn"
            type="button"
            disabled={isLoading || (!companyName && !jobText)}
            onClick={() => {
              setCompanyName("");
              setJobText("");
              setFormError("");
            }}
            className="px-4 py-3 rounded-lg border border-[#334155] text-slate-400 bg-[#0f172a]/40 hover:bg-[#0f172a] hover:text-white transition-all text-sm flex items-center gap-2"
          >
            Clear
          </button>

          <button
            id="submit-analysis-btn"
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#38bdf8] text-[#0f172a] hover:bg-[#38bdf8]/95 font-bold rounded-lg py-3 px-4 shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-[#0f172a]" />
                <span>Running Dynamic Audit...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>ANALYZE OFFER NOW</span>
              </>
            )}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="mt-5 p-4 bg-[#38bdf8]/5 border border-[#38bdf8]/10 rounded-xl text-center shadow-inner">
          <div className="inline-block p-1 bg-[#38bdf8]/10 text-[#38bdf8] rounded-full animate-spin mb-2">
            <RefreshCw className="h-5 w-5" />
          </div>
          <p className="text-xs font-mono text-[#38bdf8] font-semibold tracking-wide animate-pulse">
            {getLoadingMessage()}
          </p>
          <div className="w-full bg-[#0f172a] rounded-full h-1 mt-3">
            <div className="bg-[#38bdf8] h-1 rounded-full w-3/4"></div>
          </div>
        </div>
      )}
    </div>
  );
}
