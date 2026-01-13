import { useEffect, useState } from "react";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../api/teacher.api";
import ConfirmDelete from "../components/ConfirmDelete";
import Pagination from "../components/Pagination";

const initialForm = {
  name: "",
  email: "",
  phoneNumber: "",
  subjects: "",
  status: "active",   // ✅ lowercase
  profileImage: null,
};

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeachers();
  }, [page, search]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getTeachers({ page, search });
      setTeachers(res.data.teachers);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectsArray = form.subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!subjectsArray.length) {
      setError("At least one subject is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("status", form.status);
    formData.append("subjects", JSON.stringify(subjectsArray));
    if (form.profileImage) {
      formData.append("profileImage", form.profileImage);
    }

    try {
      setLoading(true);
      setError("");

      if (editingId) {
        await updateTeacher(editingId, formData);
      } else {
        await createTeacher(formData);
      }

      setForm(initialForm);
      setEditingId(null);
      loadTeachers();
    } catch {
      setError("Failed to save teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher._id);
    setForm({
      name: teacher.name,
      email: teacher.email,
      phoneNumber: teacher.phoneNumber,
      subjects: teacher.subjects.join(", "),
      status: teacher.status,
      profileImage: null,
    });
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteTeacher(deleteId);
      setDeleteId(null);
      loadTeachers();
    } catch {
      setError("Failed to delete teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Teachers</h1>

      {error && <div className="mb-3 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-6">
        <div className="grid md:grid-cols-3 gap-3">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phoneNumber" placeholder="Phone" value={form.phoneNumber} onChange={handleChange} required />
          <input name="subjects" placeholder="Subjects (comma separated)" value={form.subjects} onChange={handleChange} />
          <select name="status" value={form.status} onChange={handleChange}>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</select>
          <input type="file" name="profileImage" onChange={handleChange} />
        </div>
        <button disabled={loading} className="mt-4 bg-blue-600 text-white px-4 py-1 rounded">
          {editingId ? "Update Teacher" : "Add Teacher"}
        </button>
      </form>

      <input
        placeholder="Search by name"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="mb-3 border px-2 py-1"
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subjects</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t._id} className="border-t">
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.subjects.join(", ")}</td>
                <td>{t.status}</td>
                <td className="space-x-2">
                  <button onClick={() => handleEdit(t)}>Edit</button>
                  <button onClick={() => setDeleteId(t._id)} className="text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ConfirmDelete
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
