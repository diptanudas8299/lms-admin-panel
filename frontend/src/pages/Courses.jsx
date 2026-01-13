import { useEffect, useState } from "react";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../api/course.api";
import { getTeachers } from "../api/teacher.api";
import ConfirmDelete from "../components/ConfirmDelete";
import Pagination from "../components/Pagination";

const initialForm = {
  courseName: "",
  classLevel: "1",
  subject: "",
  description: "",
  price: "",
  durationInWeeks: "",
  teacherAssigned: "",
  status: "Active",
  thumbnail: null,
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, [page, search, classFilter]);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCourses({
        page,
        search,
        classLevel: classFilter,
      });
      setCourses(res.data.courses);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      const res = await getTeachers({ limit: 100 });
      setTeachers(res.data.teachers);
    } catch {
      setError("Failed to load teachers");
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

    if (
      !form.courseName ||
      !form.subject ||
      !form.description ||
      !form.durationInWeeks ||
      !form.teacherAssigned
    ) {
      setError("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("courseName", form.courseName);
    formData.append("classLevel", form.classLevel);
    formData.append("subject", form.subject);
    formData.append("description", form.description);
    formData.append("status", form.status);
    formData.append("teacherAssigned", form.teacherAssigned);
    formData.append("durationInWeeks", form.durationInWeeks);

    if (form.price !== "") {
      formData.append("price", form.price);
    }

    if (form.thumbnail) {
      formData.append("thumbnail", form.thumbnail);
    }

    try {
      setLoading(true);
      setError("");

      if (editingId) {
        await updateCourse(editingId, formData);
      } else {
        await createCourse(formData);
      }

      setForm(initialForm);
      setEditingId(null);
      loadCourses();
    } catch {
      setError("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setForm({
      courseName: course.courseName,
      classLevel: course.classLevel,
      subject: course.subject,
      description: course.description,
      price: course.price || "",
      durationInWeeks: course.durationInWeeks,
      teacherAssigned: course.teacherAssigned?._id || "",
      status: course.status,
      thumbnail: null,
    });
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteCourse(deleteId);
      setDeleteId(null);
      loadCourses();
    } catch {
      setError("Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Courses</h1>

      {error && <div className="mb-3 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-6">
        <div className="grid md:grid-cols-3 gap-3">
          <input name="courseName" placeholder="Course Name" value={form.courseName} onChange={handleChange} required />
          <select name="classLevel" value={form.classLevel} onChange={handleChange}>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Class {i + 1}
              </option>
            ))}
          </select>
          <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
          <input name="durationInWeeks" placeholder="Duration (weeks)" value={form.durationInWeeks} onChange={handleChange} required />
          <select name="teacherAssigned" value={form.teacherAssigned} onChange={handleChange} required>
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <input type="file" name="thumbnail" onChange={handleChange} />
        </div>

        <textarea
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border mt-3 p-2"
          required
        />

        <button disabled={loading} className="mt-4 bg-blue-600 text-white px-4 py-1 rounded">
          {editingId ? "Update Course" : "Add Course"}
        </button>
      </form>

      <div className="flex gap-3 mb-3">
        <input
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          value={classFilter}
          onChange={(e) => {
            setPage(1);
            setClassFilter(e.target.value);
          }}
        >
          <option value="">All Classes</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              Class {i + 1}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white border">
          <thead>
            <tr>
              <th>Course</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-t">
                <td>{c.courseName}</td>
                <td>{c.classLevel}</td>
                <td>{c.subject}</td>
                <td>{c.teacherAssigned?.name}</td>
                <td>{c.status}</td>
                <td className="space-x-2">
                  <button onClick={() => handleEdit(c)}>Edit</button>
                  <button onClick={() => setDeleteId(c._id)} className="text-red-500">
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
