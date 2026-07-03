import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faWallet,
  faBell,
  faChevronDown,
  faSignOutAlt,
  faUser,
  faCheckCircle,
  faExclamationCircle,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';

export default function Header({ setSidebarOpen }) {
  const { user, logout, walletPoints, profileData, simulateLiveApproval } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSimNotification, setShowSimNotification] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Simulates that an HR reviewer has merged the student's code
  const triggerSimulation = () => {
    // Find the first submodule that is In Progress or Submitted and simulate approving it
    simulateLiveApproval('sub-2-1'); // Calendar Grid (600 pts)
    setShowSimNotification(true);
    setTimeout(() => {
      setShowSimNotification(false);
    }, 4000);
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-bg/85 backdrop-blur-md border-b border-dark-border py-3 px-4 md:px-8 flex items-center justify-between">
      {/* Left side: Hamburger (mobile) or Brand details */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
        </button>

        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Workspace</span>
          <span className="text-gray-600">/</span>
          <span className="text-xs font-bold text-brand-primary">Student Board</span>
        </div>

        {/* Small brand representation on mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <img src="/logoSrt.webp" alt="CodeElevate Logo" className="h-7 w-7 object-contain" />
          <img src="/codeElevate.webp" alt="CodeElevate" className="h-5 object-contain" />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Simulator Button (Cool utility to test wallet updates) */}
        <button
          onClick={triggerSimulation}
          title="Simulate Review Approval (+600 XP)"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold cursor-pointer transition-all active:scale-95"
        >
          <FontAwesomeIcon icon={faPlayCircle} className="w-3.5 h-3.5" />
          <span>Simulate Merge</span>
        </button>

        {/* Wallet Balance widget */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-white/5 hover:border-brand-primary/20 rounded-xl cursor-pointer transition-all group"
        >
          <div className="p-1 rounded-lg bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform">
            <FontAwesomeIcon icon={faWallet} className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] text-gray-400 uppercase tracking-widest">Wallet</span>
            <span className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors">
              {walletPoints} <span className="text-xs font-medium text-brand-secondary">XP</span>
            </span>
          </div>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer">
            <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full" />
          </button>
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all text-left outline-none border border-transparent hover:border-white/5 cursor-pointer"
          >
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-8 h-8 rounded-lg object-cover border border-white/10"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">{profileData.name}</span>
              <span className="text-[10px] text-gray-400 leading-tight">Student</span>
            </div>
            <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-gray-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay background to close dropdown */}
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

              <div className="absolute right-0 mt-2.5 w-60 bg-dark-card border border-white/10 rounded-xl shadow-2xl p-2 z-20 animate-fadeIn">
                <div className="px-3 py-2 border-b border-white/5 mb-2">
                  <p className="text-xs font-bold text-white">{profileData.name}</p>
                  <p className="text-[10px] text-gray-400 overflow-hidden text-ellipsis">{profileData.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {profileData.isHrVerified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" /> HR Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" /> Profile Unverified
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                >
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
                  My Student Profile
                </button>

                <button
                  onClick={triggerSimulation}
                  className="md:hidden w-full flex items-center gap-2 px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPlayCircle} className="w-4 h-4 text-emerald-400" />
                  Simulate Merge (+600 XP)
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/15 rounded-lg transition-all cursor-pointer mt-1 border-t border-white/5 pt-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 text-red-400" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Simulator Toast Notification */}
      {showSimNotification && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel border border-emerald-500/30 p-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-sm animate-slideIn">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Live Project Merged!</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Code review for "Calendar Grid & Slot Booking UI" approved. <strong>+600 XP</strong> added to your wallet!
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
