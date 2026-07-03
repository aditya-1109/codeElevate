import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faFolderOpen,
  faCalendarAlt,
  faUserCheck,
  faBriefcase,
  faTimes,
  faArrowLeft,
  faBolt,
  faCheckCircle,
  faAward
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { 
    profileData, 
    activeProjectsTab, 
    setActiveProjectsTab, 
    activeJobsFilter, 
    setActiveJobsFilter,
    liveProjects,
    practiceProjects,
    jobs
  } = useApp();

  const isProjectsPage = location.pathname.startsWith('/projects');
  const isJobsPage = location.pathname.startsWith('/jobs');

  // Count active live/practice submissions for My Submissions badge
  const submittedPracticeCount = practiceProjects.filter(p => p.status === 'Submitted' || p.status === 'Graded').length;
  const submittedLiveCount = liveProjects.reduce((sum, proj) => 
    sum + proj.submodules.filter(sub => sub.status === 'Submitted' || sub.status === 'Completed').length, 0
  );
  const totalSubmissions = submittedPracticeCount + submittedLiveCount;

  // Count perfect match jobs
  const perfectJobsCount = jobs.filter(j => j.matchScore >= 85 && j.status !== 'Applied').length;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container with group classes and transition widths */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#060608] border-r border-dark-border flex flex-col justify-between transition-all duration-300 ease-in-out group lg:w-16 lg:hover:w-64 w-64 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Header Brand or Back Button */}
          <div className="p-4 border-b border-dark-border min-h-16 flex items-center justify-between">
            {isProjectsPage || isJobsPage ? (
              /* Vercel-style Back to Dashboard Button */
              <NavLink
                to="/"
                onClick={handleLinkClick}
                className="flex items-center gap-3 py-1 text-xs font-semibold text-gray-400 hover:text-white outline-none w-full"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 text-brand-primary shrink-0" />
                <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden font-bold">
                  Back to Dashboard
                </span>
              </NavLink>
            ) : (
              /* Main Brand Logo */
              <NavLink to="/" onClick={handleLinkClick} className="flex items-center gap-2 outline-none">
                <img src="/logoSrt.webp" alt="CodeElevate Logo" className="h-8 w-8 object-contain shrink-0" />
                <img
                  src="/codeElevate.webp"
                  alt="CodeElevate Text"
                  className="h-6 object-contain opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
                />
              </NavLink>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>

          {/* DYNAMIC SIDEBAR LINKS */}

          {/* 1. Projects Page Sidebar */}
          {isProjectsPage && (
            <div className="p-3 space-y-4 mt-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden block">
                Projects Context
              </span>
              <nav className="space-y-1.5">
                {/* Live projects */}
                <button
                  onClick={() => { setActiveProjectsTab('live'); handleLinkClick(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative outline-none cursor-pointer ${
                    activeProjectsTab === 'live'
                      ? 'bg-brand-primary/10 text-white border border-brand-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {activeProjectsTab === 'live' && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-primary rounded-r-md" />
                  )}
                  <FontAwesomeIcon icon={faFolderOpen} className="w-4 h-4 text-brand-primary shrink-0" />
                  <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden flex-1 text-left">
                    Live Client Projects
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    Live
                  </span>
                </button>

                {/* Practice templates */}
                <button
                  onClick={() => { setActiveProjectsTab('practice'); handleLinkClick(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative outline-none cursor-pointer ${
                    activeProjectsTab === 'practice'
                      ? 'bg-brand-primary/10 text-white border border-brand-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {activeProjectsTab === 'practice' && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-primary rounded-r-md" />
                  )}
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden flex-1 text-left">
                    Practice Templates
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    Repo
                  </span>
                </button>

                {/* My Submissions */}
                <button
                  onClick={() => { setActiveProjectsTab('my'); handleLinkClick(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative outline-none cursor-pointer ${
                    activeProjectsTab === 'my'
                      ? 'bg-brand-primary/10 text-white border border-brand-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {activeProjectsTab === 'my' && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-primary rounded-r-md" />
                  )}
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden flex-1 text-left">
                    My Submissions
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    {totalSubmissions}
                  </span>
                </button>
              </nav>
            </div>
          )}

          {/* 2. Jobs Page Sidebar */}
          {isJobsPage && (
            <div className="p-3 space-y-4 mt-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden block">
                Jobs Context
              </span>
              <nav className="space-y-1.5">
                {/* All Available Roles */}
                <button
                  onClick={() => { setActiveJobsFilter('all'); handleLinkClick(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative outline-none cursor-pointer ${
                    activeJobsFilter === 'all'
                      ? 'bg-brand-primary/10 text-white border border-brand-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {activeJobsFilter === 'all' && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-primary rounded-r-md" />
                  )}
                  <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4 text-brand-primary shrink-0" />
                  <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden flex-1 text-left">
                    All Available Roles
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    {jobs.length}
                  </span>
                </button>

                {/* Perfect Matches */}
                <button
                  onClick={() => { setActiveJobsFilter('matches'); handleLinkClick(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative outline-none cursor-pointer ${
                    activeJobsFilter === 'matches'
                      ? 'bg-brand-primary/10 text-white border border-brand-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {activeJobsFilter === 'matches' && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-primary rounded-r-md" />
                  )}
                  <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-brand-secondary shrink-0" />
                  <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden flex-1 text-left">
                    Perfect Matches
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    {perfectJobsCount}
                  </span>
                </button>

                {/* Recently Applied */}
                <button
                  onClick={() => { setActiveJobsFilter('applied'); handleLinkClick(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative outline-none cursor-pointer ${
                    activeJobsFilter === 'applied'
                      ? 'bg-brand-primary/10 text-white border border-brand-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {activeJobsFilter === 'applied' && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-primary rounded-r-md" />
                  )}
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden flex-1 text-left">
                    Recently Applied
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    {jobs.filter(j => j.status === 'Applied').length}
                  </span>
                </button>
              </nav>
            </div>
          )}

          {/* 3. General Main Sidebar */}
          {!isProjectsPage && !isJobsPage && (
            <div className="p-3 space-y-4 mt-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden block">
                Workspace Menu
              </span>
              <nav className="space-y-1.5">
                {[
                  { name: 'Dashboard', path: '/', icon: faHome },
                  { name: 'Projects Hub', path: '/projects', icon: faFolderOpen },
                  { name: 'Mentorship Sessions', path: '/sessions', icon: faCalendarAlt },
                  { name: 'My Profile Portfolio', path: '/profile', icon: faUserCheck },
                  { name: 'Jobs Board', path: '/jobs', icon: faBriefcase },
                  { name: 'Refer & Earn', path: '/referral', icon: faAward },
                ].map((item) => {
                  const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  const icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 outline-none relative group ${
                        active
                          ? 'bg-brand-primary/10 text-white border border-brand-primary/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-primary rounded-r-md" />
                      )}
                      
                      <FontAwesomeIcon icon={icon} className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-brand-primary' : 'text-gray-400 group-hover:text-white'}`} />
                      <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                        {item.name}
                      </span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Footer Sidebar Info (Student status card) - Hidden when collapsed */}
        <div className="p-4 border-t border-dark-border opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 overflow-hidden whitespace-nowrap">
          <div className="bg-[#121215] border border-white/5 rounded-xl p-3 min-w-56">
            <div className="flex items-center gap-2 mb-2">
              {profileData.isHrVerified ? (
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {profileData.isHrVerified ? 'Verified Profile' : 'Incomplete Profile'}
              </span>
            </div>
            
            <p className="text-[10px] text-gray-400 mb-2 leading-relaxed whitespace-normal">
              {profileData.isHrVerified 
                ? 'Your portfolio details are fully verified for enterprise clients.'
                : 'Complete profile details and book slot reviewer verify badge.'}
            </p>

            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-1">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  profileData.isHrVerified ? 'bg-brand-primary' : 'bg-amber-500'
                }`}
                style={{ width: `${profileData.verifiedProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-gray-500 font-semibold">
              <span>Progress</span>
              <span>{profileData.verifiedProgress}%</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
