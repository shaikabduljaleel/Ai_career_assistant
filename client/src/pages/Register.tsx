import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { user, loading, register } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  if (user) {
    navigate("/dashboard");
    return null;
  }

  const submitRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const message = await register(
        name,
        email,
        password
      );

      if (message) {
        setError(message);
        return;
      }

      navigate(
  `/resend-verification?email=${encodeURIComponent(email)}`
);
    } catch {
      setError("Unable to connect to the server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <form
        onSubmit={submitRegister}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        <p className="text-gray-600">
          Start your AI learning journey
        </p>

        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          type="text"
          placeholder="Full name"
          required
          className="w-full rounded border p-3"
        />

        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email"
          required
          className="w-full rounded border p-3"
        />

        <input
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          type="password"
          placeholder="Password"
          required
          minLength={8}
          className="w-full rounded border p-3"
        />

        {error && (
          <p className="text-red-600">{error}</p>
        )}

        <button
          disabled={submitting}
          className="w-full rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting
            ? "Creating account..."
            : "Create account"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;