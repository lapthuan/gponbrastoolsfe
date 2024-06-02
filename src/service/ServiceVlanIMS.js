import requests from "./httpService";

const ServiceVlanIMS = {
    getAllVlanIMS: async () => {
        return requests.get(`/vlanims/`);
    },
    getVlanIMS: async (id) => {
        return requests.get(`/vlanims/${id}`);
    },
    createVlanIMS: async (body) => {
        return requests.post(`/vlanims/`, body);
    },
    editVlanIMS: async (body, id) => {
        return requests.put(`/vlanims/${id}`, body);
    },
    deleteVlanIMS: async (id) => {
        return requests.delete(`/vlanims/${id}`);
    }
}

export default ServiceVlanIMS;