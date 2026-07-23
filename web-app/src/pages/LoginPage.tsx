import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  Mail,
  User,
  Users,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";

type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await apiRequest("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        });
      }

      const response = await apiRequest<LoginResponse>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      );

      localStorage.setItem(
        "accessToken",
        response.accessToken,
      );
      localStorage.setItem(
        "userName",
        response.user.name,
      );

      navigate("/hangouts");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsRegistering((current) => !current);
    setError("");
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="auth-brand">
          <div className="auth-brand-mark">
            <Users size={24} />
          </div>

          <span>Gather</span>
        </div>

        <div className="auth-showcase-content">
          <p className="auth-eyebrow">
            Plan together, effortlessly
          </p>

          <h1>
            Turn plans into moments worth remembering.
          </h1>

          <p className="auth-showcase-description">
            Create hangouts, share an invite and keep
            track of every RSVP in one simple place.
          </p>

          <div className="auth-feature-list">
            <AuthFeature
              icon={<CalendarDays size={18} />}
              text="Create and organize hangouts"
            />

            <AuthFeature
              icon={<Users size={18} />}
              text="Share invitations with friends"
            />

            <AuthFeature
              icon={<CheckCircle2 size={18} />}
              text="Track RSVPs instantly"
            />
          </div>
        </div>

        <p className="auth-showcase-footer">
          A full-stack portfolio project built with React,
          Kotlin and Spring Boot.
        </p>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-mobile-brand">
            <div className="auth-brand-mark">
              <Users size={22} />
            </div>

            <span>Gather</span>
          </div>

          <div className="auth-heading">
            <p className="auth-form-eyebrow">
              {isRegistering
                ? "Create your account"
                : "Welcome back"}
            </p>

            <h2>
              {isRegistering
                ? "Start planning together"
                : "Sign in to Gather"}
            </h2>

            <p>
              {isRegistering
                ? "Create an account to organize your next hangout."
                : "Enter your details to manage your hangouts."}
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {isRegistering && (
              <label className="auth-field">
                <span>Name</span>

                <div className="auth-input-wrapper">
                  <User size={18} />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </div>
              </label>
            )}

            <label className="auth-field">
              <span>Email</span>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>

              <div className="auth-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete={
                    isRegistering
                      ? "new-password"
                      : "current-password"
                  }
                  minLength={8}
                  required
                />
              </div>
            </label>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Please wait..."
                  : isRegistering
                    ? "Create account"
                    : "Sign in"}
              </span>

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-switch">
            <span>
              {isRegistering
                ? "Already have an account?"
                : "New to Gather?"}
            </span>

            <button
              type="button"
              onClick={toggleMode}
            >
              {isRegistering
                ? "Sign in"
                : "Create an account"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

type AuthFeatureProps = {
  icon: React.ReactNode;
  text: string;
};

function AuthFeature({
  icon,
  text,
}: AuthFeatureProps) {
  return (
    <div className="auth-feature">
      <div className="auth-feature-icon">
        {icon}
      </div>

      <span>{text}</span>
    </div>
  );
}