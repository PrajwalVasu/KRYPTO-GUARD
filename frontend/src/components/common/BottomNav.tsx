import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, BookOpen, ShieldAlert, Award, PhoneCall } from 'lucide-react';
import type { ScreenId } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, language } = useApp();

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; isEmergency?: boolean }[] = [
    {
      id: 'home',
      label: language === 'hi' ? 'होम' : 'Home',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'learn',
      label: language === 'hi' ? 'घोटाले' : 'Learn',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 'checker',
      label: language === 'hi' ? 'जांचें' : 'Checker',
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'quiz',
      label: language === 'hi' ? 'क्विज़' : 'Quiz',
      icon: <Award className="w-5 h-5" />
    },
    {
      id: 'emergency',
      label: language === 'hi' ? '1930 मदद' : 'Help 1930',
      icon: <PhoneCall className="w-5 h-5 text-rose-600" />,
      isEmergency: true
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {navItems.map(item => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentScreen(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                item.isEmergency
                  ? isActive
                    ? 'text-rose-700 font-bold bg-rose-50'
                    : 'text-rose-600 font-semibold'
                  : isActive
                  ? 'text-[#0F766E] font-bold bg-teal-50'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0F766E]" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
