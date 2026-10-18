"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchManagedPastPapersPage, type ManagedPastPaper } from "@/lib/past-papers";

const PAGE_SIZE = 10;

export default function PastPapersClient({
  gradeId,
  gradeLabel,
  subject,
}: {
  gradeId: string;
  gradeLabel: string;
  subject: string;
}) {
  const [managedPapers, setManagedPapers] = useState<ManagedPastPaper[]>([]);
  const [totalPapers, setTotalPapers] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    void fetchManagedPastPapersPage(gradeId, subject, page)
      .then((result) => {
        if (active) {
          setManagedPapers(result.items);
          setTotalPapers(result.total);
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Past papers could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [gradeId, subject, page]);

  const pageCount = Math.ceil(totalPapers / PAGE_SIZE);
  const firstPaper = totalPapers ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastPaper = Math.min(page * PAGE_SIZE, totalPapers);

  return (
    <main className="practice-shell">
      <header className="practice-topbar">
        <Link href="/dashboard" className="practice-brand">
          <span className="brand-mark">c</span>
          <span><strong>competence</strong><span>HUB</span></span>
        </Link>
        <div className="practice-top-label">PAST PAPERS · {gradeLabel.toUpperCase()}</div>
        <Link href="/dashboard" className="leave-practice">Back to dashboard</Link>
      </header>

      <div className="past-papers-page">
        <Link className="back-link" href="/dashboard">← <span>Back to Past Papers</span></Link>
        <div className="practice-heading">
          <span className="course-subject">{gradeLabel.toUpperCase()} · {subject.toUpperCase()}</span>
          <h1>{subject} past papers</h1>
          <p>Browse and download the available papers for this subject.</p>
        </div>
        {error && <p className="admin-message" role="alert">{error}</p>}
        {loading ? (
          <p className="exams-loading">Loading available past papers…</p>
        ) : managedPapers.length > 0 ? (
          <>
            <div className="past-papers-table-wrap">
              <table className="past-papers-table">
                <thead>
                  <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Title</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {managedPapers.map((paper: ManagedPastPaper) => (
                    <tr key={paper.id}>
                      <td>
                        <time dateTime={paper.createdAt}>
                          {new Date(paper.createdAt).toLocaleDateString()}
                        </time>
                      </td>
                      <td>
                        <strong className="past-paper-title">{paper.title}</strong>
                        <span className="past-paper-file-meta">
                          {paper.year} · {paper.filename.split(".").pop()?.toUpperCase() ?? "DOCUMENT"}
                        </span>
                      </td>
                      <td>
                        <a className="button button-primary past-paper-download" href={paper.pdfUrl}>
                          Download <span aria-hidden="true">↓</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pageCount > 1 && (
              <nav className="past-papers-pagination" aria-label="Past papers pagination">
                <span>Showing {firstPaper}–{lastPaper} of {totalPapers}</span>
                <div>
                  <button
                    className="past-papers-page-button"
                    disabled={page <= 1}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                    type="button"
                  >
                    Previous
                  </button>
                  <span aria-live="polite">Page {page} of {pageCount}</span>
                  <button
                    className="past-papers-page-button"
                    disabled={page >= pageCount}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}
          </>
        ) : (
          <div className="exam-empty-state past-papers-empty-state">
            <h2>No past papers have been added yet</h2>
            <p>Past-paper PDFs for {gradeLabel} {subject} will appear here when uploaded.</p>
            <Link className="button button-secondary" href="/dashboard">Return to dashboard</Link>
          </div>
        )}
      </div>
    </main>
  );
}
