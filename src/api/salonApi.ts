// src/api/salonApi.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getSalons = async (query = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/salons`, {
      params: { search: query },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка получения салонов:", error);
    throw error;
  }
};

export const getSalonById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/salons/salon/${id}`);
  return response.data;
};

// Для получения услуг салона (админ может создавать услуги, но клиент получает список)
export const getServicesBySalon = async (salonId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/services/salon/${salonId}`
  );
  return response.data;
};

export const getEmployeesBySalonAndService = async (
  salonId: string,
  serviceId: string
) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/api/employee/salon-service`,
    {
      params: { salonId, serviceId },
    }
  );
  return data;
};
