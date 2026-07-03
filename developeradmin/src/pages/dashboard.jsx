import { Users, Briefcase, FolderKanban, CalendarClock, BookOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import Shell from "../components/Shell.jsx";
import Header from "../components/Header.jsx";
import { useAdmin } from "../context/AdminContext.jsx";

function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 font-medium mb-1">{label}</p>
        {loading
          ? <div className="skeleton h-6 w-16 mb-1"></div>
          : <p className="text-2xl font-bold text-white">{value}</p>
        }
        {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function RecentRow({ icon: Icon, iconColor, title, sub, badge, badgeClass }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[rgba(255,255,255,0.05)] last:border-none">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200 font-medium truncate">{title}</p>
        <p className="text-xs text-zinc-500 truncate">{sub}</p>
      </div>
      {badge && <span className={`badge ${badgeClass} shrink-0`}>{badge}</span>}
    </div>
  );
}

export default function Dashboard() {
  const { users, jobs, liveProjects, practiceProjects, sessions, loading } = useAdmin();

  const totalStudents       = users.length;
  const totalJobs           = jobs.length;
  const totalLive           = liveProjects.length;
  const totalPractice       = practiceProjects.length;
  const totalSessions       = sessions.length;
  const completedSessions   = sessions.filter(s => s.status === "Completed").length;
  const pendingSessions     = sessions.filter(s => s.status !== "Completed").length;
  const verifiedStudents    = users.filter(u => u.isHrVerified === 1).length;

  const recentSessions = sessions.slice(-5).reverse();
  const recentJobs     = jobs.slice(-4).reverse();

  const anyLoading = loading.users || loading.jobs || loading.liveProjects || loading.sessions;

  return (
    <Shell>
      <Header title="Dashboard" subtitle="Overview of your platform at a glance" />
      <div className="flex-1 p-6 space-y-6 animate-fade-in overflow-y-auto">

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}         label="Total Students"     value={totalStudents}    sub={`${verifiedStudents} HR Verified`}      color="bg-gradient-to-br from-blue-500 to-indigo-600"   loading={anyLoading} />
          <StatCard icon={Briefcase}     label="Job Listings"       value={totalJobs}        sub="Active positions"                        color="bg-gradient-to-br from-amber-500 to-orange-600"  loading={anyLoading} />
          <StatCard icon={FolderKanban}  label="Live Projects"      value={totalLive}        sub={`${totalPractice} Practice templates`}  color="bg-gradient-to-br from-violet-500 to-purple-700" loading={anyLoading} />
          <StatCard icon={CalendarClock} label="Sessions"           value={totalSessions}    sub={`${completedSessions} completed · ${pendingSessions} pending`} color="bg-gradient-to-br from-emerald-500 to-teal-600" loading={anyLoading} />
        </div>

        {/* Progress Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Verification rate */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">HR Verification Rate</p>
              <TrendingUp size={14} className="text-violet-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {totalStudents ? Math.round((verifiedStudents / totalStudents) * 100) : 0}%
            </p>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-700"
                style={{ width: `${totalStudents ? (verifiedStudents / totalStudents) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-zinc-600 mt-2">{verifiedStudents} of {totalStudents} students</p>
          </div>

          {/* Session completion */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Session Completion</p>
              <CheckCircle2 size={14} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0}%
            </p>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${totalSessions ? (completedSessions / totalSessions) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-zinc-600 mt-2">{completedSessions} of {totalSessions} completed</p>
          </div>

          {/* Pending */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Pending Actions</p>
              <Clock size={14} className="text-amber-400" />
            </div>
            <div className="space-y-2.5 mt-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Pending Sessions</span>
                <span className="badge badge-warning">{pendingSessions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Unverified Students</span>
                <span className="badge badge-purple">{totalStudents - verifiedStudents}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Practice Templates</span>
                <span className="badge badge-gray">{totalPractice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent sessions */}
          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-1">Recent Sessions</h2>
            <p className="text-xs text-zinc-600 mb-4">Latest booked student sessions</p>
            {anyLoading
              ? [1,2,3].map(i => <div key={i} className="skeleton h-10 mb-2 rounded-lg"></div>)
              : recentSessions.length === 0
                ? <p className="text-xs text-zinc-600 py-4 text-center">No sessions found. Seed the database first.</p>
                : recentSessions.map(sess => (
                    <RecentRow
                      key={sess.id}
                      icon={CalendarClock}
                      iconColor="bg-emerald-500/20"
                      title={sess.title}
                      sub={`${sess.studentName} · ${sess.date || "—"}`}
                      badge={sess.status}
                      badgeClass={sess.status === "Completed" ? "badge-success" : "badge-warning"}
                    />
                  ))
            }
          </div>

          {/* Recent jobs */}
          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-1">Job Listings</h2>
            <p className="text-xs text-zinc-600 mb-4">Recently added positions</p>
            {anyLoading
              ? [1,2,3].map(i => <div key={i} className="skeleton h-10 mb-2 rounded-lg"></div>)
              : recentJobs.length === 0
                ? <p className="text-xs text-zinc-600 py-4 text-center">No jobs found. Seed the database first.</p>
                : recentJobs.map(job => (
                    <RecentRow
                      key={job.id}
                      icon={Briefcase}
                      iconColor="bg-amber-500/20"
                      title={job.title}
                      sub={`${job.company} · ${job.location}`}
                      badge={`${job.matchScore}% match`}
                      badgeClass="badge-purple"
                    />
                  ))
            }
          </div>
        </div>

        {/* Quick Platform Stats */}
        <div className="glass-panel rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Platform Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Avg. Match Score", value: jobs.length ? `${Math.round(jobs.reduce((a,j) => a + (j.matchScore||0), 0) / jobs.length)}%` : "—", color: "text-violet-400" },
              { label: "Live Submodules",  value: liveProjects.reduce((a,p) => a + (p.submodules?.length || 0), 0), color: "text-blue-400" },
              { label: "Practice Projects",value: totalPractice, color: "text-amber-400" },
              { label: "Verified Students",value: verifiedStudents, color: "text-emerald-400" },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-white/3 border border-white/5">
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-zinc-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Shell>
  );
}
