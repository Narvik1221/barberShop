import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getBarbershops = async (query = "") => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/barbershops`,
      {
        params: { search: query }, // Передаём параметр строки поиска
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching barbershops:", error);
    throw error;
  }
};

export const getBarbershopById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/api/barbershops/${id}`);
  return response.data;
};
