import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Login() {
  const { user, loading, login } = useAuth();

  const navigate = useNavigate();

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

  const submitLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const message = await login(email, password);

      if (message) {
        setError(message);
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Unable to connect to the server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <form
        onSubmit={submitLogin}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-bold">
          AI Career Assistant
        </h1>

        <p className="text-gray-600">
          Login to your account
        </p>

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
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
          required
          className="w-full rounded border p-3"
        />

        {error && (
          <p className="text-red-600">{error}</p>
        )}

        <button
          disabled={submitting}
          className="w-full rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href =
              "http://localhost:5000/api/auth/google";
          }}
          className="w-full rounded-lg border bg-white px-5 py-3 text-gray-700 hover:bg-gray-50"
        >
          Continue with Google
        </button>
        <p className="text-center text-sm text-gray-600">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="text-blue-600 hover:underline"
  >
    Create account
  </Link>
</p>
      </form>
    </div>
  );
}

export default Login;