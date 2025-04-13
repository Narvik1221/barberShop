// src/components/Profile/Profile.tsx
import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.scss";
import { AuthContext, User, Appointment } from "../../context/AuthContext";
import { getSalonById } from "../../api/salonApi";
import { Button } from "../Button/Button";
const SERVER_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  // Получаем данные и методы из контекста
  const {
    user,
    appointments,
    clientAppointments,
    refreshUser,
    setAppointments,
  } = useContext(AuthContext);
  const [salon, setSalon] = useState(null) as any;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }
        // Обновляем данные контекста (user, appointments и clientAppointments)
        await refreshUser();
        console.log(user?.salon_id);
        console.log(user?.salon_id && user?.role === "employee");
        if (user?.salon_id && user?.role === "employee") {
          const response = await getSalonById(user?.salon_id);

          setSalon(response);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        navigate("/auth");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await refreshUser();
    navigate("/auth");
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту запись?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/bookings/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Обновляем записи в контексте после удаления для сотрудников
      if (appointments) {
        setAppointments(
          appointments.filter(
            (appointment: Appointment) => appointment.id !== appointmentId
          )
        );
      }
      alert("Запись успешно удалена.");
      await refreshUser();
    } catch (error) {
      console.error("Ошибка при удалении записи:", error);
      alert("Не удалось удалить запись. Попробуйте позже.");
    }
  };

  if (!user) return <p>Загрузка...</p>;

  return (
    <div className="container">
      <div className={styles.profile}>
        <h2 className={styles.title}>Личный кабинет</h2>
        <div className={styles.userInfo}>
          <h3 className={styles.title}>Мои данные</h3>
          <p>
            <strong>Имя:</strong> {user.name}
          </p>
          <p>
            <strong>Фамилия:</strong> {user.surname}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Роль:</strong> {user.role}
          </p>
        </div>

        {/* Блок для сотрудников */}
        {user.role === "employee" && salon ? (
          <div className={styles.card}>
            <h2 className={styles.title}>Мой салон</h2>
            <img
              className={styles.img}
              src={SERVER_URL + salon?.imagesrc}
              alt={salon?.name}
            />
            <h3 className={styles.title}>{salon?.name}</h3>
            <p className={styles.address}>{salon?.address}</p>
            <h3 className={styles.title}>{salon?.description}</h3>
          </div>
        ) : (
          <div className={styles.title}>
            Администратор пока не прикрепил вас к салону
          </div>
        )}

        {/* Блок для клиентов */}
        {user.role === "client" && (
          <div className={styles.appointments}>
            <h3 className={styles.title}>Мои записи</h3>
            {clientAppointments && clientAppointments.length > 0 ? (
              <ul className={styles.appointment_list}>
                {clientAppointments.map((appointment: any) => (
                  <li key={appointment.id}>
                    <p>
                      <strong>Салон:</strong> {appointment.salon_name}{" "}
                      {appointment.salon_address}
                    </p>
                    <p>
                      <strong>Мастер:</strong> {appointment.master_name}{" "}
                      {appointment.master_surname}
                    </p>
                    <p>
                      <strong>Услуга:</strong> {appointment.service_name}
                    </p>
                    <p>
                      <strong>Дата:</strong>{" "}
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Время:</strong> {appointment.time}
                    </p>

                    <Button
                      className={styles.delete}
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      myType="delete"
                    >
                      Удалить запись
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет записей.</p>
            )}
          </div>
        )}

        <Button
          className={styles.logout}
          onClick={handleLogout}
          myType="delete"
        >
          Выйти
        </Button>
      </div>
    </div>
  );
};

export default Profile;
