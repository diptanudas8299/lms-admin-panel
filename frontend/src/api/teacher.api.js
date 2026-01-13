import api from "./axios";

// GET teachers with filters + pagination
export const getTeachers = (params = {}) => {
  return api.get("/teachers", { params });
};

// CREATE teacher (multipart)
export const createTeacher = (formData) => {
  return api.post("/teachers", formData);
};

// UPDATE teacher (multipart)
export const updateTeacher = (id, formData) => {
  if (!id) {
    throw new Error("Teacher ID is required");
  }
  return api.put(`/teachers/${id}`, formData);
};

// SOFT DELETE teacher
export const deleteTeacher = (id) => {
  if (!id) {
    throw new Error("Teacher ID is required");
  }
  return api.delete(`/teachers/${id}`);
};
