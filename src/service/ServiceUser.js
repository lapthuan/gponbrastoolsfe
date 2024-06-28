import requests from "./httpService";

const ServiceUser = {
  userLogin: async (body) => {
    return requests.post(`/user/login`, body);
  },
  changePassword: async (body) => {
    return requests.put(`/user/change-password`, body);
  },
  userSignup: async (body) => {
    return requests.post(`/user/`, body);
  },
  getUser: async (body) => {
    return requests.post(`/cts`, body)
  }
};

export default ServiceUser;
