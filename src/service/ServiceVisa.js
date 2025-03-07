import requests from "./httpService";

const ServiceVisa = {
  getUser: async (body) => {
    return requests.post(`/cts`, body);
  },

  change_cgnat: async (body) => {
    return requests.post(`/cgnat`, body);
  },
};

export default ServiceVisa;
