import { useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function VerifyOtp() {
  const [searchParams] = useSearchParams();

  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const sendOtp = async () => {
    setSending(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/auth/send-otp`,
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
        setError(
          data.message ?? "Unable to send OTP"
        );
        return;
      }

      setOtpSent(true);
      setMessage(
        "OTP sent successfully. Check your email."
      );
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setVerifying(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ?? "Invalid OTP"
        );
        return;
      }

      setMessage(
        "OTP verified successfully!"
      );
      setOtp("");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">
          Verify OTP
        </h1>

        <p className="mt-2 text-gray-600">
          Enter your email and verify the OTP
          sent to you.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
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
              className="w-full rounded-lg border p-3"
            />
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={sendOtp}
              disabled={sending || !email}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {sending
                ? "Sending OTP..."
                : "Send OTP"}
            </button>
          ) : (
            <>
              <form
                onSubmit={verifyOtp}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium"
                  >
                    Enter 6-digit OTP
                  </label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="123456"
                    className="w-full rounded-lg border p-3 text-center text-xl tracking-[0.5em]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    verifying || otp.length !== 6
                  }
                  className="w-full rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {verifying
                    ? "Verifying..."
                    : "Verify OTP"}
                </button>
              </form>

              <button
                type="button"
                onClick={sendOtp}
                disabled={sending}
                className="w-full text-sm text-blue-600 hover:underline disabled:opacity-50"
              >
                {sending
                  ? "Sending..."
                  : "Send a new OTP"}
              </button>
            </>
          )}

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

          <Link
            to="/login"
            className="block text-center text-blue-600 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default VerifyOtp;