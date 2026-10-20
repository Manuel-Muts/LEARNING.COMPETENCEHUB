"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ButtonSpinner from "@/components/button-spinner";
import { AuthApiError, authApiRequest } from "@/lib/auth-api";
import type { SampleQuestion } from "@/lib/curriculum";
import type { JuniorComposition } from "@/lib/junior-compositions";
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
      mode: "language";
      gradeId: string;
      grade: string;
      subject: string;
      questions: PracticeQuestion[];
      compositions: JuniorComposition[];
    }
  | {
      mode: "sample";
      grade: string;
      subject: string;
      question: SampleQuestion;
    };

export default function SubjectPracticeClient(props: SubjectPracticeClientProps) {
  if (props.mode === "language") {
    return (
      <LanguageLearning
        gradeId={props.gradeId}
        grade={props.grade}
        subject={props.subject}
        questions={props.questions}
        compositions={props.compositions}
      />
    );
  }

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

function LanguageLearning({
  gradeId,
  grade,
  subject,
  questions,
  compositions,
}: {
  gradeId: string;
  grade: string;
  subject: string;
  questions: PracticeQuestion[];
  compositions: JuniorComposition[];
}) {
  const [section, setSection] = useState<"choose" | "revision" | "writing">("choose");
  const [selectedCompositionIndex, setSelectedCompositionIndex] = useState<number>();
  const selectedComposition = compositions[selectedCompositionIndex ?? -1];

  if (section === "revision") {
    return (
      <JuniorPractice
        gradeId={gradeId}
        grade={grade}
        subject={subject}
        questions={questions}
        onReturnToChoices={() => setSection("choose")}
      />
    );
  }

  const isKiswahili = subject === "Kiswahili";
  const writingLabel = isKiswahili ? "Insha" : "Composition";
  const compositionWordCount = selectedComposition
    ? selectedComposition.paragraphs.join(" ").trim().split(/\s+/).length
    : 0;

  return (
    <main className="practice-shell">
      <header className="practice-topbar">
        <Link href="/dashboard" className="practice-brand">
          <span className="brand-mark">c</span>
          <span><strong>competence</strong><span>HUB</span></span>
        </Link>
        <div className="practice-top-label">LANGUAGE LEARNING · {grade.toUpperCase()}</div>
        <Link href="/dashboard" className="leave-practice">Change subject</Link>
      </header>

      <div className="practice-layout language-learning-layout">
        <section className="practice-main">
          <Link className="back-link" href="/dashboard">
            ← <span>Back to grade and subjects</span>
          </Link>
          <div className="practice-heading">
            <span className="course-subject">{grade.toUpperCase()} · {subject.toUpperCase()}</span>
            <h1>{section === "writing" ? writingLabel : subject}</h1>
            <p>
              {section === "writing"
                ? `Read these ${compositions.length} ${grade} model ${isKiswahili ? "inshas" : "compositions"} and notice how each one is organised.`
                : `Choose how you would like to practise ${subject}.`}
            </p>
          </div>

          {section === "choose" ? (
            <div className="language-choice-grid">
              <button
                className="language-choice-card"
                type="button"
                onClick={() => setSection("revision")}
              >
                <span className="language-choice-icon" aria-hidden="true">✓</span>
                <span className="language-choice-copy">
                  <strong>Revision questions</strong>
                  <span>Practise grammar, reading and language skills with questions.</span>
                </span>
                <span className="language-choice-arrow" aria-hidden="true">→</span>
              </button>
              <button
                className="language-choice-card"
                type="button"
                onClick={() => setSection("writing")}
              >
                <span className="language-choice-icon language-writing-icon" aria-hidden="true">✎</span>
                <span className="language-choice-copy">
                  <strong>{writingLabel}</strong>
                  <span>Explore ten extended model topics and examples for {grade}.</span>
                </span>
                <span className="language-choice-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <>
              <button
                className="back-link language-return-link"
                type="button"
                onClick={() => {
                  setSelectedCompositionIndex(undefined);
                  setSection("choose");
                }}
              >
                ← <span>Back to {subject} options</span>
              </button>
              {selectedComposition ? (
                <article className="composition-reading-card">
                  <div className="composition-reading-heading">
                    <span className="question-number">{writingLabel.toUpperCase()} {(selectedCompositionIndex ?? 0) + 1}</span>
                    <span className="composition-type">{selectedComposition.writingType}</span>
                    <h2>{selectedComposition.title}</h2>
                    <p>{selectedComposition.prompt}</p>
                    <span className="composition-word-count">About {compositionWordCount} words</span>
                  </div>
                  {selectedComposition.openingPhrase && (
                    <blockquote className="composition-opening">
                      <strong>Opening sentence:</strong> {selectedComposition.openingPhrase}
                    </blockquote>
                  )}
                  <div className="composition-paragraphs">
                    {selectedComposition.paragraphs.map((paragraph, index) => (
                      <p key={`${selectedComposition.title}-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                  <p className="composition-study-tip">
                    {isKiswahili ? (
                      <>
                        <strong>Dokezo la kujifunza:</strong> {selectedComposition.writingType?.toLowerCase()} hii ina takribani maneno {compositionWordCount}.
                        Fuata muundo ulioonyeshwa: hotuba huanza kwa kuwasalimu wasikilizaji na
                        kumalizika kwa heshima; barua hutumia salamu na hitimisho linalofaa; na
                        hadithi za kuendeleza huanzia kwenye sentensi uliyopewa. Zingatia mawazo,
                        matumizi ya alama za uandishi na nyakati za vitenzi, kisha fanya mazoezi
                        kwa kutumia maneno yako mwenyewe. Ikiwa maelekezo ya mwalimu wako ni tofauti,
                        yafuate.
                      </>
                    ) : (
                      <>
                        <strong>Learning tip:</strong> This {selectedComposition.writingType?.toLowerCase()} is about {compositionWordCount} words.
                        Follow the format shown: speeches greet the audience and close politely,
                        letters use the right greeting and sign-off, and continuation stories begin
                        from the given opening. Notice the ideas, punctuation and verb tenses, then
                        practise in your own words. Follow your teacher&apos;s instructions if they differ.
                      </>
                    )}
                  </p>
                  <button
                    className="text-link composition-back-button"
                    type="button"
                    onClick={() => setSelectedCompositionIndex(undefined)}
                  >
                    ← Choose another topic
                  </button>
                </article>
              ) : (
                <div className="language-composition-list">
                  {compositions.map((composition, index) => (
                    <button
                      className="language-composition-card"
                      key={composition.title}
                      type="button"
                      onClick={() => setSelectedCompositionIndex(index)}
                    >
                      <span className="language-composition-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="language-composition-copy">
                        <strong>{composition.title}</strong>
                        <span>{composition.prompt}</span>
                      </span>
                      <span className="composition-type">{composition.writingType}</span>
                      <span className="language-choice-arrow" aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
        <aside className="practice-sidebar language-learning-sidebar">
          <div className="session-card">
            <div className="session-card-heading">
              <span>WRITING PRACTICE</span>
              <span className="session-time">{compositions.length} models</span>
            </div>
            <h2>Build your writing skills</h2>
            <p className="language-sidebar-copy">
              Explore {compositions.length} writing models for {grade}. Notice the order
              of ideas, linking words, punctuation and verb tenses, then practise in your own words.
            </p>
            <div className="session-divider" />
            <p className="language-sidebar-label">FOR YOUR GRADE</p>
            <strong className="language-sidebar-grade">{grade} · {subject}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

function JuniorPractice({
  gradeId,
  grade,
  subject,
  questions,
  onReturnToChoices,
}: {
  gradeId: string;
  grade: string;
  subject: string;
  questions: PracticeQuestion[];
  onReturnToChoices?: () => void;
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
  const canGenerateQuestions = /^grade-[789]$/.test(gradeId);
  const learnerSelectionRequired = learners.length > 1 && !selectedLearnerId;
  const canSaveProgress = accountStatus === "signed-in" && Boolean(selectedLearnerId);
  const isLoadingPractice =
    accountStatus === "loading" ||
    (accountStatus === "signed-in" && !learnerSelectionRequired && progressStatus === "loading");
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
        <Link href="/dashboard" className="practice-brand">
          <span className="brand-mark">c</span>
          <span><strong>competence</strong><span>HUB</span></span>
        </Link>
        <div className="practice-top-label">JUNIOR PRACTICE · {grade.toUpperCase()}</div>
        {onReturnToChoices ? (
          <button
            className="leave-practice-button"
            type="button"
            onClick={onReturnToChoices}
          >
            {subject} options
          </button>
        ) : (
          <Link href="/dashboard" className="leave-practice">
            Change subject
          </Link>
        )}
      </header>

      <div className="practice-layout">
        <section className="practice-main">
          {onReturnToChoices ? (
            <button
              className="back-link practice-return-button"
              type="button"
              onClick={onReturnToChoices}
            >
              ← <span>Back to {subject} options</span>
            </button>
          ) : (
            <Link className="back-link" href="/dashboard">
              ← <span>{dashboardLabel}</span>
            </Link>
          )}
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
              <Link href="/login">Sign in</Link> to save progress across visits
              {canGenerateQuestions ? " and generate more questions" : ""}.
            </p>
          )}
          {isLoadingPractice && (
            <div className="progress-loading-panel" role="status" aria-live="polite" aria-busy="true">
              <div className="progress-loading-art" aria-hidden="true">
                <span className="progress-loading-orbit progress-loading-orbit-one" />
                <span className="progress-loading-orbit progress-loading-orbit-two" />
                <span className="progress-loading-spark">✦</span>
                <span className="progress-loading-book">▤</span>
              </div>
              <div className="progress-loading-copy">
                <strong>
                  {accountStatus === "loading"
                    ? "Getting your learning space ready"
                    : "Picking up where you left off"}
                </strong>
                <span>
                  {accountStatus === "loading"
                    ? "Checking your learner profile and saved progress."
                    : "Your saved answers are on their way. Your questions will be ready in a moment."}
                </span>
                <div className="progress-loading-steps" aria-hidden="true">
                  <span className={accountStatus === "signed-in" ? "progress-loading-step-done" : "progress-loading-step-active"}>
                    <i>{accountStatus === "signed-in" ? "✓" : "1"}</i> Profile
                  </span>
                  <span className={accountStatus === "signed-in" ? "progress-loading-step-active" : ""}>
                    <i>2</i> Progress
                  </span>
                  <span><i>3</i> Ready
                  </span>
                </div>
                <div className="progress-loading-track" aria-hidden="true"><span /></div>
              </div>
            </div>
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
                {canGenerateQuestions ? (
                  <>
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
                  </>
                ) : (
                  <p className="generation-limit">You’ve completed the available questions for this subject.</p>
                )}
                <Link href="/dashboard" className="back-link">{dashboardLabel}</Link>
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
        <Link href="/dashboard" className="practice-brand">
          <span className="brand-mark">c</span>
          <span><strong>competence</strong><span>HUB</span></span>
        </Link>
        <div className="practice-top-label">
          SAMPLE QUESTION · {grade.toUpperCase()}
        </div>
        <Link href="/dashboard" className="leave-practice">
          Change subject
        </Link>
      </header>

      <div className="practice-layout">
        <section className="practice-main">
          <Link className="back-link" href="/dashboard">
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
                <Link href="/dashboard" className="button button-primary">
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
