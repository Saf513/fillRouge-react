import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:8000", // Ensure this matches your backend server URL
  withCredentials: true, // Required for CSRF protection
});
