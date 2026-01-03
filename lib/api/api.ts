import axios from "axios";

const isServer = typeof window === "undefined";

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : isServer
  ? "http://localhost:3000/api"
  : "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
