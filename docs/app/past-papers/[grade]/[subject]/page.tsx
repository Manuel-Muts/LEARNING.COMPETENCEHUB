import Link from "next/link";
import { notFound } from "next/navigation";
import { findGrade, slugifyCurriculumLabel } from "@/lib/curriculum";
import { getPastPapers } from "@/lib/past-papers";

export default async function PastPapersPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string }>;
}) {
  const { grade: gradeId, subject: subjectId } = await params;
  const grade = findGrade(gradeId);
  const subject = grade?.subjects.find(
    (candidate) => slugifyCurriculumLabel(candidate) === subjectId,
  );

  if (!grade || !subject) {
    notFound();
  }

  const papers = getPastPapers(grade.id, subject);

  return (
    <main className="practice-shell">
      <header className="practice-topbar">
        <Link href="/" className="practice-brand">
          <span className="brand-mark">c</span>
          <span><strong>competence</strong><span>HUB</span></span>
        </Link>
        <div className="practice-top-label">PAST PAPERS · {grade.label.toUpperCase()}</div>
        <Link href="/" className="leave-practice">Back to dashboard</Link>
      </header>

      <div className="past-papers-page">
        <Link className="back-link" href="/">
          ← <span>Back to Past Papers</span>
        </Link>
        <div className="practice-heading">
          <span className="course-subject">
            {grade.label.toUpperCase()} · {subject.toUpperCase()}
          </span>
          <h1>{subject} past papers</h1>
          <p>Browse and download the available papers for this subject.</p>
        </div>

        {papers.length > 0 ? (
          <div className="past-paper-list">
            {papers.map((paper) => (
              <article className="past-paper-card" key={`${paper.year}-${paper.title}`}>
                <span className="exam-subject-icon" aria-hidden="true">PDF</span>
                <div className="exam-subject-copy">
                  <h2>{paper.title}</h2>
                  <p>{paper.year}</p>
                </div>
                <a
                  className="button button-primary exam-open-button"
                  href={paper.pdfUrl}
                  download
                >
                  Download PDF <span aria-hidden="true">↓</span>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="exam-empty-state past-papers-empty-state">
            <h2>No past papers have been added yet</h2>
            <p>
              Past-paper PDFs for {grade.label} {subject} will appear here once
              they are configured.
            </p>
            <Link className="button button-secondary" href="/">
              Return to dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
