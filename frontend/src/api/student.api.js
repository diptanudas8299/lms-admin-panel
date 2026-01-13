import api from "./axios";

export const getStudents = (params = {}) => {
  const {
    search = "",
    classId = "",
    page = 1,
    limit = 10,
  } = params;

  return api.get("/students", {
    params: {
      search,
      classId,
      page,
      limit,
    },
  });
};
