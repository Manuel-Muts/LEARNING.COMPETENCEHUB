"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { findGrade, grades, slugifyCurriculumLabel } from "@/lib/curriculum";
import SubscriptionPreviewNotice from "./subscription-preview-notice";

type SelectionStep = 1 | 2 | "selected";

const bandOrder = ["Early years", "Lower primary", "Upper primary", "Junior school"];

export default function LearningSelector() {
  const [step, setStep] = useState<SelectionStep>(1);
  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [ready, setReady] = useState(false);
  const selectedGrade = findGrade(selectedGradeId);
  const selectedSubject = selectedGrade?.subjects.find(
    (subject) => slugifyCurriculumLabel(subject) === selectedSubjectId,
  );

  useEffect(() => {
    const savedGradeId = window.localStorage.getItem("competencehub.grade");
    const savedSubjectId = window.localStorage.getItem("competencehub.subject");
    const grade = savedGradeId ? findGrade(savedGradeId) : undefined;
    const subject = grade?.subjects.find(
      (item) => slugifyCurriculumLabel(item) === savedSubjectId,
    );

    if (grade) {
      setSelectedGradeId(grade.id);
      if (subject) {
        setSelectedSubjectId(slugifyCurriculumLabel(subject));
        setStep("selected");
      } else {
        setStep(2);
      }
    }
    setReady(true);
  }, []);

  function chooseGrade(gradeId: string) {
    setSelectedGradeId(gradeId);
    setSelectedSubjectId("");
    window.localStorage.setItem("competencehub.grade", gradeId);
    window.localStorage.removeItem("competencehub.subject");
    window.dispatchEvent(new Event("competencehub:selection-changed"));
  }

  function changeGrade() {
    setSelectedSubjectId("");
    window.localStorage.removeItem("competencehub.subject");
    window.dispatchEvent(new Event("competencehub:selection-changed"));
    setStep(1);
  }

  function chooseAnotherSubject() {
    if (selectedGrade) {
      setSelectedSubjectId("");
      window.localStorage.removeItem("competencehub.subject");
      window.dispatchEvent(new Event("competencehub:selection-changed"));
      setStep(2);
    }
  }

  if (!ready) {
    return (
      <section className="learning-selector courses-section" id="courses" aria-busy="true">
        <div className="section-heading">
          <div>
            <h2>My learning</h2>
            <p>Loading your learning choices…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="learning-selector courses-section" id="courses">
      <div className="section-heading">
        <div>
          <h2>My learning</h2>
          <p>Choose your grade and subject to get started.</p>
        </div>
        {step !== 1 && (
          <span className="learning-step-indicator">
            {step === 2 ? "STEP 2 OF 2" : "YOUR SELECTION"}
          </span>
        )}
      </div>
      <SubscriptionPreviewNotice content="learning" />

      {step === 1 && (
        <div className="grade-section dashboard-grade-section">
          <div className="selection-section-heading">
            <span className="step-number">1</span>
            <div>
              <h3>Choose your grade</h3>
              <p>Select your current class. Your subjects will be on the next step.</p>
            </div>
          </div>

          <div className="grade-band-list">
            {bandOrder.map((band) => (
              <div className="grade-band" key={band}>
                <h4>{band}</h4>
                <div className="grade-options">
                  {grades.filter((grade) => grade.band === band).map((grade) => (
                    <button
                      className={`grade-option ${selectedGradeId === grade.id ? "grade-option-selected" : ""}`}
                      key={grade.id}
                      type="button"
                      onClick={() => chooseGrade(grade.id)}
                      aria-pressed={selectedGradeId === grade.id}
                    >
                      <span>{grade.label}</span>
                      <span className="grade-option-check" aria-hidden="true">
                        {selectedGradeId === grade.id ? "✓" : ""}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="selection-navigation selection-navigation-next">
            <span className="selection-hint">
              {selectedGrade ? `Selected: ${selectedGrade.label}` : "Choose a grade to continue."}
            </span>
            <button
              className="button button-primary"
              type="button"
              onClick={() => setStep(2)}
              disabled={!selectedGrade}
            >
              Continue to subjects <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && selectedGrade && (
        <div className="subject-step-panel dashboard-subject-panel">
          <div className="subject-step-header">
            <button className="back-step-button" type="button" onClick={changeGrade}>
              <span aria-hidden="true">←</span> Back to grades
            </button>
            <span className="selected-grade-chip">
              Selected grade: <strong>{selectedGrade.label}</strong>
            </span>
          </div>
          <div className="selection-section-heading">
            <span className="step-number">2</span>
            <div>
              <h3>Choose a subject</h3>
              <p>Pick a subject to open its practice page.</p>
            </div>
          </div>
          <div className="subject-grid">
            {selectedGrade.subjects.map((subject, index) => {
              const subjectId = slugifyCurriculumLabel(subject);
              return (
                <Link
                  className="subject-card"
                  href={`/learn/${selectedGrade.id}/${subjectId}`}
                  key={subject}
                  onClick={() => {
                    window.localStorage.setItem("competencehub.subject", subjectId);
                    window.dispatchEvent(new Event("competencehub:selection-changed"));
                  }}
                >
                  <span className={`subject-card-icon subject-card-icon-${index % 5}`} aria-hidden="true">
                    {subjectMark(subject)}
                  </span>
                  <span className="subject-card-name">{subject}</span>
                  <span className="subject-card-arrow" aria-hidden="true">→</span>
                </Link>
              );
            })}
          </div>
          <p className="selection-footnote">
            Sample questions are illustrative and are not graded.
          </p>
        </div>
      )}

      {step === "selected" && selectedGrade && selectedSubject && (
        <div className="selected-learning-card">
          <span className="selected-learning-icon" aria-hidden="true">
            {subjectMark(selectedSubject)}
          </span>
          <div className="selected-learning-copy">
            <span className="course-subject">{selectedGrade.label.toUpperCase()}</span>
            <h3>{selectedSubject}</h3>
            <p>Your grade and subject are saved in this browser for this preview.</p>
          </div>
          <div className="selected-learning-actions">
            <Link
              className="button button-primary"
              href={`/learn/${selectedGrade.id}/${selectedSubjectId}`}
            >
              Continue learning <span aria-hidden="true">→</span>
            </Link>
            <button className="text-link" type="button" onClick={chooseAnotherSubject}>
              Change subject
            </button>
            <button className="text-link" type="button" onClick={changeGrade}>
              Change grade
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function subjectMark(subject: string): string {
  const marks: Record<string, string> = {
    Mathematics: "∑",
    Numberwork: "123",
    English: "Aa",
    Language: "Aa",
    Literacy: "Ab",
    Kiswahili: "K",
    "Environmental Activities": "♧",
    "Science and Technology": "✳",
    "Integrated Science": "✳",
    Agriculture: "♧",
    "Social Studies": "◎",
    "Christian Religious Education": "✦",
    Psychomotor: "↗",
    "Creative Arts": "✎",
    "Creative Arts and Sports": "✎",
    "Pre-Technical Studies": "⚙",
  };

  return marks[subject] ?? "✦";
}
