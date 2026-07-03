import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faAward,
  faCheckCircle,
  faExclamationCircle,
  faFileAlt,
  faUpload,
  faCalendarAlt,
  faEdit,
  faArrowRight,
  faEye,
  faThLarge,
  faBriefcase,
  faExternalLinkAlt,
  faGlobe,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useMemo } from 'react';

export default function Profile() {
  const { profileData, updateProfile, liveProjects, practiceProjects, updateResume } = useApp();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'hr'
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [newResumeUrl, setNewResumeUrl] = useState(profileData.resumeUrl || '');

  // Local edit states
  const [title, setTitle] = useState(profileData.title || '');
  const [bio, setBio] = useState(profileData.bio || '');
  const [phone, setPhone] = useState(profileData.phone || '');
  const [github, setGithub] = useState(profileData.github || '');

  // Synchronize local states when profile data is fetched/loaded
  useEffect(() => {
    setNewResumeUrl(profileData.resumeUrl || '');
    setTitle(profileData.title || '');
    setBio(profileData.bio || '');
    setPhone(profileData.phone || '');
    setGithub(profileData.github || '');
  }, [profileData]);

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfile({ title, bio, phone, github });
    setIsEditing(false);
  };

  // Format dynamic resume upload date based on student profile creation
  const formattedUploadDate = useMemo(() => {
    if (!profileData.createdAt) return 'Recently';
    try {
      return new Date(profileData.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  }, [profileData.createdAt]);

  // Calculate highest rated skill dynamically for language audit display
  const topSkill = useMemo(() => {
    if (!profileData.skills || profileData.skills.length === 0) {
      return { name: "React / JS", level: 70 };
    }
    return profileData.skills.reduce((prev, current) => (prev.level > current.level) ? prev : current);
  }, [profileData.skills]);


  // Find merged live submodules
  const mergedLiveSubmodules = liveProjects.flatMap(p => 
    p.submodules.filter(sub => sub.status === 'Completed').map(sub => ({ ...sub, projectTitle: p.title, company: p.company }))
  );

  // Find graded practice templates
  const gradedTemplates = practiceProjects.filter(p => p.status === 'Graded');

  return (
    <div className="space-y-6">
      {/* Tab/Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 border border-white/5 rounded-2xl p-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            My Professional Portfolio
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Manage public details and review how hiring HRs view your achievements.
          </p>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex bg-black p-1 rounded-lg border border-white/10 shrink-0">
          <button
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-brand-primary text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
            <span>Student Editor</span>
          </button>
          <button
            onClick={() => setViewMode('hr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'hr'
                ? 'bg-brand-primary text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
            <span>HR Preview Mode</span>
          </button>
        </div>
      </div>

      {/* Editor view */}
      {viewMode === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Profile Card & Info Editor */}
          <div className="space-y-6">
            <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col items-center text-center">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-white/10 shadow-xl"
                />
                
                <h3 className="text-base font-bold text-white mt-4">{profileData.name}</h3>
                <p className="text-xs text-brand-primary font-medium mt-1">{profileData.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{profileData.email}</p>

                {/* Progress card */}
                <div className="w-full bg-[#121215] border border-white/5 p-4 rounded-xl mt-5 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Profile Verified Status</span>
                    {profileData.isHrVerified ? (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">VERIFIED</span>
                    ) : (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">PENDING</span>
                    )}
                  </div>
                  
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        profileData.isHrVerified ? 'bg-brand-primary' : 'bg-amber-500'
                      }`}
                      style={{ width: `${profileData.verifiedProgress}%` }}
                    />
                  </div>

                  <p className="text-[9px] text-gray-500 leading-normal">
                    {profileData.isHrVerified
                      ? 'Congratulations! Your profile is verified. Recruiting companies can now access your GitHub scorecards.'
                      : 'Complete your profile information and book a verification review session to unlock the premium HR badge.'}
                  </p>

                  {!profileData.isHrVerified && (
                    <button
                      onClick={() => navigate('/sessions')}
                      className="w-full bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-bold py-1.5 rounded-lg text-[9px] border border-brand-primary/20 transition-all cursor-pointer text-center block"
                    >
                      Book Profile Review Session Slot
                    </button>
                  )}
                </div>
              </div>

              {/* Form editing toggle */}
              <div className="mt-6 pt-4 border-t border-white/5">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-[#1b1b20] hover:bg-white/5 border border-white/5 text-gray-200 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    Edit Profile Details
                  </button>
                ) : (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Profile Subtitle</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-brand-primary"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Personal Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows="3"
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp / Contact No.</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">GitHub Username</label>
                      <input
                        type="text"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div className="flex gap-2 text-xs font-semibold">
                      <button
                        type="submit"
                        className="flex-1 bg-brand-primary text-black py-1.5 rounded-lg cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-[#121214] border border-white/5 text-gray-400 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Github stats and Scorecard details */}
          <div className="lg:col-span-2 space-y-6">
            {/* GitHub Sync */}
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faGithub} className="w-5 h-5 text-gray-300" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">GitHub Audit Sync</h3>
                </div>
                <span className="text-[10px] text-gray-400">Account: <strong>github.com/{profileData.github}</strong></span>
              </div>

              {/* GitHub Cards Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 text-center">
                  <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-wider">Commits This Month</span>
                  <span className="text-xl font-extrabold text-white mt-1 block">{profileData.githubStats.commitsThisMonth}</span>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 text-center">
                  <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-wider">Merged PRs (Clients)</span>
                  <span className="text-xl font-extrabold text-brand-secondary mt-1 block">{profileData.githubStats.mergedPRs}</span>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 text-center">
                  <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-wider">Daily Streak</span>
                  <span className="text-xl font-extrabold text-brand-primary mt-1 block">{profileData.githubStats.streakDays} days 🔥</span>
                </div>
              </div>

              {/* Commits logs */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Audited Commit Logs</span>
                <div className="space-y-2 bg-[#0c0c0e] p-3 rounded-xl border border-white/5">
                  {profileData.githubStats.recentCommits.map(commit => (
                    <div key={commit.id} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-gray-300 truncate max-w-sm">{commit.message}</span>
                      <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">{commit.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Scorecard */}
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <FontAwesomeIcon icon={faAward} className="w-5 h-5 text-brand-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Performance Scorecard Metrics</h3>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-semibold">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-brand-primary">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-brand-primary transition-all duration-500 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Uploader */}
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5 text-gray-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Developer Resume Management</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 p-4 border border-white/5 rounded-xl">
                <div className="p-3 bg-white/5 text-brand-primary rounded-xl">
                  <FontAwesomeIcon icon={faFileAlt} className="w-8 h-8 text-brand-primary" />
                </div>
                {isEditingResume ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newResumeUrl}
                      onChange={(e) => setNewResumeUrl(e.target.value)}
                      placeholder="Resume PDF URL or filename"
                      id="resume-url-input"
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-brand-primary"
                    />
                    <button
                      onClick={() => {
                        updateResume(newResumeUrl);
                        setIsEditingResume(false);
                      }}
                      id="save-resume-button"
                      className="bg-brand-primary text-black px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingResume(false)}
                      className="bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-lg text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    {profileData.resumeUrl ? (
                      <>
                        <h4 className="text-xs font-bold text-white">{profileData.resumeUrl}</h4>
                        <p className="text-[10px] text-gray-500">PDF format • Uploaded on {formattedUploadDate}</p>
                      </>
                    ) : (
                      <>
                        <h4 className="text-xs font-bold text-gray-400">No resume uploaded yet</h4>
                        <p className="text-[10px] text-gray-500">Add a resume link to share with recruiting companies</p>
                      </>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  {!isEditingResume && (
                    <button
                      onClick={() => {
                        setIsEditingResume(true);
                      }}
                      id="replace-resume-button"
                      className="bg-black/60 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      {profileData.resumeUrl ? 'Replace' : 'Upload'}
                    </button>
                  )}
                  {profileData.resumeUrl ? (
                    <a
                      href={profileData.resumeUrl.startsWith('http') ? profileData.resumeUrl : `#${profileData.resumeUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-brand-primary hover:bg-brand-primary-hover text-black px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1"
                    >
                      <span>Download</span> 
                      <FontAwesomeIcon icon={faDownload} className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="bg-zinc-900 text-zinc-600 px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-white/5 cursor-not-allowed opacity-50 flex items-center gap-1"
                    >
                      <span>Download</span>
                      <FontAwesomeIcon icon={faDownload} className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HR View Preview */}
      {viewMode === 'hr' && (
        <div className="max-w-4xl mx-auto bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 space-y-8 relative overflow-hidden animate-fadeIn">
          {/* Neon Glow Spotlights */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none translate-y-12 -translate-x-12" />

          {/* HR Top Bar */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-lg"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{profileData.name}</h1>
                  {profileData.isHrVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-emerald-400" /> Verified Candidate
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3 text-amber-400" /> Pending Audit
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-primary font-semibold">{profileData.title}</p>
                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 pt-0.5 font-semibold">
                  {profileData.github ? (
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faGithub} className="w-3.5 h-3.5" /> github.com/{profileData.github}
                    </span>
                  ) : (
                    <span className="text-gray-600 italic">GitHub not linked</span>
                  )}
                  <span>•</span>
                  <span>{profileData.email}</span>
                  <span>•</span>
                  {profileData.phone ? (
                    <span>{profileData.phone}</span>
                  ) : (
                    <span className="text-gray-600 italic">Phone not linked</span>
                  )}
                </div>
              </div>
            </div>
 
            <div className="flex flex-row md:flex-col gap-2 shrink-0">
              <a 
                href={`mailto:${profileData.email}`}
                className="glow-btn bg-brand-primary hover:bg-brand-primary-hover text-black px-4 py-2 rounded-lg text-xs font-bold text-center block transition-all shadow-md"
              >
                Contact Candidate
              </a>
              {profileData.resumeUrl ? (
                <a
                  href={profileData.resumeUrl.startsWith('http') ? profileData.resumeUrl : `#${profileData.resumeUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-black border border-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold text-center block transition-all"
                >
                  Download Resume PDF
                </a>
              ) : (
                <button
                  disabled
                  className="bg-black/40 border border-white/5 text-gray-600 px-4 py-2 rounded-lg text-xs font-semibold text-center block cursor-not-allowed opacity-50"
                >
                  No Resume PDF
                </button>
              )}
            </div>
          </div>

          {/* Profile Bio */}
          <div className="relative z-10 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Personal Statement</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              {profileData.bio}
            </p>
          </div>

          {/* Audited Scorecard Metrics */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Audited Ratings */}
            <div className="space-y-3 bg-black/40 border border-white/5 p-5 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2.5">
                Verified Skill Set Scores
              </h3>
              
              <div className="space-y-3">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-semibold">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-brand-primary font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Commits details */}
            <div className="space-y-3 bg-black/40 border border-white/5 p-5 rounded-2xl justify-between flex flex-col">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2.5 flex items-center justify-between">
                  <span>GitHub Synchronization</span>
                  <FontAwesomeIcon icon={faGithub} className="w-4 h-4 text-gray-400" />
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commits (Month):</span>
                    <strong className="text-white font-bold">{profileData.githubStats.commitsThisMonth}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Merged Client PRs:</span>
                    <strong className="text-brand-secondary font-bold">{profileData.githubStats.mergedPRs}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Language Audit:</span>
                    <strong className="text-brand-primary font-bold">
                      {topSkill.name.split(" ")[0]} ({topSkill.level}%)
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-gray-500 font-semibold leading-relaxed">
                * Sync log includes continuous git commit auditing, pull request verifications, and quality diagnostics.
              </div>
            </div>
          </div>

          {/* Project Contributions Achievements */}
          <div className="relative z-10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Verified Project Contributions</h3>

            <div className="space-y-3">
              {/* Client Merged Contributions */}
              {mergedLiveSubmodules.map((sub, i) => (
                <div key={i} className="p-4 bg-black/40 border border-white/5 hover:border-brand-primary/20 rounded-xl flex items-center justify-between gap-4 transition-all animate-fadeIn">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">MERGED CODE</span>
                      <h4 className="text-xs font-bold text-white">{sub.title}</h4>
                    </div>
                    <p className="text-[10px] text-gray-500">Client project: <strong>{sub.projectTitle} ({sub.company})</strong></p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">Awarded +{sub.points} XP</span>
                </div>
              ))}

              {/* Graded practice projects */}
              {gradedTemplates.map((proj, i) => (
                <div key={i} className="p-4 bg-black/40 border border-white/5 hover:border-brand-primary/20 rounded-xl flex items-center justify-between gap-4 transition-all animate-fadeIn">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-brand-primary bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 animate-pulse-glow">AUDITED SOLUTION</span>
                      <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">"Reviewer: {proj.reviewerFeedback}"</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-500 font-bold block uppercase">Quality Grade</span>
                    <strong className="text-xs font-extrabold text-emerald-400 uppercase">{proj.performance.codeQuality}</strong>
                  </div>
                </div>
              ))}

              {mergedLiveSubmodules.length === 0 && gradedTemplates.length === 0 && (
                <p className="text-[10px] text-gray-500 italic">No verified project contributions recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
