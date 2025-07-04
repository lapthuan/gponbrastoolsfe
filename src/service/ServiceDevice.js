import requests from "./httpService";

const ServiceDevice = {
  getAlldevice: async () => {
    return requests.get(`/thietbi/`);
  },
  getAllDeviceByType: async ({ loaithietbi }) => {
    return requests.get(`/thietbi/${loaithietbi}`);
  },
  getAllDeviceByName: async ({ name }) => {
    return requests.get(`/thietbi/tenthietbi/${name}`);
  },
  getAllDeviceByIp: async ({ ip }) => {
    return requests.get(`/thietbi/ip/${ip}`);
  },
  getAllDeviceByVlannet: async ({ vlannet }) => {
    return requests.get(`/thietbi/vlannet/${vlannet}`);
  },
  getDevice: async (id) => {
    return requests.get(`/thietbi/${id}`);
  },
  getADevice: async (id) => {
    return requests.get(`/thietbi/id/${id}`);
  },
  createDevice: async (body) => {
    return requests.post(`/thietbi/`, body);
  },
  editDevice: async (body, id) => {
    return requests.put(`/thietbi/${id}`, body);
  },
  deleteDevice: async (id) => {
    return requests.delete(`/thietbi/${id}`);
  },
};

export default ServiceDevice;
