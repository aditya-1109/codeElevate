import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { apiFunction } from '../api/apiFunction';
import { authApis } from '../api/apis';
import {
  User, Mail, Lock, Phone, Code, FileText, ChevronRight,
  ChevronLeft, QrCode, CheckCircle, AlertCircle, Percent, Sparkles
} from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Step 1 states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [title, setTitle] = useState('Junior React Developer');
  const [bio, setBio] = useState('Frontend React developer trainee at CodeElevate.');
  const [referralCode, setReferralCode] = useState('');

  // Referral verification states
  const [verifyingReferral, setVerifyingReferral] = useState(false);
  const [referralName, setReferralName] = useState('');
  const [referralError, setReferralError] = useState('');
  const [referralSuccess, setReferralSuccess] = useState(false);

  // Step state
  const [step, setStep] = useState(1); // 1 | 2 | 3 (success)

  // Step 2 states
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdRequestId, setCreatedRequestId] = useState('');

  // Pre-fill referral code from URL parameter (?ref=XYZ)
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
      autoVerifyReferral(ref);
    }
  }, [searchParams]);

  const autoVerifyReferral = async (code) => {
    if (!code) return;
    setVerifyingReferral(true);
    setReferralError('');
    setReferralSuccess(false);
    setReferralName('');
    try {
      const res = await apiFunction(authApis.validateReferral, [code.trim()], {}, 'GET');
      if (res.data && res.data.success) {
        setReferralSuccess(true);
        setReferralName(res.data.name);
      }
    } catch (err) {
      setReferralError(err.response?.data?.error || 'Referral code is invalid or expired.');
    } finally {
      setVerifyingReferral(false);
    }
  };

  const handleVerifyReferral = async () => {
    if (!referralCode.trim()) {
      setReferralError('Please enter a referral code.');
      return;
    }
    await autoVerifyReferral(referralCode);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setSubmitError('Name, email, and password are required fields.');
      return;
    }
    setStep(2);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setSubmitError('Transaction Reference ID is required to verify your payment.');
      return;
    }
    if (transactionId.trim().length < 8) {
      setSubmitError('Please enter a valid Transaction Reference ID.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const finalAmount = referralSuccess ? 1899 : 1999;
    const payload = {
      name,
      email,
      password,
      phone: phone || null,
      github: github || null,
      title: title || null,
      bio: bio || null,
      referralCodeUsed: referralSuccess ? referralCode.toUpperCase().trim() : null,
      transactionId: transactionId.trim(),
      amountPaid: finalAmount
    };

    try {
      const res = await apiFunction(authApis.registerRequest, [], payload, 'POST');
      if (res.data && res.data.success) {
        setCreatedRequestId(res.data.request.id);
        setStep(3); // Go to success step
      }
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to submit registration request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const amountDue = referralSuccess ? 1899 : 1999;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#09090b] px-4 py-12">
      {/* Background Neon Spotlight Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center gap-2 mb-3">
            <img src="/logoSrt.webp" alt="CodeElevate Logo" className="h-10 w-10 object-contain" />
            <img src="/codeElevate.webp" alt="CodeElevate Title" className="h-7 object-contain" />
          </div>
          
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            Apply to Join CodeElevate
          </h2>
        </div>

        {/* Stepper Header */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 1 ? 'bg-violet-600 text-white' : 'bg-violet-600/20 text-violet-400'
              }`}>1</span>
              <span className={`text-xs font-semibold ${step === 1 ? 'text-zinc-200' : 'text-zinc-500'}`}>Profile details</span>
            </div>
            <div className="h-px bg-zinc-800 w-12" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2 ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-500'
              }`}>2</span>
              <span className={`text-xs font-semibold ${step === 2 ? 'text-zinc-200' : 'text-zinc-500'}`}>Fee payment</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="glass-panel rounded-2xl border border-white/5 p-8 shadow-2xl relative">
          
          {/* STEP 1: Profile details */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Step 1: Account Credentials & Details</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      required
                      type="text"
                      className="w-full bg-[#121214] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      required
                      type="email"
                      className="w-full bg-[#121214] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      required
                      type="password"
                      className="w-full bg-[#121214] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="tel"
                      className="w-full bg-[#121214] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="e.g. +91 99999 88888"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">GitHub Username</label>
                  <div className="relative">
                    <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      className="w-full bg-[#121214] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="e.g. johndoe"
                      value={github}
                      onChange={e => setGithub(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Student / Job Title</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      className="w-full bg-[#121214] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="e.g. Junior React Developer"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  className="w-full bg-[#121214] border border-white/10 rounded-xl py-2 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
                  placeholder="Describe yourself..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />
              </div>

              {/* Referral Code Field */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wide">Referral Discount (₹100 Off)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      className="w-full bg-[#121214] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 uppercase font-semibold"
                      placeholder="Enter Referral Code"
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={verifyingReferral}
                    onClick={handleVerifyReferral}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all border border-zinc-700 disabled:opacity-50 cursor-pointer"
                  >
                    {verifyingReferral ? 'Checking…' : 'Apply'}
                  </button>
                </div>
                {referralError && (
                  <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} />{referralError}</p>
                )}
                {referralSuccess && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={12} /> Discount applied! Referred by {referralName}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} />{submitError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-violet-500/20 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ChevronRight size={16} />
              </button>
            </form>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-semibold text-zinc-300">Step 2: Registration Fee Payment</h3>
                <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                  Due: ₹{amountDue}
                </span>
              </div>

              {/* QR Scan Section */}
              <div className="flex flex-col items-center text-center space-y-4">
                <p className="text-xs text-zinc-400 max-w-sm">
                  Scan the UPI QR code below using any payment app (GPay, PhonePe, Paytm) to transfer the amount.
                </p>
                
                {/* QR Code Container */}
                <div className="p-3 bg-white rounded-2xl shadow-xl max-w-[200px]">
                  <img
                    src="/scan.jpeg"
                    alt="UPI QR Code"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>

                <div className="bg-[#121214] border border-white/5 rounded-xl px-4 py-2 text-xs font-mono text-zinc-400">
                  UPI ID: <span className="text-white select-all">codeelevate@upi</span>
                </div>
              </div>

              {/* Transaction ID input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-400">UPI Transaction ID / Reference Number *</label>
                <div className="relative">
                  <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    required
                    type="text"
                    className="w-full bg-[#121214] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono"
                    placeholder="Enter 12-digit transaction ID"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-zinc-500">
                  Please double-check the Transaction ID. Admin will reject request if transaction is not verified.
                </p>
              </div>

              {submitError && (
                <p className="text-xs text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{submitError}</span>
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-violet-500/20 cursor-pointer"
                >
                  <span>{submitting ? 'Submitting…' : 'Submit Registration Request'}</span>
                  <CheckCircle size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Registration Submitted!</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Your registration request has been recorded. The transaction reference ID is being reviewed by the CodeElevate team.
                </p>
              </div>

              <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 text-left max-w-sm mx-auto space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Applicant:</span>
                  <span className="text-zinc-300 font-semibold">{name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Email:</span>
                  <span className="text-zinc-300 font-semibold">{email}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Transaction ID:</span>
                  <span className="text-zinc-300 font-mono font-semibold">{transactionId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Paid Amount:</span>
                  <span className="text-violet-400 font-bold">₹{amountDue}</span>
                </div>
              </div>

              <div className="text-xs text-zinc-500 bg-zinc-900/40 p-3 rounded-xl max-w-md mx-auto">
                Once the admin verifies the payment (usually within a few hours), you will receive confirmation and can log in with your email and password.
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-2.5 text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 cursor-pointer"
              >
                Go to Login Portal
              </button>
            </div>
          )}

        </div>

        {/* Helper Footer Links */}
        {step < 3 && (
          <p className="text-center text-xs text-zinc-500 mt-6">
            Already have an approved account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 hover:underline font-medium">
              Sign In here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
