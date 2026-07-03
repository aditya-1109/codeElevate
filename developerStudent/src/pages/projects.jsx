import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen,
  faCodeBranch,
  faArrowRight,
  faLock,
  faCheckCircle,
  faExclamationCircle,
  faExternalLinkAlt,
  faDownload,
  faWandMagicSparkles,
  faPaperPlane,
  faAward,
  faComment,
  faCalendarAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons';

export default function Projects() {
  const { 
    liveProjects, 
    practiceProjects, 
    submitLiveCode, 
    simulateLiveApproval, 
    requestApk, 
    submitPracticeGit, 
    bookSession,
    activeProjectsTab,
    setActiveProjectsTab
  } = useApp();
  
  const navigate = useNavigate();
  const activeTab = activeProjectsTab;
  const setActiveTab = setActiveProjectsTab;
  
  // States for Live Projects Modals
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [liveGitLink, setLiveGitLink] = useState('');
  
  // States for Practice Projects Submissions
  const [submittingPracId, setSubmittingPracId] = useState(null);
  const [pracGitLink, setPracGitLink] = useState('');

  const handleLiveSubmit = (e) => {
    e.preventDefault();
    if (!liveGitLink.trim()) return;
    submitLiveCode(selectedSubmodule.id, liveGitLink);
    setSelectedSubmodule(null);
    setLiveGitLink('');
  };

  const handlePracSubmit = (e, projId) => {
    e.preventDefault();
    if (!pracGitLink.trim()) return;
    submitPracticeGit(projId, pracGitLink);
    setSubmittingPracId(null);
    setPracGitLink('');
  };

  // Get completed items for 'My Projects'
  const submittedPractice = practiceProjects.filter(p => p.status === 'Submitted' || p.status === 'Graded');
  const submittedLiveSubmodules = liveProjects.flatMap(p => 
    p.submodules.filter(sub => sub.status === 'Submitted' || sub.status === 'Completed').map(sub => ({ ...sub, projectTitle: p.title, company: p.company }))
  );

  return (
    <div className="min-h-[calc(100vh-120px)]">
      {/* Main projects panel content */}
      <section className="min-w-0">
        {/* Live Projects Panel */}
        {activeTab === 'live' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Live Client submodules <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Complete specific client tasks inside deadlines. Push your final code to the designated branch. Completing submodules adds rewards directly to your wallet.
              </p>
            </div>

            {liveProjects.map(project => (
              <div key={project.id} className="glass-panel border border-white/5 rounded-2xl p-6 space-y-4">
                {/* Project Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">{project.title}</h3>
                    <p className="text-[10px] font-semibold text-brand-primary mt-0.5">Client: {project.company}</p>
                  </div>
                  <p className="text-xs text-gray-400 max-w-md md:text-right leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Submodules Tree */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tasks & Submodules</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {project.submodules.map(sub => (
                      <div 
                        key={sub.id} 
                        className={`p-4 bg-black/40 border rounded-xl flex flex-col justify-between min-h-48 transition-all ${
                          sub.status === 'Locked' 
                            ? 'border-white/5 opacity-55' 
                            : sub.status === 'Completed'
                            ? 'border-emerald-500/20 bg-emerald-500/5'
                            : sub.status === 'Submitted'
                            ? 'border-amber-500/20 bg-amber-500/5'
                            : 'border-white/5 hover:border-brand-primary/20'
                        }`}
                      >
                        {/* Upper Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                              +{sub.points} XP Points
                            </span>
                            {sub.status === 'Locked' && <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-gray-600" />}
                            {sub.status === 'Completed' && <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-emerald-400" />}
                            {sub.status === 'Submitted' && <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-amber-400 animate-pulse" />}
                            {sub.status === 'In Progress' && <FontAwesomeIcon icon={faCodeBranch} className="w-4 h-4 text-cyan-400" />}
                          </div>

                          <h5 className="text-xs font-bold text-white leading-snug">{sub.title}</h5>
                          <p className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
                            Deadline: {sub.deadline}
                          </p>
                        </div>

                        {/* Lower Section (Actions / Info) */}
                        <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                          {sub.status === 'Locked' && (
                            <span className="text-[9px] font-semibold text-gray-500 flex items-center gap-1">
                              Locked (Complete previous tasks)
                            </span>
                          )}

                          {sub.status === 'Available' && (
                            <button
                              onClick={() => setSelectedSubmodule(sub)}
                              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold py-1.5 rounded-lg text-[10px] transition-all cursor-pointer text-center block"
                            >
                              Submit Test Code
                            </button>
                          )}

                          {sub.status === 'In Progress' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[9px] bg-[#0d0d0f] p-1.5 rounded border border-white/5 text-cyan-400">
                                <span className="font-mono">Push branch:</span>
                                <span className="font-bold">{sub.branch}</span>
                              </div>
                              <button
                                onClick={() => setSelectedSubmodule(sub)}
                                className="w-full bg-[#1b1b20] hover:bg-white/5 text-gray-300 hover:text-white py-1.5 rounded-lg text-[10px] font-semibold border border-white/5 transition-all cursor-pointer text-center block"
                              >
                                Submit Pull Request Link
                              </button>
                            </div>
                          )}

                          {sub.status === 'Submitted' && (
                            <div className="space-y-2">
                              <span className="text-[9px] text-amber-400 font-semibold block text-center">
                                Review pending for merge
                              </span>
                              <div className="flex gap-1">
                                <a
                                  href={sub.gitLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-1 bg-black/40 text-center py-1.5 rounded text-[9px] font-semibold border border-white/5 text-gray-400 hover:text-white flex items-center justify-center gap-1"
                                >
                                  <span>Code</span> <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[8px]" />
                                </a>
                                <button
                                  onClick={() => simulateLiveApproval(sub.id)}
                                  className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-center py-1.5 rounded text-[9px] font-semibold cursor-pointer"
                                >
                                  Sim Approve
                                </button>
                              </div>
                            </div>
                          )}

                          {sub.status === 'Completed' && (
                            <span className="text-[9px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                              Merged & Wallet Credited
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Practice Templates Panel */}
        {activeTab === 'practice' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white">Practice Projects Dashboard</h2>
              <p className="text-xs text-gray-400 mt-1">
                Access starter repositories, test your logic with mobile builds by requesting APKs, submit repository links for automatic expert audits, and book slot reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {practiceProjects.map(project => (
                <div key={project.id} className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        project.difficulty === 'Advanced'
                          ? 'text-red-400 bg-red-500/10 border-red-500/20'
                          : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                      }`}>
                        {project.difficulty} Level
                      </span>
                      {project.status === 'Graded' && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Audited
                        </span>
                      )}
                      {project.status === 'Submitted' && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
                          Under Audit
                        </span>
                      )}
                      {project.status === 'Available' && (
                        <span className="text-[9px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          Uncompleted
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{project.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{project.description}</p>
                    </div>

                    {/* Resources Panel */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/10 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                      >
                        <span>Clone Template</span> <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[8px]" />
                      </a>

                      {project.apkLink ? (
                        <a
                          href={project.apkLink}
                          className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                        >
                          <span>Download APK</span> <FontAwesomeIcon icon={faDownload} className="text-[8px]" />
                        </a>
                      ) : (
                        <button
                          onClick={() => requestApk(project.id)}
                          className="bg-black/40 hover:bg-black/60 border border-white/5 text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                        >
                          Request APK Link
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submission Form / Scorecard details */}
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    {project.status === 'Available' && (
                      <>
                        {submittingPracId === project.id ? (
                          <form onSubmit={(e) => handlePracSubmit(e, project.id)} className="space-y-2 animate-fadeIn">
                            <input
                              type="url"
                              value={pracGitLink}
                              onChange={(e) => setPracGitLink(e.target.value)}
                              placeholder="Your Git Solution Link (e.g. Github)"
                              required
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-brand-primary outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="flex-1 bg-brand-primary text-black font-semibold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3 text-black" /> Submit Solutions
                              </button>
                              <button
                                type="button"
                                onClick={() => setSubmittingPracId(null)}
                                className="bg-[#121214] text-gray-400 px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-white/5 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => setSubmittingPracId(project.id)}
                            className="w-full bg-[#1b1b20] hover:bg-white/5 border border-white/5 text-gray-300 hover:text-white py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center block"
                          >
                            Submit Git Repository link
                          </button>
                        )}
                      </>
                    )}

                    {project.status === 'Submitted' && (
                      <div className="bg-[#121215] p-3 rounded-lg border border-white/5 space-y-1">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Submitted Solution</span>
                        <p className="text-[10px] text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">{project.submittedGit}</p>
                        <p className="text-[9px] text-amber-400 mt-1 font-semibold flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-amber-400" /> Expert grading will take up to 24 hours.
                        </p>
                      </div>
                    )}

                    {project.status === 'Graded' && (
                      <div className="space-y-3 bg-[#0d0d0f] p-3.5 rounded-xl border border-white/5">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Audit Scorecard</span>
                        
                        {/* Grades Grid */}
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-black/40 p-1.5 rounded border border-white/5">
                            <span className="block text-[8px] text-gray-500">Quality</span>
                            <span className="text-xs font-bold text-emerald-400">{project.performance.codeQuality}</span>
                          </div>
                          <div className="bg-black/40 p-1.5 rounded border border-white/5">
                            <span className="block text-[8px] text-gray-500">Security</span>
                            <span className="text-xs font-bold text-emerald-400">{project.performance.security}</span>
                          </div>
                          <div className="bg-black/40 p-1.5 rounded border border-white/5">
                            <span className="block text-[8px] text-gray-500">Speed</span>
                            <span className="text-xs font-bold text-brand-secondary">{project.performance.performance}</span>
                          </div>
                          <div className="bg-black/40 p-1.5 rounded border border-white/5">
                            <span className="block text-[8px] text-gray-500">UI/UX</span>
                            <span className="text-xs font-bold text-brand-primary">{project.performance.uiux}</span>
                          </div>
                        </div>

                        {/* Reviewer Comment */}
                        <div className="text-[10px] text-gray-400 flex items-start gap-1.5 border-t border-white/5 pt-2">
                          <FontAwesomeIcon icon={faComment} className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                          <p className="italic">"{project.reviewerFeedback}"</p>
                        </div>

                        {/* Book Review Button */}
                        <button
                          onClick={() => {
                            bookSession('Project Review', '2026-06-16', '03:00 PM - 03:45 PM');
                            navigate('/sessions');
                          }}
                          className="w-full bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-bold py-1.5 rounded-lg text-[9px] border border-brand-primary/20 transition-all cursor-pointer text-center block"
                        >
                          Book Slot Session For Code Review
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Submissions Panel */}
        {activeTab === 'my' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white">My Completed & Pending Submissions</h2>
              <p className="text-xs text-gray-400 mt-1">
                A historical log of your client contributions and graded template reviews. Check points logs, branches details, and feedback notes.
              </p>
            </div>

            {submittedLiveSubmodules.length === 0 && submittedPractice.length === 0 ? (
              <div className="glass-panel rounded-2xl border border-white/5 p-12 text-center">
                <FontAwesomeIcon icon={faFolderOpen} className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white">No submissions recorded</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  You haven't submitted any templates or completed client submodules yet. Select the tabs to start.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Client Live submodules history */}
                {submittedLiveSubmodules.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Client Live Tasks ({submittedLiveSubmodules.length})</h3>
                    <div className="space-y-2">
                      {submittedLiveSubmodules.map((sub, i) => (
                        <div key={i} className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{sub.title}</h4>
                              <span className="text-[9px] text-gray-400 font-medium">({sub.projectTitle})</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-semibold">Company: {sub.company}</p>
                            <a href={sub.gitLink} className="text-[10px] text-brand-primary hover:underline flex items-center gap-1" target="_blank" rel="noreferrer">
                              <span>Source Code Link</span> <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[8px]" />
                            </a>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                              +{sub.points} XP Earned
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              sub.status === 'Completed'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            }`}>
                              {sub.status === 'Completed' ? 'Merged' : 'Pending Review'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practice projects history */}
                {submittedPractice.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Practice Audits ({submittedPractice.length})</h3>
                    <div className="space-y-2">
                      {submittedPractice.map((proj, i) => (
                        <div key={i} className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                            <p className="text-[10px] text-gray-500 font-medium">Starter Code: <a href={proj.githubLink} className="hover:underline text-gray-400" target="_blank" rel="noreferrer">View Template</a></p>
                            <a href={proj.submittedGit} className="text-[10px] text-brand-primary hover:underline flex items-center gap-1" target="_blank" rel="noreferrer">
                              <span>My Solution URL</span> <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[8px]" />
                            </a>
                          </div>

                          <div className="flex items-center gap-3">
                            {proj.status === 'Graded' ? (
                              <div className="flex flex-col items-end gap-1.5">
                                <span className="text-[9px] text-gray-500 font-bold">AVG AUDIT GRADE: <strong className="text-xs text-emerald-400 font-extrabold">{proj.performance.codeQuality}</strong></span>
                                <button
                                  onClick={() => { setActiveTab('practice'); }}
                                  className="text-[9px] font-bold text-brand-primary hover:underline"
                                >
                                  View Scorecard & Feedback
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-full">
                                Audit In Progress
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Live Project Code Submission Modal */}
      {selectedSubmodule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedSubmodule(null)} />
          
          {/* Modal Panel */}
          <div className="glass-panel border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl relative z-10 animate-fadeIn space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faFolderOpen} className="w-5 h-5 text-brand-primary" />
              Submit Test Solution Code
            </h3>
            
            <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-1 text-xs">
              <p className="font-semibold text-white">Submodule: {selectedSubmodule.title}</p>
              <p className="text-[10px] text-emerald-400">Award on approval: <strong>+{selectedSubmodule.points} XP</strong></p>
              <p className="text-[10px] text-gray-500">Assigned Branch: <strong className="text-gray-300 font-mono">{selectedSubmodule.branch}</strong></p>
            </div>

            <form onSubmit={handleLiveSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">GitHub Pull Request / Code link</label>
                <input
                  type="url"
                  value={liveGitLink}
                  onChange={(e) => setLiveGitLink(e.target.value)}
                  placeholder="https://github.com/company/repo/pull/123"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-brand-primary outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSelectedSubmodule(null)}
                  className="bg-[#121214] text-gray-400 px-4 py-2 rounded-lg border border-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary-hover text-black px-4 py-2 rounded-lg cursor-pointer"
                >
                  Submit Code Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}