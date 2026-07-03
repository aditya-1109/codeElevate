import { useState, useMemo } from "react";
import { 
  Search, BookOpen, FolderKanban, ExternalLink, 
  GitMerge, CheckCircle, Clock, X, Award, ChevronRight,
  ClipboardCheck, RefreshCw, Star, AlertCircle
} from "lucide-react";
import Shell from "../components/Shell.jsx";
import Header from "../components/Header.jsx";
import { useAdmin } from "../context/AdminContext.jsx";

const GRADE_OPTIONS = ["A+", "A", "B+", "B", "C", "F"];

export default function SubmissionsPage() {
  const { users, practiceProjects, approveLiveSubmodule, auditPracticeProject, loading } = useAdmin();
  const [tab, setTab] = useState("practice"); // "practice" | "live"
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null); // tracking loading state for merge/approvals
  const [selectedPractice, setSelectedPractice] = useState(null); // practice item for auditing
  const [performance, setPerformance] = useState({
    codeQuality: "A+",
    security: "A+",
    performance: "A",
    uiux: "A"
  });
  const [feedback, setFeedback] = useState("");
  const [submittingAudit, setSubmittingAudit] = useState(false);
  const [auditError, setAuditError] = useState("");

  const isPractice = tab === "practice";

  // 1. Compile submissions from all users state
  const practiceSubmissions = useMemo(() => {
    const list = [];
    users.forEach(student => {
      const studentPracs = student.practiceProjects || [];
      studentPracs.forEach(sp => {
        if (sp.status === "Submitted" || sp.status === "Graded") {
          const masterProj = practiceProjects.find(p => p.id === sp.id);
          list.push({
            studentId: student.id,
            userId: student.userId,
            studentName: student.name || "Unknown",
            studentEmail: student.email || "",
            studentAvatar: student.avatar || "",
            studentGithub: student.github || "",
            projectId: sp.id,
            title: sp.title || masterProj?.title || "Practice Project",
            status: sp.status,
            submittedGit: sp.submittedGit,
            performance: sp.performance,
            reviewerFeedback: sp.reviewerFeedback,
            difficulty: masterProj?.difficulty || "Intermediate"
          });
        }
      });
    });
    return list;
  }, [users, practiceProjects]);

  const liveSubmissions = useMemo(() => {
    const list = [];
    users.forEach(student => {
      const studentLives = student.liveProjects || [];
      studentLives.forEach(sl => {
        if (sl.status === "Submitted" || sl.status === "Completed") {
          list.push({
            studentId: student.id,
            userId: student.userId,
            studentName: student.name || "Unknown",
            studentEmail: student.email || "",
            studentAvatar: student.avatar || "",
            studentGithub: student.github || "",
            submoduleId: sl.id,
            title: sl.title,
            projectTitle: sl.projectTitle,
            company: sl.company,
            points: sl.points,
            gitLink: sl.gitLink,
            status: sl.status
          });
        }
      });
    });
    return list;
  }, [users]);

  // Filters
  const filteredPractice = useMemo(() => {
    return practiceSubmissions.filter(item =>
      [item.studentName, item.studentEmail, item.title].some(field =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [practiceSubmissions, search]);

  const filteredLive = useMemo(() => {
    return liveSubmissions.filter(item =>
      [item.studentName, item.studentEmail, item.title, item.projectTitle].some(field =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [liveSubmissions, search]);

  // Statistics
  const stats = useMemo(() => {
    const pSubmitted = practiceSubmissions.filter(p => p.status === "Submitted").length;
    const pGraded = practiceSubmissions.filter(p => p.status === "Graded").length;
    const lSubmitted = liveSubmissions.filter(l => l.status === "Submitted").length;
    const lCompleted = liveSubmissions.filter(l => l.status === "Completed").length;

    return {
      pSubmitted,
      pGraded,
      pTotal: practiceSubmissions.length,
      lSubmitted,
      lCompleted,
      lTotal: liveSubmissions.length
    };
  }, [practiceSubmissions, liveSubmissions]);

  // Actions
  const handleMergeApprove = async (studentId, submoduleId) => {
    const key = `${studentId}-${submoduleId}`;
    setActionId(key);
    try {
      const res = await approveLiveSubmodule({ studentId, submoduleId });
      if (!res.success) {
        alert("Failed to approve submodule: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleOpenAuditModal = (item) => {
    setSelectedPractice(item);
    if (item.status === "Graded" && item.performance) {
      setPerformance({
        codeQuality: item.performance.codeQuality || "A+",
        security: item.performance.security || "A+",
        performance: item.performance.performance || "A",
        uiux: item.performance.uiux || "A"
      });
      setFeedback(item.reviewerFeedback || "");
    } else {
      setPerformance({
        codeQuality: "A+",
        security: "A+",
        performance: "A",
        uiux: "A"
      });
      setFeedback("");
    }
    setAuditError("");
  };

  const handleSaveAudit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setAuditError("Please provide expert audit feedback comments.");
      return;
    }
    setSubmittingAudit(true);
    setAuditError("");
    try {
      const res = await auditPracticeProject(
        selectedPractice.studentId,
        selectedPractice.projectId,
        performance,
        feedback
      );
      if (res.success) {
        setSelectedPractice(null);
      } else {
        setAuditError(res.error || "Failed to submit audit grades.");
      }
    } catch (err) {
      setAuditError(err.message);
    } finally {
      setSubmittingAudit(false);
    }
  };

  const currentList = isPractice ? filteredPractice : filteredLive;

  return (
    <Shell>
      <Header title="Submissions Board" subtitle="Audit and approve student repository solutions in real-time" />
      <div className="flex-1 p-6 space-y-5 animate-fade-in overflow-y-auto">

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Practice Projects KPIs */}
          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">Practice Submissions</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">{stats.pTotal}</span>
                <span className="text-xs text-zinc-400">Total received</span>
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Clock size={12} /> {stats.pSubmitted} Awaiting Audit
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle size={12} /> {stats.pGraded} Audited
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400">
              <BookOpen size={22} />
            </div>
          </div>

          {/* Live Projects KPIs */}
          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">Live Submodules</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">{stats.lTotal}</span>
                <span className="text-xs text-zinc-400">Total received</span>
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1.5 text-amber-400 animate-pulse">
                  <Clock size={12} /> {stats.lSubmitted} Pending Merge
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <GitMerge size={12} /> {stats.lCompleted} Merged
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400">
              <FolderKanban size={22} />
            </div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Tabs switch */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-white/5">
            <button
              onClick={() => { setTab("practice"); setSearch(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isPractice ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <BookOpen size={14} /> Practice Audits ({practiceSubmissions.length})
            </button>
            <button
              onClick={() => { setTab("live"); setSearch(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isPractice ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <FolderKanban size={14} /> Live Merges ({liveSubmissions.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-sm w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isPractice ? "Search practice submissions…" : "Search live tasks…"}
              className="admin-input pl-9 py-2"
            />
          </div>
        </div>

        {/* Submissions Table / View */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            {loading.users ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-12 rounded-lg w-full"></div>)}
              </div>
            ) : currentList.length === 0 ? (
              <div className="p-12 text-center">
                <ClipboardCheck size={32} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">No submissions found.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  {isPractice ? (
                    <tr>
                      <th>Student</th>
                      <th>Project / Level</th>
                      <th>Submitted Repository</th>
                      <th>Audit Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Student</th>
                      <th>Client submodule</th>
                      <th>Branch & XP</th>
                      <th>Submitted Repository</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {currentList.map((item, idx) => {
                    const uniqueKey = isPractice 
                      ? `${item.studentId}-prac-${item.projectId}-${idx}`
                      : `${item.studentId}-live-${item.submoduleId}-${idx}`;

                    return (
                      <tr key={uniqueKey}>
                        {/* Student Details */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden">
                              {item.studentAvatar ? (
                                <img src={item.studentAvatar} alt={item.studentName} className="w-full h-full object-cover" />
                              ) : (
                                item.studentName[0]
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-zinc-200 truncate">{item.studentName}</p>
                              <p className="text-[10px] text-zinc-500 truncate">{item.studentEmail}</p>
                            </div>
                          </div>
                        </td>

                        {/* Practice template fields */}
                        {isPractice && (
                          <>
                            <td>
                              <p className="text-xs font-semibold text-zinc-300 leading-tight">{item.title}</p>
                              <span className={`badge text-[9px] mt-1 ${
                                item.difficulty === "Advanced" ? "badge-danger" : "badge-warning"
                              }`}>{item.difficulty}</span>
                            </td>
                            <td>
                              {item.submittedGit ? (
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={item.submittedGit} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-mono max-w-56 truncate"
                                  >
                                    <ExternalLink size={10} /> {item.submittedGit}
                                  </a>
                                </div>
                              ) : (
                                <span className="text-xs text-zinc-600 italic">Not submitted</span>
                              )}
                            </td>
                            <td>
                              {item.status === "Graded" && item.performance ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="badge badge-success w-fit py-0 px-2 text-[10px]">
                                    Audited (Grade: {item.performance.codeQuality})
                                  </span>
                                  <span className="text-[10px] text-zinc-500 line-clamp-1 italic max-w-48">
                                    "{item.reviewerFeedback}"
                                  </span>
                                </div>
                              ) : (
                                <span className="badge badge-warning flex items-center gap-1 w-fit animate-pulse">
                                  <Clock size={10} /> Awaiting Audit
                                </span>
                              )}
                            </td>
                            <td className="text-right">
                              <button
                                onClick={() => handleOpenAuditModal(item)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/15 text-violet-400 border border-violet-500/20 hover:bg-violet-600/35 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                {item.status === "Graded" ? "Re-Audit" : "Grade Submission"}
                              </button>
                            </td>
                          </>
                        )}

                        {/* Live submodule fields */}
                        {!isPractice && (
                          <>
                            <td>
                              <p className="text-xs font-semibold text-zinc-200 leading-tight">{item.title}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{item.projectTitle} · <span className="text-violet-400">{item.company}</span></p>
                            </td>
                            <td>
                              <p className="text-[10px] text-zinc-400 font-medium">Points: <span className="text-purple-400 font-semibold">+{item.points} XP</span></p>
                              <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Branch: {item.title.toLowerCase().replace(/\s+/g, "-")}</p>
                            </td>
                            <td>
                              {item.gitLink ? (
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={item.gitLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-mono max-w-56 truncate"
                                  >
                                    <ExternalLink size={10} /> {item.gitLink}
                                  </a>
                                </div>
                              ) : (
                                <span className="text-xs text-zinc-600 italic">Not submitted</span>
                              )}
                            </td>
                            <td>
                              {item.status === "Completed" ? (
                                <span className="badge badge-purple flex items-center gap-1 w-fit">
                                  <CheckCircle size={10} /> Merged & Approved
                                </span>
                              ) : (
                                <span className="badge badge-warning flex items-center gap-1 w-fit animate-pulse">
                                  <Clock size={10} /> Pending Review
                                </span>
                              )}
                            </td>
                            <td className="text-right">
                              {item.status === "Submitted" ? (
                                <button
                                  onClick={() => handleMergeApprove(item.studentId, item.submoduleId)}
                                  disabled={actionId === `${item.studentId}-${item.submoduleId}`}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-black transition-all cursor-pointer inline-flex items-center gap-1 shadow-md shadow-emerald-500/10"
                                >
                                  {actionId === `${item.studentId}-${item.submoduleId}` ? (
                                    <>
                                      <RefreshCw size={12} className="animate-spin" /> Merging…
                                    </>
                                  ) : (
                                    <>
                                      <GitMerge size={12} /> Merge & Approve
                                    </>
                                  )}
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-600 border border-white/5 opacity-50 cursor-not-allowed inline-flex items-center gap-1"
                                >
                                  Merged
                                </button>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Practice Project Grading Modal */}
      {selectedPractice && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedPractice(null)}>
          <div className="modal-box max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-400">
                  <Star size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Expert Audit & Scorecard</h3>
                  <p className="text-[10px] text-zinc-500">Grading practice repository solution</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPractice(null)} 
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Context Summary */}
            <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-3 mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {selectedPractice.studentName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white leading-none">{selectedPractice.studentName}</p>
                  <p className="text-[9px] text-zinc-500 leading-none mt-1">{selectedPractice.studentEmail}</p>
                </div>
              </div>
              <div className="border-t border-white/5 pt-2 flex flex-col gap-1 text-[11px] text-zinc-400">
                <p>Template: <strong className="text-zinc-200">{selectedPractice.title}</strong></p>
                {selectedPractice.submittedGit && (
                  <p className="truncate">
                    Repository URL:{" "}
                    <a 
                      href={selectedPractice.submittedGit} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-violet-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      {selectedPractice.submittedGit} <ExternalLink size={8} />
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAudit} className="space-y-4">
              {/* Grading Grid */}
              <div className="grid grid-cols-2 gap-3 bg-zinc-900/30 border border-white/5 p-4 rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Code Quality</label>
                  <select 
                    className="admin-input text-xs py-1.5"
                    value={performance.codeQuality}
                    onChange={e => setPerformance(prev => ({ ...prev, codeQuality: e.target.value }))}
                  >
                    {GRADE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Security Score</label>
                  <select 
                    className="admin-input text-xs py-1.5"
                    value={performance.security}
                    onChange={e => setPerformance(prev => ({ ...prev, security: e.target.value }))}
                  >
                    {GRADE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Speed & Performance</label>
                  <select 
                    className="admin-input text-xs py-1.5"
                    value={performance.performance}
                    onChange={e => setPerformance(prev => ({ ...prev, performance: e.target.value }))}
                  >
                    {GRADE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">UI/UX Accuracy</label>
                  <select 
                    className="admin-input text-xs py-1.5"
                    value={performance.uiux}
                    onChange={e => setPerformance(prev => ({ ...prev, uiux: e.target.value }))}
                  >
                    {GRADE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              {/* Reviewer Comment */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Expert feedback comments *</label>
                <textarea
                  required
                  rows={4}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Provide brief architectural critique, clean code guidance, and layout improvement details…"
                  className="admin-input resize-none text-xs"
                />
              </div>

              {/* Error messages */}
              {auditError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-lg text-xs flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{auditError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-1 border-t border-white/5 mt-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedPractice(null)}
                  className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingAudit}
                  className="glow-btn px-4 py-2 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-55 transition-all flex items-center gap-1 shadow-lg shadow-violet-600/20"
                >
                  {submittingAudit ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      Save Audit Scorecard
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Shell>
  );
}
