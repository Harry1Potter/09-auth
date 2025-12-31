import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { api } from "./api";


export async function proxy<T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return api.request<T>(config);
}
