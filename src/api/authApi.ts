// src/api/authApi.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  surname: string;
  name: string;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, payload);
  return data;
};

export const register = async (payload: RegisterPayload): Promise<void> => {
  await axios.post(`${API_BASE_URL}/api/auth/register`, payload);
};
