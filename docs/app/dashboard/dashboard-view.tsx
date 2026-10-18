"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ButtonSpinner from "@/components/button-spinner";
import {
  AuthApiError,
  authApiRequest,
  clearCachedAccount,
  getCachedAccount,
  setCachedAccount,
} from "@/lib/auth-api";
import { findGrade, grades, slugifyCurriculumLabel } from "@/lib/curriculum";
import PastPapersSection from "./past-papers-section";
import LearningSelector from "./learning-selector";

type DashboardSection = "overview" | "learning" | "exams" | "progress" | "planner";
type DashboardPanel = "search" | "notifications" | null;
type PlanDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
const planDays: PlanDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Icon({
  name,
  size = 20,
}: {
  name: "home" | "book" | "exam" | "chart" | "calendar" | "search" | "bell" | "arrow";
  size?: number;
}) {
  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z" />
      </>
    ),
    book: (
      <>
        <path d="M12 7v14" />
        <path d="M3 18V5a2 2 0 0 1 2-2h2a5 5 0 0 1 5 5 5 5 0 0 1 5-5h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-2a5 5 0 0 0-5 2 5 5 0 0 0-5-2H5a2 2 0 0 1-2-2Z" />
      </>
    ),
    exam: (
      <>
        <path d="M8 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
        <path d="M9 3h6v4H9zM8 12h8M8 16h5" />
        <path d="m16 16 1.2 1.2L20 14" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-5 5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [section, setSection] = useState<DashboardSection>("overview");
  const [gradeId, setGradeId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [ready, setReady] = useState(false);
  const [activePanel, setActivePanel] = useState<DashboardPanel>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [learnerName, setLearnerName] = useState("");
  const [accountStatus, setAccountStatus] = useState<"loading" | "signed-in" | "signed-out" | "unavailable">("loading");
  const [accountMessage, setAccountMessage] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const grade = findGrade(gradeId);
  const subject = grade?.subjects.find(
    (item) => slugifyCurriculumLabel(item) === subjectId,
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("accountCreated") === "1") {
      setAccountCreated(true);
      url.searchParams.delete("accountCreated");
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      const cachedAccount = getCachedAccount();
      if (cachedAccount) {
        setLearnerName(cachedAccount.learners[0]?.display_name?.trim() ?? "");
        setAccountStatus("signed-in");
        return;
      }

      try {
        const account = await authApiRequest<{
          id: string;
          phone: string;
          email: string | null;
          learners: {
            id: string;
            display_name: string;
            grade_id: string | null;
          }[];
        }>("me");
        if (!cancelled) {
          setCachedAccount(account);
          setLearnerName(account.learners[0]?.display_name?.trim() ?? "");
          setAccountStatus("signed-in");
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof AuthApiError && error.status === 401) {
          clearCachedAccount();
          setAccountStatus("signed-out");
        } else {
          setAccountStatus("unavailable");
          setAccountMessage(error instanceof Error ? error.message : "Could not load your account.");
        }
      }
    }

    void loadAccount();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    setAccountMessage("");
    try {
      await authApiRequest("logout", { method: "POST" });
      clearCachedAccount();
      setLearnerName("");
      setAccountStatus("signed-out");
      router.replace("/login");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "Unable to sign out.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  useEffect(() => {
    const savedSection = window.localStorage.getItem("competencehub.dashboardSection");
    if (
      savedSection === "overview" ||
      savedSection === "learning" ||
      savedSection === "exams" ||
      savedSection === "progress" ||
      savedSection === "planner"
    ) {
      setSection(savedSection);
    }

    function readSelection() {
      setGradeId(window.localStorage.getItem("competencehub.grade") ?? "");
      setSubjectId(window.localStorage.getItem("competencehub.subject") ?? "");
      setReady(true);
    }

    readSelection();
    window.addEventListener("competencehub:selection-changed", readSelection);
    window.addEventListener("storage", readSelection);

    return () => {
      window.removeEventListener("competencehub:selection-changed", readSelection);
      window.removeEventListener("storage", readSelection);
    };
  }, []);

  function openSection(nextSection: DashboardSection) {
    setSection(nextSection);
    window.localStorage.setItem("competencehub.dashboardSection", nextSection);
    setMobileNavOpen(false);
  }

  const sectionTitles: Record<DashboardSection, string> = {
    overview: "Overview",
    learning: "My learning",
    exams: "Past Papers",
    progress: "My progress",
    planner: "Study planner",
  };
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const searchableSections = (Object.entries(sectionTitles) as [DashboardSection, string][])
    .filter(([, title]) => title.toLocaleLowerCase().includes(normalizedSearchQuery));
  const searchableSubjects = normalizedSearchQuery
    ? grades.flatMap((item) =>
        item.subjects
          .filter(
            (itemSubject) =>
              itemSubject.toLocaleLowerCase().includes(normalizedSearchQuery) ||
              item.label.toLocaleLowerCase().includes(normalizedSearchQuery),
          )
          .map((itemSubject) => ({
            gradeId: item.id,
            gradeLabel: item.label,
            subject: itemSubject,
            subjectId: slugifyCurriculumLabel(itemSubject),
          })),
      ).slice(0, 8)
    : [];

  useEffect(() => {
    if (!activePanel) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setActivePanel(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activePanel]);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileNavOpen]);

  return (
    <div className={`app-shell ${mobileNavOpen ? "mobile-drawer-open" : ""}`}>
      {mobileNavOpen && (
        <button
          className="mobile-drawer-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => {
            setMobileNavOpen(false);
            mobileMenuButtonRef.current?.focus();
          }}
        />
      )}
      <aside
        className={`sidebar ${mobileNavOpen ? "sidebar-mobile-open" : ""}`}
        id="dashboard-navigation-drawer"
        aria-label="Learner navigation"
      >
        <div className="sidebar-brand-row">
          <Link className="brand" href="/" aria-label="CompetenceHub home">
            <span className="brand-mark">c</span>
            <span>
              <strong>competence</strong>
              <span>HUB</span>
            </span>
          </Link>
          <button
            className="mobile-drawer-close"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => {
              setMobileNavOpen(false);
              mobileMenuButtonRef.current?.focus();
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="sidebar-label">LEARNING SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button
            className={`nav-link ${section === "overview" ? "active" : ""}`}
            type="button"
            onClick={() => openSection("overview")}
            aria-current={section === "overview" ? "page" : undefined}
          >
            <Icon name="home" />
            <span>Overview</span>
          </button>
          <button
            className={`nav-link ${section === "learning" ? "active" : ""}`}
            type="button"
            onClick={() => openSection("learning")}
            aria-current={section === "learning" ? "page" : undefined}
          >
            <Icon name="book" />
            <span>My learning</span>
            {subject && (
              <span className="nav-count" title="Selected subject">
                1
              </span>
            )}
          </button>
          <button
            className={`nav-link ${section === "exams" ? "active" : ""}`}
            type="button"
            onClick={() => openSection("exams")}
            aria-current={section === "exams" ? "page" : undefined}
          >
            <Icon name="exam" />
            <span>Past Papers</span>
          </button>
          <button
            className={`nav-link ${section === "progress" ? "active" : ""}`}
            type="button"
            onClick={() => openSection("progress")}
            aria-current={section === "progress" ? "page" : undefined}
          >
            <Icon name="chart" />
            <span>My progress</span>
          </button>
          <button
            className={`nav-link ${section === "planner" ? "active" : ""}`}
            type="button"
            onClick={() => openSection("planner")}
            aria-current={section === "planner" ? "page" : undefined}
          >
            <Icon name="calendar" />
            <span>Study planner</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="streak-card">
            <span className="streak-emoji" aria-hidden="true">
              ✦
            </span>
            <div>
              <strong>{subject ? "Ready to learn?" : "Your learning journey"}</strong>
              <p>{subject ? `${grade?.label} · ${subject}` : "Choose your grade and subject to begin."}</p>
            </div>
          </div>
          {accountStatus === "signed-in" ? (
            <div className="profile-account">
              <div className="profile-account-details">
                <span className="avatar">{learnerName.charAt(0).toUpperCase() || "L"}</span>
                <span className="profile-copy">
                  <strong>{learnerName || "Learner"}</strong>
                  <span>Learner account</span>
                </span>
              </div>
              <button
                aria-busy={isLoggingOut}
                className="profile-logout-button"
                disabled={isLoggingOut}
                onClick={() => void handleLogout()}
                type="button"
              >
                {isLoggingOut && <ButtonSpinner />}
                {isLoggingOut ? "Signing out…" : "Log out"}
              </button>
            </div>
          ) : null}
          {accountMessage && accountStatus === "signed-in" && (
            <p className="profile-error-message" role="alert">{accountMessage}</p>
          )}
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu-toggle"
            type="button"
            ref={mobileMenuButtonRef}
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileNavOpen}
            aria-controls="dashboard-navigation-drawer"
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="breadcrumb">
            <span>Learning space</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{sectionTitles[section]}</strong>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button search-button"
              aria-label="Search dashboard"
              aria-expanded={activePanel === "search"}
              aria-controls="dashboard-search-panel"
              type="button"
              onClick={() => setActivePanel(activePanel === "search" ? null : "search")}
            >
              <Icon name="search" />
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              aria-expanded={activePanel === "notifications"}
              aria-controls="dashboard-notifications-panel"
              type="button"
              onClick={() =>
                setActivePanel(activePanel === "notifications" ? null : "notifications")
              }
            >
              <Icon name="bell" />
            </button>
            <span className="topbar-divider" />
            <span className="avatar avatar-small">
              {learnerName.charAt(0).toUpperCase() || "L"}
            </span>
          </div>
          {activePanel === "search" && (
            <section
              className="topbar-panel dashboard-search-panel"
              id="dashboard-search-panel"
              aria-label="Dashboard search"
            >
              <div className="topbar-panel-heading">
                <label htmlFor="dashboard-search-input">Search learning</label>
                <button
                  className="panel-close-button"
                  type="button"
                  aria-label="Close search"
                  onClick={() => {
                    setActivePanel(null);
                    setSearchQuery("");
                  }}
                >
                  ×
                </button>
              </div>
              <input
                autoFocus
                id="dashboard-search-input"
                className="dashboard-search-input"
                type="search"
                placeholder="Search sections, grades or subjects"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <div className="dashboard-search-results" aria-live="polite">
                {!normalizedSearchQuery ? (
                  <p className="panel-empty-message">Type to search dashboard sections and subjects.</p>
                ) : searchableSections.length === 0 && searchableSubjects.length === 0 ? (
                  <p className="panel-empty-message">No matching sections or subjects found.</p>
                ) : (
                  <>
                    {searchableSections.length > 0 && (
                      <div className="search-result-group">
                        <span className="search-result-label">Dashboard</span>
                        {searchableSections.map(([targetSection, title]) => (
                          <button
                            className="search-result-item"
                            key={targetSection}
                            type="button"
                            onClick={() => {
                              openSection(targetSection);
                              setActivePanel(null);
                              setSearchQuery("");
                            }}
                          >
                            <span>{title}</span><span aria-hidden="true">→</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchableSubjects.length > 0 && (
                      <div className="search-result-group">
                        <span className="search-result-label">Subjects</span>
                        {searchableSubjects.map((result) => (
                          <Link
                            className="search-result-item"
                            href={`/learn/${result.gradeId}/${result.subjectId}`}
                            key={`${result.gradeId}-${result.subjectId}`}
                            onClick={() => {
                              window.localStorage.setItem("competencehub.grade", result.gradeId);
                              window.localStorage.setItem("competencehub.subject", result.subjectId);
                              window.localStorage.setItem("competencehub.dashboardSection", "learning");
                              window.dispatchEvent(new Event("competencehub:selection-changed"));
                              setActivePanel(null);
                              setSearchQuery("");
                            }}
                          >
                            <span>{result.subject}<small>{result.gradeLabel}</small></span>
                            <span aria-hidden="true">→</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          )}
          {activePanel === "notifications" && (
            <section
              className="topbar-panel dashboard-notifications-panel"
              id="dashboard-notifications-panel"
              aria-label="Notifications"
            >
              <div className="topbar-panel-heading">
                <h2>Notifications</h2>
                <button
                  className="panel-close-button"
                  type="button"
                  aria-label="Close notifications"
                  onClick={() => setActivePanel(null)}
                >
                  ×
                </button>
              </div>
              <div className="notification-empty-state" role="status">
                <span aria-hidden="true">♧</span>
                <h3>You’re all caught up</h3>
                <p>Learning updates and reminders will appear here.</p>
              </div>
            </section>
          )}
        </header>

        <div className="dashboard-content">
          {accountCreated && (
            <div className="account-created-message" role="status" aria-live="polite">
              <span className="account-created-check" aria-hidden="true">✓</span>
              <span>Your account was created successfully. Welcome to CompetenceHub!</span>
              <button
                aria-label="Dismiss account created message"
                onClick={() => setAccountCreated(false)}
                type="button"
              >
                ×
              </button>
            </div>
          )}
          {section === "overview" && (
            <>
              <section className="welcome-row">
                <div>
                  <p className="eyebrow">
                    {accountStatus === "signed-in" ? "LEARNER DASHBOARD" : "LEARNER DASHBOARD PREVIEW"}
                  </p>
                  <h1>
                    Welcome, {accountStatus === "signed-in" && learnerName ? learnerName : "learner"}{" "}
                    <span aria-hidden="true">☀</span>
                  </h1>
                  <p className="welcome-subtitle">
                    {subject && grade
                      ? `Your current learning: ${grade.label} · ${subject}.`
                      : "Choose your grade and subject to begin your learning journey."}
                  </p>
                </div>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => openSection("learning")}
                >
                  {subject ? "Open my learning" : "Choose grade & subject"}
                  <Icon name="arrow" size={17} />
                </button>
              </section>

              <section className="dashboard-columns overview-columns">
                <article className="overview-status-card">
                  <span className="overview-card-kicker">LEARNING OVERVIEW</span>
                  <h2>{subject && grade ? "You’re ready to continue" : "Let’s set up your learning"}</h2>
                  <p>
                    {subject && grade
                      ? "Your grade and subject are saved in this browser preview."
                      : "Select your grade first, then choose a subject. Your choices will appear here."}
                  </p>
                  <div className="overview-selection-details">
                    <div>
                      <span>GRADE</span>
                      <strong>{ready ? grade?.label ?? "Not selected" : "Loading…"}</strong>
                    </div>
                    <div>
                      <span>SUBJECT</span>
                      <strong>{ready ? subject ?? "Not selected" : "Loading…"}</strong>
                    </div>
                  </div>
                  {subject && grade ? (
                    <Link className="button button-primary" href={`/learn/${grade.id}/${subjectId}`}>
                      Continue learning <Icon name="arrow" size={16} />
                    </Link>
                  ) : (
                    <button
                      className="button button-primary"
                      type="button"
                      onClick={() => openSection("learning")}
                    >
                      Set up my learning <Icon name="arrow" size={16} />
                    </button>
                  )}
                </article>
                <aside className="right-column">
                  <section className="tip-card">
                    <div className="tip-sparkle" aria-hidden="true">✳</div>
                    <span className="tip-label">LEARNING TIP</span>
                    <h2>Small steps, big progress.</h2>
                    <p>Choose one subject and build a steady learning routine.</p>
                    <span className="tip-decoration" aria-hidden="true">✳</span>
                  </section>
                </aside>
              </section>
            </>
          )}

          {section === "learning" && <LearningSelector />}
          {section === "exams" && <PastPapersSection />}
          {section === "progress" && (
            <ProgressSection
              gradeLabel={grade?.label}
              subject={subject}
              subjectHref={grade && subject ? `/learn/${grade.id}/${subjectId}` : undefined}
              onChooseLearning={() => openSection("learning")}
            />
          )}
          {section === "planner" && (
            <PlannerSection
              gradeLabel={grade?.label}
              subject={subject}
              onChooseLearning={() => openSection("learning")}
            />
          )}
          <footer className="dashboard-footer">
            <span>Dashboard preview · Learning activity will appear here as it is recorded.</span>
            <span>MADE FOR YOUR NEXT STEP</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function ProgressSection({
  gradeLabel,
  subject,
  subjectHref,
  onChooseLearning,
}: {
  gradeLabel?: string;
  subject?: string;
  subjectHref?: string;
  onChooseLearning: () => void;
}) {
  return (
    <section className="dashboard-tab-content">
      <div className="dashboard-tab-heading">
        <span className="eyebrow">YOUR LEARNING RECORD</span>
        <h1>My progress</h1>
        <p>Completed lessons and assessment results will be shown here.</p>
      </div>
      <div className="data-status-card">
        <span className="data-status-icon" aria-hidden="true">↗</span>
        <div>
          <span className="overview-card-kicker">NO GRADED ACTIVITY YET</span>
          <h2>Your progress will grow as you learn</h2>
          <p>
            Progress is not recorded in this frontend preview. Once accounts and
            backend grading are connected, this section can show completed lessons,
            scores, and learning trends.
          </p>
          {(gradeLabel || subject) && (
            <div className="progress-current-selection">
              Current selection: <strong>{gradeLabel ?? "Grade not selected"}</strong>
              {subject ? ` · ${subject}` : ""}
            </div>
          )}
          {subjectHref ? (
            <Link className="button button-primary" href={subjectHref}>
              Continue learning <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <button className="button button-primary" type="button" onClick={onChooseLearning}>
              Choose a grade and subject <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function PlannerSection({
  gradeLabel,
  subject,
  onChooseLearning,
}: {
  gradeLabel?: string;
  subject?: string;
  onChooseLearning: () => void;
}) {
  const [selectedDays, setSelectedDays] = useState<PlanDay[]>([]);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedDays = window.localStorage.getItem("competencehub.plannedDays");
    if (savedDays) {
      try {
        const parsed: unknown = JSON.parse(savedDays);
      const allowedDays: readonly string[] = planDays;
      if (
        Array.isArray(parsed) &&
        parsed.every((day): day is PlanDay => typeof day === "string" && allowedDays.includes(day))
      ) {
        setSelectedDays(parsed);
        }
      } catch {
        window.localStorage.removeItem("competencehub.plannedDays");
      }
    }
    setReady(true);
  }, []);

  function toggleDay(day: PlanDay) {
    setSaved(false);
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day],
    );
  }

  function savePlan() {
    window.localStorage.setItem("competencehub.plannedDays", JSON.stringify(selectedDays));
    setSaved(true);
  }

  return (
    <section className="dashboard-tab-content">
      <div className="dashboard-tab-heading">
        <span className="eyebrow">MAKE A ROUTINE THAT WORKS FOR YOU</span>
        <h1>Study planner</h1>
        <p>Choose the days you’d like to set aside for learning.</p>
      </div>
      <div className="planner-card">
        <div className="planner-card-heading">
          <div>
            <h2>Your weekly plan</h2>
            <p>This is a personal plan only; study sessions aren’t tracked yet.</p>
          </div>
          <span className="planner-count">{selectedDays.length} {selectedDays.length === 1 ? "day" : "days"}</span>
        </div>
        <div className="planner-days" aria-label="Select study days">
          {planDays.map((day) => (
            <button
              className={`planner-day ${selectedDays.includes(day) ? "planner-day-selected" : ""}`}
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              aria-pressed={selectedDays.includes(day)}
              disabled={!ready}
            >
              <span className="planner-day-check" aria-hidden="true">
                {selectedDays.includes(day) ? "✓" : ""}
              </span>
              <span>{day}</span>
            </button>
          ))}
        </div>
        <div className="planner-actions">
          {subject && gradeLabel ? (
            <span className="planner-focus">Focus: <strong>{gradeLabel} · {subject}</strong></span>
          ) : (
            <button className="text-link" type="button" onClick={onChooseLearning}>
              Choose a learning subject
            </button>
          )}
          <button
            className="button button-primary"
            type="button"
            onClick={savePlan}
            disabled={!ready || selectedDays.length === 0}
          >
            Save weekly plan
          </button>
        </div>
        {saved && <p className="planner-saved-message" role="status">Your plan is saved in this browser.</p>}
      </div>
      <div className="planner-note">
        <strong>No completed sessions recorded yet.</strong>
        <span>When progress tracking is connected, completed learning days will appear here.</span>
      </div>
    </section>
  );
}
