import { API_URL, API_URL_SOCKET, NODE_ENV } from "@/constants/api";

export const env = {
  apiUrl: API_URL,
  apiSocket: API_URL_SOCKET,
  nodeEnv: NODE_ENV,
} as const;