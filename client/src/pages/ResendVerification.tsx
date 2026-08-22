import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function ResendVerification() {
  const [searchParams] = useSearchParams();

  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Unable to send email");
        return;
      }

      setMessage(data.message);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Check your email
          </h1>

          <p className="mt-2 text-gray-600">
            We sent a verification link to:
          </p>

          {email && (
            <p className="mt-2 font-medium text-gray-900">
              {email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Email"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />
        </div>

        <p className="text-sm text-gray-600">
          Didn't receive the email? You can send a new
          verification link below.
        </p>

        {message && (
          <p className="rounded-lg bg-green-50 p-3 text-green-600">
            {message}
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting
            ? "Sending..."
            : "Resend verification email"}
        </button>

        <Link
          to="/login"
          className="block text-center text-blue-600 hover:underline"
        >
          Back to login
        </Link>
      </form>
    </main>
  );
}

export default ResendVerification;