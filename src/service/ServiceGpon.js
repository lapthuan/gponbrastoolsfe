import requests from "./httpService";

const ServiceGpon = {
    ControlGpon: async (body) => {
        return requests.post(`/gpon/control`, body);
    },
    ControlMany: async (body) => {
        return requests.post(`/gpon/control_many`, body);
    },
}

export default ServiceGpon;