export type LearnerProfile = {
  id: string;
  display_name: string;
  grade_id: string | null;
};

export type SavedGeneratedQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
};

export type QuestionProgress = {
  learner_id: string;
  grade_id: string;
  subject: string;
  answered_bank_question_keys: string[];
  bank_completed: boolean;
  bank_correct_answers: number;
  total_correct_answers: number;
  total_answered: number;
  pending_generated_questions: SavedGeneratedQuestion[];
  remaining_today: number;
};

export type SubjectProgressSummary = {
  grade_id: string;
  subject: string;
  total_answered: number;
  total_correct_answers: number;
  accuracy_percentage: number;
  bank_questions_answered: number;
  bank_completed: boolean;
  last_activity_at: string;
};

export type LearnerProgressSummary = {
  learner_id: string;
  total_answered: number;
  total_correct_answers: number;
  accuracy_percentage: number;
  subjects_practised: number;
  last_activity_at: string | null;
  subjects: SubjectProgressSummary[];
};

export type GeneratedQuestionsResponse = {
  questions: SavedGeneratedQuestion[];
  remaining_today: number;
};

export class QuestionApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "QuestionApiError";
  }
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
).replace(/\/+$/, "");

export async function questionApiRequest<T>(
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(`${API_URL}/questions/${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const result = (await response.json().catch(() => ({}))) as { detail?: string } & T;
  if (!response.ok) {
    throw new QuestionApiError(result.detail ?? `Request failed (${response.status}).`, response.status);
  }
  return result as T;
}
