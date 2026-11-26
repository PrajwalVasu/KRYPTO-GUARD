import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { api, ApiError } from '../../services/api';
import type {
  QuizQuestionPublic,
  CheckAnswerResponse,
  QuizSubmitResponse,
  UserAnswerItem,
  TargetAudience,
} from '../../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Volume2,
  Sparkles,
  BookOpen,
  Loader2,
  AlertCircle,
  LogIn
} from 'lucide-react';

export const QuizScreen: React.FC = () => {
  const {
    targetAudience,
    setQuizScore,
    setCurrentScreen,
    speakText,
    isAuthenticated,
    loadProgress,
    loadHistory,
    setShowAuthModal,
    setAuthModalMessage,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<TargetAudience>(
    targetAudience === 'all' ? 'all' : targetAudience
  );
  const [questions, setQuestions] = useState<QuizQuestionPublic[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<CheckAnswerResponse | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const [userAnswers, setUserAnswers] = useState<UserAnswerItem[]>([]);
  const [userScore, setUserScore] = useState(0);

  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<QuizSubmitResponse | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch questions from backend whenever active audience filter changes
  const loadQuestions = useCallback(async (audience: TargetAudience) => {
    setIsLoadingQuestions(true);
    setQuestionsError(null);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnswerFeedback(null);
    setCheckError(null);
    setUserAnswers([]);
    setUserScore(0);
    setSubmitResult(null);
    setSubmitError(null);
    setIsCompleted(false);

    try {
      const data = await api.quizzes.getQuestions(audience === 'all' ? undefined : audience);
      setQuestions(data);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to load quiz questions';
      setQuestionsError(msg);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    api.quizzes
      .getQuestions(activeFilter === 'all' ? undefined : activeFilter)
      .then(data => {
        if (isMounted) {
          setQuestions(data);
          setIsLoadingQuestions(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof ApiError ? err.message : 'Failed to load quiz questions';
          setQuestionsError(msg);
          setIsLoadingQuestions(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

  const handleFilterChange = (filter: TargetAudience) => {
    if (filter === activeFilter) return;
    setIsLoadingQuestions(true);
    setQuestionsError(null);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnswerFeedback(null);
    setCheckError(null);
    setUserAnswers([]);
    setUserScore(0);
    setSubmitResult(null);
    setSubmitError(null);
    setIsCompleted(false);
    setActiveFilter(filter);
  };

  const currentQ = questions[currentIndex];
  const progressPercent = questions.length > 0
    ? Math.round((currentIndex / questions.length) * 100)
    : 0;

  const handleSelectOption = (optionId: string) => {
    if (answerFeedback || isCheckingAnswer) return;
    setSelectedOptionId(optionId);
    setCheckError(null);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOptionId || isCheckingAnswer || answerFeedback || !currentQ) return;

    setIsCheckingAnswer(true);
    setCheckError(null);

    try {
      const feedback = await api.quizzes.checkAnswer({
        questionId: currentQ.id,
        selectedOptionId,
      });

      setAnswerFeedback(feedback);
      if (feedback.isCorrect) {
        setUserScore(prev => prev + 1);
      }

      setUserAnswers(prev => [
        ...prev.filter(item => item.questionId !== currentQ.id),
        { questionId: currentQ.id, selectedOptionId },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Unable to check answer. Please try again.';
      setCheckError(msg);
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  const handleCompleteQuiz = async () => {
    if (isSubmittingQuiz || submitResult) return;

    setIsSubmittingQuiz(true);
    setSubmitError(null);

    // Ensure all answers are gathered
    const finalAnswers: UserAnswerItem[] = [...userAnswers];
    if (currentQ && selectedOptionId && !finalAnswers.some(a => a.questionId === currentQ.id)) {
      finalAnswers.push({ questionId: currentQ.id, selectedOptionId });
    }

    try {
      const result = await api.quizzes.submitQuiz({ answers: finalAnswers });
      setSubmitResult(result);
      setIsCompleted(true);

      // Update quiz score in context
      setQuizScore({
        score: result.score,
        total: result.total,
        completed: true,
      });

      // If user is authenticated, refresh progress summary to update Home Reflex Score & calibration
      if (isAuthenticated) {
        try {
          await loadProgress();
          // Refresh quiz history to reflect the latest attempt
          await loadHistory();
        } catch {
          // Progress or history load error is non-blocking
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to submit quiz results. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentQ || !answerFeedback) return;

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setAnswerFeedback(null);
      setCheckError(null);
    } else {
      // Last question reached -> Submit full quiz to backend
      await handleCompleteQuiz();
    }
  };

  const handleRestart = () => {
    loadQuestions(activeFilter);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          <span>Interactive Cyber Defense Reflex Quiz</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Test Your Scam Detection Instincts
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Realistic situations faced by students and senior citizens in India. Learn the safe reflex for each scenario.
        </p>
      </div>

      {/* Audience Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeFilter === 'all'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Scenarios
        </button>
        <button
          onClick={() => handleFilterChange('seniors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeFilter === 'seniors'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          👵 Senior Focus
        </button>
        <button
          onClick={() => handleFilterChange('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeFilter === 'students'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🎓 Student Focus
        </button>
      </div>

      {/* Main Body */}
      {isLoadingQuestions ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin mx-auto" />
          <p className="text-sm text-slate-600 font-medium">Loading quiz scenarios from server...</p>
        </div>
      ) : questionsError ? (
        <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Unable to Load Quiz</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">{questionsError}</p>
          <button
            onClick={() => loadQuestions(activeFilter)}
            className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold transition-all shadow-xs"
          >
            Retry Loading
          </button>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4 shadow-sm">
          <p className="text-sm text-slate-600">No quiz questions found for this category.</p>
          <button
            onClick={() => handleFilterChange('all')}
            className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-bold"
          >
            Show All Scenarios
          </button>
        </div>
      ) : !isCompleted && currentQ ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 space-y-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>
                Scenario {currentIndex + 1} of {questions.length}
              </span>
              <span className="font-bold text-teal-700">Score: {userScore}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0F766E] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Scenario Context Tag */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200/60">
              {currentQ.contextTag}
            </span>
            <button
              onClick={() => speakText(`${currentQ.scenario}. ${currentQ.question}`)}
              title="Read scenario aloud"
              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            {currentQ.scenario && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                "{currentQ.scenario}"
              </p>
            )}
            <h2 className="text-base sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options (A, B, C, D) */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map(opt => {
              const isSelected = selectedOptionId === opt.id;
              let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

              if (answerFeedback) {
                if (opt.id === answerFeedback.correctOptionId) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                } else if (isSelected && !answerFeedback.isCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                } else {
                  optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-[#0F766E] bg-teal-50/70 text-slate-950 shadow-2xs font-bold';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${optionStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                    {opt.text}
                  </div>
                  {answerFeedback && opt.id === answerFeedback.correctOptionId && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {answerFeedback && isSelected && !answerFeedback.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Inline Check Answer Error */}
          {checkError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{checkError}</span>
            </div>
          )}

          {/* Feedback & Explanation Box from Backend */}
          {answerFeedback && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                {answerFeedback.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Correct Decision!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                    <XCircle className="w-4 h-4" /> Risky Decision
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {answerFeedback.explanation}
              </p>

              {answerFeedback.safetyRule && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2 text-xs text-emerald-950 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-emerald-900 font-bold">Shield Rule: </span>
                    {answerFeedback.safetyRule}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Inline Submit Error */}
          {submitError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{submitError}</span>
              </div>
              <button
                onClick={handleCompleteQuiz}
                disabled={isSubmittingQuiz}
                className="underline font-bold text-rose-900 hover:text-rose-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {!answerFeedback ? 'Select an answer above to continue' : 'Review explanation and proceed'}
            </span>

            {!answerFeedback ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId || isCheckingAnswer}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:bg-slate-200 text-white text-xs font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-102 disabled:hover:scale-100"
              >
                {isCheckingAnswer && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isCheckingAnswer ? 'Checking Answer...' : 'Submit Answer'}</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={isSubmittingQuiz}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:bg-slate-300 text-white text-xs font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-102 disabled:hover:scale-100"
              >
                {isSubmittingQuiz && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {isSubmittingQuiz
                    ? 'Submitting Assessment...'
                    : currentIndex + 1 < questions.length
                    ? 'Next Scenario'
                    : 'Complete & Submit Quiz'}
                </span>
                {!isSubmittingQuiz && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completed Screen */
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-12 text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-50 text-[#0F766E] flex items-center justify-center shadow-inner">
            <Award className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assessment Finished</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {submitResult ? submitResult.rankTitle : 'Assessment Complete'}
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {submitResult ? submitResult.rankDescription : ''}
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="p-6 bg-slate-50 rounded-2xl max-w-xs mx-auto border border-slate-200">
            <span className="block text-4xl sm:text-5xl font-black text-[#0F766E]">
              {submitResult ? submitResult.score : userScore}/{submitResult ? submitResult.total : questions.length}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
              {submitResult ? submitResult.percentage : 0}% Safety Reflex Score
            </span>
          </div>

          {/* Auth State Note */}
          {isAuthenticated ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Attempt saved to your profile. Reflex Score calibrated on Home Dashboard!</span>
            </div>
          ) : (
            <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200/80 max-w-md mx-auto text-xs text-teal-900 space-y-2">
              <p className="font-semibold">
                💡 You completed this assessment as a Guest. Sign in to save future attempts and monitor your Reflex Score over time!
              </p>
              <button
                onClick={() => {
                  setAuthModalMessage({
                    title: 'Sign in to save your learning progress.',
                    message: 'Create an account or sign in to track completed lessons, monitor your Reflex Score, and continue learning across sessions.'
                  });
                  setShowAuthModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F766E] text-white font-bold hover:bg-[#115E59] transition-all shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Save Progress</span>
              </button>
            </div>
          )}

          {/* Personalized Recommendations */}
          <div className="text-left bg-teal-50/60 p-6 rounded-2xl border border-teal-200/80 max-w-lg mx-auto space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Next Steps for Full Safety
            </h3>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li>&bull; Review the <strong>UPI Payment Fraud</strong> guide (PIN is only to send).</li>
              <li>&bull; Share the <strong>AnyDesk Remote Access warning</strong> with elderly relatives.</li>
              <li>&bull; Save <strong>1930</strong> in your phone emergency speed dial.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={() => setCurrentScreen('learn')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-102"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All 8 Fraud Lessons</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
