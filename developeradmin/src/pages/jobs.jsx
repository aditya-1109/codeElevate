import { useState } from "react";
import { Briefcase, Plus, Pencil, Trash2, Search, X, MapPin, DollarSign, Target } from "lucide-react";
import Shell from "../components/Shell.jsx";
import Header from "../components/Header.jsx";
import { useAdmin } from "../context/AdminContext.jsx";

const EMPTY_JOB = {
  title: "", company: "", location: "", salary: "", experience: "",
  description: "", matchScore: 85,
  skills: "",
  hrContact: { name: "", phone: "", email: "", whatsapp: "" }
};

function JobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState(
    job
      ? { ...job, skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills }
      : { ...EMPTY_JOB }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setHr = (key, val) => setForm(f => ({ ...f, hrContact: { ...f.hrContact, [key]: val } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        matchScore: Number(form.matchScore) || 85,
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
      <div className="modal-box" style={{ maxWidth: 600 }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">{job ? "Edit Job" : "Create New Job"}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Job Title *</label>
              <input required className="admin-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. React Developer" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Company *</label>
              <input required className="admin-input" value={form.company} onChange={e => set("company", e.target.value)} placeholder="e.g. TechSolutions Ltd" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Location *</label>
              <input required className="admin-input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Remote" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Salary *</label>
              <input required className="admin-input" value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="e.g. 6–8 LPA" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Experience *</label>
              <input required className="admin-input" value={form.experience} onChange={e => set("experience", e.target.value)} placeholder="e.g. 0–1 year" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Match Score (%)</label>
              <input type="number" min="0" max="100" className="admin-input" value={form.matchScore} onChange={e => set("matchScore", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Skills (comma-separated)</label>
            <input className="admin-input" value={form.skills} onChange={e => set("skills", e.target.value)} placeholder="React, Redux, TailwindCSS" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Description *</label>
            <textarea required rows={3} className="admin-input resize-none" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Job description…" />
          </div>

          {/* HR Contact */}
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide pt-1">HR Contact</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">HR Name *</label>
              <input required className="admin-input" value={form.hrContact?.name || ""} onChange={e => setHr("name", e.target.value)} placeholder="HR Manager Name" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">HR Email *</label>
              <input required type="email" className="admin-input" value={form.hrContact?.email || ""} onChange={e => setHr("email", e.target.value)} placeholder="hr@company.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">HR Phone</label>
              <input className="admin-input" value={form.hrContact?.phone || ""} onChange={e => setHr("phone", e.target.value)} placeholder="+91 99999 88888" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">WhatsApp Link</label>
              <input className="admin-input" value={form.hrContact?.whatsapp || ""} onChange={e => setHr("whatsapp", e.target.value)} placeholder="https://wa.me/91…" />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="glow-btn px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all disabled:opacity-50">
              {saving ? "Saving…" : (job ? "Update Job" : "Create Job")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const { jobs, loading, createJob, updateJob, deleteJob } = useAdmin();
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(null); // null | "create" | job object
  const [deleting, setDeleting] = useState(null);

  const filtered = jobs.filter(j =>
    [j.title, j.company, j.location].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (job) => {
    if (!confirm(`Delete "${job.title}"?`)) return;
    setDeleting(job.id);
    try { await deleteJob(job.id); }
    catch (err) { alert("Error: " + err.message); }
    finally { setDeleting(null); }
  };

  const handleSave = async (data) => {
    if (typeof modal === "object" && modal !== null) {
      await updateJob(modal.id, data);
    } else {
      await createJob(data);
    }
  };

  return (
    <Shell>
      <Header title="Job Listings" subtitle="Create, edit, and manage job opportunities" />
      <div className="flex-1 p-6 space-y-4 animate-fade-in overflow-y-auto">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs…" className="admin-input pl-9 py-2" />
          </div>
          <button
            onClick={() => setModal("create")}
            className="glow-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-500/20"
          >
            <Plus size={15} />
            New Job
          </button>
        </div>

        {/* Cards */}
        {loading.jobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-2xl"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <Briefcase size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No jobs found. Create your first job listing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(job => (
              <div key={job.id} className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col gap-3 cursor-default">
                {/* Title & Match */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 leading-tight">{job.title}</p>
                    <p className="text-xs text-violet-400 mt-0.5">{job.company}</p>
                  </div>
                  <span className="badge badge-purple shrink-0">{job.matchScore}%</span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={11} />{job.salary}</span>
                  <span className="flex items-center gap-1"><Target size={11} />{job.experience}</span>
                </div>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {job.skills.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 text-[10px] rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">{s}</span>
                    ))}
                    {job.skills.length > 3 && <span className="px-2 py-0.5 text-[10px] rounded-full bg-zinc-700/40 text-zinc-500">+{job.skills.length - 3}</span>}
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-zinc-500 line-clamp-2 flex-1">{job.description}</p>

                {/* Actions */}
                <div className="flex justify-end gap-1.5 pt-1 border-t border-white/5">
                  <button onClick={() => setModal(job)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job)}
                    disabled={deleting === job.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                  >
                    <Trash2 size={12} /> {deleting === job.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <JobModal
          job={typeof modal === "object" ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </Shell>
  );
}
