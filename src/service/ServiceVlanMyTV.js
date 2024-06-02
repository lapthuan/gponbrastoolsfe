import requests from "./httpService";

const ServiceVlanMyTV = {
    getAllVlanMyTV: async () => {
        return requests.get(`/vlanmytv/`);
    },
    getVlanMyTV: async (id) => {
        return requests.get(`/vlanmytv/${id}`);
    },
    createVlanMyTV: async (body) => {
        return requests.post(`/vlanmytv/`, body);
    },
    editVlanMyTV: async (body, id) => {
        return requests.put(`/vlanmytv/${id}`, body);
    },
    deleteVlanMyTV: async (id) => {
        return requests.delete(`/vlanmytv/${id}`);
    }
}

export default ServiceVlanMyTV;