import { useState } from "react";
import { Users, Search, UserCheck, Check, X, ExternalLink, Phone, RefreshCw, BadgePercent } from "lucide-react";
import Shell from "../components/Shell.jsx";
import Header from "../components/Header.jsx";
import { useAdmin } from "../context/AdminContext.jsx";

export default function RegistrationRequestsPage() {
  const { registrationRequests, loadingRequests, approveRegistrationRequest, rejectRegistrationRequest } = useAdmin();
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null);

  const filtered = registrationRequests.filter(r =>
    [r.name, r.email, r.transactionId, r.referralCodeUsed].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApprove = async (requestId, name) => {
    if (!confirm(`Approve registration request for "${name}"?`)) return;
    setActionId(requestId);
    try {
      await approveRegistrationRequest(requestId);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (requestId, name) => {
    if (!confirm(`Reject registration request for "${name}"?`)) return;
    setActionId(requestId);
    try {
      await rejectRegistrationRequest(requestId);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <Shell>
      <Header title="Registration Requests" subtitle="Review and approve student payment registrations" />
      <div className="flex-1 p-6 space-y-4 animate-fade-in overflow-y-auto">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, tx id…"
              className="admin-input pl-9 py-2"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Users size={13} />
            <span>{filtered.length} pending requests</span>
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Contact</th>
                  <th>Transaction ID</th>
                  <th>Amount Paid</th>
                  <th>Referral Used</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingRequests ? (
                  [1, 2, 3].map(i => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5, 6].map(j => (
                        <td key={j}><div className="skeleton h-5 rounded"></div></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-zinc-600 py-12">
                      No pending registration requests found.
                    </td>
                  </tr>
                ) : filtered.map(r => (
                  <tr key={r.id}>
                    {/* Student Info */}
                    <td>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-200 truncate">{r.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{r.title || "Junior Developer"}</p>
                      </div>
                    </td>

                    {/* Contact */}
                    <td>
                      <p className="text-xs text-zinc-400 truncate">{r.email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {r.phone && <span className="flex items-center gap-1 text-[10px] text-zinc-600"><Phone size={9} />{r.phone}</span>}
                        {r.github && (
                          <a href={`https://github.com/${r.github}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300">
                            <ExternalLink size={9} />{r.github}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Transaction ID */}
                    <td>
                      <span className="font-mono text-xs text-zinc-300">{r.transactionId}</span>
                    </td>

                    {/* Amount Paid */}
                    <td>
                      <span className="badge badge-purple">₹{r.amountPaid}</span>
                    </td>

                    {/* Referral Used */}
                    <td>
                      {r.referralCodeUsed ? (
                        <span className="badge badge-success flex items-center gap-1 w-fit">
                          <BadgePercent size={11} />
                          {r.referralCodeUsed}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(r.id, r.name)}
                          disabled={actionId === r.id}
                          title="Approve registration"
                          className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-300 transition-all disabled:opacity-40 cursor-pointer"
                        >
                          {actionId === r.id ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(r.id, r.name)}
                          disabled={actionId === r.id}
                          title="Reject request"
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-all disabled:opacity-40 cursor-pointer"
                        >
                          {actionId === r.id ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <X size={16} />
                          )}
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
    </Shell>
  );
}
