import api from "./axios";

export const getParents = (params = {}) => {
  const {
    search = "",
    page = 1,
    limit = 10,
  } = params;

  return api.get("/parents", {
    params: {
      search,
      page,
      limit,
    },
  });
};
