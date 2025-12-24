// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_BASED_API_URL,
//   timeout: 10000,
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;

//     return config;
//   },
//   (error) => {
//     console.error("Requst error", error);
//     return Promise.reject(error);
//   }
// );

// export default api;
