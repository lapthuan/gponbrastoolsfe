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
  getAllUser: async (body) => {
    return requests.get(`/user/`);
  },
  getUser: async (body) => {
    return requests.post(`/cts`, body)
  },
  delectUser: async (body) => {
    return requests.delete(`/user/${body}`)
  },
  editUser: async (id,body) => {
    return requests.put(`/user/edit/${id}`, body);
  },
  changePasswordDefault: async (body) => {
    return requests.put(`/user/reset-password/${body}`)
  },
};

export default ServiceUser;
