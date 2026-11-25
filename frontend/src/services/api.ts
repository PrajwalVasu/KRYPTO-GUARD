import type {
  TargetAudience,
  ScamCategory,
  DailyTip,
  JargonTerm,
  AuthResponse,
  UserProfile,
  RegisterRequest,
  LoginRequest,
  QuizQuestionPublic,
  CheckAnswerRequest,
  CheckAnswerResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
  ProgressSummary,
  LessonCompletionResponse,
  QuizAttemptHistoryResponse,
} from '../types';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api/v1';

export const TOKEN_STORAGE_KEY = 'kryptoguard_token';

/**
 * Standard typed API error carrying HTTP status, response data, and network failure markers.
 */
export class ApiError extends Error {
  status: number;
  statusText: string;
  data: unknown;
  isNetworkError: boolean;
  isUnauthorized: boolean;

  constructor(
    message: string,
    status: number = 0,
    statusText: string = '',
    data: unknown = null,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.isNetworkError = isNetworkError;
    this.isUnauthorized = status === 401;
  }
}

/**
 * Token storage helpers for browser persistence across page refreshes.
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Gracefully handle storage disabled/private browsing restrictions
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Gracefully handle storage disabled/private browsing restrictions
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Reusable, typed native fetch wrapper with automatic token attachment and error extraction.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, body, ...customConfig } = options;

  let url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const reqHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Default to application/json if sending a JSON body
  if (body && typeof body === 'string' && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  // Automatically attach Bearer token if present in storage
  const token = getStoredToken();
  if (token && !reqHeaders['Authorization']) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...customConfig,
      headers: reqHeaders,
      body,
    });
  } catch {
    throw new ApiError(
      'Network error: Unable to connect to KRYPTOGUARD server. Please check your internet connection.',
      0,
      'Network Failure',
      null,
      true
    );
  }

  let responseData: unknown = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    try {
      responseData = await response.text();
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    if (
      responseData &&
      typeof responseData === 'object' &&
      'detail' in (responseData as Record<string, unknown>)
    ) {
      const detail = (responseData as Record<string, unknown>).detail;
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail
          .map((d: any) => d?.msg || JSON.stringify(d))
          .join('; ');
      }
    }

    throw new ApiError(
      errorMessage,
      response.status,
      response.statusText,
      responseData,
      false
    );
  }

  return responseData as T;
}

// ==========================================
// Module-Specific API Functions
// ==========================================

export const api = {
  // Authentication Endpoints
  auth: {
    register: (data: RegisterRequest): Promise<AuthResponse> =>
      apiRequest<AuthResponse>('auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: LoginRequest): Promise<AuthResponse> =>
      apiRequest<AuthResponse>('auth/login/json', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    logout: (): Promise<{ msg: string }> =>
      apiRequest<{ msg: string }>('auth/logout', {
        method: 'POST',
      }),
  },

  // User Profile Endpoints
  users: {
    getMe: (): Promise<UserProfile> =>
      apiRequest<UserProfile>('users/me'),

    updateMe: (data: Partial<Pick<UserProfile, 'name' | 'audience'>>): Promise<UserProfile> =>
      apiRequest<UserProfile>('users/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Learning & Scam Knowledge Base Endpoints
  learning: {
    getCategories: (audience?: TargetAudience, search?: string): Promise<ScamCategory[]> =>
      apiRequest<ScamCategory[]>('learning/categories', {
        params: { audience, search },
      }),

    getCategory: (categoryId: string): Promise<ScamCategory> =>
      apiRequest<ScamCategory>(`learning/categories/${categoryId}`),

    getDailyTip: (audience?: TargetAudience): Promise<DailyTip> =>
      apiRequest<DailyTip>('learning/daily-tip', {
        params: { audience },
      }),

    getTips: (audience?: TargetAudience): Promise<DailyTip[]> =>
      apiRequest<DailyTip[]>('learning/tips', {
        params: { audience },
      }),

    getJargonTerms: (search?: string): Promise<JargonTerm[]> =>
      apiRequest<JargonTerm[]>('learning/jargon', {
        params: { search },
      }),
  },

  // Quiz Endpoints
  quizzes: {
    getQuestions: (audience?: TargetAudience): Promise<QuizQuestionPublic[]> =>
      apiRequest<QuizQuestionPublic[]>('quizzes/questions', {
        params: { audience },
      }),

    getQuestionsByCategory: (categoryId: string): Promise<QuizQuestionPublic[]> =>
      apiRequest<QuizQuestionPublic[]>(`quizzes/categories/${categoryId}/questions`),

    checkAnswer: (data: CheckAnswerRequest): Promise<CheckAnswerResponse> =>
      apiRequest<CheckAnswerResponse>('quizzes/check-answer', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    submitQuiz: (data: QuizSubmitRequest): Promise<QuizSubmitResponse> =>
      apiRequest<QuizSubmitResponse>('quizzes/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // User Progress & Reflex Score Endpoints
  progress: {
    getSummary: (): Promise<ProgressSummary> =>
      apiRequest<ProgressSummary>('progress/summary'),

    completeLesson: (categoryId: string): Promise<LessonCompletionResponse> =>
      apiRequest<LessonCompletionResponse>(`progress/lessons/${categoryId}/complete`, {
        method: 'POST',
      }),

    uncompleteLesson: (categoryId: string): Promise<LessonCompletionResponse> =>
      apiRequest<LessonCompletionResponse>(`progress/lessons/${categoryId}/complete`, {
        method: 'DELETE',
      }),

    getHistory: (limit: number = 10, skip: number = 0): Promise<QuizAttemptHistoryResponse> =>
      apiRequest<QuizAttemptHistoryResponse>('progress/history', {
        params: { limit, skip },
      }),
  },
};
