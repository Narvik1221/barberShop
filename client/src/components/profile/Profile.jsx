import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [user, setUser] = useState(null); // Личные данные пользователя
  const [appointments, setAppointments] = useState([]); // Записи на сеансы
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }

        const userResponse = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        const appointmentsResponse = await axios.get(
          `${API_BASE_URL}/api/auth/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(appointmentsResponse.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        navigate("/auth"); // Перенаправить на страницу авторизации при ошибке
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Удалить токен из хранилища
    navigate("/auth"); // Перенаправить на страницу авторизации
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту запись?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/bookings/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Удаляем запись локально из состояния
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.bookingid !== appointmentId)
      );
      alert("Запись успешно удалена.");
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
          <h3>Мои данные</h3>
          <p>
            <strong>Имя:</strong> {user.name}
          </p>
          <p>
            <strong>Фамилия:</strong> {user.surname}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <div className={styles.appointments}>
          <h3>Мои записи</h3>
          {appointments.length > 0 ? (
            <ul className={styles.appointment_list}>
              {appointments.map((appointment) => (
                <li key={appointment.id}>
                  <p>
                    <strong>Парикмахерская:</strong>{" "}
                    {appointment.barbershopname} {appointment.barbershopaddress}
                  </p>
                  <p>
                    <strong>Мастер:</strong> {appointment.mastername}{" "}
                    {appointment.mastersurname}
                  </p>
                  <p>
                    <strong>Дата:</strong>{" "}
                    {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Время:</strong> {appointment.time}
                  </p>
                  <button
                    onClick={() =>
                      handleDeleteAppointment(appointment.bookingid)
                    }
                    className={styles.deleteButton}
                  >
                    Удалить запись
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>У вас пока нет записей.</p>
          )}
        </div>{" "}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Profile;
