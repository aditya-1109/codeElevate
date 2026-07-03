import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Briefcase, FolderKanban,
  BookOpen, CalendarClock, LogOut, Shield, ChevronRight, ClipboardCheck, UserPlus
} from "lucide-react";
import { useAdmin } from "../context/AdminContext.jsx";

const NAV_ITEMS = [
  { to: "/dashboard",  label: "Dashboard",        icon: LayoutDashboard },
  { to: "/users",      label: "Users",             icon: Users },
  { to: "/registration-requests", label: "Reg Requests", icon: UserPlus },
  { to: "/submissions",label: "Submissions",       icon: ClipboardCheck },
  { to: "/jobs",       label: "Jobs",              icon: Briefcase },
  { to: "/projects",   label: "Projects",          icon: FolderKanban },
  { to: "/sessions",   label: "Sessions",          icon: CalendarClock },
];


export default function Sidebar() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const logoutAdmin = ()=>{
    logout();
    navigate("/login");
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col glass-panel border-r border-[rgba(139,92,246,0.15)] animate-slide-in">
      {/* Brand */}
      <div className="px-6 pt-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide leading-none">CodeElevate</p>
            <p className="text-xs text-violet-400 font-medium mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/25 shadow-sm shadow-violet-500/10"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-violet-400 opacity-70" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + Logout */}
      <div className="px-4 py-4 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white shadow">
            {admin?.name?.[0] || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-200 truncate">{admin?.name || "Admin"}</p>
            <p className="text-[10px] text-zinc-500 truncate">{admin?.email || ""}</p>
          </div>
        </div>
        <button
          onClick={logoutAdmin}
          className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={14} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
