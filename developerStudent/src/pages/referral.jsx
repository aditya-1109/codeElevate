import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Copy, Check, Share2, Award, Sparkles, AlertCircle } from 'lucide-react';

export default function Referral() {
  const { profileData, walletPoints } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralCode = profileData.referralCode || 'NOTAVAILABLE';
  const shareLink = `http://student.codelevate.tech/register?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fade-in overflow-y-auto">
      
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-violet-900/40 to-purple-900/20 border border-white/5 p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
            <Sparkles size={12} />
            Referral Program
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Invite Friends, Earn Rewards
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Share the CodeElevate experience with your developers network. They will receive <span className="text-violet-400 font-semibold">₹100 discount</span> off their registration fee, and you get credited <span className="text-violet-400 font-semibold">₹100 worth of bonus points</span> directly into your wallet when they join!
          </p>
        </div>
      </div>

      {/* Main Referral Section */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Referral Code details */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gift className="text-violet-400" size={18} />
              Your Referral Code
            </h3>
            <p className="text-xs text-zinc-400">
              Share this code with your friends to give them a ₹100 discount when they register.
            </p>
          </div>

          <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">CODE</p>
              <p className="text-2xl font-black text-white font-mono tracking-wider mt-1">{referralCode}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-500/10 cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sharing Link Section */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="text-violet-400" size={18} />
              Personal Invite Link
            </h3>
            <p className="text-xs text-zinc-400">
              New students using this link will have your referral code pre-filled automatically.
            </p>
          </div>

          <div className="bg-[#121215] border border-white/5 rounded-2xl p-3 pl-4 flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-400 font-mono truncate select-all">{shareLink}</p>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Wallet Balance Info */}
      <div className="glass-panel border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <Award size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Your Wallet Balance</p>
              <h4 className="text-xl font-bold text-white mt-0.5">{walletPoints} points</h4>
            </div>
          </div>
          <div className="text-xs text-zinc-400 max-w-sm flex gap-2 bg-[#121215] p-3 rounded-xl border border-white/5">
            <AlertCircle size={16} className="text-zinc-500 shrink-0" />
            <span>Referrals are credited to your wallet balance once the admin verifies and approves the referred student.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
