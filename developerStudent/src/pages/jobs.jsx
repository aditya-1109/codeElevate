import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faMapPin,
  faDollarSign,
  faAward,
  faCommentDots,
  faEnvelope,
  faPhone,
  faCheckCircle,
  faChevronRight,
  faFilter,
  faBolt,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';

export default function Jobs() {
  const { 
    jobs, 
    applyToJob, 
    profileData,
    activeJobsFilter,
    setActiveJobsFilter
  } = useApp();
  
  const filter = activeJobsFilter;
  const setFilter = setActiveJobsFilter;
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || null);

  // Apply filters
  const filteredJobs = jobs.filter(job => {
    if (filter === 'matches') return job.matchScore >= 85 && job.status !== 'Applied';
    if (filter === 'applied') return job.status === 'Applied';
    return true; // 'all'
  });

  const selectedJob = jobs.find(j => j.id === selectedJobId) || filteredJobs[0] || jobs[0];

  const handleApply = (jobId) => {
    applyToJob(jobId);
  };

  return (
    <div className="min-h-[calc(100vh-120px)]">
      {/* Split Pane View */}
      <section className="flex-1 min-w-0 flex flex-col md:flex-row gap-6">
        {/* Left Column: Job Cards List */}
        <div className="w-full md:w-1/2 lg:w-96 shrink-0 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
          {filteredJobs.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center">
              <FontAwesomeIcon icon={faBriefcase} className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No jobs match this filter.</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`glass-panel border rounded-xl p-4 cursor-pointer text-left transition-all ${
                  selectedJobId === job.id || (!selectedJobId && selectedJob?.id === job.id)
                    ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                    : 'border-white/5 bg-black/40 hover:border-white/10 hover:bg-black/55'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{job.title}</h4>
                    <p className="text-[10px] text-brand-primary font-semibold mt-0.5">{job.company}</p>
                  </div>
                  
                  {/* Match Score Badge */}
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                    job.matchScore >= 90
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                      : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'
                  }`}>
                    {job.matchScore}% Match
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[9px] text-gray-500 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faMapPin} className="w-2.5 h-2.5" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faDollarSign} className="w-2.5 h-2.5" /> {job.salary}
                  </span>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {job.skills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="bg-white/5 text-gray-400 text-[8px] px-1.5 py-0.5 rounded border border-white/5 font-semibold">
                      {s}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="bg-white/5 text-gray-500 text-[8px] px-1.5 py-0.5 rounded">
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Application tag */}
                {job.status === 'Applied' && (
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[9px] text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" /> APPLIED
                    </span>
                    <span>Direct HR unlocked</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Column: Detailed Pane */}
        <div className="flex-1 min-w-0">
          {selectedJob ? (
            <div className="glass-panel border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 lg:sticky lg:top-24">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-brand-primary bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                    Job Details
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-1.5">{selectedJob.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                    <span>{selectedJob.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[10px]">
                      <FontAwesomeIcon icon={faMapPin} className="w-3 h-3 text-brand-secondary" /> {selectedJob.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                    {selectedJob.salary}
                  </span>
                  <span className="text-[9px] text-gray-500 font-semibold">Experience: {selectedJob.experience}</span>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2 text-xs leading-relaxed text-gray-300">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Position Overview</h4>
                <p className="font-medium">{selectedJob.description}</p>
              </div>

              {/* Skills required */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skills & Qualifications</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skills.map((s, idx) => (
                    <span key={idx} className="bg-black/55 text-brand-secondary border border-white/5 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply / HR Contact Section */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                {selectedJob.status !== 'Applied' ? (
                  <button
                    onClick={() => handleApply(selectedJob.id)}
                    className="w-full glow-btn bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold rounded-lg py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <FontAwesomeIcon icon={faBolt} className="w-3.5 h-3.5" />
                    <span>Apply for role and unlock direct HR credentials</span>
                  </button>
                ) : (
                  <div className="bg-[#0b0b0e] border border-emerald-500/20 p-5 rounded-2xl space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                      <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Application Sent Successfully!</h4>
                        <p className="text-[9px] text-gray-500 mt-0.5">Your verified scorecards are shared with the recruiter.</p>
                      </div>
                    </div>

                    {/* HR details card */}
                    <div className="space-y-3">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Direct HR Recruitment Contacts</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* WhatsApp */}
                        <a
                          href={selectedJob.hrContact.whatsapp}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/15 transition-all text-left"
                        >
                          <div className="p-2 bg-emerald-500 text-black rounded-lg">
                            <FontAwesomeIcon icon={faCommentDots} className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">Chat WhatsApp</span>
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              Open Chat <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[8px]" />
                            </span>
                          </div>
                        </a>

                        {/* Email */}
                        <a
                          href={`mailto:${selectedJob.hrContact.email}`}
                          className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl hover:bg-black/60 transition-all text-left"
                        >
                          <div className="p-2 bg-white/5 text-gray-300 rounded-lg">
                            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">Send Profile Mail</span>
                            <span className="text-[10px] text-white font-bold truncate block max-w-32">
                              {selectedJob.hrContact.email}
                            </span>
                          </div>
                        </a>
                      </div>

                      {/* Mobile detail block */}
                      <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl text-xs">
                        <div className="flex items-center gap-2 text-gray-400 font-medium">
                          <FontAwesomeIcon icon={faPhone} className="text-brand-primary" />
                          <span>Contact Person: <strong>{selectedJob.hrContact.name}</strong></span>
                        </div>
                        <span className="font-bold text-white font-mono">{selectedJob.hrContact.phone}</span>
                      </div>

                      {/* Instruction */}
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] text-gray-400 leading-relaxed">
                        <strong>Hiring Instructions:</strong> For a faster response, send a brief message to {selectedJob.hrContact.name} over WhatsApp with your verified student portfolio link: <code className="text-brand-secondary bg-black/40 px-1.5 py-0.5 rounded">github.com/{profileData.github}</code> and resume PDF.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel border border-white/5 rounded-2xl p-12 text-center">
              <FontAwesomeIcon icon={faBriefcase} className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">Select a Job Role</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Select a job from the listing panel to view detailed descriptions, required skills, and direct recruiter contact coordinates.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
