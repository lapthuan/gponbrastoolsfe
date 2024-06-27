import requests from "./httpService";

const ServiceGoogleSheets = {
  updateData: async (body) => {
    return requests.post(`/sheets/update`, body);
  },

  getAllGgSheets: async () => {
    return requests.get(`/sheets/`);
  },

  getGgSheet: async (id) => {
    return requests.get(`/sheets/${id}`);
  },
  createGgSheet: async (body) => {
    return requests.post(`/sheets/`, body);
  },
  editGgSheet: async (body, id) => {
    return requests.put(`/sheets/${id}`, body);
  },
  deleteGgsheet: async (id) => {
    return requests.delete(`/sheets/${id}`);
  },
};

export default ServiceGoogleSheets;
