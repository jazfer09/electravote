import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, ArrowRight, Smartphone, Fingerprint, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useVoting } from '../context/VotingContext';
import { DEMO_USERS } from '../data/initialData';
import { UserRole } from '../types/voting';

interface LoginViewProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onCancel }) => {
  const { initiateLogin, verifyMfaCode, mfaPending, cancelMfa } = useVoting();

  const [email, setEmail] = useState('voter@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Step 1: ID & Password Submit
  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = initiateLogin(email);
      setIsSubmitting(false);
      if (res.success) {
        setInfoMessage(res.message);
        setOtpCode(res.otp || '849201'); // Pre-fill for instant frictionless demo experience
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  // Handle Step 2: MFA OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = verifyMfaCode(otpCode);
      setIsSubmitting(false);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  // Quick preset account selector
  const handleSelectDemoAccount = (role: UserRole) => {
    const user = DEMO_USERS.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword('securePassword123');
      setErrorMessage('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-[1px] shadow-lg shadow-blue-500/20 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {mfaPending ? 'Two-Factor Verification' : 'Electoral Portal Access'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {mfaPending
              ? 'Enter the 6-digit cryptographic security code to authenticate your voter session.'
              : 'Institutional voter authentication with zero-knowledge cryptographic safeguards.'}
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 rounded-xl bg-blue-950/70 border border-blue-500/40 text-blue-200 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* STEP 1: Email and Password Form */}
        {!mfaPending ? (
          <form onSubmit={handleInitiate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Voter ID or Institutional Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. voter@university.edu"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password or Digital Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white py-2.5 px-4 text-sm font-semibold shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating Credentials...</span>
                </>
              ) : (
                <>
                  <span>Continue to 2FA Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Credentials Box */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-2.5">
                Select 1-Click Demo Persona
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('voter')}
                  className={`p-2 rounded-xl border text-center transition ${
                    email === 'voter@university.edu'
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold leading-tight truncate">Elena V.</span>
                  <span className="text-[10px] text-slate-400">Voter</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('admin')}
                  className={`p-2 rounded-xl border text-center transition ${
                    email === 'admin@election.org'
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold leading-tight truncate">Marcus R.</span>
                  <span className="text-[10px] text-slate-400">Commissioner</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('auditor')}
                  className={`p-2 rounded-xl border text-center transition ${
                    email === 'auditor@auditboard.org'
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold leading-tight truncate">Dr. Aris T.</span>
                  <span className="text-[10px] text-slate-400">Auditor</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* STEP 2: MFA 2FA Code Input Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-300 mb-1">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span>Security Token Generated</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Destination: <span className="text-white font-mono">{mfaPending.sentTo}</span>
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/80 border border-blue-500/30 text-xs font-mono text-sky-300">
                <span>Demo Code:</span>
                <span className="font-bold tracking-widest text-white">{mfaPending.expectedOtp}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 text-center">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="849201"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest text-sky-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition tabular-nums"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelMfa}
                className="w-1/3 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 py-2.5 px-3 text-xs font-semibold transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={otpCode.length < 6 || isSubmitting}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white py-2.5 px-4 text-xs font-semibold shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Proof...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize Session</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setOtpCode(mfaPending.expectedOtp)}
                className="text-[11px] text-sky-400 hover:text-sky-300 underline"
              >
                Click here to auto-fill security code ({mfaPending.expectedOtp})
              </button>
            </div>
          </form>
        )}

        {/* Security watermark footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span>End-to-End Cryptographic Seal</span>
          <span>WebAuthn / TOTP Ready</span>
        </div>
      </div>
    </div>
  );
};
