import { HistoryItem } from "../types";
import { History, ShieldCheck, Skull, AlertTriangle, Calendar, ExternalLink, Trash2 } from "lucide-react";

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClearHistory?: () => void;
  selectedId?: string;
}

export default function HistoryList({ history, onSelect, onClearHistory, selectedId }: HistoryListProps) {
  const getBadgeClass = (verdict: HistoryItem["verdict"]) => {
    switch (verdict) {
      case "Likely Legit":
        return "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25";
      case "Suspicious":
        return "bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/25";
      case "Likely Scam":
      default:
        return "bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/25";
    }
  };

  const getVerdictIcon = (verdict: HistoryItem["verdict"]) => {
    switch (verdict) {
      case "Likely Legit":
        return <ShieldCheck className="h-4 w-4 text-[#10b981]" />;
      case "Suspicious":
        return <AlertTriangle className="h-4 w-4 text-[#f59e0b]" />;
      case "Likely Scam":
      default:
        return <Skull className="h-4 w-4 text-[#ef4444]" />;
    }
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between gap-4 border-b border-[#334155] pb-4 mb-5">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[#38bdf8]" id="checked-history-icon" />
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Previously Checked Companies
            </h3>
            <p className="text-xs text-[#94a3b8]">Database of public and user inspections</p>
          </div>
        </div>

        {onClearHistory && history.length > 3 && (
          <button
            id="clear-all-history-btn"
            onClick={onClearHistory}
            className="text-xs text-rose-450 hover:text-rose-450 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-500/10 hover:border-rose-500/30 bg-rose-500/5 transition-all text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Reset History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 text-slate-500 border-2 border-dashed border-[#334155]/60 rounded-lg">
          <History className="h-8 w-8 mx-auto opacity-30 mb-2" />
          <p className="text-xs font-mono">No companies recorded in checkout records yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#334155] text-[10px] uppercase font-mono tracking-wider font-semibold text-[#94a3b8]">
                <th className="pb-3 select-none">Company Name</th>
                <th className="pb-3 select-none">Trust Verdict</th>
                <th className="pb-3 select-none hidden sm:table-cell">Scam Risk Score</th>
                <th className="pb-3 select-none hidden md:table-cell">Audit Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60">
              {history.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <tr
                    key={item.id}
                    id={`history-row-${item.id}`}
                    onClick={() => onSelect(item)}
                    className={`group cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-[#0f172a] border-l-2 border-l-[#38bdf8]" 
                        : "hover:bg-[#0f172a]/40"
                    }`}
                  >
                    <td className="py-3.5 font-medium text-[#f8fafc] text-sm pl-2">
                       <div className="flex items-center gap-2">
                        <span className="truncate max-w-[150px] sm:max-w-[200px]" title={item.companyName}>
                          {item.companyName}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1 bg-[#38bdf8]/15 border border-[#38bdf8]/20 text-[#38bdf8] rounded">
                            Viewing
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeClass(item.verdict)}`}>
                        {getVerdictIcon(item.verdict)}
                        <span>{item.verdict}</span>
                      </div>
                    </td>
                    <td className="py-3.5 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-350">{item.score}%</span>
                        <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-[#334155]">
                          <div
                            className={`h-full ${
                              item.score < 30 
                                ? "bg-[#10b981]" 
                                : item.score < 70 
                                  ? "bg-[#f59e0b]" 
                                  : "bg-[#ef4444]"
                            }`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 hidden md:table-cell text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.checkedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-xs pr-2">
                      <button
                        id={`view-audit-btn-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(item);
                        }}
                        className="text-xs text-[#38bdf8] group-hover:text-[#38bdf8] font-bold inline-flex items-center gap-1 bg-[#0f172a]/50 border border-[#334155] px-2.5 py-1.5 rounded hover:border-[#38bdf8]/40 transition-all select-none hover:bg-[#0f172a]"
                      >
                        <span>Audit Record</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
