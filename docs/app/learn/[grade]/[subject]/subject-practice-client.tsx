"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ButtonSpinner from "@/components/button-spinner";
import { AuthApiError, authApiRequest } from "@/lib/auth-api";
import type { SampleQuestion } from "@/lib/curriculum";
import type { PracticeQuestion } from "@/lib/junior-question-bank";
import {
  type GeneratedQuestionsResponse,
  type LearnerProfile,
  type QuestionProgress,
  QuestionApiError,
  questionApiRequest,
  type SavedGeneratedQuestion,
} from "@/lib/questions-api";

type SubjectPracticeClientProps =
  | {
      mode: "practice";
      gradeId: string;
      grade: string;
      subject: string;
      questions: PracticeQuestion[];
    }
  | {
      mode: "sample";
      grade: string;
      subject: string;
      question: SampleQuestion;
    };

export default function SubjectPracticeClient(props: SubjectPracticeClientProps) {
  if (props.mode === "practice") {
    return (
      <JuniorPractice
        gradeId={props.gradeId}
        grade={props.grade}
        subject={props.subject}
        questions={props.questions}
      />
    );
  }

  return (
    <SamplePractice
      grade={props.grade}
      subject={props.subject}
      question={props.question}
    />
  );
}

function JuniorPractice({
  gradeId,
  grade,
  subject,
  questions,
}: {
  gradeId: string;
  grade: string;
  subject: string;
  questions: PracticeQuestion[];
}) {
  const [questionList, setQuestionList] = useState(questions);
  const [questionKeys, setQuestionKeys] = useState(
    questions.map((_, index) => `bank-${index}`),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [learners, setLearners] = useState<LearnerProfile[]>([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accountStatus, setAccountStatus] = useState<
    "loading" | "signed-in" | "signed-out" | "unavailable"
  >("loading");
  const [progressStatus, setProgressStatus] = useState<
    "loading" | "loaded" | "unavailable"
  >("loading");
  const [progressError, setProgressError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [isSavingActivity, setIsSavingActivity] = useState(false);
  const [activitySaved, setActivitySaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [remainingToday, setRemainingToday] = useState(10);
  const [quotaChecked, setQuotaChecked] = useState(false);
  const question = questionList[questionIndex] ?? questions[0];
  const isCorrect = selectedAnswer === question.correctAnswerIndex;
  const dashboardLabel = "Back to grade and subjects";
  const learnerSelectionRequired = learners.length > 1 && !selectedLearnerId;
  const canSaveProgress = accountStatus === "signed-in" && Boolean(selectedLearnerId);
  const progress = finished
    ? 100
    : ((questionIndex + (isSubmitted ? 1 : 0)) / questionList.length) * 100;

  useEffect(() => {
    let cancelled = false;

    async function loadLearnerAccount() {
      try {
        const account = await authApiRequest<{
          id: string;
          learners: LearnerProfile[];
        }>("me");
        if (cancelled) {
          return;
        }
        setAccountId(account.id);
        setLearners(account.learners);
        setAccountStatus("signed-in");
        const savedLearnerId = window.localStorage.getItem(
          `competencehub.learner.${account.id}`,
        );
        const savedLearner = account.learners.find(
          (learner) => learner.id === savedLearnerId,
        );
        if (savedLearner) {
          setSelectedLearnerId(savedLearner.id);
        } else if (account.learners.length === 1) {
          setSelectedLearnerId(account.learners[0].id);
          window.localStorage.setItem(
            `competencehub.learner.${account.id}`,
            account.learners[0].id,
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }
        if (error instanceof AuthApiError && error.status === 401) {
          setAccountStatus("signed-out");
          setProgressStatus("loaded");
        } else {
          setAccountStatus("unavailable");
          setProgressError(
            error instanceof Error ? error.message : "Could not load learner profiles.",
          );
          setProgressStatus("unavailable");
        }
      }
    }

    void loadLearnerAccount();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedLearnerId || accountStatus !== "signed-in") {
      return;
    }
    let cancelled = false;

    async function loadProgress() {
      setProgressStatus("loading");
      setProgressError("");
      try {
        const params = new URLSearchParams({
          learner_id: selectedLearnerId,
          grade_id: gradeId,
          subject,
        });
        const result = await questionApiRequest<QuestionProgress>(
          `progress?${params.toString()}`,
        );
        if (cancelled) {
          return;
        }
        const answeredKeys = new Set(result.answered_bank_question_keys);
        const remainingBank = questions.flatMap((item, index) =>
          answeredKeys.has(`bank-${index}`)
            ? []
            : [{ item, questionKey: `bank-${index}` }],
        );
        const pendingGenerated = [...result.pending_generated_questions]
          .reverse()
          .map((item: SavedGeneratedQuestion) => ({
            item: {
              prompt: item.prompt,
              options: item.options,
              correctAnswerIndex: item.correct_answer_index,
              explanation: item.explanation,
            },
            questionKey: `generated:${item.id}`,
          }));
        const resumeQuestions = result.bank_completed
          ? pendingGenerated
          : [...remainingBank, ...pendingGenerated];
        setQuestionList(resumeQuestions.map(({ item }) => item));
        setQuestionKeys(resumeQuestions.map(({ questionKey }) => questionKey));
        setQuestionIndex(0);
        setSelectedAnswer(undefined);
        setIsSubmitted(false);
        setScore(result.total_correct_answers);
        setFinished(resumeQuestions.length === 0);
        setRemainingToday(result.remaining_today);
        setQuotaChecked(true);
        setProgressStatus("loaded");
      } catch (error) {
        if (cancelled) {
          return;
        }
        setProgressError(
          error instanceof Error ? error.message : "Could not load saved practice progress.",
        );
        setProgressStatus("unavailable");
      }
    }

    void loadProgress();
    return () => {
      cancelled = true;
    };
  }, [accountStatus, gradeId, questions, selectedLearnerId, subject]);

  function chooseLearner(learnerId: string) {
    setSelectedLearnerId(learnerId);
    setQuestionList(questions);
    setQuestionKeys(questions.map((_, index) => `bank-${index}`));
    setQuestionIndex(0);
    setSelectedAnswer(undefined);
    setIsSubmitted(false);
    setScore(0);
    setFinished(false);
    setActivityError("");
    setActivitySaved(false);
    setGenerationError("");
    if (accountId && learnerId) {
      window.localStorage.setItem(
        `competencehub.learner.${accountId}`,
        learnerId,
      );
    }
  }

  async function generateMoreQuestions() {
    if (!canSaveProgress || learnerSelectionRequired) {
      setGenerationError(
        accountStatus === "signed-in"
          ? "Choose a learner profile before generating questions."
          : "Sign in to generate and save more questions.",
      );
      return;
    }
    setIsGenerating(true);
    setGenerationError("");
    try {
      const result = await questionApiRequest<GeneratedQuestionsResponse>(
        "generate",
        {
          method: "POST",
          body: {
            learner_id: selectedLearnerId,
            grade_id: gradeId,
            subject,
            recent_questions: [
              ...new Set([
                ...questions.map((item) => item.prompt),
                ...questionList.map((item) => item.prompt),
              ]),
            ],
          },
        },
      );
      if (result.questions.length !== 5) {
        throw new Error("The question service returned an invalid response. Please try again.");
      }
      const newQuestions: PracticeQuestion[] = result.questions.map((item) => ({
        prompt: item.prompt,
        options: item.options,
        correctAnswerIndex: item.correct_answer_index,
        explanation: item.explanation,
      }));
      const startIndex = questionList.length;
      setQuestionList((current) => [...current, ...newQuestions]);
      setQuestionKeys((current) => [
        ...current,
        ...result.questions.map((item) => `generated:${item.id}`),
      ]);
      setQuestionIndex(startIndex);
      setSelectedAnswer(undefined);
      setIsSubmitted(false);
      setFinished(false);
      setRemainingToday(result.remaining_today);
      setQuotaChecked(true);
    } catch (error) {
      if (error instanceof QuestionApiError && error.status === 429) {
        setRemainingToday(0);
        setQuotaChecked(true);
      }
      setGenerationError(
        error instanceof Error ? error.message : "Could not generate questions. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function submitAnswer() {
    if (selectedAnswer === undefined || isSubmitted) {
      return;
    }
    if (isCorrect) {
      setScore((currentScore) => currentScore + 1);
    }
    setIsSubmitted(true);
    setActivitySaved(false);
    setActivityError("");
    if (canSaveProgress) {
      void saveCurrentAttempt();
    }
  }

  async function saveCurrentAttempt() {
    if (!canSaveProgress) {
      return;
    }
    setIsSavingActivity(true);
    setActivityError("");
    try {
      await questionApiRequest("attempt", {
        method: "POST",
        body: {
          learner_id: selectedLearnerId,
          grade_id: gradeId,
          subject,
          question_key: questionKeys[questionIndex],
          source: questionKeys[questionIndex].startsWith("bank-")
            ? "bank"
            : "generated",
          is_correct: isCorrect,
        },
      });
      setActivitySaved(true);
    } catch (error) {
      setActivitySaved(false);
      setActivityError(
        error instanceof Error ? error.message : "Could not save this practice answer.",
      );
    } finally {
      setIsSavingActivity(false);
    }
  }

  function continuePractice() {
    if (!isSubmitted || isSavingActivity || activityError) {
      return;
    }
    if (questionIndex === questionList.length - 1) {
      setFinished(true);
      return;
    }
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(undefined);
    setIsSubmitted(false);
    setActivitySaved(false);
    setActivityError("");
  }

  return (
    <main className="practice-shell">
      <header className="practice-topbar">
        <Link href="/" className="practice-brand">
          <span className="brand-mark">c</span>
          <span><strong>competence</strong><span>HUB</span></span>
        </Link>
        <div className="practice-top-label">JUNIOR PRACTICE · {grade.toUpperCase()}</div>
        <Link href="/" className="leave-practice">
          Change subject
        </Link>
      </header>

      <div className="practice-layout">
        <section className="practice-main">
          <Link className="back-link" href="/">
            ← <span>{dashboardLabel}</span>
          </Link>
          <div className="practice-heading">
            <span className="course-subject">
              {grade.toUpperCase()} · {subject.toUpperCase()} · PRACTICE
            </span>
            <h1>{subject}</h1>
            <p>Answer each question and check your understanding.</p>
          </div>

          {learners.length > 1 && (
            <label className="practice-learner-select">
              Practising as
              <select
                value={selectedLearnerId}
                onChange={(event) => chooseLearner(event.target.value)}
              >
                <option value="">Choose a learner</option>
                {learners.map((learner) => (
                  <option key={learner.id} value={learner.id}>
                    {learner.display_name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {accountStatus === "signed-out" && (
            <p className="practice-account-note" role="status">
              <Link href="/login">Sign in</Link> to save progress across visits and generate more questions.
            </p>
          )}
          {progressStatus === "loading" && accountStatus === "signed-in" && (
            <p className="practice-account-note" role="status">Loading saved practice progress…</p>
          )}
          {progressError && (
            <p className="generation-error" role="alert">{progressError}</p>
          )}
          {learnerSelectionRequired && (
            <p className="practice-account-note" role="status">
              Choose which learner is practising so progress is saved to the right profile.
            </p>
          )}

          <div className="question-card">
            <div className="question-card-top">
              <span className="question-number">
                {finished
                  ? "PRACTICE COMPLETE"
                  : `QUESTION ${questionIndex + 1} OF ${questionList.length}`}
              </span>
              <span className="question-points">
                {finished ? `${score} correct answers` : `${score} correct`}
              </span>
            </div>
            <div className="progress-track question-progress">
              <span style={{ width: `${progress}%` }} />
            </div>

            {finished ? (
              <div className="finish-panel" role="status">
                <span className="finish-icon" aria-hidden="true">✓</span>
                <h2>Practice complete</h2>
                <p>
                  {canSaveProgress
                    ? "Your practice activity is saved for this learner and subject."
                    : "This practice session is complete. Sign in if you want progress saved for future visits."}
                </p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={generateMoreQuestions}
                  disabled={isGenerating || remainingToday === 0 || learnerSelectionRequired}
                >
                  {isGenerating ? "Generating questions…" : "Generate 5 more questions"}
                </button>
                {generationError && (
                  <p className="generation-error" role="alert">
                    {generationError}
                    {(generationError.startsWith("Sign in") ||
                      generationError.startsWith("Choose a learner")) && (
                      <> <Link href="/login">Sign in</Link></>
                    )}
                  </p>
                )}
                <p className="generation-limit">
                  {quotaChecked
                    ? `${remainingToday} generated questions remaining today.`
                    : "Daily limit: up to 10 generated questions per learner. Sign-in required."}
                </p>
                <Link href="/" className="back-link">{dashboardLabel}</Link>
              </div>
            ) : (
              <>
                <h2 className="question-prompt">{question.prompt}</h2>
                <div className="answer-list" role="group" aria-label="Choose one answer">
                  {question.options.map((option, index) => {
                    const selected = selectedAnswer === index;
                    const correct = isSubmitted && index === question.correctAnswerIndex;
                    const incorrect = isSubmitted && selected && !isCorrect;
                    const optionClass = [
                      "answer-option",
                      selected ? "answer-selected" : "",
                      correct ? "answer-correct" : "",
                      incorrect ? "answer-incorrect" : "",
                    ].filter(Boolean).join(" ");

                    return (
                      <button
                        key={option}
                        type="button"
                        className={optionClass}
                        onClick={() => setSelectedAnswer(index)}
                        aria-pressed={selected}
                        disabled={
                          isSubmitted ||
                          accountStatus === "loading" ||
                          learnerSelectionRequired ||
                          (accountStatus === "signed-in" && progressStatus === "loading")
                        }
                      >
                        <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                        <span>{option}</span>
                        <span className="answer-radio" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
                {isSubmitted && (
                  <p className={`answer-feedback ${isCorrect ? "answer-feedback-correct" : "answer-feedback-incorrect"}`} role="status">
                    <strong>{isCorrect ? "Correct." : `Not quite. The correct answer is ${question.options[question.correctAnswerIndex]}.`}</strong>{" "}
                    {question.explanation}
                  </p>
                )}
                {isSubmitted && (
                  <div
                    className={`answer-sync-status ${
                      isSavingActivity
                        ? "answer-sync-pending"
                        : activityError
                          ? "answer-sync-error"
                          : activitySaved
                            ? "answer-sync-saved"
                            : "answer-sync-local"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {isSavingActivity ? (
                      <>
                        <ButtonSpinner />
                        <span>Saving answer to your progress…</span>
                      </>
                    ) : activityError ? (
                      <span>Could not sync this answer. Retry below.</span>
                    ) : activitySaved ? (
                      <>
                        <span className="answer-sync-check" aria-hidden="true">✓</span>
                        <span>Answer synced to your progress</span>
                      </>
                    ) : (
                      <span>
                        {accountStatus === "unavailable"
                          ? "Could not connect to your account. This answer is saved for this visit only."
                          : "This answer is only saved for this visit. Sign in to sync your progress."}
                      </span>
                    )}
                  </div>
                )}
                {activityError && (
                  <div className="generation-error" role="alert">
                    <p>{activityError}</p>
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => void saveCurrentAttempt()}
                      disabled={isSavingActivity}
                    >
                      {isSavingActivity ? "Saving…" : "Retry saving answer"}
                    </button>
                  </div>
                )}
                <div className="question-navigation">
                  <span className="question-points">
                    {isSubmitted ? "Answer checked" : "Choose an answer to continue"}
                  </span>
                  {isSubmitted ? (
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={continuePractice}
                      disabled={isSavingActivity || Boolean(activityError)}
                    >
                      {questionIndex === questionList.length - 1 ? "See results →" : "Next question →"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={submitAnswer}
                      disabled={
                        selectedAnswer === undefined ||
                        accountStatus === "loading" ||
                        learnerSelectionRequired ||
                        (accountStatus === "signed-in" && progressStatus === "loading")
                      }
                    >
                      Check answer →
                    </button>
                  )}
                </div>
                {accountStatus === "unavailable" && (
                  <p className="practice-account-note" role="status">
                    Progress could not be loaded. Answers in this visit are not saved.
                  </p>
                )}
              </>
            )}
          </div>
          <p className="frontend-note">
            Original CBC-aligned practice questions; AI-generated questions are for practice and may need teacher review.
          </p>
        </section>

        <aside className="practice-sidebar">
          <div className="session-card">
            <div className="session-card-heading">
              <span>YOUR SELECTION</span>
              <span className="session-time">{questionList.length} questions</span>
            </div>
            <h2>{grade}</h2>
            <p className="selected-subject-summary">{subject}</p>
            <div className="session-divider" />
            <div className="answered-count">
              <span>Correct answers</span>
              <strong>{score}</strong>
            </div>
            <div className="progress-track sidebar-progress">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="encouragement-card">
            <span aria-hidden="true">✦</span>
            <p><strong>Keep learning!</strong><br />Read the explanation after each answer to strengthen your understanding.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SamplePractice({
  grade,
  subject,
  question,
}: {
  grade: string;
  subject: string;
  question: SampleQuestion;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [finished, setFinished] = useState(false);
  const dashboardLabel = "Back to grade and subjects";

  return (
    <main className="practice-shell">
      <header className="practice-topbar">
        <Link href="/" className="practice-brand">
          <span className="brand-mark">c</span>
          <span><strong>competence</strong><span>HUB</span></span>
        </Link>
        <div className="practice-top-label">
          SAMPLE QUESTION · {grade.toUpperCase()}
        </div>
        <Link href="/" className="leave-practice">
          Change subject
        </Link>
      </header>

      <div className="practice-layout">
        <section className="practice-main">
          <Link className="back-link" href="/">
            ← <span>{dashboardLabel}</span>
          </Link>
          <div className="practice-heading">
            <span className="course-subject">
              {grade.toUpperCase()} · {subject.toUpperCase()} · PRACTICE
            </span>
            <h1>{subject}</h1>
            <p>Try this sample question for your selected grade and subject.</p>
          </div>

          <div className="question-card">
            <div className="question-card-top">
              <span className="question-number">SAMPLE QUESTION</span>
              <span className="question-points">Not graded</span>
            </div>
            <div className="progress-track question-progress">
              <span style={{ width: selectedAnswer === undefined ? "30%" : "100%" }} />
            </div>

            {finished ? (
              <div className="finish-panel" role="status">
                <span className="finish-icon" aria-hidden="true">✓</span>
                <h2>Sample answer saved!</h2>
                <p>
                  This is an illustrative sample question, not an official past
                  paper. Your answer has not been validated or graded. Reviewed
                  exam content and backend grading can be connected later.
                </p>
                <Link href="/" className="button button-primary">
                  {dashboardLabel}
                </Link>
              </div>
            ) : (
              <>
                <h2 className="question-prompt">{question.prompt}</h2>
                <div className="answer-list" role="group" aria-label="Choose one answer">
                  {question.options.map((option, index) => {
                    const selected = selectedAnswer === index;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`answer-option ${selected ? "answer-selected" : ""}`}
                        onClick={() => setSelectedAnswer(index)}
                        aria-pressed={selected}
                      >
                        <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                        <span>{option}</span>
                        <span className="answer-radio" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
                <div className="question-navigation">
                  <span className="question-points">
                    Example only · curriculum review needed
                  </span>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => setFinished(true)}
                    disabled={selectedAnswer === undefined}
                  >
                    Submit sample answer →
                  </button>
                </div>
              </>
            )}
          </div>
          <p className="frontend-note">
            Sample question only · The question is illustrative and the answer is not graded.
          </p>
        </section>

        <aside className="practice-sidebar">
          <div className="session-card">
            <div className="session-card-heading">
              <span>YOUR SELECTION</span>
              <span className="session-time">Example question</span>
            </div>
            <h2>{grade}</h2>
            <p className="selected-subject-summary">{subject}</p>
            <div className="session-divider" />
            <div className="answered-count">
              <span>Sample answer selected</span>
              <strong>{selectedAnswer === undefined ? "No" : "Yes"}</strong>
            </div>
            <div className="progress-track sidebar-progress">
              <span style={{ width: selectedAnswer === undefined ? "0%" : "100%" }} />
            </div>
          </div>
          <div className="encouragement-card">
            <span aria-hidden="true">✦</span>
            <p><strong>Keep exploring!</strong><br />This sample is a starting point. Grade-specific questions can be added to the question bank.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
