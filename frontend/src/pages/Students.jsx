import { useEffect, useState } from "react";
import { getStudents } from "../api/student.api";
import { getClasses } from "../api/class.api";
import Pagination from "../components/Pagination";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [classesError, setClassesError] = useState("");

  useEffect(() => {
    loadStudents();
  }, [search, classFilter, page]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setStudentsError("");

      const res = await getStudents({
        search,
        classId: classFilter,
        page,
        limit: 10,
      });

      setStudents(res.data.students);
      setTotalPages(res.data.totalPages);
    } catch {
      setStudentsError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      setClassesError("");
      const res = await getClasses({ limit: 100 });
      setClasses(res.data.classes);
    } catch {
      setClassesError("Failed to load classes");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Students</h1>

      {studentsError && (
        <div className="mb-3 text-red-500">{studentsError}</div>
      )}

      {/* FILTERS */}
      <div className="flex gap-3 mb-3">
        <input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-2 py-1"
        />

        <select
          value={classFilter}
          onChange={(e) => {
            setPage(1);
            setClassFilter(e.target.value);
          }}
          className="border px-2 py-1"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.className}
            </option>
          ))}
        </select>
      </div>

      {classesError && (
        <div className="mb-2 text-sm text-red-400">
          {classesError}
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div>Loading students...</div>
      ) : (
        <table className="w-full bg-white border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Enrollment Date</th>
              <th>Parent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t">
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>
                  {s.classEnrolled
                    ? `${s.classEnrolled.className} (${s.classEnrolled.classCode})`
                    : "-"}
                </td>
                <td>
                  {new Date(s.enrollmentDate).toLocaleDateString()}
                </td>
                <td>{s.parent?.name || "-"}</td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No students found
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
