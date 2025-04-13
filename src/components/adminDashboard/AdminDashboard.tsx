// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.scss";
import { EditSalonModal } from "../modals/EditSalonModal";
import { AddEmployeesModal } from "../modals/AddEmployeesModal";
import { AddSalonModal } from "../modals/AddSalonModal"; // Импортируем AddSalonModal
import SalonCard from "../salonCard/SalonCard";
import { Button } from "../Button/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Salon {
  id: number;
  name: string;
  address: string;
  description: string;
  imagesrc: string;
}

const AdminDashboard: React.FC = () => {
  const [salons, setSalons] = useState<Salon[]>([]);

  const [addSalonModalOpen, setAddSalonModalOpen] = useState(false); // Состояние для открытия модалки

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/salons/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalons(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке салонов:", err);
    }
  };

  const handleSalonCreated = () => {
    fetchSalons(); // Обновляем список салонов после добавления нового
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Салоны</h1>
      <Button onClick={() => setAddSalonModalOpen(true)}>
        Добавить салон
      </Button>{" "}
      {/* Кнопка для открытия модалки */}
      <div className={styles.salonList}>
        {salons.map((salon) => (
          <SalonCard
            link={`/admin/salons/${salon.id}`}
            key={salon.id}
            salon={salon}
          />
        ))}
      </div>
      {addSalonModalOpen && (
        <AddSalonModal
          onClose={() => setAddSalonModalOpen(false)}
          onCreated={handleSalonCreated} // Передаем колбэк для обновления списка
        />
      )}
    </div>
  );
};

export default AdminDashboard;
