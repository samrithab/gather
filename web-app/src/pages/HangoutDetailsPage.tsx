import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  MapPin,
  RefreshCw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";

type Hangout = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string | null;
  inviteCode: string;
  createdAt: string;
};

type RsvpStatus = "YES" | "MAYBE" | "NO";

type RsvpResponse = {
  id: string;
  guestName: string;
  status: RsvpStatus;
  respondedAt: string;
};

type RsvpSummary = {
  yes: number;
  maybe: number;
  no: number;
  total: number;
};

type HangoutRsvpsResponse = {
  hangoutId: string;
  summary: RsvpSummary;
  responses: RsvpResponse[];
};

export default function HangoutDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [hangout, setHangout] = useState<Hangout | null>(null);
  const [rsvpData, setRsvpData] =
    useState<HangoutRsvpsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [rsvpsLoading, setRsvpsLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvpError, setRsvpError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Hangout ID is missing.");
      setLoading(false);
      setRsvpsLoading(false);
      return;
    }

    void loadHangout();
    void loadRsvps();
  }, [id]);

  async function loadHangout() {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest<Hangout>(
        `/api/hangouts/${id}`,
      );

      setHangout(response);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Unable to load hangout."),
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadRsvps() {
    try {
      setRsvpsLoading(true);
      setRsvpError("");

      const response = await apiRequest<HangoutRsvpsResponse>(
        `/api/hangouts/${id}/rsvps`,
      );

      setRsvpData(response);
    } catch (requestError) {
      setRsvpError(
        getErrorMessage(
          requestError,
          "Unable to load guest responses.",
        ),
      );
    } finally {
      setRsvpsLoading(false);
    }
  }

  const groupedResponses = useMemo(() => {
    const responses = rsvpData?.responses ?? [];

    return {
      yes: responses.filter(
        (response) => response.status === "YES",
      ),
      maybe: responses.filter(
        (response) => response.status === "MAYBE",
      ),
      no: responses.filter(
        (response) => response.status === "NO",
      ),
    };
  }, [rsvpData]);

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading hangout...</p>
      </main>
    );
  }

  if (error || !hangout) {
    return (
      <main className="page-container">
        <div className="page-header">
          <Link
            to="/hangouts"
            className="back-link modern-back-link"
          >
            <ArrowLeft size={16} />
            Back to hangouts
          </Link>
        </div>

        <div className="error-message">
          {error || "Hangout not found."}
        </div>
      </main>
    );
  }

  const inviteUrl =
    `${window.location.origin}/invite/${hangout.inviteCode}`;

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the invite link.");
    }
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <Link
            to="/hangouts"
            className="back-link modern-back-link"
          >
            <ArrowLeft size={16} />
            Back to hangouts
          </Link>

          <h1>{hangout.title}</h1>

          <p className="event-header-date">
            <CalendarDays size={16} />
            {formatDate(hangout.startTime)}
          </p>

          <p className="page-subtitle">
            Manage invitations, monitor RSVPs and share your event.
          </p>
        </div>
      </div>

      <section className="details-grid">
        <div className="details-column">
          <section className="content-card">
            <h2>Event details</h2>

            <div className="event-information">
              <DetailRow
                icon={<CalendarDays size={18} />}
                label="Date"
                value={formatDate(hangout.startTime)}
              />

              <DetailRow
                icon={<Clock3 size={18} />}
                label="Time"
                value={formatTimeRange(
                  hangout.startTime,
                  hangout.endTime,
                )}
              />

              <DetailRow
                icon={<MapPin size={18} />}
                label="Location"
                value={
                  hangout.location || "No location provided"
                }
              />

              <DetailRow
                icon={<FileText size={18} />}
                label="Description"
                value={
                  hangout.description ||
                  "No description provided"
                }
              />
            </div>
          </section>

          <section className="content-card">
            <div className="section-heading-row">
              <div>
                <h2>Guest responses</h2>
                <p className="section-description">
                  See who is attending your hangout.
                </p>
              </div>

              <button
                type="button"
                className="secondary-button refresh-button"
                onClick={() => void loadRsvps()}
                disabled={rsvpsLoading}
              >
                <RefreshCw
                  size={16}
                  className={
                    rsvpsLoading ? "refresh-icon spinning" : "refresh-icon"
                  }
                />
                {rsvpsLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {rsvpError && (
              <div className="error-message">{rsvpError}</div>
            )}

            {rsvpsLoading && !rsvpData ? (
              <p>Loading guest responses...</p>
            ) : (
              <>
                <div className="rsvp-summary-grid">
                  <SummaryCard
                    label="Going"
                    count={rsvpData?.summary.yes ?? 0}
                  />

                  <SummaryCard
                    label="Maybe"
                    count={rsvpData?.summary.maybe ?? 0}
                  />

                  <SummaryCard
                    label="Not going"
                    count={rsvpData?.summary.no ?? 0}
                  />

                  <SummaryCard
                    label="Total"
                    count={rsvpData?.summary.total ?? 0}
                  />
                </div>

                {(rsvpData?.summary.total ?? 0) === 0 ? (
                  <div className="empty-state">
                    <h3>No responses yet</h3>
                    <p>
                      Share the invite link or QR code with your
                      guests.
                    </p>
                  </div>
                ) : (
                  <div className="response-groups">
                    <ResponseGroup
                      title="Going"
                      responses={groupedResponses.yes}
                    />

                    <ResponseGroup
                      title="Maybe"
                      responses={groupedResponses.maybe}
                    />

                    <ResponseGroup
                      title="Not going"
                      responses={groupedResponses.no}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <aside className="share-column">
          <section className="content-card share-card">
            <h2 className="share-title">
              <Share2 size={20} />
              Share invitation
            </h2>

            <p className="section-description">
              Guests can scan the QR code or open the invite link.
            </p>

            <div className="qr-code-container">
              <QRCodeSVG
                value={inviteUrl}
                size={210}
                level="H"
                includeMargin
              />
            </div>

            <div className="invite-link-box">
              <span>{inviteUrl}</span>
            </div>

            <button
              type="button"
              className="primary-button full-width-button"
              onClick={() => void copyInviteLink()}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy invite link
                </>
              )}
            </button>

            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="secondary-button full-width-button link-button"
            >
              <ExternalLink size={16} />
              Preview invite
            </a>
          </section>
        </aside>
      </section>
    </main>
  );
}

type DetailRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function DetailRow({
  icon,
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="detail-row">
      <div className="detail-icon">{icon}</div>

      <div className="detail-copy">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value}</span>
      </div>
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  count: number;
};

function SummaryCard({
  label,
  count,
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <span className="summary-count">{count}</span>
      <span className="summary-label">{label}</span>
    </div>
  );
}

type ResponseGroupProps = {
  title: string;
  responses: RsvpResponse[];
};

function ResponseGroup({
  title,
  responses,
}: ResponseGroupProps) {
  return (
    <section className="response-group">
      <div className="response-group-header">
        <h3>{title}</h3>
        <span className="response-count">
          {responses.length}
        </span>
      </div>

      {responses.length === 0 ? (
        <p className="empty-group-message">
          No guests yet.
        </p>
      ) : (
        <div className="guest-list">
          {responses.map((response) => (
            <div
              key={response.id}
              className="guest-row"
            >
              <div className="guest-avatar">
                {getInitial(response.guestName)}
              </div>

              <div>
                <p className="guest-name">
                  {response.guestName}
                </p>

                <p className="response-date">
                  Responded{" "}
                  {formatResponseDate(
                    response.respondedAt,
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatTimeRange(
  startTime: string,
  endTime: string | null,
) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  });

  const formattedStart = formatter.format(
    new Date(startTime),
  );

  if (!endTime) {
    return formattedStart;
  }

  const formattedEnd = formatter.format(
    new Date(endTime),
  );

  return `${formattedStart} – ${formattedEnd}`;
}

function formatResponseDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}