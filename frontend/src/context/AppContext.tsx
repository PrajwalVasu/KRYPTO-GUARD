import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { TargetAudience, ScreenId, FontSize, UserProfile, ProgressSummary, QuizAttemptHistoryResponse } from '../types';
import { api, ApiError, getStoredToken, setStoredToken, clearStoredToken } from '../services/api';

interface AppContextType {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  targetAudience: TargetAudience;
  setTargetAudience: (audience: TargetAudience) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  cycleFontSize: () => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  toggleHighContrast: () => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  toggleLanguage: () => void;
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
  selectedScamId: string | null;
  setSelectedScamId: (id: string | null) => void;
  openScamDetail: (id: string) => void;
  completedLessons: string[];
  markLessonComplete: (id: string) => Promise<void>;
  unmarkLessonComplete: (id: string) => Promise<void>;
  toggleLessonComplete: (id: string) => Promise<void>;
  quizScore: { score: number; total: number; completed: boolean } | null;
  setQuizScore: (score: { score: number; total: number; completed: boolean } | null) => void;
  showJargonModal: boolean;
  setShowJargonModal: (val: boolean) => void;

  // Authentication State & Actions
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMessage: { title: string; message: string } | null;
  setAuthModalMessage: (msg: { title: string; message: string } | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, audience: TargetAudience) => Promise<void>;
  logout: () => Promise<void>;
  loadUserProfile: () => Promise<void>;

  // User Progress State & Actions
  progress: ProgressSummary | null;
  isProgressLoading: boolean;
  progressError: string | null;
  loadProgress: () => Promise<void>;

  // Quiz History State & Actions
  quizHistory: QuizAttemptHistoryResponse | null;
  isHistoryLoading: boolean;
  historyError: string | null;
  loadHistory: (limit?: number, skip?: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('all');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [selectedScamId, setSelectedScamId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number; completed: boolean } | null>(null);
  const [showJargonModal, setShowJargonModal] = useState<boolean>(false);

  // Authentication states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMessage, setAuthModalMessage] = useState<{ title: string; message: string } | null>(null);
  const initialProfileLoadedRef = useRef<boolean>(false);

  // Progress states
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [isProgressLoading, setIsProgressLoading] = useState<boolean>(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  // Quiz History states
  const [quizHistory, setQuizHistory] = useState<QuizAttemptHistoryResponse | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const isAuthenticated = Boolean(token && user);

  // Sync font size to document root class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-xlarge');
    root.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  // Sync high contrast
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Check if first-time user
  useEffect(() => {
    const onboarded = localStorage.getItem('kryptoguard_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    }
  }, []);

  // Fetch progress summary for authenticated user
  const loadProgress = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setProgress(null);
      setCompletedLessons([]);
      setIsProgressLoading(false);
      return;
    }

    setIsProgressLoading(true);
    try {
      const summary = await api.progress.getSummary();
      setProgress(summary);
      setCompletedLessons(summary.lessons.completedCategoryIds);
      setProgressError(null);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to load progress summary';
      setProgressError(msg);
    } finally {
      setIsProgressLoading(false);
    }
  }, []);

  // Fetch quiz history for authenticated user
  const loadHistory = useCallback(async (limit: number = 10, skip: number = 0) => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setQuizHistory(null);
      setIsHistoryLoading(false);
      return;
    }

    setIsHistoryLoading(true);
    try {
      const data = await api.progress.getHistory(limit, skip);
      setQuizHistory(data);
      setHistoryError(null);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to load quiz history';
      setHistoryError(msg);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // Persistent user profile loading on startup
  const loadUserProfile = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setProgress(null);
      setQuizHistory(null);
      setCompletedLessons([]);
      setQuizScore(null);
      setIsAuthLoading(false);
      return;
    }

    setIsAuthLoading(true);
    try {
      const profile = await api.users.getMe();
      setUser(profile);
      setToken(currentToken);
      setAuthError(null);
      if (profile.audience) {
        setTargetAudience(profile.audience);
      }

      // Fetch user progress for authenticated user
      try {
        const summary = await api.progress.getSummary();
        setProgress(summary);
        setCompletedLessons(summary.lessons.completedCategoryIds);
        setProgressError(null);
      } catch (err: unknown) {
        if (err instanceof ApiError && !err.isUnauthorized) {
          setProgressError(err.message);
        }
      }

      // Fetch user quiz history
      try {
        const history = await api.progress.getHistory(10, 0);
        setQuizHistory(history);
        setHistoryError(null);
      } catch (err: unknown) {
        if (err instanceof ApiError && !err.isUnauthorized) {
          setHistoryError(err.message);
        }
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.isUnauthorized) {
          // Token expired or invalid: clear invalid session and return to anonymous state
          clearStoredToken();
          setToken(null);
          setUser(null);
          setProgress(null);
          setQuizHistory(null);
          setCompletedLessons([]);
          setQuizScore(null);
          setTargetAudience('all');
        } else if (err.isNetworkError) {
          // Network failure: preserve token for retry, do not log user out
          setAuthError('Server unreachable. Running with offline capabilities.');
        }
      }
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  // Run initial profile check on mount without StrictMode duplicate execution
  useEffect(() => {
    if (!initialProfileLoadedRef.current) {
      initialProfileLoadedRef.current = true;
      loadUserProfile();
    }
  }, [loadUserProfile]);

  const login = async (email: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);
    // Reset previous account state before loading new account data
    setUser(null);
    setProgress(null);
    setQuizHistory(null);
    setCompletedLessons([]);
    setQuizScore(null);
    try {
      const authRes = await api.auth.login({ email, password });
      setStoredToken(authRes.access_token);
      setToken(authRes.access_token);

      const profile = await api.users.getMe();
      setUser(profile);
      if (profile.audience) {
        setTargetAudience(profile.audience);
      }

      // Load authenticated user progress & history
      try {
        const [summary, history] = await Promise.all([
          api.progress.getSummary(),
          api.progress.getHistory(10, 0),
        ]);
        setProgress(summary);
        setCompletedLessons(summary.lessons.completedCategoryIds);
        setProgressError(null);
        setQuizHistory(history);
        setHistoryError(null);
      } catch (err: unknown) {
        if (err instanceof ApiError && !err.isUnauthorized) {
          setProgressError(err.message);
        }
      }

      setShowAuthModal(false);
      setAuthModalMessage(null);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Login failed. Please verify your email and password.';
      setAuthError(msg);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, audience: TargetAudience) => {
    setIsAuthLoading(true);
    setAuthError(null);
    // Reset previous account state before loading new account data
    setUser(null);
    setProgress(null);
    setQuizHistory(null);
    setCompletedLessons([]);
    setQuizScore(null);
    try {
      const authRes = await api.auth.register({ name, email, password, audience });
      setStoredToken(authRes.access_token);
      setToken(authRes.access_token);

      const profile = await api.users.getMe();
      setUser(profile);
      setTargetAudience(audience);

      // Load fresh progress & history
      try {
        const [summary, history] = await Promise.all([
          api.progress.getSummary(),
          api.progress.getHistory(10, 0),
        ]);
        setProgress(summary);
        setCompletedLessons(summary.lessons.completedCategoryIds);
        setProgressError(null);
        setQuizHistory(history);
        setHistoryError(null);
      } catch (err: unknown) {
        if (err instanceof ApiError && !err.isUnauthorized) {
          setProgressError(err.message);
        }
      }

      setShowAuthModal(false);
      setAuthModalMessage(null);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed. Please check your information.';
      setAuthError(msg);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    setIsAuthLoading(true);
    try {
      await api.auth.logout();
    } catch {
      // Backend unavailable or token already revoked - proceed with local cleanup
    } finally {
      clearStoredToken();
      setToken(null);
      setUser(null);
      setProgress(null);
      setQuizHistory(null);
      setCompletedLessons([]);
      setQuizScore(null);
      setTargetAudience('all');
      setProgressError(null);
      setHistoryError(null);
      setAuthError(null);
      setAuthModalMessage(null);
      setIsHistoryLoading(false);
      setIsAuthLoading(false);
    }
  };

  const markLessonComplete = async (id: string) => {
    if (!token || !user) {
      setAuthModalMessage({
        title: 'Sign in to save your learning progress.',
        message: 'Create an account or sign in to track completed lessons, monitor your Reflex Score, and continue learning across sessions.'
      });
      setShowAuthModal(true);
      return;
    }

    setIsProgressLoading(true);
    try {
      await api.progress.completeLesson(id);
      const summary = await api.progress.getSummary();
      setProgress(summary);
      setCompletedLessons(summary.lessons.completedCategoryIds);
      setProgressError(null);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to mark lesson complete';
      setProgressError(msg);
      throw err;
    } finally {
      setIsProgressLoading(false);
    }
  };

  const unmarkLessonComplete = async (id: string) => {
    if (!token || !user) {
      return;
    }

    setIsProgressLoading(true);
    try {
      await api.progress.uncompleteLesson(id);
      const summary = await api.progress.getSummary();
      setProgress(summary);
      setCompletedLessons(summary.lessons.completedCategoryIds);
      setProgressError(null);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to unmark lesson';
      setProgressError(msg);
      throw err;
    } finally {
      setIsProgressLoading(false);
    }
  };

  const toggleLessonComplete = async (id: string) => {
    if (!token || !user) {
      setAuthModalMessage({
        title: 'Sign in to save your learning progress.',
        message: 'Create an account or sign in to track completed lessons, monitor your Reflex Score, and continue learning across sessions.'
      });
      setShowAuthModal(true);
      return;
    }
    if (completedLessons.includes(id)) {
      await unmarkLessonComplete(id);
    } else {
      await markLessonComplete(id);
    }
  };

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleLanguage = () => setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));

  // Web Speech API Voice Assistance
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const openScamDetail = (id: string) => {
    setSelectedScamId(id);
    setCurrentScreen('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        targetAudience,
        setTargetAudience,
        fontSize,
        setFontSize,
        cycleFontSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        language,
        setLanguage,
        toggleLanguage,
        isSpeaking,
        speakText,
        stopSpeaking,
        showOnboarding,
        setShowOnboarding,
        selectedScamId,
        setSelectedScamId,
        openScamDetail,
        completedLessons,
        markLessonComplete,
        unmarkLessonComplete,
        toggleLessonComplete,
        quizScore,
        setQuizScore,
        showJargonModal,
        setShowJargonModal,
        user,
        token,
        isAuthenticated,
        isAuthLoading,
        authError,
        setAuthError,
        showAuthModal,
        setShowAuthModal,
        authModalMessage,
        setAuthModalMessage,
        login,
        register,
        logout,
        loadUserProfile,
        progress,
        isProgressLoading,
        progressError,
        loadProgress,
        quizHistory,
        isHistoryLoading,
        historyError,
        loadHistory
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
