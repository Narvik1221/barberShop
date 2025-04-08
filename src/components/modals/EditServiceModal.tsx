import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import styles from "./Modal.module.scss";
import { Button } from "../Button/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Service {
  id: number;
  salon_id: number;
  name: string;
  description: string;
  price: number;
}

interface Props {
  service: Service;
  onClose: () => void;
  onUpdated: () => void;
}

export const EditServiceModal: React.FC<Props> = ({
  service,
  onClose,
  onUpdated,
}) => {
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price);
  const [loading, setLoading] = useState(false);

  const handleUpdateService = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/services/${service.id}`,
        { name, description, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Услуга обновлена.");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Ошибка при обновлении услуги:", err);
      alert("Ошибка при обновлении услуги.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3>Редактировать услугу</h3>
      <div className={styles.formGroup}>
        <label>Название:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Описание:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Цена:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
        />
      </div>
      <div className={styles.modalActions}>
        <Button onClick={handleUpdateService} disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </Modal>
  );
};
