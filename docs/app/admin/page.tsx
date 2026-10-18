"use client";

import { useEffect, useState, type FormEvent } from "react";
import { grades, hasPredictions, PREDICTIONS_SUBJECT } from "@/lib/curriculum";
import { getCachedRequest, invalidateCachedRequests } from "@/lib/request-cache";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
).replace(/\/+$/, "");

type Admin = { email: string };
type AdminUser = {
  id: string;
  phone: string;
  email: string | null;
  created_at: string;
  learners: { id: string; display_name: string; grade_id: string | null }[];
};
type PastPaper = {
  id: string;
  title: string;
  grade_id: string;
  subject: string;
  year: number;
  filename: string;
  content_type: string;
  created_at: string;
};
type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};
type AdminTab = "overview" | "papers" | "users";
type PapersTab = "upload" | "uploaded";
const ADMIN_PAGE_SIZE = 5;
const ADMIN_TABLE_CACHE_TTL_MS = 30_000;

class AdminRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function adminRequest<T>(
  path: string,
  options: { method?: "GET" | "POST" | "DELETE"; body?: BodyInit } = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${API_URL}/${path}`, {
      method: options.method ?? "GET",
      credentials: "include",
      headers:
        options.body && !(options.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : undefined,
      body: options.body,
      signal: controller.signal,
    });
    const result = (await response.json().catch(() => ({}))) as { detail?: string } & T;
    if (!response.ok) {
      throw new AdminRequestError(
        result.detail ?? `Request failed (${response.status}).`,
        response.status,
      );
    }
    return result;
  } catch (error) {
    if (error instanceof AdminRequestError) throw error;
    if (controller.signal.aborted) {
      throw new Error("The admin API did not respond. Check that the backend and database are running.");
    }
    throw new Error("Could not reach the admin API. Check that the backend is running.");
  } finally {
    window.clearTimeout(timeout);
  }
}

function cachedAdminRequest<T>(path: string, forceFresh = false): Promise<T> {
  return getCachedRequest(
    `admin:${path}`,
    () => adminRequest<T>(path),
    ADMIN_TABLE_CACHE_TTL_MS,
    forceFresh,
  );
}

function uploadAdminDocument<T>(
  body: FormData,
  onProgress: (progress: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${API_URL}/admin/past-papers`);
    request.withCredentials = true;
    request.timeout = 120_000;
    request.setRequestHeader("Accept", "application/json");
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.min(90, Math.round((event.loaded / event.total) * 90)));
      }
    };
    request.onload = () => {
      let result: unknown;
      try {
        result = JSON.parse(request.responseText);
      } catch {
        reject(new Error("The server returned an invalid upload response."));
        return;
      }
      if (request.status < 200 || request.status >= 300) {
        const detail =
          typeof result === "object" &&
          result !== null &&
          "detail" in result &&
          typeof result.detail === "string"
            ? result.detail
            : `Upload failed (${request.status}).`;
        reject(new AdminRequestError(detail, request.status));
        return;
      }
      onProgress(100);
      resolve(result as T);
    };
    request.onerror = () => reject(new Error("Could not reach the admin API. Check that the backend is running."));
    request.ontimeout = () => reject(new Error("The upload timed out. Please try again."));
    request.onabort = () => reject(new Error("The upload was cancelled."));
    request.send(body);
  });
}

export default function AdminPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [papersTab, setPapersTab] = useState<PapersTab>("upload");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [paperPage, setPaperPage] = useState(1);
  const [paperTotal, setPaperTotal] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState(grades[0].id);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [papersLoading, setPapersLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    if (!successToast) return;
    const timeout = window.setTimeout(() => setSuccessToast(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [successToast]);

  async function loadDashboard() {
    const currentAdmin = await adminRequest<Admin>("admin/me");
    setAdmin(currentAdmin);
    setPapersLoading(true);
    setUsersLoading(true);
    try {
      const [registeredUsers, documents] = await Promise.all([
        cachedAdminRequest<PaginatedResult<AdminUser>>("admin/users/page?page=1"),
        cachedAdminRequest<PaginatedResult<PastPaper>>("admin/past-papers/page?page=1"),
      ]);
      setUsers(registeredUsers.items);
      setUserPage(registeredUsers.page);
      setUserTotal(registeredUsers.total);
      setPapers(documents.items);
      setPaperPage(documents.page);
      setPaperTotal(documents.total);
    } finally {
      setPapersLoading(false);
      setUsersLoading(false);
    }
  }

  async function loadPapers(page: number, forceFresh = false) {
    setPapersLoading(true);
    try {
      const result = await cachedAdminRequest<PaginatedResult<PastPaper>>(
        `admin/past-papers/page?page=${page}`,
        forceFresh,
      );
      setPapers(result.items);
      setPaperPage(result.page);
      setPaperTotal(result.total);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load uploaded past papers.");
    } finally {
      setPapersLoading(false);
    }
  }

  async function loadUsers(page: number, forceFresh = false) {
    setUsersLoading(true);
    try {
      const result = await cachedAdminRequest<PaginatedResult<AdminUser>>(
        `admin/users/page?page=${page}`,
        forceFresh,
      );
      setUsers(result.items);
      setUserPage(result.page);
      setUserTotal(result.total);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load registered accounts.");
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const currentAdmin = await adminRequest<Admin>("admin/me");
        if (active) setAdmin(currentAdmin);
        const [registeredUsers, documents] = await Promise.all([
          cachedAdminRequest<PaginatedResult<AdminUser>>("admin/users/page?page=1"),
          cachedAdminRequest<PaginatedResult<PastPaper>>("admin/past-papers/page?page=1"),
        ]);
        if (active) {
          setUsers(registeredUsers.items);
          setUserPage(registeredUsers.page);
          setUserTotal(registeredUsers.total);
          setPapers(documents.items);
          setPaperPage(documents.page);
          setPaperTotal(documents.total);
        }
      } catch (error) {
        if (active && !(error instanceof AdminRequestError && error.status === 401)) {
          setMessage(error instanceof Error ? error.message : "Could not load admin page.");
        }
      } finally {
        if (active) setPapersLoading(false);
        if (active) setUsersLoading(false);
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      await adminRequest<Admin>("admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        }),
      });
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setUploadProgress(0);
    setMessage("");
    setSuccessToast("");
    try {
      const uploadedPaper = await uploadAdminDocument<PastPaper>(
        new FormData(formElement),
        setUploadProgress,
      );
      invalidateCachedRequests("admin:admin/past-papers/page");
      invalidateCachedRequests("learner:past-papers:");
      formElement.reset();
      setSelectedGrade(grades[0].id);
      setPapers((currentPapers) => [uploadedPaper, ...currentPapers]);
      setActiveTab("papers");
      setPapersTab("uploaded");
      await loadPapers(1, true);
      setSuccessToast("Past paper uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The PDF could not be uploaded.");
    } finally {
      setBusy(false);
      setUploadProgress(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this past paper? This cannot be undone.")) return;
    setBusy(true);
    setMessage("");
    try {
      await adminRequest(`admin/past-papers/${id}`, { method: "DELETE" });
      invalidateCachedRequests("admin:admin/past-papers/page");
      invalidateCachedRequests("learner:past-papers:");
      const nextPage = papers.length === 1 && paperPage > 1 ? paperPage - 1 : paperPage;
      await loadPapers(nextPage, true);
      setMessage("Past paper deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The past paper could not be deleted.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    try {
      await adminRequest("admin/logout", { method: "POST" });
      invalidateCachedRequests("admin:");
      setAdmin(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign out.");
    } finally {
      setBusy(false);
    }
  }

  if (!admin) {
    return (
      <main className="admin-page admin-login-page">
        <section className="admin-login-card">
          <a className="admin-brand" href="/">Competence<span>Hub</span></a>
          <span className="admin-eyebrow">SITE ADMINISTRATION</span>
          {loading && <p className="admin-session-check">Checking for an existing admin session…</p>}
          <h1>Admin sign in</h1>
          <p>Sign in to manage revision PDFs and view registered accounts.</p>
          <form className="admin-form" onSubmit={handleLogin}>
            <label>Email address<input autoComplete="username" name="email" required type="email" /></label>
            <label>Password<input autoComplete="current-password" name="password" required type="password" /></label>
            {message && <p className="admin-message" role="alert">{message}</p>}
            <button className="admin-primary-button" disabled={busy} type="submit">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <a className="admin-home-link" href="/">Return to CompetenceHub</a>
        </section>
      </main>
    );
  }

  const grade = grades.find((item) => item.id === selectedGrade) ?? grades[0];
  const supportsPredictions = hasPredictions(selectedGrade);
  return (
    <main className="admin-page">
      <header className="admin-header">
        <a className="admin-brand" href="/">Competence<span>Hub</span></a>
        <div className="admin-header-account">
          <span>{admin.email}</span>
          <button className="admin-secondary-button" disabled={busy} onClick={handleLogout} type="button">Sign out</button>
        </div>
      </header>
      <div className="admin-content">
        {successToast && (
          <div className="admin-success-toast" role="status" aria-live="polite">
            <span aria-hidden="true">✓</span>
            {successToast}
          </div>
        )}
        <div className="admin-heading">
          <div><span className="admin-eyebrow">SITE ADMINISTRATION</span><h1>Admin dashboard</h1>
            <p>Manage past-paper PDFs and review registered accounts.</p></div>
        </div>
        {message && <p className="admin-message" role="status">{message}</p>}
        <div className="admin-tabs" role="tablist" aria-label="Admin dashboard sections">
          {([
            ["overview", "Overview"],
            ["papers", "Past Papers"],
            ["users", "Registered Accounts"],
          ] as const).map(([tab, label]) => (
            <button
              aria-controls={`admin-panel-${tab}`}
              aria-selected={activeTab === tab}
              className={`admin-tab ${activeTab === tab ? "admin-tab-active" : ""}`}
              id={`admin-tab-${tab}`}
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMessage("");
              }}
              role="tab"
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <section
          aria-labelledby={`admin-tab-${activeTab}`}
          className="admin-tab-panel"
          id={`admin-panel-${activeTab}`}
          role="tabpanel"
          tabIndex={0}
        >
          {activeTab === "overview" && (
            <>
              <div className="admin-stats">
                <article><span>REGISTERED ACCOUNTS</span><strong>{userTotal}</strong></article>
                <article><span>AVAILABLE PDF PAPERS</span><strong>{paperTotal}</strong></article>
              </div>
              <div className="admin-overview-cards">
                <button className="admin-overview-card" onClick={() => setActiveTab("papers")} type="button">
                  <strong>Manage Past Papers</strong>
                  <span>Upload PDFs and manage files available to learners.</span>
                  <span className="admin-overview-link">Open past papers →</span>
                </button>
                <button className="admin-overview-card" onClick={() => setActiveTab("users")} type="button">
                  <strong>Registered Accounts</strong>
                  <span>Review guardian contact details and learner profiles.</span>
                  <span className="admin-overview-link">View accounts →</span>
                </button>
              </div>
            </>
          )}
          {activeTab === "papers" && (
            <>
              <div className="admin-tabs admin-subtabs" role="tablist" aria-label="Past paper sections">
                {([
                  ["upload", "Upload past paper"],
                  ["uploaded", "Uploaded past papers"],
                ] as const).map(([tab, label]) => (
                  <button
                    aria-controls={`admin-papers-panel-${tab}`}
                    aria-selected={papersTab === tab}
                    className={`admin-tab ${papersTab === tab ? "admin-tab-active" : ""}`}
                    id={`admin-papers-tab-${tab}`}
                    key={tab}
                    onClick={() => {
                      setPapersTab(tab);
                      setMessage("");
                      if (tab === "uploaded") void loadPapers(paperPage);
                    }}
                    role="tab"
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
              {papersTab === "upload" ? (
                <section
                  aria-labelledby="admin-papers-tab-upload"
                  className="admin-panel"
                  id="admin-papers-panel-upload"
                  role="tabpanel"
                  tabIndex={0}
                >
                  <div className="admin-panel-heading"><div><h2>Upload a past paper</h2><p>PDF or Word document (.doc, .docx), up to 20 MB. The current year is assigned automatically.</p></div></div>
                  <form className="admin-upload-form" onSubmit={handleUpload}>
                    <label>Paper title<input maxLength={160} name="title" placeholder="e.g. End of year assessment" required /></label>
                    <label>Grade<select name="grade_id" onChange={(event) => setSelectedGrade(event.target.value)} value={selectedGrade}>
                      {grades.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                    </select></label>
                    <label>Subject<select name="subject" required>
                      <optgroup label="Subjects">
                        {grade.subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                      </optgroup>
                      {supportsPredictions && (
                        <optgroup label="Predictions">
                          <option value={PREDICTIONS_SUBJECT}>{PREDICTIONS_SUBJECT}</option>
                        </optgroup>
                      )}
                    </select></label>
                    <label className="admin-file-field">Document file<input accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file" required type="file" /></label>
                    {uploadProgress !== null && (
                      <div className="admin-upload-progress">
                        <div className="admin-upload-progress-label">
                          <span>
                            {uploadProgress >= 90
                              ? "Saving document to Cloudinary…"
                              : "Uploading document…"}
                          </span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div
                          aria-label="Document upload progress"
                          aria-valuemax={100}
                          aria-valuemin={0}
                          aria-valuenow={uploadProgress}
                          className="admin-upload-progress-track"
                          role="progressbar"
                        >
                          <div
                            className="admin-upload-progress-fill"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <button className="admin-primary-button" disabled={busy} type="submit">{busy ? "Working…" : "Upload document"}</button>
                  </form>
                </section>
              ) : (
                <section
                  aria-labelledby="admin-papers-tab-uploaded"
                  className="admin-panel"
                  id="admin-papers-panel-uploaded"
                  role="tabpanel"
                  tabIndex={0}
                >
                  <div className="admin-panel-heading">
                    <div><h2>Uploaded past papers</h2><p>PDFs currently available on the learner site.</p></div>
                    <button
                      className="admin-secondary-button"
                      disabled={papersLoading}
                      onClick={() => void loadPapers(paperPage, true)}
                      type="button"
                    >
                      {papersLoading ? "Refreshing…" : "Refresh"}
                    </button>
                  </div>
                  {papersLoading ? (
                    <p className="admin-empty" role="status">Loading uploaded documents…</p>
                  ) : papers.length ? (
                    <>
                      <div className="admin-table-wrap">
                        <table className="admin-table">
                          <thead><tr><th scope="col">Title</th><th scope="col">Grade</th><th scope="col">Subject</th><th scope="col">Year</th><th scope="col">Actions</th></tr></thead>
                          <tbody>{papers.map((paper) => (
                            <tr key={paper.id}>
                              <td data-label="Title"><strong>{paper.title}</strong></td>
                              <td data-label="Grade">{grades.find((item) => item.id === paper.grade_id)?.label ?? paper.grade_id}</td>
                              <td data-label="Subject">{paper.subject}</td>
                              <td data-label="Year">{paper.year}</td>
                              <td data-label="Actions">
                                <div className="admin-row-actions">
                                  <a href={`${API_URL}/past-papers/${paper.id}/file`} target="_blank" rel="noreferrer">Download</a>
                                  <button disabled={busy} onClick={() => void handleDelete(paper.id)} type="button">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                      {paperTotal > ADMIN_PAGE_SIZE && (
                        <div className="admin-pagination">
                          <span>
                            Showing {(paperPage - 1) * ADMIN_PAGE_SIZE + 1}–
                            {Math.min(paperPage * ADMIN_PAGE_SIZE, paperTotal)} of {paperTotal}
                          </span>
                          <div>
                            <button
                              className="admin-page-button"
                              disabled={paperPage <= 1 || papersLoading}
                              onClick={() => void loadPapers(paperPage - 1)}
                              type="button"
                            >Previous</button>
                            <span aria-live="polite">Page {paperPage} of {Math.ceil(paperTotal / ADMIN_PAGE_SIZE)}</span>
                            <button
                              className="admin-page-button"
                              disabled={paperPage >= Math.ceil(paperTotal / ADMIN_PAGE_SIZE) || papersLoading}
                              onClick={() => void loadPapers(paperPage + 1)}
                              type="button"
                            >Next</button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : <p className="admin-empty">No PDFs have been uploaded yet.</p>}
                </section>
              )}
            </>
          )}
          {activeTab === "users" && (
            <section className="admin-panel">
              <div className="admin-panel-heading"><div><h2>Registered accounts</h2><p>Guardian contact details and learner profiles.</p></div></div>
              {usersLoading ? (
                <p className="admin-empty" role="status">Loading registered accounts…</p>
              ) : users.length ? (
                <>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th scope="col">Learner name</th><th scope="col">Guardian email</th><th scope="col">Phone number</th><th scope="col">Registered</th></tr></thead>
                      <tbody>{users.map((user) => (
                        <tr key={user.id}>
                          <td data-label="Learner name"><strong>{user.learners.map((learner) => learner.display_name).join(", ") || "No learner profile"}</strong></td>
                          <td data-label="Guardian email">{user.email || "—"}</td>
                          <td data-label="Phone number">{user.phone}</td>
                          <td data-label="Registered"><time dateTime={user.created_at}>{new Date(user.created_at).toLocaleDateString()}</time></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                  {userTotal > ADMIN_PAGE_SIZE && (
                    <div className="admin-pagination">
                      <span>
                        Showing {(userPage - 1) * ADMIN_PAGE_SIZE + 1}–
                        {Math.min(userPage * ADMIN_PAGE_SIZE, userTotal)} of {userTotal}
                      </span>
                      <div>
                        <button
                          className="admin-page-button"
                          disabled={userPage <= 1 || usersLoading}
                          onClick={() => void loadUsers(userPage - 1)}
                          type="button"
                        >Previous</button>
                        <span aria-live="polite">Page {userPage} of {Math.ceil(userTotal / ADMIN_PAGE_SIZE)}</span>
                        <button
                          className="admin-page-button"
                          disabled={userPage >= Math.ceil(userTotal / ADMIN_PAGE_SIZE) || usersLoading}
                          onClick={() => void loadUsers(userPage + 1)}
                          type="button"
                        >Next</button>
                      </div>
                    </div>
                  )}
                </>
              ) : <p className="admin-empty">No accounts have signed up yet.</p>}
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
