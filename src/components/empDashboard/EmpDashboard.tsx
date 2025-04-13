import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext, Appointment } from "../../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
import styles from "./EmpDashboard.module.scss";

const EmpDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = async (search: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/employee/appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { search },
        }
      );
      setAppointments(response.data);
    } catch (err) {
      console.error("Ошибка при получении записей:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAppointments(searchTerm);
    }, 300); // debounce
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    fetchAppointments("");
  }, []);

  if (!user) return <p>Загрузка...</p>;
  if (user.role !== "employee") return <p>Доступ запрещён.</p>;

  return (
    <div className={styles.container}>
      <h2>Панель управления для сотрудников</h2>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск по клиенту или услуге..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : appointments?.length === 0 ? (
        <p>Нет записей клиентов.</p>
      ) : (
        <ul className={styles.appointmentList}>
          {appointments.map((appointment: Appointment) => (
            <li key={appointment?.id} className={styles.appointmentItem}>
              <p>
                <strong>Клиент:</strong> {appointment.client_name}{" "}
                {appointment.client_surname}
              </p>
              <p>
                <strong>Услуга:</strong> {appointment.service_name}{" "}
                {appointment.service_price} ₽
              </p>
              <p>
                <strong>Дата:</strong>{" "}
                {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Время:</strong> {appointment.time}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmpDashboard;
