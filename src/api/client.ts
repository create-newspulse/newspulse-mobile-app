import { API_BASE_URL } from "@/src/constants/config";
import axios from "axios";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
