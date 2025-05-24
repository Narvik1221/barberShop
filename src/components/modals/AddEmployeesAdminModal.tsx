import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import styles from "./Modal.module.scss";
import { Button } from "../Button/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  salonId: number;
  onClose: () => void;
}

interface AdminCandidate {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  assigned: boolean;
}

export const AddEmployeesAdminModal: React.FC<Props> = ({
  salonId,
  onClose,
}) => {
  const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/employee/admins/candidates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCandidates(data);
    } catch (err) {
      console.error("Ошибка загрузки кандидатов:", err);
    }
  };

  const handleAttach = async () => {
    if (selectedId == null) {
      alert("Выберите администратора");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/employee/salons/${salonId}/assign-salon-admin`,
        { userId: selectedId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Администратор салона назначен.");
      onClose();
    } catch (err) {
      console.error("Ошибка при назначении админа салона:", err);
      alert("Не удалось назначить администратора.");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3>Назначить администратора салона</h3>

      <ul className={styles.employeeList}>
        {candidates.length === 0 && <p>Нет доступных кандидатов</p>}
        {candidates.map((c) => (
          <li key={c.id} className={styles.employeeItem}>
            <label className={styles.label}>
              <input
                type="radio"
                name="salonAdmin"
                value={c.id}
                disabled={c.assigned}
                onChange={() => setSelectedId(c.id)}
              />
              <div className={styles.label_text}>
                {c.name} {c.surname} {c.patronymic} ({c.email})
                {c.assigned && <span> — уже админ</span>}
              </div>
            </label>
          </li>
        ))}
      </ul>

      <div className={styles.modalActions}>
        <Button onClick={handleAttach}>Назначить</Button>
      </div>
    </Modal>
  );
};
