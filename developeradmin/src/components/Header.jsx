import { useState } from "react";
import { RefreshCw, Zap, Bell } from "lucide-react";
import { useAdmin } from "../context/AdminContext.jsx";

export default function Header({ title, subtitle }) {
  const { loadAll } = useAdmin();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setTimeout(() => setRefreshing(false), 800);
  };

 

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)] glass-panel sticky top-0 z-50">
      <div>
        <h1 className="text-lg font-semibold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200"
          title="Refresh data"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        

        {/* Notification dot */}
        <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-all hover:bg-white/10">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
        </div>
      </div>
    </header>
  );
}
