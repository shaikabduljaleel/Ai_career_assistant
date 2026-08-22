import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name}
          </h1>

          <p className="mt-2 text-gray-600">
            {user?.email}
          </p>

          <p className="mt-4">
            Email verified:{" "}
            {user?.isEmailVerified ? "Yes" : "No"}
          </p>

          <button
            onClick={logout}
            className="mt-6 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;