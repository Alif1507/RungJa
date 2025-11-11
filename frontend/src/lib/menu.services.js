import api from "./axios.js";

const menuService = {
  list: async (page = 1) => {
    const { data } = await api.get("/menus", { params: { page } });
    return data.data;
  },

  get: async (id) => {
    const { data } = await api.get(`/menus/${id}`);
    return data.data;
  },

  create: async (payload) => {
    const { data } = await api.post(`/menus`, payload);
    return data.data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/menus/${id}`, payload);
    return data.data;
  },

  delete: async (id) => {
    await api.delete(`/menus/${id}`);
  }
};

export default menuService;

