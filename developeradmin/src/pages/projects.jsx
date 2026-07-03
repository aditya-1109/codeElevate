import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FolderKanban, Plus, Pencil, Trash2, Search, X, BookOpen, CheckCircle2 } from "lucide-react";
import Shell from "../components/Shell.jsx";
import Header from "../components/Header.jsx";
import { useAdmin } from "../context/AdminContext.jsx";

// ─── Live Project Modal ────────────────────────────────────────────────────────

const EMPTY_LIVE = { title: "", company: "", description: "", submodules: [] };
const EMPTY_SUB  = { id: "", title: "", points: 300, deadline: "", status: "Available", branch: "" };

function LiveModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project ? { ...project, submodules: project.submodules || [] } : { ...EMPTY_LIVE });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const updateSub = (idx, key, val) =>
    setForm(f => ({ ...f, submodules: f.submodules.map((s, i) => i === idx ? { ...s, [key]: val } : s) }));

  const addSub = () =>
    setForm(f => ({ ...f, submodules: [...f.submodules, { ...EMPTY_SUB, id: `sub-${Date.now()}` }] }));

  const removeSub = (idx) =>
    setForm(f => ({ ...f, submodules: f.submodules.filter((_, i) => i !== idx) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        submodules: form.submodules.map(s => ({ ...s, points: Number(s.points) || 0 }))
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 640 }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">{project ? "Edit Live Project" : "Create Live Project"}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={18} /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Project Title *</label>
              <input required className="admin-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. E-Commerce Refresh" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Client Company *</label>
              <input required className="admin-input" value={form.company} onChange={e => set("company", e.target.value)} placeholder="e.g. ElectroMart India" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Description *</label>
            <textarea required rows={2} className="admin-input resize-none" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Project description…" />
          </div>

          {/* Submodules */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Submodules ({form.submodules.length})</p>
            <button type="button" onClick={addSub} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {form.submodules.map((sub, idx) => (
              <div key={idx} className="rounded-xl bg-zinc-900/60 border border-white/5 p-3 grid grid-cols-2 gap-2">
                <div className="col-span-2 flex justify-between items-start gap-2">
                  <input className="admin-input flex-1 text-xs py-1.5" placeholder="Submodule title" value={sub.title}
                    onChange={e => updateSub(idx, "title", e.target.value)} />
                  <button type="button" onClick={() => removeSub(idx)} className="text-zinc-600 hover:text-red-400 mt-1"><X size={14} /></button>
                </div>
                <input className="admin-input text-xs py-1.5" placeholder="Branch" value={sub.branch}
                  onChange={e => updateSub(idx, "branch", e.target.value)} />
                <input className="admin-input text-xs py-1.5" type="number" placeholder="Points" value={sub.points}
                  onChange={e => updateSub(idx, "points", e.target.value)} />
                <input className="admin-input text-xs py-1.5" type="date" value={sub.deadline}
                  onChange={e => updateSub(idx, "deadline", e.target.value)} />
                <select className="admin-input text-xs py-1.5" value={sub.status} onChange={e => updateSub(idx, "status", e.target.value)}>
                  {["Available", "In Progress", "Locked", "Completed"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saving} className="glow-btn px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50">
              {saving ? "Saving…" : (project ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Practice Project Modal ────────────────────────────────────────────────────

const EMPTY_PRACTICE = { title: "", description: "", difficulty: "Intermediate", githubLink: "", apkLink: "" };

function PracticeModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project ? { ...project } : { ...EMPTY_PRACTICE });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({ ...form, githubLink: form.githubLink || null, apkLink: form.apkLink || null });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">{project ? "Edit Practice Template" : "Create Practice Template"}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={18} /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Title *</label>
            <input required className="admin-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. React Dashboard UI" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Description *</label>
            <textarea required rows={3} className="admin-input resize-none" value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Difficulty *</label>
            <select required className="admin-input" value={form.difficulty} onChange={e => set("difficulty", e.target.value)}>
              {["Beginner", "Intermediate", "Advanced"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">GitHub Repo URL</label>
            <input className="admin-input" value={form.githubLink || ""} onChange={e => set("githubLink", e.target.value)} placeholder="https://github.com/…" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">APK Link</label>
            <input className="admin-input" value={form.apkLink || ""} onChange={e => set("apkLink", e.target.value)} placeholder="/apks/app.apk" />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saving} className="glow-btn px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50">
              {saving ? "Saving…" : (project ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Status badge helpers ─────────────────────────────────────────────────────

const SUB_STATUS_CLASS = {
  Available: "badge-success",
  "In Progress": "badge-warning",
  Locked: "badge-gray",
  Completed: "badge-purple",
};

const DIFF_CLASS = {
  Beginner: "badge-success",
  Intermediate: "badge-warning",
  Advanced: "badge-danger",
};

// ─── Main Projects Page ────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const { liveProjects, practiceProjects, loading, createLiveProject, updateLiveProject, deleteLiveProject, createPracticeProject, updatePracticeProject, deletePracticeProject } = useAdmin();
  const location = useLocation();
  const [tab, setTab]       = useState(location.pathname === "/practice" ? "practice" : "live");
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState(null);
  const [deleting, setDeleting] = useState(null);

  const isLive = tab === "live";
  const data   = isLive ? liveProjects : practiceProjects;
  const filtered = data.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeleting(item.id);
    try {
      isLive ? await deleteLiveProject(item.id) : await deletePracticeProject(item.id);
    } catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  const handleSave = async (data) => {
    if (typeof modal === "object" && modal !== null) {
      isLive ? await updateLiveProject(modal.id, data) : await updatePracticeProject(modal.id, data);
    } else {
      isLive ? await createLiveProject(data) : await createPracticeProject(data);
    }
  };

  return (
    <Shell>
      <Header title="Projects" subtitle="Manage live client projects and practice templates" />
      <div className="flex-1 p-6 space-y-4 animate-fade-in overflow-y-auto">

        {/* Tabs & Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-white/5">
            <button
              onClick={() => { setTab("live"); setSearch(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "live" ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <FolderKanban size={14} /> Live Projects
            </button>
            <button
              onClick={() => { setTab("practice"); setSearch(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "practice" ? "bg-violet-600/25 text-violet-300 border border-violet-500/30" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <BookOpen size={14} /> Practice Templates
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${isLive ? "live" : "practice"}…`} className="admin-input pl-8 py-2" />
            </div>
            <button
              onClick={() => setModal("create")}
              className="glow-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-500/20 shrink-0"
            >
              <Plus size={15} /> New
            </button>
          </div>
        </div>

        {/* Content */}
        {(isLive ? loading.liveProjects : loading.practiceProjects) ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="skeleton h-40 rounded-2xl"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <FolderKanban size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No {isLive ? "live projects" : "practice templates"} found.</p>
          </div>
        ) : isLive ? (
          // Live project cards
          <div className="space-y-4">
            {filtered.map(proj => (
              <div key={proj.id} className="glass-panel rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">{proj.title}</p>
                    <p className="text-xs text-violet-400 mt-0.5">{proj.company}</p>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{proj.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setModal(proj)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(proj)} disabled={deleting === proj.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40">
                      <Trash2 size={12} /> {deleting === proj.id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Submodule table */}
                {proj.submodules?.length > 0 && (
                  <div className="rounded-xl overflow-hidden border border-white/5 mt-2">
                    <table className="admin-table text-xs">
                      <thead><tr><th>Submodule</th><th>Branch</th><th>Points</th><th>Deadline</th><th>Status</th></tr></thead>
                      <tbody>
                        {proj.submodules.map(sub => (
                          <tr key={sub.id}>
                            <td className="text-zinc-300 font-medium">{sub.title}</td>
                            <td className="font-mono text-[10px] text-zinc-500">{sub.branch}</td>
                            <td><span className="badge badge-purple">{sub.points}</span></td>
                            <td className="text-zinc-500">{sub.deadline || "—"}</td>
                            <td><span className={`badge ${SUB_STATUS_CLASS[sub.status] || "badge-gray"}`}>{sub.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Practice cards
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(proj => (
              <div key={proj.id} className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 leading-tight">{proj.title}</p>
                    <span className={`badge ${DIFF_CLASS[proj.difficulty] || "badge-gray"} mt-1`}>{proj.difficulty}</span>
                  </div>
                  <BookOpen size={16} className="text-zinc-600 shrink-0" />
                </div>
                <p className="text-xs text-zinc-500 line-clamp-3 flex-1">{proj.description}</p>
                {proj.githubLink && (
                  <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-violet-400 hover:text-violet-300 truncate">
                    {proj.githubLink}
                  </a>
                )}
                {proj.apkLink && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <CheckCircle2 size={10} /> APK available
                  </div>
                )}
                <div className="flex justify-end gap-1 pt-1 border-t border-white/5">
                  <button onClick={() => setModal(proj)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(proj)} disabled={deleting === proj.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && isLive && (
        <LiveModal
          project={typeof modal === "object" ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {modal && !isLive && (
        <PracticeModal
          project={typeof modal === "object" ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </Shell>
  );
}
