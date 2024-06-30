
import axios from "axios";

const ipAddress = window.location.hostname;

axios.defaults.baseURL = `http://${ipAddress}:8000`;

export default axios;