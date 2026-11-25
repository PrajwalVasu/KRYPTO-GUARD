import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { HomeScreen } from './components/screens/HomeScreen';
import { LearnScreen } from './components/screens/LearnScreen';
import { ScamCheckerScreen } from './components/screens/ScamCheckerScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { EmergencyScreen } from './components/screens/EmergencyScreen';
import { OnboardingModal } from './components/screens/OnboardingModal';
import { JargonBusterModal } from './components/screens/JargonBusterModal';
import { AuthModal } from './components/screens/AuthModal';
import { PhoneCall } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#1E293B]">
      {/* Top Header */}
      <Header />

      {/* Main Screen Content */}
      <main className="flex-1 w-full">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'learn' && <LearnScreen />}
        {currentScreen === 'checker' && <ScamCheckerScreen />}
        {currentScreen === 'quiz' && <QuizScreen />}
        {currentScreen === 'emergency' && <EmergencyScreen />}
      </main>

      {/* Floating 1930 Speed Dial Button (Visible on mobile/desktop unless already in emergency screen) */}
      {currentScreen !== 'emergency' && (
        <aside aria-label="Emergency Speed Dial" className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-30">
          <button
            onClick={() => {
              setCurrentScreen('emergency');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Open Emergency Help and Dial 1930"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-4 py-3 rounded-2xl shadow-xl shadow-rose-950/20 border-2 border-white/40 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-[10px] uppercase tracking-wider text-rose-200 leading-none">Cyber Emergency</span>
              <span className="text-sm font-black leading-tight">Dial 1930</span>
            </div>
            <span className="text-xs font-black sm:hidden">1930 Help</span>
          </button>
        </aside>
      )}

      {/* Bottom Nav for Mobile */}
      <BottomNav />

      {/* Accessible Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <OnboardingModal />
      <JargonBusterModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
