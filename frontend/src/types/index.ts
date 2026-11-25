export type TargetAudience = 'all' | 'students' | 'seniors';

export type ScreenId = 'home' | 'learn' | 'checker' | 'quiz' | 'emergency';

export type FontSize = 'normal' | 'large' | 'xlarge';

export interface ScamCategory {
  id: string;
  title: string;
  shortTitle: string;
  audience: 'all' | 'students' | 'seniors';
  icon: string;
  badge: string;
  tagline: string;
  description: string;
  howItHappens: {
    step: number;
    title: string;
    description: string;
  }[];
  realLifeScenario: {
    victimProfile: string;
    story: string;
    messagePreview?: {
      sender: string;
      body: string;
      timestamp: string;
      type: 'sms' | 'whatsapp' | 'call' | 'email';
    };
  };
  warningSigns: string[];
  shieldRules: string[];
  whatToDoIfAffected: string[];
  commonKeywords: string[];
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  contextTag: string;
  audience: 'all' | 'students' | 'seniors';
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  safetyRule: string;
}

export interface DailyTip {
  id: number;
  category: string;
  tip: string;
  actionableStep: string;
  forAudience: TargetAudience;
}

export interface AnalysisResult {
  riskLevel: 'high' | 'suspicious' | 'low-risk' | 'inconclusive';
  score: number; // 0 - 100
  summary: string;
  detectedFlags: {
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
  }[];
  whyItIsSuspicious: string[];
  recommendedActions: string[];
  disclaimer: string;
}

export interface BankContact {
  name: string;
  tollFree: string;
  fraudEmail: string;
  smsBlockCode: string;
  logoColor: string;
}

export interface JargonTerm {
  term: string;
  hindiTerm?: string;
  meaning: string;
  realWorldAnalogy: string;
  safetyTakeaway: string;
}

// ==========================================
// Authentication & User Profile Interfaces
// ==========================================

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  audience: TargetAudience;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  audience: TargetAudience;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ==========================================
// Quiz API Interfaces
// ==========================================

export interface QuizOptionPublic {
  id: string;
  text: string;
}

export interface QuizQuestionPublic {
  id: number;
  scenario: string;
  contextTag: string;
  categoryId?: string | null;
  audience: TargetAudience;
  question: string;
  options: QuizOptionPublic[];
}

export interface CheckAnswerRequest {
  questionId: number;
  selectedOptionId: string;
}

export interface CheckAnswerResponse {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
  correctOptionId: string;
  explanation: string;
  safetyRule: string;
}

export interface UserAnswerItem {
  questionId: number;
  selectedOptionId: string;
}

export interface QuizSubmitRequest {
  answers: UserAnswerItem[];
}

export interface QuestionResultFeedback {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
  correctOptionId: string;
  explanation: string;
  safetyRule: string;
}

export interface QuizSubmitResponse {
  score: number;
  total: number;
  percentage: number;
  rankTitle: string;
  rankDescription: string;
  results: QuestionResultFeedback[];
}

// ==========================================
// User Progress & Reflex Score Interfaces
// ==========================================

export interface LessonCompletionResponse {
  categoryId: string;
  isCompleted: boolean;
  completedAt?: string | null;
  completedLessonsCount: number;
  totalLessonsCount: number;
  completionPercentage: number;
}

export interface ReflexScoreDetail {
  score: number;
  isCalibrated: boolean;
  rankTitle: string;
  lessonComponent: number;
  quizComponent?: number | null;
  explanation: string;
}

export interface LessonProgressSummary {
  completed: number;
  total: number;
  completionPercentage: number;
  completedCategoryIds: string[];
}

export interface LatestQuizScore {
  score: number;
  total: number;
  percentage: number;
  rankTitle: string;
  attemptedAt: string;
}

export interface QuizProgressSummary {
  totalAttempts: number;
  latestScore?: LatestQuizScore | null;
  highestPercentage?: number | null;
  averagePercentage?: number | null;
}

export interface WeakCategoryItem {
  categoryId: string;
  categoryTitle: string;
  incorrectAnswersCount: number;
  isLessonCompleted: boolean;
}

export interface LearningRecommendation {
  categoryId: string;
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ProgressSummary {
  userId: string;
  audience: TargetAudience;
  reflexScore: ReflexScoreDetail;
  lessons: LessonProgressSummary;
  quizzes: QuizProgressSummary;
  weakCategories: WeakCategoryItem[];
  recommendations: LearningRecommendation[];
}

export interface QuizAttemptHistoryItem {
  id: string;
  score: number;
  total: number;
  percentage: number;
  rankTitle: string;
  createdAt: string;
}

export interface QuizAttemptHistoryResponse {
  total: number;
  attempts: QuizAttemptHistoryItem[];
}
