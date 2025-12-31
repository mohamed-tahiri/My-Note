import { env } from '@/utils/env';
import axios from 'axios';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});