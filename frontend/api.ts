import axios from "axios";

export default {
    get: async (path: string) => await axios.get(
        `https://api.twodev.cc/ivbo${path}`,
        // {
        //     headers: { 'x-access-token': localStorage.getItem('user') }
        // }
    ),
    post: async (path: string, body: object) => await axios.post(
        `https://api.twodev.cc/ivbo${path}`,
        body,
        // {
        //     headers: { 'x-access-token': localStorage.getItem('user') }
        // }
    )
}