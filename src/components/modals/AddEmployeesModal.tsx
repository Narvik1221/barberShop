// src/components/AddEmployeesModal.tsx

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
  patronymic: string;
  email: string;
  assigned: boolean;
  registration_date: string;
}

export const AddEmployeesModal: React.FC<Props> = ({ salonId, onClose }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedEmployeeIds, setExpandedEmployeeIds] = useState<number[]>([]);

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

  const toggleAccordion = (e: React.MouseEvent, employeeId: number) => {
    e.stopPropagation();
    setExpandedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
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
          employees.map((emp) => {
            const isExpanded = expandedEmployeeIds.includes(emp.id);
            const isChecked = selectedIds.includes(emp.id);

            return (
              <li key={emp.id} className={styles.employeeItem}>
                <div className={styles.itemHeader}>
                  <label className={styles.label}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(emp.id)}
                      disabled={emp.assigned}
                    />
                    <span className={styles.label_text}>
                      {emp.name} <br /> {emp.surname}
                    </span>
                  </label>
                  <Button
                    className={styles.moreInfoBtn}
                    onClick={(e: React.MouseEvent) =>
                      toggleAccordion(e, emp.id)
                    }
                  >
                    {isExpanded ? "Скрыть" : "Подробнее"}
                  </Button>
                </div>

                {isExpanded && (
                  <div className={styles.accordionContent}>
                    <p>
                      <strong>ID:</strong> {emp.id}
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
          })
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
