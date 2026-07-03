import { useState } from "react";
import { CalendarClock, Search, CheckCircle2, Clock, Filter, Plus, Trash2 } from "lucide-react";
import Shell from "../components/Shell.jsx";
import Header from "../components/Header.jsx";
import { useAdmin } from "../context/AdminContext.jsx";

export default function SessionsPage() {
  const { 
    sessions, 
    loading, 
    completeSession, 
    availableSlots, 
    createAvailableSlot, 
    deleteAvailableSlot 
  } = useAdmin();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all"); // all | pending | completed
  const [actionId, setActionId] = useState(null);

  // Slot Form States
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM - 10:45 AM");
  const [newMeetingLink, setNewMeetingLink] = useState("");
  const [isSubmittingSlot, setIsSubmittingSlot] = useState(false);

  const filtered = sessions.filter(s => {
    const matchSearch = [s.title, s.studentName, s.tutor, s.type].some(f =>
      f?.toLowerCase().includes(search.toLowerCase())
    );
    const matchFilter =
      filter === "all" ||
      (filter === "pending"   && s.status !== "Completed") ||
      (filter === "completed" && s.status === "Completed");
    return matchSearch && matchFilter;
  });

  const handleComplete = async (sess) => {
    if (sess.status === "Completed") return;
    if (!confirm(`Mark session "${sess.title}" as Completed for ${sess.studentName}?`)) return;
    setActionId(sess.id);
    try { await completeSession(sess.studentId, sess.id); }
    catch (err) { alert("Error: " + err.message); }
    finally { setActionId(null); }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return;
    setIsSubmittingSlot(true);
    try {
      await createAvailableSlot(newDate, newTime, newMeetingLink);
      setNewDate("");
      setNewMeetingLink("");
    } catch (err) {
      alert("Error creating slot: " + err.message);
    } finally {
      setIsSubmittingSlot(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm("Are you sure you want to delete this available slot?")) return;
    try {
      await deleteAvailableSlot(slotId);
    } catch (err) {
      alert("Error deleting slot: " + err.message);
    }
  };

  const totalSess    = sessions.length;
  const completedSess = sessions.filter(s => s.status === "Completed").length;
  const pendingSess   = totalSess - completedSess;

  return (
    <Shell>
      <Header title="Sessions" subtitle="All student sessions across the platform" />
      <div className="flex-1 p-6 space-y-4 animate-fade-in overflow-y-auto">

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Left Column: Create & Manage Slots */}
          <div className="space-y-4">
            {/* Create Slot Card */}
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wide border-b border-white/5 pb-2 flex items-center gap-1.5">
                <Plus size={14} className="text-violet-400" />
                <span>Create Booking Slot</span>
              </p>
              <form onSubmit={handleCreateSlot} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Select Date *</label>
                  <input
                    required
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Time Slot *</label>
                  <select
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="admin-input"
                  >
                    <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM (Morning)</option>
                    <option value="11:00 AM - 11:45 AM">11:00 AM - 11:45 AM (Morning)</option>
                    <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM (Afternoon)</option>
                    <option value="03:00 PM - 03:45 PM">03:00 PM - 03:45 PM (Afternoon)</option>
                    <option value="04:00 PM - 04:45 PM">04:00 PM - 04:45 PM (Evening)</option>
                    <option value="05:00 PM - 05:45 PM">05:00 PM - 05:45 PM (Evening)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Meeting Link</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={newMeetingLink}
                    onChange={e => setNewMeetingLink(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingSlot}
                  className="w-full glow-btn px-4 py-2 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all disabled:opacity-50 cursor-pointer text-center block"
                >
                  {isSubmittingSlot ? "Creating..." : "Add Available Slot"}
                </button>
              </form>
            </div>

            {/* Active Slots Card */}
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wide border-b border-white/5 pb-2">
                Active Available Slots ({availableSlots.length})
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {availableSlots.length === 0 ? (
                  <p className="text-xs text-zinc-600 text-center py-4">No active booking slots created.</p>
                ) : (
                  [...availableSlots].sort((a,b) => a.date.localeCompare(b.date)).map(slot => (
                    <div key={slot.id} className="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 rounded-xl text-xs">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-semibold text-zinc-200">{slot.date}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{slot.timeSlot}</p>
                        {slot.meetingLink && (
                          <p className="text-[9px] text-violet-400 mt-1 truncate hover:underline hover:text-violet-300">
                            <a href={slot.meetingLink} target="_blank" rel="noreferrer">
                              {slot.meetingLink}
                            </a>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer shrink-0"
                        title="Delete slot"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Booked Sessions Table */}
          <div className="xl:col-span-2 space-y-4">
            {/* Summary pills */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: `All (${totalSess})`,         val: "all",       class: "bg-violet-500/10 border-violet-500/25 text-violet-300" },
                { label: `Pending (${pendingSess})`,    val: "pending",   class: "bg-amber-500/10  border-amber-500/25  text-amber-300"  },
                { label: `Completed (${completedSess})`,val: "completed", class: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"},
              ].map(btn => (
                <button
                  key={btn.val}
                  onClick={() => setFilter(btn.val)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    filter === btn.val ? btn.class : "bg-transparent border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="relative max-w-sm">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search sessions, students, tutors…"
                className="admin-input pl-9 py-2"
              />
            </div>

            {/* Table */}
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Student</th>
                      <th>Tutor</th>
                      <th>Date / Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading.sessions ? (
                      [1,2,3,4].map(i => (
                        <tr key={i}>
                          {[1,2,3,4,5,6].map(j => (
                            <td key={j}><div className="skeleton h-5 rounded"></div></td>
                          ))}
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-zinc-600 py-12">
                          No sessions match your filters.
                        </td>
                      </tr>
                    ) : filtered.map(sess => (
                      <tr key={`${sess.studentId}-${sess.id}`}>
                        {/* Session info */}
                        <td>
                          <div>
                            <p className="text-sm text-zinc-200 font-medium">{sess.title}</p>
                            <span className="badge badge-purple mt-0.5">{sess.type}</span>
                          </div>
                        </td>

                        {/* Student */}
                        <td>
                          <p className="text-sm text-zinc-300 font-medium">{sess.studentName}</p>
                          <p className="text-xs text-zinc-500">{sess.studentEmail}</p>
                        </td>

                        {/* Tutor */}
                        <td>
                          <p className="text-xs text-zinc-400">{sess.tutor || "—"}</p>
                        </td>

                        {/* Date / Time */}
                        <td>
                          <p className="text-xs text-zinc-400">{sess.date || "—"}</p>
                          <p className="text-[10px] text-zinc-600">{sess.timeSlot || "—"}</p>
                        </td>

                        {/* Status */}
                        <td>
                          {sess.status === "Completed"
                            ? <span className="badge badge-success flex items-center gap-1 w-fit"><CheckCircle2 size={11} />Completed</span>
                            : <span className="badge badge-warning flex items-center gap-1 w-fit"><Clock size={11} />{sess.status || "Pending"}</span>
                          }
                        </td>

                        {/* Action */}
                        <td>
                          {sess.status !== "Completed" && (
                            <button
                              onClick={() => handleComplete(sess)}
                              disabled={actionId === sess.id}
                              className="glow-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/25 transition-all disabled:opacity-40 cursor-pointer"
                            >
                              <CheckCircle2 size={12} />
                              {actionId === sess.id ? "Saving…" : "Mark Done"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes panel */}
            {filtered.some(s => s.notes) && (
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Session Notes</p>
                <div className="space-y-2">
                  {filtered.filter(s => s.notes).map(s => (
                    <div key={s.id} className="flex gap-3 text-xs">
                      <span className="text-violet-400 shrink-0 font-medium">{s.studentName}:</span>
                      <span className="text-zinc-400 italic">{s.notes}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </Shell>
  );
}
