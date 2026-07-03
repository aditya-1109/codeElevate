import { useState } from "react";
import { Users, Search, BadgeCheck, Trash2, ShieldCheck, ShieldX, ExternalLink, Phone, RefreshCw, Plus, Pencil, X } from "lucide-react";
import Shell from "../components/Shell.jsx";
import Header from "../components/Header.jsx";
import { useAdmin } from "../context/AdminContext.jsx";

const EMPTY_USER = {
  name: "",
  email: "",
  password: "",
  role: "student",
  title: "Junior React Developer",
  bio: "Frontend developer trainee at CodeElevate.",
  phone: "",
  github: "",
  walletPoints: 0,
  isHrVerified: 0
};

function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(
    user
      ? { ...user, password: "" }
      : { ...EMPTY_USER }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (!form.name.trim() || !form.email.trim()) {
        throw new Error("Name and Email are required");
      }
      if (!user && !form.password.trim()) {
        throw new Error("Password is required for new users");
      }
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 600 }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">{user ? "Edit User & Profile" : "Create New User"}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Credentials */}
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">Account Credentials</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Name *</label>
                <input required className="admin-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Email *</label>
                <input required type="email" className="admin-input" value={form.email} onChange={e => set("email", e.target.value)} placeholder="e.g. john@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Password {user ? "(leave blank to keep current)" : "*"}
                </label>
                <input
                  required={!user}
                  type="password"
                  className="admin-input"
                  value={form.password || ""}
                  onChange={e => set("password", e.target.value)}
                  placeholder={user ? "••••••••" : "Password"}
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Role *</label>
                <select className="admin-input text-zinc-300 bg-zinc-900 border-zinc-800" value={form.role} onChange={e => set("role", e.target.value)}>
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Profile/Student details */}
          <div>
            <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">Profile Portfolio Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Title</label>
                <input className="admin-input" value={form.title || ""} onChange={e => set("title", e.target.value)} placeholder="e.g. Junior React Developer" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Phone</label>
                <input className="admin-input" value={form.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="e.g. +91 99999 88888" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">GitHub Username</label>
                <input className="admin-input" value={form.github || ""} onChange={e => set("github", e.target.value)} placeholder="e.g. johndoe" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Wallet Points</label>
                <input type="number" min="0" className="admin-input" value={form.walletPoints ?? 0} onChange={e => set("walletPoints", e.target.value)} />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs text-zinc-400 mb-1">Bio</label>
              <textarea rows={2} className="admin-input resize-none" value={form.bio || ""} onChange={e => set("bio", e.target.value)} placeholder="Brief bio..." />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="isHrVerified"
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-violet-500"
                checked={Number(form.isHrVerified) === 1}
                onChange={e => set("isHrVerified", e.target.checked ? 1 : 0)}
              />
              <label htmlFor="isHrVerified" className="text-xs text-zinc-300 font-medium cursor-pointer">
                HR Verified (Forces verifiedProgress to 100%)
              </label>
            </div>
          </div>

          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="glow-btn px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all disabled:opacity-50">
              {saving ? "Saving…" : (user ? "Save Changes" : "Create User")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { users, loading, deleteUser, toggleVerify, loadAll, createUser, updateUser } = useAdmin();
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null);
  const [modal, setModal] = useState(null); // null | "create" | userObject

  const filtered = users.filter(u =>
    [u.name, u.email, u.title].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleVerify = async (userId) => {
    setActionId(userId);
    try { await toggleVerify(userId); }
    catch (err) { alert("Error: " + err.message); }
    finally { setActionId(null); }
  };

  const handleDelete = async (userId, name) => {
    if (!confirm(`Delete student "${name}"? This is irreversible.`)) return;
    setActionId(userId);
    try { await deleteUser(userId); }
    catch (err) { alert("Error: " + err.message); }
    finally { setActionId(null); }
  };

  const handleSave = async (data) => {
    if (modal === "create") {
      await createUser(data);
    } else {
      await updateUser(modal.userId, data);
    }
  };

  return (
    <Shell>
      <Header title="User Management" subtitle="View, verify, and manage registered students" />
      <div className="flex-1 p-6 space-y-4 animate-fade-in overflow-y-auto">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students…"
              className="admin-input pl-9 py-2"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setModal("create")}
              className="glow-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add User</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Users size={13} />
              <span>{filtered.length} students</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Wallet</th>
                  <th>Progress</th>
                  <th>HR Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading.users ? (
                  [1,2,3].map(i => (
                    <tr key={i}>
                      {[1,2,3,4,5,6].map(j => (
                        <td key={j}><div className="skeleton h-5 rounded"></div></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-zinc-600 py-12">
                      No students found. Try seeding the database first.
                    </td>
                  </tr>
                ) : filtered.map(u => (
                  <tr key={u.userId}>
                    {/* Student info */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden">
                          {u.avatar
                            ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            : (u.name?.[0] || "S")
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-200 truncate">{u.name || "—"}</p>
                          <p className="text-xs text-zinc-500 truncate">{u.title || "No title"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td>
                      <p className="text-xs text-zinc-400 truncate">{u.email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {u.phone && <span className="flex items-center gap-1 text-[10px] text-zinc-600"><Phone size={9} />{u.phone}</span>}
                        {u.github && (
                          <a href={`https://github.com/${u.github}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300">
                            <ExternalLink size={9} />{u.github}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Wallet */}
                    <td>
                      <span className="badge badge-purple">{u.walletPoints ?? 0} pts</span>
                    </td>

                    {/* Progress */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden w-20">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                            style={{ width: `${u.verifiedProgress ?? 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-zinc-500">{u.verifiedProgress ?? 0}%</span>
                      </div>
                    </td>

                    {/* Verified */}
                    <td>
                      {u.isHrVerified === 1
                        ? <span className="badge badge-success flex items-center gap-1 w-fit"><BadgeCheck size={11} />Verified</span>
                        : <span className="badge badge-gray w-fit">Unverified</span>
                      }
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setModal(u)}
                          disabled={actionId === u.userId}
                          title="Edit user details"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all disabled:opacity-40"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleVerify(u.userId)}
                          disabled={actionId === u.userId}
                          title={u.isHrVerified === 1 ? "Remove Verification" : "Grant HR Verification"}
                          className={`p-1.5 rounded-lg transition-all ${
                            u.isHrVerified === 1
                              ? "text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-300"
                              : "text-zinc-500 hover:bg-violet-500/15 hover:text-violet-300"
                          } disabled:opacity-40`}
                        >
                          {actionId === u.userId
                            ? <RefreshCw size={14} className="animate-spin" />
                            : u.isHrVerified === 1 ? <ShieldX size={14} /> : <ShieldCheck size={14} />
                          }
                        </button>
                        <button
                          onClick={() => handleDelete(u.userId, u.name)}
                          disabled={actionId === u.userId}
                          title="Delete student"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {modal && (
        <UserModal
          user={typeof modal === "object" ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </Shell>
  );
}
