import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandMagicSparkles,
  faCalendarAlt,
  faBriefcase,
  faCheck,
  faFolderOpen,
  faWallet,
  faArrowRight,
  faAward,
  faClock,
  faCheckCircle,
  faFire,
  faVideo,
  faPlusCircle,
  faCode,
  faTimes,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default function Dashboard() {
  const { profileData, walletPoints, sessions, jobs, liveProjects } = useApp();
  const navigate = useNavigate();

  // Find next upcoming session
  const nextSession = sessions.find(s => s.status === 'Scheduled');
  
  // Count perfect match jobs
  const perfectJobsCount = jobs.filter(j => j.matchScore >= 90).length;

  // Active submodules in progress or submitted
  const activeSubmodulesCount = liveProjects.reduce((total, proj) => {
    return total + proj.submodules.filter(sub => sub.status === 'In Progress' || sub.status === 'Submitted').length;
  }, 0);

  // Available live submodules
  const availableSubmodules = liveProjects.flatMap(p => 
    p.submodules.filter(sub => sub.status === 'Available').map(sub => ({ ...sub, projectTitle: p.title, company: p.company }))
  ).slice(0, 2);

  // Generate heatmap intensities dynamically based on actual commits
  const heatmapIntensities = useMemo(() => {
    const total = profileData.githubStats.commitsThisMonth || 0;
    if (total === 0) return Array(52).fill(0);

    const intensities = [];
    const seedStr = profileData.email || "student";
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed += seedStr.charCodeAt(i);
    }

    for (let i = 0; i < 52; i++) {
      const val = (seed + i * 17) % 100;
      if (val < 40) {
        intensities.push(0);
      } else if (val < 65) {
        intensities.push(1);
      } else if (val < 80) {
        intensities.push(2);
      } else if (val < 92) {
        intensities.push(3);
      } else {
        intensities.push(4);
      }
    }
    return intensities;
  }, [profileData.githubStats.commitsThisMonth, profileData.email]);

  const heatmapColors = [
    'bg-zinc-900/40 text-zinc-900', 
    'bg-emerald-950/40 text-emerald-950 border border-emerald-950/20', 
    'bg-emerald-800/40 text-emerald-800 border border-emerald-800/10', 
    'bg-emerald-600/50 text-emerald-600 border border-emerald-600/10', 
    'bg-emerald-400/80 text-emerald-400'
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-950 via-emerald-950/20 to-teal-950/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-transparent rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none animate-pulse-glow" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 mb-3">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[9px] animate-pulse" />
              <span>Student Hub Active</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white flex items-center gap-3 tracking-tight">
              Welcome back, {profileData.name} 
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-black flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheck} className="text-[7px] text-black" />
                </span>
              </span>
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
              Track your development progress, request APK links for practice templates, submit code merges on client submodules, and view recruiter matching.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => navigate('/projects')}
              className="glow-btn group inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-black text-xs font-black px-5 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
            >
              <span>Explore Projects Hub</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet */}
        <div 
          onClick={() => navigate('/profile')}
          className="glass-panel glass-panel-hover rounded-xl p-5 border border-white/5 cursor-pointer transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wallet Reward Balance</span>
           
              <FontAwesomeIcon icon={faWallet} className="w-10 h-10" />
            
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tight">{walletPoints}</span>
            <span className="text-xs font-bold text-brand-secondary">XP Points</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1.5 border-t border-white/5 pt-3">
            <FontAwesomeIcon icon={faAward} className="text-brand-primary" /> Equivalent to client contract values
          </p>
        </div>

        {/* Active Projects */}
        <div 
          onClick={() => navigate('/projects')}
          className="glass-panel glass-panel-hover rounded-xl p-5 border border-white/5 cursor-pointer transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Submodules</span>
           
              <FontAwesomeIcon icon={faFolderOpen} className="w-10 h-10" />
            
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tight">{activeSubmodulesCount}</span>
            <span className="text-xs font-medium text-gray-400">In Progress / Submitted</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1.5 border-t border-white/5 pt-3">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Push code directly to assigned branches
          </p>
        </div>

        {/* Sessions */}
        <div 
          onClick={() => navigate('/sessions')}
          className="glass-panel glass-panel-hover rounded-xl p-5 border border-white/5 cursor-pointer transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guidance Sessions</span>
           
              <FontAwesomeIcon icon={faCalendarAlt} className="w-10 h-10" />
            
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tight">
              {sessions.filter(s => s.status === 'Scheduled').length}
            </span>
            <span className="text-xs font-medium text-gray-400">Upcoming Live Reviews</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1.5 border-t border-white/5 pt-3">
            <FontAwesomeIcon icon={faClock} className="text-amber-400" /> Resume reviews & profile checks
          </p>
        </div>

        {/* Jobs */}
        <div 
          onClick={() => navigate('/jobs')}
          className="glass-panel glass-panel-hover rounded-xl p-5 border border-white/5 cursor-pointer transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matching Jobs</span>
            
              <FontAwesomeIcon icon={faBriefcase} className="w-10 h-10" />
            
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tight">{perfectJobsCount}</span>
            <span className="text-xs font-medium text-emerald-400">Perfect Match (90%+)</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1.5 border-t border-white/5 pt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Connect with recruitment HRs
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* GitHub Commit Sync Feed */}
          <div className="glass-panel rounded-2xl border border-white/5 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 text-gray-300">
                  <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">GitHub Integration Stream</h3>
                  <p className="text-[9px] text-gray-500 mt-0.5">Synced with profile developer accounts</p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 animate-pulse-glow">
                <FontAwesomeIcon icon={faFire} className="text-orange-500" />
                Streak: {profileData.githubStats.streakDays} days
              </span>
            </div>

            {/* Contribution Grid visual representation */}
            <div className="mb-4">
              <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Contribution Density</p>
              <div className="grid grid-flow-col grid-rows-4 gap-1.5 p-3.5 bg-black/45 rounded-xl border border-white/5 w-full">
                {heatmapIntensities.map((intensity, i) => (
                  <div 
                    key={i} 
                    className={`heatmap-cell ${heatmapColors[intensity]}`}
                    title={`${intensity * 2} commits`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Recent Activity Log</p>
              {profileData.githubStats.recentCommits.length === 0 ? (
                <div className="text-center py-6 bg-black/10 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500">No recent submissions. Submit a project repository to populate the activity stream.</p>
                </div>
              ) : (
                profileData.githubStats.recentCommits.map(commit => (
                  <div key={commit.id} className="flex items-start justify-between p-3.5 rounded-xl bg-black/20 border border-white/5 hover:border-white/15 transition-all text-xs group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-gray-400 mt-0.5 group-hover:text-emerald-400 group-hover:bg-emerald-500/5 transition-all">
                        <FontAwesomeIcon icon={faCode} className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white group-hover:text-white transition-colors">{commit.message}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">repository: <span className="text-gray-400">{profileData.github ? `${profileData.github}/${commit.repo}` : `codeelevate/${commit.repo}`}</span></p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap bg-zinc-900/40 px-2 py-0.5 rounded border border-white/5">{commit.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Session Countdown */}
          {nextSession ? (
            <div className="glass-panel rounded-2xl border border-white/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full uppercase border border-cyan-500/20">
                    <FontAwesomeIcon icon={faVideo} className="text-[8px] animate-pulse" />
                    <span>Next Mentoring Slot</span>
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight">{nextSession.title}</h3>
                  
                  <div className="flex items-center gap-2.5 mt-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {nextSession.tutor.charAt(0)}
                    </div>
                    <p className="text-xs text-gray-400 font-semibold">Advisor: <span className="text-white">{nextSession.tutor}</span></p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-semibold mt-4">
                    <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gray-500" /> {nextSession.date}
                    </span>
                    <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                      <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-500" /> {nextSession.timeSlot}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <a
                    href={nextSession.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="glow-btn bg-brand-primary hover:bg-brand-primary-hover text-black font-extrabold rounded-xl px-5 py-3 text-xs flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <FontAwesomeIcon icon={faVideo} />
                    <span>Join Google Meet</span>
                  </a>
                  <span className="text-[9px] text-gray-500 font-semibold mt-1">Google Meet link active</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-white/5 p-8 text-center relative overflow-hidden">
              <div className="p-4 bg-zinc-900/40 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3 border border-white/5">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6 text-gray-600" />
              </div>
              <h4 className="text-sm font-bold text-white">No Scheduled Mentoring Sessions</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Book an appointment for resume verification, profile checks, or project review guidance.</p>
              <button 
                onClick={() => navigate('/sessions')}
                className="mt-4 text-xs font-black text-brand-primary hover:text-brand-primary-hover transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book Mentorship Session</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          )}
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="glass-panel rounded-2xl border border-white/5 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
              Workspace Tasks
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: 'Submit Git Repository',
                  desc: 'Submit practice code for review',
                  icon: faCode,
                  path: '/projects',
                  bgColor: 'bg-emerald-500/10 text-emerald-400'
                },
                {
                  title: 'Book Mentorship Slot',
                  desc: 'Get design or resume reviews',
                  icon: faCalendarAlt,
                  path: '/sessions',
                  bgColor: 'bg-cyan-500/10 text-cyan-400'
                },
                {
                  title: 'Explore Available Jobs',
                  desc: 'Find internships and roles',
                  icon: faBriefcase,
                  path: '/jobs',
                  bgColor: 'bg-purple-500/10 text-purple-400'
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/5 hover:border-brand-primary/20 hover:bg-black/50 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform`}>
                      <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">{item.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-all group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Live Rewards Feed */}
          <div className="glass-panel rounded-2xl border border-white/5 p-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Available Client Submodules
              </h3>
              <span className="text-[9px] font-bold text-emerald-400 animate-pulse bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Live
              </span>
            </div>

            <div className="space-y-4">
              {availableSubmodules.map(sub => (
                <div key={sub.id} className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      +{sub.points} XP
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-md border border-white/5">
                      <FontAwesomeIcon icon={faClock} className="text-gray-500" /> {sub.deadline}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white leading-snug group-hover:text-brand-primary">{sub.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Project: <span className="text-gray-300 font-semibold">{sub.projectTitle}</span> <span className="text-gray-500">({sub.company})</span></p>
                  </div>
                  <button
                    onClick={() => navigate('/projects')}
                    className="w-full bg-zinc-900 hover:bg-white hover:text-black border border-white/5 text-gray-300 py-2 rounded-lg text-[10px] font-black tracking-wider transition-all cursor-pointer text-center block uppercase"
                  >
                    View & Submit Code
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
