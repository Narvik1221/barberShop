// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface User {
  id: number;
  name: string;
  patronymic?: string;
  surname: string;
  email: string;
  salon_id?: any;
  role: "employee" | "admin" | "client" | "salon_admin";
}

export interface Appointment {
  id: number;
  client_name: string;
  client_surname: string;
  service_name: string;
  date: string;
  time: string;
  service_price: string;
}

interface AuthContextType {
  user: User | null;
  appointments: Appointment[] | null;
  clientAppointments: any;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[] | null>>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  appointments: null,
  clientAppointments: null,
  setUser: () => {},
  setAppointments: () => {},
  refreshUser: async () => {},
  isLoading: true,
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [clientAppointments, setClientAppointments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userResponse = await axios.get(
        `${API_BASE_URL}/api/employee/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(userResponse.data);

      if (userResponse.data.role === "employee") {
        const appointmentsResponse = await axios.get(
          `${API_BASE_URL}/api/employee/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(appointmentsResponse.data);
      }

      if (userResponse.data.role === "client") {
        const appointmentsResponse = await axios.get(
          `${API_BASE_URL}/api/auth/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClientAppointments(appointmentsResponse.data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        appointments,
        setUser,
        setAppointments,
        refreshUser,
        clientAppointments,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
