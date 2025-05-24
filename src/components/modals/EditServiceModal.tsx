import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import styles from "./Modal.module.scss";
import { Button } from "../Button/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Employee {
  employee_id: number;
  name: string;
  surname: string;
  patronymic: string;
}

interface Service {
  id: number;
  salon_id: number;
  name: string;
  description: string;
  price: number;
  employees: Employee[];
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
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>(
    service.employees || []
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setSelectedEmployees(service.employees || []);
  }, [service.employees]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/employee/salon/${service.salon_id}`
      );
      setEmployees(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке мастеров:", err);
    }
  };

  const handleUpdateService = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Формируем массив id из выбранных сотрудников
      const employee_ids = selectedEmployees.map((e) => e.employee_id);

      await axios.put(
        `${API_BASE_URL}/api/services/${service.id}`,
        {
          name,
          description,
          price,
          employee_ids,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Услуга обновлена.");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
      alert("Ошибка при обновлении услуги.");
    } finally {
      setLoading(false);
    }
  };

  // Удалить выбранного сотрудника из списка
  const handleRemoveEmployee = (employee_id: number) => {
    setSelectedEmployees((prev) =>
      prev.filter((e) => e.employee_id !== employee_id)
    );
  };

  // Добавить сотрудника в выбранные
  const handleAddEmployee = (emp: Employee) => {
    setSelectedEmployees((prev) => [...prev, emp]);
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
      <div className={styles.formGroup}>
        <label>Выбранные мастера:</label>
        <div className={styles.selectedList}>
          {selectedEmployees.map((emp) => (
            <div key={emp.employee_id} className={styles.selectedItem}>
              {emp.name} {emp.surname}
              <button
                className={styles.removeBtn}
                onClick={() => handleRemoveEmployee(emp.employee_id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Добавить мастера:</label>
        <ul className={styles.employeeList}>
          {employees
            .filter(
              (emp) =>
                !selectedEmployees.some(
                  (e) => e.employee_id === emp.employee_id
                )
            )
            .map((emp) => (
              <li
                key={emp.employee_id}
                className={styles.employeeItem}
                onClick={() => handleAddEmployee(emp)}
              >
                {emp.name} {emp.surname} {emp.patronymic}
              </li>
            ))}
        </ul>
      </div>
      <div className={styles.modalActions}>
        <Button onClick={handleUpdateService} disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </Modal>
  );
};
