import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.stats);
      } catch {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Teachers" value={stats.teachers} />
        <StatCard title="Courses" value={stats.courses} />
        <StatCard title="Classes" value={stats.classes} />
        <StatCard title="Students" value={stats.students} />
        <StatCard title="Parents" value={stats.parents} />
      </div>
    </div>
  );
}
