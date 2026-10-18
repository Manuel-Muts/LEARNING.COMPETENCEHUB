"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lesson } from "@/lib/lessons";

export default function PracticeClient({ lesson }: { lesson: Lesson }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const question = lesson.questions[current];

  function selectAnswer(optionIndex: number) {
    if (finished) return;
    setAnswers((previous) => ({ ...previous, [current]: optionIndex }));
  }

  function finishPractice() {
    setFinished(true);
  }

  return (
    <main className="practice-shell">
      <header className="practice-topbar">
        <Link href="/learn" className="practice-brand">
          <span className="brand-mark">c</span>
          <span><strong>competence</strong><span>HUB</span></span>
        </Link>
        <div className="practice-top-label">PRACTICE SESSION</div>
        <Link href="/dashboard" className="leave-practice">Save &amp; exit</Link>
      </header>

      <div className="practice-layout">
        <section className="practice-main">
          <Link className="back-link" href="/dashboard">← <span>Back to your learning</span></Link>
          <div className="practice-heading">
            <span className="course-subject">{lesson.subject}</span>
            <h1>{lesson.title}</h1>
            <p>{lesson.description}</p>
          </div>

          <div className="question-card">
            <div className="question-card-top">
              <span className="question-number">QUESTION {current + 1} <span>OF {lesson.questions.length}</span></span>
              <span className="question-points">1 point</span>
            </div>
            <div
              className="progress-track question-progress"
              role="progressbar"
              aria-label="Question progress"
              aria-valuenow={current + 1}
              aria-valuemin={1}
              aria-valuemax={lesson.questions.length}
            >
              <span style={{ width: `${((current + 1) / lesson.questions.length) * 100}%` }} />
            </div>

            {finished ? (
              <div className="finish-panel" role="status">
                <span className="finish-icon" aria-hidden="true">✓</span>
                <h2>Practice complete!</h2>
                <p>
                  You answered {Object.keys(answers).length} of {lesson.questions.length} questions.
                  Your answers haven’t been graded—backend grading will be added in a future step.
                </p>
                <Link href="/dashboard" className="button button-primary">Back to overview</Link>
              </div>
            ) : (
              <>
                <h2 className="question-prompt">{question.prompt}</h2>
                <div className="answer-list" role="group" aria-label="Choose one answer">
                  {question.options.map((option, index) => {
                    const selected = answers[current] === index;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`answer-option ${selected ? "answer-selected" : ""}`}
                        onClick={() => selectAnswer(index)}
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
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setCurrent((value) => Math.max(0, value - 1))}
                    disabled={current === 0}
                  >
                    ← Previous
                  </button>
                  {current < lesson.questions.length - 1 ? (
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => setCurrent((value) => value + 1)}
                    >
                      Next question →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={finishPractice}
                    >
                      Finish practice →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          <p className="frontend-note">
            Frontend preview · Your answers stay in this browser and are not graded yet.
          </p>
        </section>

        <aside className="practice-sidebar">
          <div className="session-card">
            <div className="session-card-heading">
              <span>YOUR SESSION</span>
              <span className="session-time">◷ &nbsp;{lesson.duration}</span>
            </div>
            <h2>Question list</h2>
            <div className="question-index-list">
              {lesson.questions.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  className={`question-index ${current === index ? "question-index-active" : ""} ${answers[index] !== undefined ? "question-index-answered" : ""}`}
                  onClick={() => !finished && setCurrent(index)}
                  aria-label={`Go to question ${index + 1}${answers[index] !== undefined ? ", answered" : ", not answered"}`}
                  aria-current={current === index ? "step" : undefined}
                  disabled={finished}
                >
                  <span>{index + 1}</span>
                  <span>Question {index + 1}</span>
                  <span className="question-index-check">{answers[index] !== undefined ? "✓" : ""}</span>
                </button>
              ))}
            </div>
            <div className="session-divider" />
            <div className="answered-count">
              <span>Questions answered</span>
              <strong>{Object.keys(answers).length} <span>/ {lesson.questions.length}</span></strong>
            </div>
            <div className="progress-track sidebar-progress">
              <span style={{ width: `${(Object.keys(answers).length / lesson.questions.length) * 100}%` }} />
            </div>
          </div>
          <div className="encouragement-card">
            <span aria-hidden="true">✦</span>
            <p><strong>You’ve got this!</strong><br />Take your time. You can move between questions whenever you like.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
