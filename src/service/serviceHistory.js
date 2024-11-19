import requests from "./httpService";

const ServiceHistory = {
  getAllHistory: async () => {
    return requests.get(`/history`);
  },
  deleteAllHistory: async (id) => {
    return requests.delete(`/history`);
  },
};

export default ServiceHistory;
