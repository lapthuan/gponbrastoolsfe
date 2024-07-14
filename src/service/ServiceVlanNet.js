import requests from "./httpService";

const ServiceVlanNet = {
    getAllVlanNet: async () => {
        return requests.get(`/vlannet/`);
    },
    getVlanNet: async (id) => {
        return requests.get(`/vlannet/${id}`);
    },
    createVlanNet: async (body) => {
        return requests.post(`/vlannet/`, body);
    },
    editVlanNet: async (body, id) => {
        return requests.put(`/vlannet/${id}`, body);
    },
    deleteVlanNet: async (id) => {
        return requests.delete(`/vlannet/${id}`);
    },
    getManyVlanNet: async (device) => {
        return requests.get(`/thietbi/find/vlannet/${device}`)
    }
}

export default ServiceVlanNet;