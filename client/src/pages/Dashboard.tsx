import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-xl bg-white p-8 shadow sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name} 👋
            </h1>

            <p className="mt-2 text-gray-600">
              Your personal AI career and learning assistant.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void logout();
            }}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        {/* Main navigation cards */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">
            Career Assistant
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile */}
            <div className="rounded-xl bg-white p-6 shadow">
              <div className="text-3xl">👤</div>

              <h3 className="mt-4 text-xl font-bold">
                Career Profile
              </h3>

              <p className="mt-2 text-gray-600">
                Manage your education, experience, skills and
                career goals.
              </p>

              <Link
                to="/profile"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                View Profile →
              </Link>
            </div>

            {/* Documents */}
            <div className="rounded-xl bg-white p-6 shadow">
              <div className="text-3xl">📄</div>

              <h3 className="mt-4 text-xl font-bold">
                Documents
              </h3>

              <p className="mt-2 text-gray-600">
                Upload and manage your resume and career
                documents.
              </p>

              <Link
                to="/documents"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Manage Documents →
              </Link>
            </div>

            {/* Chat */}
            <div className="rounded-xl bg-white p-6 shadow">
              <div className="text-3xl">🤖</div>

              <h3 className="mt-4 text-xl font-bold">
                AI Career Chat
              </h3>

              <p className="mt-2 text-gray-600">
                Ask questions about your skills, experience,
                projects and career.
              </p>

              <Link
                to="/chat"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Start Chat →
              </Link>
            </div>
          </div>
        </section>

        {/* Account information */}
        <section className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-bold">
            Account Information
          </h2>

          <div className="mt-4 space-y-2 text-gray-600">
            <p>
              <span className="font-medium text-gray-900">
                Name:
              </span>{" "}
              {user?.name}
            </p>

            <p>
              <span className="font-medium text-gray-900">
                Email:
              </span>{" "}
              {user?.email}
            </p>

            <p>
              <span className="font-medium text-gray-900">
                Email verification:
              </span>{" "}
              {user?.isEmailVerified ? (
                <span className="font-medium text-green-600">
                  ✓ Verified
                </span>
              ) : (
                <span className="font-medium text-red-600">
                  Not verified
                </span>
              )}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;