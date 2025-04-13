import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import styles from "./Modal.module.scss";
import { Button } from "../Button/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  salonId: any;
  onClose: () => void;
  onAdded: () => void;
}

export const AddServiceModal: React.FC<Props> = ({
  salonId,
  onClose,
  onAdded,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleAddService = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/services`,
        { salon_id: salonId, name, description, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Услуга успешно добавлена.");
      onAdded();
      onClose();
    } catch (err) {
      console.error("Ошибка при добавлении услуги:", err);
      alert("Ошибка при добавлении услуги.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3>Добавить новую услугу</h3>
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
        <Button onClick={handleAddService} disabled={loading}>
          {loading ? "Сохранение..." : "Добавить"}
        </Button>
      </div>
    </Modal>
  );
};
