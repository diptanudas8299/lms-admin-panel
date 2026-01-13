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
  status: "Active",
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
    try {
      const res = await getCourses({ limit: 100 });
      setCourses(res.data.courses);
    } catch {
      setError("Failed to load courses");
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.className ||
      !form.classCode ||
      !form.courseLinked ||
      !form.teacherAssigned ||
      !form.scheduleDay ||
      !form.scheduleTime ||
      !form.maxStudents
    ) {
      setError("Please fill all required fields");
      return;
    }

    const payload = {
      className: form.className,
      classCode: form.classCode,
      courseLinked: form.courseLinked,
      teacherAssigned: form.teacherAssigned,
      schedule: {
        day: form.scheduleDay,
        time: form.scheduleTime,
      },
      maxStudents: Number(form.maxStudents),
      status: form.status,
    };

    try {
      setLoading(true);
      setError("");

      if (editingId) {
        await updateClass(editingId, payload);
      } else {
        await createClass(payload);
      }

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
    try {
      setLoading(true);
      await deleteClass(deleteId);
      setDeleteId(null);
      loadClasses();
    } catch {
      setError("Failed to delete class");
    } finally {
      setLoading(false);
    }
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
              <option key={c._id} value={c._id}>
                {c.courseName}
              </option>
            ))}
          </select>

          <select name="teacherAssigned" value={form.teacherAssigned} onChange={handleChange} required>
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <input name="scheduleDay" placeholder="Day (e.g. Monday)" value={form.scheduleDay} onChange={handleChange} required />
          <input name="scheduleTime" placeholder="Time (e.g. 9AM)" value={form.scheduleTime} onChange={handleChange} required />
          <input name="maxStudents" placeholder="Max Students" value={form.maxStudents} onChange={handleChange} required />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button disabled={loading} className="mt-4 bg-blue-600 text-white px-4 py-1 rounded">
          {editingId ? "Update Class" : "Add Class"}
        </button>
      </form>

      <div className="flex gap-3 mb-3">
        <select value={courseFilter} onChange={(e) => { setPage(1); setCourseFilter(e.target.value); }}>
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.courseName}</option>
          ))}
        </select>

        <select value={teacherFilter} onChange={(e) => { setPage(1); setTeacherFilter(e.target.value); }}>
          <option value="">All Teachers</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white border">
          <thead>
            <tr>
              <th>Class</th>
              <th>Code</th>
              <th>Course</th>
              <th>Teacher</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id} className="border-t">
                <td>{cls.className}</td>
                <td>{cls.classCode}</td>
                <td>{cls.courseLinked?.courseName || "-"}</td>
                <td>{cls.teacherAssigned?.name || "-"}</td>
                <td>{cls.schedule?.day} {cls.schedule?.time}</td>
                <td>{cls.status}</td>
                <td className="space-x-2">
                  <button onClick={() => handleEdit(cls)}>Edit</button>
                  <button onClick={() => setDeleteId(cls._id)} className="text-red-500">Delete</button>
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
