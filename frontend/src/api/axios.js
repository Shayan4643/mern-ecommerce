import axios from "axios";

const api = axios.create({
  baseURL: "https://mern-ecommerce-orcin-seven.vercel.app/api",
  //   withCredentials: true,
});

export default api;
