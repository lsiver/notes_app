import axios from "axios";
import {API_BASE} from "./config.js";

const api= axios.create({
    baseURL: API_BASE,
});

export default api;