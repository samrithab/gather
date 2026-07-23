import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/client";

type RsvpStatus = "YES" | "MAYBE" | "NO";

type PublicHangout = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string | null;
  inviteCode: string;
  organizerName: string;
};

type RsvpResponse = {
  id: string;
  guestName: string;
  status: RsvpStatus;
  respondedAt: string;
};

export default function InvitePage() {
  const { inviteCode } = useParams();

  const [hangout, setHangout] = useState<PublicHangout | null>(null);
  const [guestName, setGuestName] = useState("");
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [submittedStatus, setSubmittedStatus] =
    useState<RsvpStatus | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!inviteCode) {
      setError("Invite code is missing.");
      setLoading(false);
      return;
    }

    apiRequest<PublicHangout>(
      `/api/public/invites/${inviteCode}`
    )
      .then(setHangout)
      .catch((error) => {
        setError(
          error instanceof Error
            ? error.message
            : "Could not load this invitation."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [inviteCode]);

  async function submitRsvp() {
    if (!inviteCode || !status) {
      setError("Please enter your name and choose a response.");
      return;
    }

    if (!guestName.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await apiRequest<RsvpResponse>(
        `/api/public/invites/${inviteCode}/rsvps`,
        {
          method: "POST",
          body: JSON.stringify({
            guestName: guestName.trim(),
            status,
          }),
        }
      );

      setSubmittedStatus(response.status);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not submit your RSVP."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function getGoogleCalendarUrl() {
    if (!hangout) {
      return "#";
    }

    const start = formatGoogleCalendarDate(hangout.startTime);

    const fallbackEnd = new Date(
      new Date(hangout.startTime).getTime() + 2 * 60 * 60 * 1000
    ).toISOString();

    const end = formatGoogleCalendarDate(
      hangout.endTime ?? fallbackEnd
    );

    const parameters = new URLSearchParams({
      action: "TEMPLATE",
      text: hangout.title,
      dates: `${start}/${end}`,
      details: hangout.description ?? "",
      location: hangout.location ?? "",
    });

    return `https://calendar.google.com/calendar/render?${parameters.toString()}`;
  }

  if (loading) {
    return (
      <main className="page centered-page">
        <p>Loading invitation...</p>
      </main>
    );
  }

  if (error && !hangout) {
    return (
      <main className="page centered-page">
        <section className="card auth-card">
          <h1>Invitation unavailable</h1>
          <p className="error">{error}</p>
        </section>
      </main>
    );
  }

  if (!hangout) {
    return null;
  }

  if (submittedStatus) {
    const canAddToCalendar =
      submittedStatus === "YES" || submittedStatus === "MAYBE";

    return (
      <main className="page centered-page">
        <section className="card guest-card">
          <h1>RSVP saved</h1>

          <p>
            Thanks, <strong>{guestName.trim()}</strong>.
          </p>

          <p className="response-message">
            Your response:{" "}
            <strong>{formatStatus(submittedStatus)}</strong>
          </p>

          {canAddToCalendar && (
            <a
              className="button-link calendar-button"
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noreferrer"
            >
              Add to Google Calendar
            </a>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="page centered-page">
      <section className="card guest-card">
        <p className="muted">
          You’re invited by {hangout.organizerName}
        </p>

        <h1>{hangout.title}</h1>

        <p className="event-date">
          {new Date(hangout.startTime).toLocaleString()}
        </p>

        {hangout.location && (
          <p>
            <strong>Location:</strong> {hangout.location}
          </p>
        )}

        {hangout.description && (
          <p>{hangout.description}</p>
        )}

        <div className="guest-form">
          <label>
            Your name
            <input
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              maxLength={100}
              placeholder="Enter your name"
            />
          </label>

          <fieldset className="rsvp-fieldset">
            <legend>Are you coming?</legend>

            <div className="rsvp-options">
              <button
                type="button"
                className={
                  status === "YES"
                    ? "rsvp-option selected"
                    : "rsvp-option"
                }
                onClick={() => setStatus("YES")}
              >
                Yes
              </button>

              <button
                type="button"
                className={
                  status === "MAYBE"
                    ? "rsvp-option selected"
                    : "rsvp-option"
                }
                onClick={() => setStatus("MAYBE")}
              >
                Maybe
              </button>

              <button
                type="button"
                className={
                  status === "NO"
                    ? "rsvp-option selected"
                    : "rsvp-option"
                }
                onClick={() => setStatus("NO")}
              >
                No
              </button>
            </div>
          </fieldset>

          {error && <p className="error">{error}</p>}

          <button
            type="button"
            onClick={submitRsvp}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit RSVP"}
          </button>
        </div>
      </section>
    </main>
  );
}

function formatStatus(status: RsvpStatus) {
  if (status === "YES") {
    return "Yes";
  }

  if (status === "MAYBE") {
    return "Maybe";
  }

  return "No";
}

function formatGoogleCalendarDate(value: string) {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}
