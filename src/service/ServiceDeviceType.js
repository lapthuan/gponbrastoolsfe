import requests from "./httpService";

const ServiceDeviceType = {
  getAllDeviceType: async () => {
    return requests.get(`/devicetype/`);
  },
  getDeviceType: async (id) => {
    return requests.get(`/devicetype/${id}`);
  },
  createDeviceType: async (body) => {
    return requests.post(`/devicetype/`, body);
  },
  editDeviceType: async (body, id) => {
    return requests.put(`/devicetype/${id}`, body);
  },
  deleteDeviceType: async (id) => {
    return requests.delete(`/devicetype/${id}`);
  },
};

export default ServiceDeviceType;
