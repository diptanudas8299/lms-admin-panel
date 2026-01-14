import { useEffect, useState } from "react";
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../api/class.api";
import { getCourses } from "../api/course.api";
import { getTeachers } from "../api/teacher.api";
import ConfirmDelete from "../components/ConfirmDelete";
import Pagination from "../components/Pagination";

const initialForm = {
  className: "",
  classCode: "",
  courseLinked: "",
  teacherAssigned: "",
  scheduleDay: "",
  scheduleTime: "",
  maxStudents: "",
  status: "active", // ✅ lowercase
};

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [courseFilter, setCourseFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClasses();
  }, [page, courseFilter, teacherFilter]);

  useEffect(() => {
    loadCourses();
    loadTeachers();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getClasses({
        page,
        course: courseFilter,
        teacher: teacherFilter,
      });
      setClasses(res.data.classes);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    const res = await getCourses({ limit: 100 });
    setCourses(res.data.courses);
  };

  const loadTeachers = async () => {
    const res = await getTeachers({ limit: 100 });
    setTeachers(res.data.teachers);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      className: form.className,
      classCode: form.classCode,
      courseLinked: form.courseLinked,
      teacherAssigned: form.teacherAssigned,
      schedule: {
        day: form.scheduleDay,   // ✅ enum-safe
        time: form.scheduleTime,
      },
      maxStudents: Number(form.maxStudents),
      status: form.status,       // ✅ lowercase enum
    };

    try {
      setLoading(true);
      setError("");

      editingId
        ? await updateClass(editingId, payload)
        : await createClass(payload);

      setForm(initialForm);
      setEditingId(null);
      loadClasses();
    } catch {
      setError("Failed to save class");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cls) => {
    setEditingId(cls._id);
    setForm({
      className: cls.className,
      classCode: cls.classCode,
      courseLinked: cls.courseLinked?._id || "",
      teacherAssigned: cls.teacherAssigned?._id || "",
      scheduleDay: cls.schedule?.day || "",
      scheduleTime: cls.schedule?.time || "",
      maxStudents: cls.maxStudents,
      status: cls.status,
    });
  };

  const confirmDelete = async () => {
    await deleteClass(deleteId);
    setDeleteId(null);
    loadClasses();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Classes</h1>

      {error && <div className="mb-3 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-6">
        <div className="grid md:grid-cols-3 gap-3">
          <input name="className" placeholder="Class Name" value={form.className} onChange={handleChange} required />
          <input name="classCode" placeholder="Class Code" value={form.classCode} onChange={handleChange} required />

          <select name="courseLinked" value={form.courseLinked} onChange={handleChange} required>
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.courseName}</option>
            ))}
          </select>

          <select name="teacherAssigned" value={form.teacherAssigned} onChange={handleChange} required>
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>

          {/* ✅ FIXED ENUM DROPDOWN */}
          <select name="scheduleDay" value={form.scheduleDay} onChange={handleChange} required>
            <option value="">Select Day</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>

          <input name="scheduleTime" placeholder="Time (e.g. 9AM)" value={form.scheduleTime} onChange={handleChange} required />
          <input name="maxStudents" placeholder="Max Students" value={form.maxStudents} onChange={handleChange} required />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button disabled={loading} className="mt-4 bg-blue-600 text-white px-4 py-1 rounded">
          {editingId ? "Update Class" : "Add Class"}
        </button>
      </form>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ConfirmDelete
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
