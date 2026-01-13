import api from "./axios";

// GET classes (filters, pagination)
export const getClasses = (params = {}) => {
  return api.get("/classes", { params });
};

// CREATE class
export const createClass = (data) => {
  if (!data) {
    throw new Error("Class data is required");
  }
  return api.post("/classes", data);
};

// UPDATE class
export const updateClass = (id, data) => {
  if (!id) {
    throw new Error("Class ID is required");
  }
  if (!data) {
    throw new Error("Update data is required");
  }
  return api.put(`/classes/${id}`, data);
};

// DELETE class
export const deleteClass = (id) => {
  if (!id) {
    throw new Error("Class ID is required");
  }
  return api.delete(`/classes/${id}`);
};
