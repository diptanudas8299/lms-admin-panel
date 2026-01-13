import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  // ⏳ Auth state still resolving
  if (loading) return null;

  // 🔐 Not authenticated
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated
  return children;
}
