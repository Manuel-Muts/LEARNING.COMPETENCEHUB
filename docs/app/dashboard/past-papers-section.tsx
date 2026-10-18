"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { findGrade, getPastPaperSubjects, grades, slugifyCurriculumLabel } from "@/lib/curriculum";
import { fetchManagedPastPapers, getPastPapers, type ManagedPastPaper } from "@/lib/past-papers";

const selectedGradeStorageKey = "competencehub.grade";

export default function PastPapersSection() {
  const [gradeId, setGradeId] = useState("");
  const [showSubjects, setShowSubjects] = useState(false);
  const [ready, setReady] = useState(false);
  const [managedPapers, setManagedPapers] = useState<ManagedPastPaper[]>([]);
  const [papersError, setPapersError] = useState("");
  const grade = findGrade(gradeId);

  useEffect(() => {
    const savedGrade = window.localStorage.getItem(selectedGradeStorageKey);
    if (savedGrade && findGrade(savedGrade)) {
      setGradeId(savedGrade);
      setShowSubjects(true);
    }
    setReady(true);
    void fetchManagedPastPapers()
      .then(setManagedPapers)
      .catch((error: unknown) => {
        setPapersError(error instanceof Error ? error.message : "Past papers could not be loaded.");
      });
  }, []);

  function chooseGrade(id: string) {
    setGradeId(id);
    setShowSubjects(true);
  }

  return (
    <section className="dashboard-tab-content exams-section">
      <div className="dashboard-tab-heading">
        <span className="eyebrow">REVISION RESOURCES</span>
        <h1>Past Papers</h1>
        <p>
          {grade
            ? `Browse downloadable past-paper PDFs for ${grade.label}.`
            : "Choose a grade and subject to browse downloadable past-paper PDFs."}
        </p>
      </div>

      {!showSubjects ? (
        <div className="exam-grade-panel">
          <div className="selection-section-heading">
            <span className="step-number">1</span>
            <div>
              <h3>Choose a grade</h3>
              <p>Select the grade whose past papers you want to browse.</p>
            </div>
          </div>
          {ready ? (
            <div className="exam-grade-grid">
              {grades.map((item) => (
                <button
                  className={`exam-grade-option ${gradeId === item.id ? "exam-grade-option-selected" : ""}`}
                  key={item.id}
                  type="button"
                  onClick={() => chooseGrade(item.id)}
                  aria-pressed={gradeId === item.id}
                >
                  <span>{item.label}</span>
                  <span className="exam-grade-band">{item.band}</span>
                  <span className="exam-grade-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="exams-loading">Loading available grades…</p>
          )}
        </div>
      ) : grade ? (
        <div className="exam-subject-panel">
          <div className="exam-panel-header">
            <button
              className="back-step-button"
              type="button"
              onClick={() => {
                setShowSubjects(false);
                setGradeId("");
              }}
            >
              <span aria-hidden="true">←</span> Choose another grade
            </button>
            <span className="selected-grade-chip">
              Selected grade: <strong>{grade.label}</strong>
            </span>
          </div>
          <div className="selection-section-heading">
            <span className="step-number">2</span>
            <div>
              <h3>Choose a subject</h3>
              <p>Open a subject to view its available past papers.</p>
            </div>
          </div>

          <div className="exam-subject-list">
            {getPastPaperSubjects(grade).map((subject) => {
              const paperCount = getPastPapers(grade.id, subject).length + managedPapers.filter(
                (paper) => paper.gradeId === grade.id && paper.subject === subject,
              ).length;
              return (
                <article className="exam-subject-card" key={subject}>
                  <span className="exam-subject-icon" aria-hidden="true">▤</span>
                  <div className="exam-subject-copy">
                    <h4>{subject}</h4>
                    <p>
                      {paperCount === 1
                        ? "1 past paper available"
                        : `${paperCount} past papers available`}
                    </p>
                  </div>
                  <Link
                    className="button button-primary exam-open-button"
                    href={`/past-papers/${grade.id}/${slugifyCurriculumLabel(subject)}`}
                  >
                    Revise <span aria-hidden="true">→</span>
                  </Link>
                </article>
              );
            })}
          </div>
          {papersError && <p className="admin-message" role="alert">{papersError}</p>}
        </div>
      ) : (
        <div className="exam-empty-state">
          <h4>This grade is not available</h4>
          <p>Please go back and choose a grade from the list.</p>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setGradeId("");
              setShowSubjects(false);
            }}
          >
            Back to grades
          </button>
        </div>
      )}
    </section>
  );
}
