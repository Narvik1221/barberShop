import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface EmployeeLoginPayload {
  email: string;
  password: string;
}

interface EmployeeAuthResponse {
  token: string;
}

interface EmployeeRegisterPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
  role: "employee" | "admin";
  registrationCode: string;
}

export const employeeLogin = async (
  payload: EmployeeLoginPayload
): Promise<EmployeeAuthResponse> => {
  const { data } = await axios.post(
    `${API_BASE_URL}/api/employee/auth/login`,
    payload
  );
  return data;
};

export const employeeRegister = async (
  payload: EmployeeRegisterPayload
): Promise<EmployeeAuthResponse> => {
  const { data } = await axios.post(
    `${API_BASE_URL}/api/employee/auth/register`,
    payload
  );
  return data;
};
