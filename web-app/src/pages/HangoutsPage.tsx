import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";

type Hangout = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: string;
};

export default function HangoutsPage() {
  const navigate = useNavigate();

  const [hangouts, setHangouts] = useState<Hangout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userName = localStorage.getItem("userName") || "Host";

  useEffect(() => {
    async function loadHangouts() {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest<Hangout[]>("/api/hangouts");

        setHangouts(response);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load hangouts.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadHangouts();
  }, []);

  const sortedHangouts = useMemo(() => {
    return [...hangouts].sort(
      (first, second) =>
        new Date(first.startTime).getTime() -
        new Date(second.startTime).getTime(),
    );
  }, [hangouts]);

  const upcomingCount = useMemo(() => {
    const now = Date.now();

    return hangouts.filter(
      (hangout) => new Date(hangout.startTime).getTime() >= now,
    ).length;
  }, [hangouts]);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    navigate("/");
  }

  return (
    <main className="page dashboard-page">
      <header className="dashboard-header">
        <div className="brand-lockup">
          <div className="brand-mark">G</div>

          <div>
            <p className="eyebrow">Gather</p>
            <h1>Welcome back, {userName}</h1>
            <p className="page-subtitle">
              Create memorable plans, share invitations, and keep every RSVP
              organized in one place.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={logout}
        >
          Log out
        </button>
      </header>

      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Your event hub</p>
          <h2>Bring everyone together.</h2>
          <p>
            Create an event, share the QR code, and let guests RSVP without
            downloading an app.
          </p>
        </div>

        <Link to="/hangouts/new" className="button-link dashboard-create-button">
          <span aria-hidden="true">＋</span>
          Create hangout
        </Link>
      </section>

      <section className="dashboard-stats" aria-label="Hangout overview">
        <StatCard
          label="Total events"
          value={hangouts.length}
          helper="All hangouts you created"
        />

        <StatCard
          label="Upcoming"
          value={upcomingCount}
          helper="Events still ahead"
        />

        <StatCard
          label="Past events"
          value={Math.max(hangouts.length - upcomingCount, 0)}
          helper="Plans already completed"
        />
      </section>

      <section className="events-section">
        <div className="events-section-header">
          <div>
            <p className="eyebrow">Events</p>
            <h2>My hangouts</h2>
            <p className="section-description">
              Open an event to share its invitation or review guest responses.
            </p>
          </div>

          {hangouts.length > 0 && (
            <span className="event-total-pill">
              {hangouts.length}{" "}
              {hangouts.length === 1 ? "event" : "events"}
            </span>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <div className="events-loading-grid">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : sortedHangouts.length === 0 ? (
          <div className="empty-events-card">
            <div className="empty-events-icon" aria-hidden="true">
              ✦
            </div>

            <h3>No hangouts yet</h3>

            <p>
              Create your first event, invite your friends, and start tracking
              responses.
            </p>

            <Link to="/hangouts/new" className="button-link">
              Create your first hangout
            </Link>
          </div>
        ) : (
          <div className="hangout-grid">
            {sortedHangouts.map((hangout) => (
              <HangoutCard key={hangout.id} hangout={hangout} />
            ))}
          </div>
        )}
      </section>

      <footer className="app-footer">
        Built with React, Spring Boot, Kotlin, and PostgreSQL.
      </footer>
    </main>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  helper: string;
};

function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <article className="dashboard-stat-card">
      <span className="dashboard-stat-label">{label}</span>
      <strong className="dashboard-stat-value">{value}</strong>
      <span className="dashboard-stat-helper">{helper}</span>
    </article>
  );
}

type HangoutCardProps = {
  hangout: Hangout;
};

function HangoutCard({ hangout }: HangoutCardProps) {
  const startDate = new Date(hangout.startTime);
  const isPast = startDate.getTime() < Date.now();

  return (
    <Link
      to={`/hangouts/${hangout.id}`}
      className="hangout-card"
    >
      <div className="hangout-card-top">
        <div className="hangout-date-tile">
          <span>{formatMonth(startDate)}</span>
          <strong>{startDate.getDate()}</strong>
        </div>

        <span
          className={
            isPast
              ? "hangout-status hangout-status-past"
              : "hangout-status hangout-status-upcoming"
          }
        >
          {isPast ? "Past" : "Upcoming"}
        </span>
      </div>

      <div className="hangout-card-body">
        <h3>{hangout.title}</h3>

        <div className="hangout-meta">
          <MetaRow
            icon="◷"
            value={formatDateAndTime(hangout.startTime)}
          />

          <MetaRow
            icon="⌖"
            value={hangout.location || "Location not added"}
          />
        </div>

        {hangout.description && (
          <p className="hangout-description">
            {truncate(hangout.description, 110)}
          </p>
        )}
      </div>

      <div className="hangout-card-footer">
        <span>View event</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

type MetaRowProps = {
  icon: string;
  value: string;
};

function MetaRow({ icon, value }: MetaRowProps) {
  return (
    <div className="hangout-meta-row">
      <span className="hangout-meta-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{value}</span>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="hangout-card loading-card" aria-hidden="true">
      <div className="loading-line loading-line-small" />
      <div className="loading-line loading-line-large" />
      <div className="loading-line loading-line-medium" />
      <div className="loading-line loading-line-medium" />
    </div>
  );
}

function formatMonth(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
  })
    .format(value)
    .toUpperCase();
}

function formatDateAndTime(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}…`;
}