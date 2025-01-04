import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Регистрация нового пользователя
export const register = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      userData
    );
    return response.data; // Возвращает данные ответа, включая userId
  } catch (error) {
    console.error(
      "Error during registration:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message; // Прокидывает ошибку для отображения на клиенте
  }
};

// Авторизация пользователя
export const login = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      userData
    );
    return response.data; // Возвращает токен и, возможно, дополнительные данные
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error.response?.data || error.message; // Прокидывает ошибку для отображения на клиенте
  }
};
