import { useState } from "react";
import { api } from "../services/api.js";

function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const checkServer = async () => {
    try {
      setLoading(true);

      const data = await api.getHealth();

      setMessage(data.message);
    } catch (error) {
      setMessage("Unable to connect to server");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">
        AI Career Assistant
      </h1>

      <button
        onClick={checkServer}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check Backend"}
      </button>

      {message && (
        <p className="text-lg">
          Server: {message}
        </p>
      )}
    </div>
  );
}

export default Home;