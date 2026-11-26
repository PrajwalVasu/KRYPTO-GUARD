import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { TargetAudience } from '../../types';
import { GraduationCap, HeartHandshake, UserCheck, ArrowRight, CheckCircle2, Volume2, Sparkles } from 'lucide-react';

// Explicitly type the personas array so the `id` property is recognised as TargetAudience.
const personas: { id: TargetAudience; title: string; subtitle: string; icon: React.ReactNode }[] = [
  {
    id: 'seniors',
    title: 'Senior Citizen & Elder',
    subtitle: 'Focus on fake bank calls, UPI PIN confusion, pension alerts, and WhatsApp scams.',
    icon: <HeartHandshake className="w-6 h-6 text-emerald-700" />, // eslint-disable-line react/jsx-key
  },
  {
    id: 'students',
    title: 'Student & Young Adult',
    subtitle: 'Focus on gaming scams, fake internship tasks, social media clone accounts, and privacy.',
    icon: <GraduationCap className="w-6 h-6 text-teal-700" />, // eslint-disable-line react/jsx-key
  },
  {
    id: 'all',
    title: 'General / Family Protector',
    subtitle: 'Comprehensive protection covering all 8 major digital fraud categories.',
    icon: <UserCheck className="w-6 h-6 text-blue-700" />, // eslint-disable-line react/jsx-key
  },
];

export const OnboardingModal: React.FC = () => {
  const {
    showOnboarding,
    setShowOnboarding,
    targetAudience,
    setTargetAudience,
    language,
    setLanguage,
    fontSize,
    setCurrentScreen,
    setFontSize,
    speakText,
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  useEffect(() => console.log('OnboardingModal step changed', step), [step]);

  if (!showOnboarding) return null;

  const handleFinish = () => {
    localStorage.setItem('kryptoguard_onboarded', 'true');
    setShowOnboarding(false);
    setCurrentScreen('home');
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Banner */}
        <div className="relative bg-gradient-to-br from-[#0F766E] via-[#115E59] to-[#0F172A] p-6 sm:p-8 text-white text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl bg-white p-2 flex items-center justify-center border border-white/40 shadow-lg">
            <img src="/logo.png" alt="KRYPTO GUARD Logo" className="w-full h-full object-contain" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Cyber Safety Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to KRYPTO<span className="text-emerald-300">GUARD</span>
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-md mx-auto">
            Your friendly shield against digital fraud, fake bank calls, deceptive QR codes, and online scams.
          </p>
        </div>

        {/* Modal body */}
        <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 flex-1">
          {step === 1 ? (
            <>
              {/* Step 1: Persona selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-slate-900">Who will be using this app?</h2>
                  <button
                    onClick={() => speakText('Please select who will be using KRYPTOGUARD: Senior Citizen, Student, or General Family user.')}
                    className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1 font-semibold"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  We tailor explanations, examples, and warnings to your everyday digital lifestyle.
                </p>

                <div className="space-y-3">
                  {personas.map(p => {
                    const isSelected = targetAudience === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          console.log('Persona clicked', p.id);
                          setTargetAudience(p.id);
                        }}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${isSelected ? 'border-[#0F766E] bg-teal-50/70 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                      >
                        <div className="p-2.5 rounded-xl bg-white shadow-2xs shrink-0 mt-0.5">
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm sm:text-base text-slate-900">{p.title}</h3>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{p.subtitle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Language selection */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Preferred Language</span>
                  <span className="text-[11px] text-slate-400">Can be changed anytime at the top</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'hi' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Accessibility & Golden Rules */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Accessibility & Text Comfort</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose a comfortable text size for easy reading without straining your eyes.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`p-3 rounded-xl border text-center transition-all ${fontSize === 'normal'
                        ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                  >
                    <span className="text-sm block font-bold">Standard</span>
                    <span className="text-[11px] text-slate-500">Regular</span>
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`p-3 rounded-xl border text-center transition-all ${fontSize === 'large'
                        ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                  >
                    <span className="text-base block font-bold">Large A+</span>
                    <span className="text-[11px] text-slate-500">Elderly Friendly</span>
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`p-3 rounded-xl border text-center transition-all ${fontSize === 'xlarge'
                        ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                  >
                    <span className="text-lg block font-bold">Max A++</span>
                    <span className="text-[11px] text-slate-500">Maximum Clarity</span>
                  </button>
                </div>
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">3 Non-Negotiable Safety Truths</h3>
                  <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                      <p><strong className="text-slate-900">UPI PIN is ONLY for paying.</strong> You never enter your PIN to receive money.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                      <p><strong className="text-slate-900">No "Digital Arrest" exists.</strong> Police or customs never conduct investigations on WhatsApp/Skype.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                      <p><strong className="text-slate-900">Never download AnyDesk</strong> or TeamViewer when instructed by a phone caller.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            {step === 2 ? (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
              >
                Skip to Dashboard
              </button>
            )}

            {step === 1 ? (
              <button
                onClick={() => {
                  console.log('Continue clicked, targetAudience:', targetAudience);
                  if (targetAudience) {
                    setStep(2);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-102 ml-auto"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-102 ml-auto"
              >
                <span>Enter KRYPTOGUARD</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
