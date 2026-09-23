// ===== Auth / User =====
export type Role = "USER" | "ADMIN";

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  phone?: string;
  college?: string;
  branch?: string;
  graduationYear?: number;
  emailVerified?: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

// ===== CRT =====
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

export interface CrtCategory {
  id: number;
  name: string;
  displayName: string;
  description: string;
  topicCount: number;
  questionCount: number;
}

export interface CrtTopic {
  id: number;
  categoryId: number;
  title: string;
  explanation: string;
  concepts: string;
  formulas: string;
  examples: string;
  tips: string;
  displayOrder: number;
  questionCount: number;
}

export interface CrtQuestionPractice {
  id: number;
  topicId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  difficulty: DifficultyLevel;
}

export interface CrtQuestionAdmin extends CrtQuestionPractice {
  categoryId: number;
  correctOption: string;
  explanation: string;
}

export interface CrtPracticeResult {
  questionId: number;
  correct: boolean;
  correctOption: string;
  explanation: string;
  userAttempts: number;
  userCorrectAttempts: number;
}

export interface CrtTest {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: DifficultyLevel;
  isPublished: boolean;
  questionCount: number;
}

export interface CrtTestAttemptStart {
  attemptId: number;
  testId: number;
  title: string;
  durationMinutes: number;
  questions: CrtQuestionPractice[];
}

export interface CrtQuestionReview {
  questionId: number;
  questionText: string;
  selectedOption: string | null;
  correctOption: string;
  correct: boolean;
  explanation: string;
}

export interface CrtTestResult {
  attemptId: number;
  testId: number;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  timeTakenSeconds: number;
  questionReviews: CrtQuestionReview[];
}

// ===== Coding =====
export type CodingStatus = "NOT_STARTED" | "IN_PROGRESS" | "SOLVED";
export type CodingPlatform = "LEETCODE" | "CODECHEF" | "CODEFORCES" | "OTHER";

export interface CodingSheet {
  id: number;
  name: string;
  slug: string;
  description: string;
  position: number;
  problemCount: number;
}

export interface CodingPattern {
  id: number;
  name: string;
  slug: string;
  description: string;
  position: number;
  problemCount: number;
}

export interface CodingProblemSummary {
  id: number;
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  topic: string;
  platform: CodingPlatform;
  externalUrl: string | null;
  patternName: string | null;
  sheetName: string | null;
  sheetIds: number[];
  status: CodingStatus;
}

export interface CodingExample {
  inputText: string;
  outputText: string;
  explanation: string;
}

export interface CodingProblemDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  constraintsText: string;
  difficulty: DifficultyLevel;
  topic: string;
  platform: CodingPlatform;
  externalUrl: string | null;
  sheetId: number | null;
  sheetName: string | null;
  sheetIds: number[];
  patternId: number | null;
  patternName: string | null;
  status: CodingStatus;
  examples: CodingExample[];
}

export interface ProblemProgress {
  problemId: number;
  problemTitle: string;
  problemSlug: string;
  difficulty: DifficultyLevel;
  platform: CodingPlatform;
  patternName: string | null;
  status: CodingStatus;
  updatedAt: string | null;
}

// ===== Study Schedule =====
export type StudyPlanType =
  "CODING" | "INTERVIEW" | "LEARNING" | "CRT" | "OTHER";

export interface StudyPlanItem {
  id: number;
  title: string;
  type: StudyPlanType;
  dayOfWeek: number;
  time: string | null;
  durationMinutes: number | null;
  done: boolean;
}

export interface StudyPlan {
  codingPerWeek: number;
  interviewsPerWeek: number;
  learningPerWeek: number;
  items: StudyPlanItem[];
}

// ===== Interviews =====
export type InterviewType = "TECHNICAL" | "HR" | "MIXED";

export interface InterviewQuestionDto {
  answerId: number;
  order: number;
  questionText: string;
}

export interface InterviewSessionStart {
  sessionId: number;
  role: string;
  interviewType: InterviewType;
  difficulty: DifficultyLevel;
  topics: string[] | null;
  durationMinutes: number | null;
  questions: InterviewQuestionDto[];
}

export interface InterviewEvaluation {
  answerId: number;
  relevanceScore: number;
  technicalScore: number;
  communicationScore: number;
  clarityScore: number;
  feedback: string;
  improvementSuggestions: string;
}

export interface InterviewAnswerReview {
  answerId: number;
  questionText: string;
  answerText: string | null;
  evaluation: InterviewEvaluation | null;
}

export interface InterviewSessionResult {
  sessionId: number;
  role: string;
  interviewType: InterviewType;
  difficulty: DifficultyLevel;
  topics: string[] | null;
  durationMinutes: number | null;
  status: "IN_PROGRESS" | "COMPLETED";
  overallScore: number | null;
  relevanceScore: number | null;
  technicalScore: number | null;
  communicationScore: number | null;
  clarityScore: number | null;
  summaryFeedback: string | null;
  startedAt: string;
  completedAt: string | null;
  answers: InterviewAnswerReview[];
}

// ===== Learning =====
export type ResourceType =
  "ARTICLE" | "VIDEO" | "COURSE" | "NOTES" | "EXTERNAL_LINK";

export interface LearningCategory {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  resourceCount: number;
}

export interface LearningResource {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  contentUrl: string | null;
  contentBody: string | null;
  completedByCurrentUser: boolean;
}

// ===== Dashboard =====
export interface RecentActivity {
  type: string;
  description: string;
  timestamp: string;
}

export interface UserDashboard {
  fullName: string;
  crtPracticeAttempts: number;
  crtPracticeCorrect: number;
  crtAccuracy: number;
  crtTestsTaken: number;
  crtAverageTestScore: number;
  problemsSolved: number;
  totalSubmissions: number;
  solvedByDifficulty: Record<string, number>;
  interviewsCompleted: number;
  averageInterviewScore: number;
  learningResourcesCompleted: number;
  totalLearningResources: number;
  recentActivity: RecentActivity[];
}

export interface AdminDashboard {
  totalUsers: number;
  totalAdmins: number;
  totalCodingProblems: number;
  totalCrtQuestions: number;
  totalInterviewSessions: number;
  totalLearningResources: number;
  totalSubmissions: number;
  recentRegistrations: {
    id: number;
    fullName: string;
    email: string;
    createdAt: string;
  }[];
}

// ===== Pagination =====
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ===== API Error =====
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: string[];
}

// ===== InterviewStreak =====
export interface InterviewStreakPracticeDay {
  date: string;
  referenceId: number | null;
}

export interface InterviewStreakOverview {
  currentStreak: number;
  longestStreak: number;
  totalPracticeDays: number;
  todayCompleted: boolean;
  lastPracticeDate: string | null;
  today: string;
}

export interface InterviewStreakCalendar {
  today: string;
  practiceDays: InterviewStreakPracticeDay[];
}
