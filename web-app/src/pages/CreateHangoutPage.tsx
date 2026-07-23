import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";

type CreatedHangout = {
  id: string;
};

export default function CreateHangoutPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isoStartTime = new Date(startTime).toISOString();

      const response = await apiRequest<CreatedHangout>("/api/hangouts", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: description || null,
          location: location || null,
          startTime: isoStartTime,
          endTime: null,
        }),
      });

      navigate(`/hangouts/${response.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not create hangout."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <Link to="/hangouts" className="back-link">
        ← Back
      </Link>

      <section className="card">
        <h1>Create Hangout</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={1000}
            />
          </label>

          <label>
            Location
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              maxLength={255}
            />
          </label>

          <label>
            Date and time
            <input
              type="datetime-local"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Hangout"}
          </button>
        </form>
      </section>
    </main>
  );
}