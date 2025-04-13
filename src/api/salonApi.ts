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

// Дополнительно: получение списка сотрудников данного салона, оказывающих выбранную услугу.
// Предполагается, что бекенд реализует этот маршрут (например, /api/salons/:salonId/employees?service_id=...)
export const getEmployeesBySalonAndService = async (salonId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/salons/${salonId}/employees`
  );
  return response.data;
};
