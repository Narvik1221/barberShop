// components/AddEmployeesModal.tsx
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

interface Employee {
  id: number;
  name: string;
  surname: string;
  email: string;
  assigned: boolean;
}

export const AddEmployeesModal: React.FC<Props> = ({ salonId, onClose }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/salons/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке сотрудников:", err);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleAttach = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/salons/employees/${salonId}`,
        { employeeIds: selectedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Сотрудники прикреплены.");
      onClose();
    } catch (err) {
      console.error("Ошибка при прикреплении сотрудников:", err);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3>Прикрепить сотрудников</h3>
      <ul className={styles.employeeList}>
        {employees.length > 0 ? (
          employees.map((emp) => (
            <li key={emp.id} className={styles.employeeItem}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(emp.id)}
                  onChange={() => toggleSelect(emp.id)}
                  disabled={emp.assigned}
                />
                <div className={styles.label_text}>
                  {emp.name} {emp.surname}
                </div>
              </label>
            </li>
          ))
        ) : (
          <h3>Свободных сотрудников нет</h3>
        )}
      </ul>
      <div className={styles.modalActions}>
        <Button onClick={handleAttach}>Добавить</Button>
      </div>
    </Modal>
  );
};
