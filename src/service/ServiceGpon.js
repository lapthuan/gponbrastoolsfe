import requests from "./httpService";

const ServiceGpon = {
    ControlGpon: async (body) => {
        return requests.post(`/gpon/control`, body);
    },

}

export default ServiceGpon;