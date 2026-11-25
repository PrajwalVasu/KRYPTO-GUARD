import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TargetAudience } from '../../types';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  HeartHandshake,
  UserCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMessage,
    setAuthModalMessage,
    login,
    register,
    authError,
    setAuthError,
    isAuthLoading,
    language,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [audience, setAudience] = useState<TargetAudience>('students');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handleClose = () => {
    setMode('login');
    setLocalError(null);
    setAuthError(null);
    setAuthModalMessage(null);
    setShowAuthModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setAuthError(null);

    // Basic frontend validations
    if (!email.trim() || !password) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters long.');
        return;
      }
      try {
        await register(name.trim(), email.trim(), password, audience);
        handleClose();
      } catch {
        // Error state handled in AppContext
      }
    } else {
      try {
        await login(email.trim(), password);
        handleClose();
      } catch {
        // Error state handled in AppContext
      }
    }
  };

  const personas: { id: TargetAudience; label: string; icon: React.ReactNode }[] = [
    {
      id: 'students',
      label: language === 'hi' ? 'छात्र (Student)' : 'Student',
      icon: <GraduationCap className="w-4 h-4 text-teal-700" />,
    },
    {
      id: 'seniors',
      label: language === 'hi' ? 'वरिष्ठ (Senior)' : 'Senior Citizen',
      icon: <HeartHandshake className="w-4 h-4 text-emerald-700" />,
    },
    {
      id: 'all',
      label: language === 'hi' ? 'परिवार (Family)' : 'General / Family',
      icon: <UserCheck className="w-4 h-4 text-blue-700" />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Banner */}
        <div className="relative bg-gradient-to-br from-[#0F766E] via-[#115E59] to-[#0F172A] p-6 text-white text-center">
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-xl text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-2.5 rounded-2xl bg-white p-1.5 flex items-center justify-center border border-white/40 shadow-md">
            <img src="/logo.png" alt="KRYPTO GUARD Logo" className="w-full h-full object-contain" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>KRYPTOGUARD Shield Account</span>
          </div>

          <h2 id="auth-modal-title" className="text-xl font-extrabold tracking-tight">
            {authModalMessage && mode === 'login'
              ? authModalMessage.title
              : mode === 'login'
              ? language === 'hi'
                ? 'अपने खाते में साइन इन करें'
                : 'Sign In to Your Shield'
              : language === 'hi'
              ? 'नया सुरक्षा खाता बनाएं'
              : 'Create Your Security Account'}
          </h2>
          <p className="text-xs text-teal-100 mt-1 max-w-xs mx-auto">
            {authModalMessage
              ? authModalMessage.message
              : mode === 'login'
              ? 'Access your personalized safety Reflex Score and verified lesson history.'
              : 'Track completed scam lessons and build scam detection reflexes.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex bg-slate-900/40 p-1 rounded-xl mt-4 border border-white/10 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLocalError(null);
                setAuthError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-teal-100 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'साइन इन' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setLocalError(null);
                setAuthError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-teal-100 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'नया खाता' : 'Create Account'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Error Message */}
          {(localError || authError) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{localError || authError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password {mode === 'register' && <span className="text-slate-400 font-normal">(min. 8 characters)</span>}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Your Persona
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {personas.map((p) => {
                    const isSelected = audience === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAudience(p.id)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/80 text-teal-900 font-bold shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p.icon}
                        <span className="text-[11px] leading-tight text-center">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:bg-slate-300 text-white text-sm font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-101 active:scale-98"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? language === 'hi'
                        ? 'साइन इन करें'
                        : 'Sign In'
                      : language === 'hi'
                      ? 'खाता बनाएं'
                      : 'Create Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              {mode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setLocalError(null);
                  setAuthError(null);
                }}
                className="ml-1.5 font-bold text-[#0F766E] hover:underline"
              >
                {mode === 'login' ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
