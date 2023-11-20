import axios from "axios";

const baseURL = 'https://api.cherry4xo.ru/ivbo';
export const api = {
    get: async (url: string, config: any = {}) => await axios.get(baseURL + url, config),
    post: async (url: string, body: any, config: any = {}) => await axios.post(baseURL + url, body, config)
};