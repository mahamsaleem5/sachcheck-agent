import { ShieldCheck, Lock, Globe } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-[#334155] bg-[#0f172a] sticky top-0 z-50 py-4 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-sky-500/10 border border-sky-500/20 text-[#38bdf8] rounded-xl shadow-inner animate-pulse">
          <ShieldCheck className="h-7 w-7" id="sachcheck-logo-icon" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold font-display tracking-tight text-[#38bdf8] flex items-center gap-1">
            Sach<span className="text-white font-semibold">Check</span>
            <span className="text-[10px] uppercase font-mono bg-slate-850 border border-slate-700 px-1.5 py-0.5 rounded text-[#94a3b8] tracking-wider ml-1">
              AI Agent v3.5
            </span>
          </h1>
          <p className="text-xs text-[#94a3b8]">Global Job Offer Scam & Legitimacy Verifier</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-[#94a3b8]">
        <div className="hidden md:flex items-center gap-1.5 bg-[#1e293b] border border-[#334155] px-3 py-1.5 rounded-lg">
          <Globe className="h-3.5 w-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Search Grounding: ACTIVE</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#1e293b] border border-[#334155] px-3 py-1.5 rounded-lg text-[#38bdf8]">
          <Lock className="h-3.5 w-3.5" />
          <span>{currentTime || "Loading UTC Time..."}</span>
        </div>
      </div>
    </header>
  );
}
