// src/components/AddServiceModal.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import styles from "./Modal.module.scss";
import { Button } from "../Button/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  salonId: number;
  onClose: () => void;
  onAdded: () => void;
}

interface Employee {
  employee_id: number;
  name: string;
  surname: string;
  patronymic: string;
  registration_date: string;
  // При необходимости можно добавить другие поля
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [expandedEmployeeIds, setExpandedEmployeeIds] = useState<number[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/employee/salon/${salonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке сотрудников:", err);
    }
  };

  const handleEmployeeToggle = (id: number) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const toggleAccordion = (e: React.MouseEvent, employee_id: number) => {
    e.stopPropagation();
    setExpandedEmployeeIds((prev) =>
      prev.includes(employee_id)
        ? prev.filter((id) => id !== employee_id)
        : [...prev, employee_id]
    );
  };

  const handleAddService = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Формируем тело запроса
      const data: any = {
        salon_id: salonId,
        name,
        description,
        price,
      };
      if (selectedEmployeeIds.length > 0) {
        data.employee_ids = selectedEmployeeIds;
      }

      await axios.post(`${API_BASE_URL}/api/services`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

      <div className={styles.formGroup}>
        <label>Сотрудники:</label>
        <ul className={styles.employeeList}>
          {employees.map((emp) => {
            const isExpanded = expandedEmployeeIds.includes(emp.employee_id);
            const isChecked = selectedEmployeeIds.includes(emp.employee_id);

            return (
              <li key={emp.employee_id} className={styles.employeeItem}>
                <div className={styles.itemHeader}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleEmployeeToggle(emp.employee_id)}
                    />
                    <span>
                      {emp.name} {emp.surname} {emp.patronymic}
                    </span>
                  </label>
                  <Button
                    className={styles.moreInfoBtn}
                    onClick={(e: React.MouseEvent) =>
                      toggleAccordion(e, emp.employee_id)
                    }
                  >
                    {isExpanded ? "Скрыть" : "Подробнее"}
                  </Button>
                </div>

                {isExpanded && (
                  <div className={styles.accordionContent}>
                    <p>
                      <strong>ID:</strong> {emp.employee_id}
                    </p>
                    <p>
                      <strong>Имя:</strong> {emp.name}
                    </p>
                    <p>
                      <strong>Фамилия:</strong> {emp.surname}
                    </p>
                    <p>
                      <strong>Отчество:</strong> {emp.patronymic}
                    </p>
                    <p>
                      <strong>Дата регистрации:</strong> {emp.registration_date}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.modalActions}>
        <Button onClick={handleAddService} disabled={loading}>
          {loading ? "Сохранение..." : "Добавить"}
        </Button>
      </div>
    </Modal>
  );
};
