import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import Parents from "./pages/Parents";

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="courses" element={<Courses />} />
            <Route path="classes" element={<Classes />} />
            <Route path="students" element={<Students />} />
            <Route path="parents" element={<Parents />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
