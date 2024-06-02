import requests from "./httpService";

const ServiceBras = {
  ControlBras: async (body) => {
    return requests.post(`/bras/control`, body);
  },
};

export default ServiceBras;
