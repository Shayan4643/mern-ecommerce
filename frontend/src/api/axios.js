import axios from "axios";

const api = axios.create({
  baseURL: "https://mern-ecommerce-gamma-ivory.vercel.app/api",
  //   withCredentials: true,
});

export default api;
