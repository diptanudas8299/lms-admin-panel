import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { admin, logout } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white shadow shrink-0">
      {/* Brand / Title */}
      <div className="text-lg font-semibold text-gray-800">
        LMS Admin Panel
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {admin && (
          <span className="text-sm text-gray-600">
            {admin.email}
          </span>
        )}

        <button
          onClick={logout}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
