import { useEffect, useState } from "react";
import { getParents } from "../api/parent.api";
import Pagination from "../components/Pagination";

export default function Parents() {
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadParents();
  }, [search, page]);

  const loadParents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getParents({
        search,
        page,
      });

      setParents(res.data.parents);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load parents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Parents</h1>

      {error && <div className="mb-3 text-red-500">{error}</div>}

      {/* SEARCH */}
      <input
        placeholder="Search by name, email, or phone"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="border px-2 py-1 mb-3"
      />

      {/* TABLE */}
      {loading ? (
        <div>Loading parents...</div>
      ) : (
        <table className="w-full bg-white border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((p) => (
              <tr key={p._id} className="border-t">
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>
                  {p.students?.length
                    ? p.students.map((s) => s.name).join(", ")
                    : "-"}
                </td>
              </tr>
            ))}

            {parents.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No parents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  );
}
