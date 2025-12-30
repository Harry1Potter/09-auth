import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://localhost:3000/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});