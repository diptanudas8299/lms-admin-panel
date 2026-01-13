import api from "./axios";

// GET courses (search, filters, pagination)
export const getCourses = (params = {}) => {
  return api.get("/courses", { params });
};

// CREATE course (multipart)
export const createCourse = (formData) => {
  return api.post("/courses", formData);
};

// UPDATE course (multipart)
export const updateCourse = (id, formData) => {
  if (!id) {
    throw new Error("Course ID is required");
  }
  return api.put(`/courses/${id}`, formData);
};

// DELETE course
export const deleteCourse = (id) => {
  if (!id) {
    throw new Error("Course ID is required");
  }
  return api.delete(`/courses/${id}`);
};
