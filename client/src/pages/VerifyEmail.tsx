import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);
  const verificationAttempt = useRef<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Verification token is missing.");
      return;
    }

    if (verificationAttempt.current === token) {
      return;
    }
    verificationAttempt.current = token;

    const verify = async () => {
      try {
        const response = await fetch(
          `${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`,
        );
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message ?? "Unable to verify your email.");
          return;
        }

        setSuccess(true);
        setMessage(data.message ?? "Email verified successfully.");
      } catch {
        setMessage("Unable to connect to the server.");
      }
    };

    void verify();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">{success ? "Email verified" : "Email verification"}</h1>
      <p className={success ? "text-green-600" : "text-gray-600"}>{message}</p>
      {success && (
        <Link to="/login" className="rounded bg-blue-600 px-5 py-3 text-white">
          Go to login
        </Link>
      )}
    </main>
  );
}

export default VerifyEmail;