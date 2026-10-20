"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import ButtonSpinner from "@/components/button-spinner";
import {
  AuthApiError,
  type AuthenticatedAccount,
  authApiRequest,
  clearCachedAccount,
  getCachedAccount,
  setCachedAccount,
} from "@/lib/auth-api";
import { findGrade, grades, slugifyCurriculumLabel } from "@/lib/curriculum";
import {
  type LearnerProgressSummary,
  questionApiRequest,
} from "@/lib/questions-api";
import PastPapersSection from "./past-papers-section";
import LearningSelector from "./learning-selector";

type DashboardSection = "overview" | "learning" | "exams" | "progress" | "planner" | "billing";
type DashboardPanel = "search" | "notifications" | "profile" | null;
type AccountDialogMode = "profile" | "password";
type PlanDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
const planDays: PlanDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Icon({
  name,
  size = 20,
}: {
  name: "home" | "book" | "exam" | "chart" | "calendar" | "receipt" | "search" | "bell" | "arrow" | "profile";
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
    receipt: (
      <>
        <path d="M4 3v18l3-2 3 2 3-2 3 2 4-2V3l-4 2-3-2-3 2-3-2z" />
        <path d="M8 9h8M8 13h8" />
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
    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
      </>
    ),
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

function getSavedLearnerId(account: AuthenticatedAccount): string {
  const savedLearnerId = window.localStorage.getItem(
    `competencehub.learner.${account.id}`,
  );
  if (account.learners.some((learner) => learner.id === savedLearnerId)) {
    return savedLearnerId ?? "";
  }
  return account.learners.length === 1 ? account.learners[0].id : "";
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
  const [account, setAccount] = useState<AuthenticatedAccount>();
  const [progressLearnerId, setProgressLearnerId] = useState("");
  const [accountDialog, setAccountDialog] = useState<AccountDialogMode>();
  const closeAccountDialog = useCallback(() => setAccountDialog(undefined), []);
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
        setAccount(cachedAccount);
        setLearnerName(cachedAccount.learners[0]?.display_name?.trim() ?? "");
        setProgressLearnerId(getSavedLearnerId(cachedAccount));
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
          setAccount(account);
          setLearnerName(account.learners[0]?.display_name?.trim() ?? "");
          setProgressLearnerId(getSavedLearnerId(account));
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
      setAccount(undefined);
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
    window.localStorage.setItem("competencehub.dashboardSection", "overview");

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

  function handleProgressLearnerChange(learnerId: string) {
    setProgressLearnerId(learnerId);
    if (account) {
      window.localStorage.setItem(`competencehub.learner.${account.id}`, learnerId);
    }
  }

  const sectionTitles: Record<DashboardSection, string> = {
    overview: "Overview",
    learning: "My learning",
    exams: "Past Papers",
    progress: "My progress",
    planner: "Study planner",
    billing: "Billing & usage",
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
          <Link className="brand" href="/dashboard" aria-label="CompetenceHub home">
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
            <span className="nav-access-preview" aria-label="Subscription required">🔒</span>
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
            <span className="nav-access-preview" aria-label="Subscription required">🔒</span>
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
          <button
            className={`nav-link ${section === "billing" ? "active" : ""}`}
            type="button"
            onClick={() => openSection("billing")}
            aria-current={section === "billing" ? "page" : undefined}
          >
            <Icon name="receipt" />
            <span>Billing &amp; usage</span>
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
            <button
              className="avatar avatar-small profile-menu-trigger"
              type="button"
              aria-label="Open account menu"
              aria-expanded={activePanel === "profile"}
              aria-controls="dashboard-profile-panel"
              onClick={() => setActivePanel(activePanel === "profile" ? null : "profile")}
            >
              <Icon name="profile" size={18} />
            </button>
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
          {activePanel === "profile" && (
            <section
              className="topbar-panel dashboard-profile-panel"
              id="dashboard-profile-panel"
              aria-label="Account menu"
            >
              <div className="profile-menu-heading">
                <span className="avatar"><Icon name="profile" size={20} /></span>
                <span className="profile-copy">
                  <strong>{learnerName || "Learner"}</strong>
                  <span>{account?.phone ?? "Learner account"}</span>
                </span>
                <button
                  className="panel-close-button"
                  type="button"
                  aria-label="Close account menu"
                  onClick={() => setActivePanel(null)}
                >
                  ×
                </button>
              </div>
              {accountMessage && <p className="profile-error-message" role="alert">{accountMessage}</p>}
              {accountStatus === "signed-in" ? (
                <div className="profile-menu-actions">
                  <button type="button" onClick={() => { setAccountDialog("profile"); setActivePanel(null); }}>
                    Profile
                  </button>
                  <button type="button" onClick={() => { setAccountDialog("password"); setActivePanel(null); }}>
                    Change password
                  </button>
                  <button
                    className="profile-menu-logout"
                    type="button"
                    disabled={isLoggingOut}
                    aria-busy={isLoggingOut}
                    onClick={() => void handleLogout()}
                  >
                    {isLoggingOut && <ButtonSpinner />}
                    {isLoggingOut ? "Signing out…" : "Log out"}
                  </button>
                </div>
              ) : accountStatus === "signed-out" ? (
                <Link className="profile-sign-in-link" href="/login">Sign in</Link>
              ) : (
                <p className="profile-menu-note">
                  {accountStatus === "loading" ? "Loading your account…" : "Your account details are unavailable."}
                </p>
              )}
            </section>
          )}
        </header>

        {accountDialog && account && (
          <AccountDialog
            account={account}
            mode={accountDialog}
            onClose={closeAccountDialog}
            onAccountUpdated={(updatedAccount) => {
              setCachedAccount(updatedAccount);
              setAccount(updatedAccount);
              setLearnerName(updatedAccount.learners[0]?.display_name?.trim() ?? "");
            }}
          />
        )}

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
          <div hidden={section !== "progress"}>
            <ProgressSection
              isActive={section === "progress"}
              accountStatus={accountStatus}
              learners={account?.learners ?? []}
              learnerId={progressLearnerId}
              onLearnerChange={handleProgressLearnerChange}
              onChooseLearning={() => openSection("learning")}
            />
          </div>
          {section === "planner" && (
            <PlannerSection
              gradeLabel={grade?.label}
              subject={subject}
              onChooseLearning={() => openSection("learning")}
            />
          )}
          {section === "billing" && <BillingSection />}
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
  isActive,
  accountStatus,
  learners,
  learnerId,
  onLearnerChange,
  onChooseLearning,
}: {
  isActive: boolean;
  accountStatus: "loading" | "signed-in" | "signed-out" | "unavailable";
  learners: AuthenticatedAccount["learners"];
  learnerId: string;
  onLearnerChange: (learnerId: string) => void;
  onChooseLearning: () => void;
}) {
  const [summary, setSummary] = useState<LearnerProgressSummary>();
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "unavailable">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isActive) return;

    if (accountStatus !== "signed-in" || !learnerId) {
      setSummary(undefined);
      setStatus("idle");
      setError("");
      return;
    }
    if (summary?.learner_id === learnerId && status === "loaded") return;

    let cancelled = false;
    async function loadSummary() {
      setStatus("loading");
      setError("");
      try {
        const result = await questionApiRequest<LearnerProgressSummary>(
          `summary?${new URLSearchParams({ learner_id: learnerId }).toString()}`,
        );
        if (!cancelled) {
          setSummary(result);
          setStatus("loaded");
        }
      } catch (loadError) {
        if (!cancelled) {
          setSummary(undefined);
          setError(loadError instanceof Error ? loadError.message : "Could not load saved progress.");
          setStatus("unavailable");
        }
      }
    }

    void loadSummary();
    return () => {
      cancelled = true;
    };
  }, [accountStatus, isActive, learnerId, status, summary]);

  const selectedLearner = learners.find((learner) => learner.id === learnerId);

  return (
    <section className="dashboard-tab-content">
      <div className="dashboard-tab-heading">
        <span className="eyebrow">YOUR LEARNING RECORD</span>
        <h1>My progress</h1>
        <p>Saved revision-question results across your subjects.</p>
      </div>
      {learners.length > 1 && (
        <label className="progress-learner-select">
          Progress for
          <select value={learnerId} onChange={(event) => onLearnerChange(event.target.value)}>
            <option value="">Choose a learner</option>
            {learners.map((learner) => (
              <option key={learner.id} value={learner.id}>{learner.display_name}</option>
            ))}
          </select>
        </label>
      )}
      {accountStatus === "loading" && (
        <div className="data-status-card" role="status">Loading your account…</div>
      )}
      {accountStatus === "signed-out" && (
        <div className="data-status-card">
          <span className="data-status-icon" aria-hidden="true">↗</span>
          <div>
            <span className="overview-card-kicker">SIGN IN TO VIEW PROGRESS</span>
            <h2>Your saved practice belongs to your account</h2>
            <p>Sign in to see revision answers saved across visits.</p>
            <Link className="button button-primary" href="/login">Sign in</Link>
          </div>
        </div>
      )}
      {accountStatus === "unavailable" && (
        <p className="account-dialog-error" role="alert">
          Your account details could not be loaded. Please refresh and try again.
        </p>
      )}
      {accountStatus === "signed-in" && learners.length === 0 && (
        <div className="data-status-card" role="status">
          No learner profile is linked to this account yet.
        </div>
      )}
      {accountStatus === "signed-in" && selectedLearner && (
        <div className="progress-learner-heading">
          <span>Showing progress for</span>
          <strong>{selectedLearner.display_name}</strong>
        </div>
      )}
      {accountStatus === "signed-in" && !learnerId && learners.length > 1 && (
        <div className="data-status-card" role="status">
          Choose a learner above to view their saved practice results.
        </div>
      )}
      {accountStatus === "signed-in" && learnerId && status === "loading" && (
        <div className="data-status-card" role="status" aria-busy="true">
          Loading saved practice progress…
        </div>
      )}
      {accountStatus === "signed-in" && learnerId && status === "unavailable" && (
        <div className="data-status-card">
          <div>
            <span className="overview-card-kicker">PROGRESS UNAVAILABLE</span>
            <h2>We couldn’t load saved activity</h2>
            <p className="account-dialog-error" role="alert">{error}</p>
          </div>
        </div>
      )}
      {accountStatus === "signed-in" && summary && status === "loaded" && (
        <>
          <div className="progress-summary-grid">
            <article className="progress-summary-card">
              <span>QUESTIONS ANSWERED</span>
              <strong>{summary.total_answered}</strong>
            </article>
            <article className="progress-summary-card">
              <span>ANSWERED CORRECTLY</span>
              <strong>{summary.total_correct_answers}</strong>
            </article>
            <article className="progress-summary-card">
              <span>OVERALL ACCURACY</span>
              <strong>{summary.accuracy_percentage}%</strong>
            </article>
            <article className="progress-summary-card">
              <span>SUBJECTS PRACTISED</span>
              <strong>{summary.subjects_practised}</strong>
            </article>
          </div>
          {summary.subjects.length > 0 ? (
            <div className="progress-subject-list">
              <h2>Progress by subject</h2>
              {summary.subjects.map((item) => {
                const subjectGrade = findGrade(item.grade_id);
                const progressHref = `/learn/${item.grade_id}/${slugifyCurriculumLabel(item.subject)}`;
                return (
                  <article className="progress-subject-card" key={`${item.grade_id}-${item.subject}`}>
                    <div className="progress-subject-heading">
                      <div>
                        <span>{subjectGrade?.label ?? item.grade_id}</span>
                        <h3>{item.subject}</h3>
                      </div>
                      <strong>{item.accuracy_percentage}% accuracy</strong>
                    </div>
                    <p>
                      {item.total_answered} {item.total_answered === 1 ? "question" : "questions"} answered ·{" "}
                      {item.total_correct_answers} correct
                    </p>
                    <div className="progress-subject-bank">
                      <span>{item.bank_questions_answered} of 10 core questions completed</span>
                      <div className="progress-track" aria-label={`${item.bank_questions_answered} of 10 core questions completed`}>
                        <span style={{ width: `${Math.min(item.bank_questions_answered * 10, 100)}%` }} />
                      </div>
                    </div>
                    <Link className="progress-subject-link" href={progressHref}>
                      Continue practising <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="data-status-card progress-empty-state">
              <span className="data-status-icon" aria-hidden="true">↗</span>
              <div>
                <span className="overview-card-kicker">NO SAVED PRACTICE YET</span>
                <h2>Your progress will grow as you practise</h2>
                <p>Complete revision questions while signed in to see your results here.</p>
                <button className="button button-primary" type="button" onClick={onChooseLearning}>
                  Choose a grade and subject <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
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

function BillingSection() {
  return (
    <section className="dashboard-tab-content billing-section">
      <div className="dashboard-tab-heading">
        <span className="eyebrow">SUBSCRIPTIONS AND ACCOUNT ACTIVITY</span>
        <h1>Billing &amp; usage</h1>
        <p>Manage your plan and find payment receipts in one place.</p>
      </div>

      <div className="billing-summary-grid">
        <article className="billing-summary-card">
          <span className="billing-summary-icon" aria-hidden="true">◇</span>
          <div>
            <span className="overview-card-kicker">YOUR PLAN</span>
            <h2>Subscriptions are coming soon</h2>
            <p>Plan options and subscription details will be available here when they launch.</p>
          </div>
          <span className="billing-status-badge">Coming soon</span>
        </article>
        <article className="billing-summary-card">
          <span className="billing-summary-icon billing-usage-icon" aria-hidden="true">↗</span>
          <div>
            <span className="overview-card-kicker">USAGE</span>
            <h2>Usage tracking is coming</h2>
            <p>Your plan usage and limits will appear here once subscriptions are enabled.</p>
          </div>
        </article>
      </div>

      <section className="billing-receipts-card" aria-labelledby="billing-receipts-heading">
        <div className="billing-receipts-heading">
          <div>
            <span className="overview-card-kicker">PAYMENT HISTORY</span>
            <h2 id="billing-receipts-heading">Payment receipts</h2>
            <p>Receipts for completed payments will be kept here for you to view later.</p>
          </div>
          <span className="billing-receipt-count">Receipt archive</span>
        </div>
        <div className="billing-empty-state" role="status">
          <span className="billing-empty-icon" aria-hidden="true">
            <Icon name="receipt" size={23} />
          </span>
          <h3>Receipt history will appear here</h3>
          <p>Once subscription payments are enabled, receipts will be available here to view later.</p>
        </div>
      </section>
    </section>
  );
}

function AccountDialog({
  account,
  mode,
  onClose,
  onAccountUpdated,
}: {
  account: AuthenticatedAccount;
  mode: AccountDialogMode;
  onClose: () => void;
  onAccountUpdated: (account: AuthenticatedAccount) => void;
}) {
  const [editingLearnerId, setEditingLearnerId] = useState<string>();
  const [learnerNameInput, setLearnerNameInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingLearnerName, setIsSavingLearnerName] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSaving(true);
    try {
      if (newPassword !== confirmPassword) {
        throw new Error("The new passwords do not match.");
      }
      if (newPassword === currentPassword) {
        throw new Error("Choose a new password that differs from the current password.");
      }
      await authApiRequest("change-password", {
        method: "POST",
        body: { current_password: currentPassword, new_password: newPassword },
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Your password has been changed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update your account.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveLearnerName(event: FormEvent<HTMLFormElement>, learnerId: string) {
    event.preventDefault();
    setMessage("");
    setIsSavingLearnerName(true);
    try {
      if (!learnerNameInput.trim()) throw new Error("Learner name cannot be blank.");
      const updatedAccount = await authApiRequest<AuthenticatedAccount>(
        `learners/${encodeURIComponent(learnerId)}`,
        {
          method: "PATCH",
          body: { display_name: learnerNameInput.trim() },
        },
      );
      onAccountUpdated(updatedAccount);
      setEditingLearnerId(undefined);
      setMessage("Learner name updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update the learner name.");
    } finally {
      setIsSavingLearnerName(false);
    }
  }

  const title = mode === "profile" ? "Profile" : "Change password";

  return (
    <div
      className="account-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="account-dialog-title"
        aria-modal="true"
        className="account-dialog"
        role="dialog"
      >
        <div className="account-dialog-heading">
          <h2 id="account-dialog-title">{title}</h2>
          <button
            ref={closeButtonRef}
            className="panel-close-button"
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {mode === "profile" ? (
          <div className="account-profile-details">
            <div><span>Guardian phone</span><strong>{account.phone}</strong></div>
            <div><span>Email</span><strong>{account.email || "Not provided"}</strong></div>
            <div className="account-profile-learners">
              <span>Learner profiles</span>
              {account.learners.length > 0 ? (
                <ul>
                  {account.learners.map((learner) => (
                    <li key={learner.id}>
                      {editingLearnerId === learner.id ? (
                        <form
                          className="account-learner-edit-form"
                          onSubmit={(event) => void saveLearnerName(event, learner.id)}
                        >
                          <input
                            autoFocus
                            id={`learner-name-${learner.id}`}
                            aria-label={`Learner name for ${learner.display_name}`}
                            maxLength={120}
                            required
                            value={learnerNameInput}
                            onChange={(event) => setLearnerNameInput(event.target.value)}
                          />
                          <div className="account-learner-edit-actions">
                            <button type="button" disabled={isSavingLearnerName} onClick={() => setEditingLearnerId(undefined)}>
                              Cancel
                            </button>
                            <button type="submit" disabled={isSavingLearnerName}>
                              {isSavingLearnerName ? "Saving…" : "Save"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <span>{learner.display_name}</span>
                          <button
                            className="account-learner-edit-button"
                            type="button"
                            onClick={() => {
                              setEditingLearnerId(learner.id);
                              setLearnerNameInput(learner.display_name);
                              setMessage("");
                            }}
                            aria-label={`Edit ${learner.display_name}`}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No learner profiles are linked to this account.</p>
              )}
            </div>
            {message && (
              <p className={message === "Learner name updated." ? "account-dialog-success" : "account-dialog-error"}
                role={message === "Learner name updated." ? "status" : "alert"}>
                {message}
              </p>
            )}
            <button className="button button-primary" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form className="account-dialog-form" onSubmit={(event) => void handleSubmit(event)}>
            <label>
              Current password
              <input
                autoComplete="current-password"
                required
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </label>
            <label>
              New password
              <input
                autoComplete="new-password"
                minLength={8}
                required
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </label>
            <label>
              Confirm new password
              <input
                autoComplete="new-password"
                minLength={8}
                required
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
            {message && (
              <p className={message.startsWith("Your password") ? "account-dialog-success" : "account-dialog-error"}
                role={message.startsWith("Your password") ? "status" : "alert"}>
                {message}
              </p>
            )}
            <div className="account-dialog-actions">
              <button className="button button-secondary" type="button" onClick={onClose}>Cancel</button>
              <button className="button button-primary" type="submit" disabled={isSaving}>
                {isSaving && <ButtonSpinner />}
                {isSaving ? "Saving…" : "Update password"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
