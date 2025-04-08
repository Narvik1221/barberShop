// src/components/Admin/AdminSalonDetail.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSalonById } from "../../api/salonApi";
import axios from "axios";
import styles from "./AdminSalonDetail.module.scss";

import { EditSalonModal } from "../modals/EditSalonModal";
import { AddEmployeesModal } from "../modals/AddEmployeesModal";
import { Button } from "../Button/Button";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

interface Salon {
  id: number;
  name: string;
  address: string;
  description: string;
  imagesrc: string;
}

interface Employee {
  employee_id: number;
  name: string;
  surname: string;
}

const AdminSalonDetail: React.FC = () => {
  const { id } = useParams();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      loadSalonData(id);
      loadEmployees(id);
    }
  }, [id]);

  const loadSalonData = async (salonId: string) => {
    try {
      const data = await getSalonById(salonId);
      setSalon(data);
    } catch (err) {
      console.error("Ошибка при загрузке салона:", err);
    }
  };

  const loadEmployees = async (salonId: string) => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/salons/${salonId}/employees`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке сотрудников:", err);
    }
  };
  const handleDeleteSalon = async () => {
    const confirm = window.confirm(
      "Вы уверены, что хотите удалить этот салон?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${SERVER_URL}/api/salons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Салон успешно удалён");
      navigate("/dashboard/admin");
    } catch (err) {
      console.error("Ошибка при удалении салона:", err);
      alert("Не удалось удалить салон");
    }
  };
  const handleDetach = async (employeeId: number) => {
    try {
      await axios.delete(
        `${SERVER_URL}/api/salons/employees/detach/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadEmployees(id!);
    } catch (err) {
      console.error("Ошибка при откреплении сотрудника:", err);
    }
  };

  if (!salon) return <p>Загрузка...</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Салон {salon.name}</h2>
      <img
        src={SERVER_URL + salon.imagesrc}
        alt={salon.name}
        className={styles.image}
      />
      <p>
        <strong>Адрес:</strong> {salon.address}
      </p>
      <p>
        <strong>Описание:</strong> {salon.description}
      </p>

      <div className={styles.actions}>
        <Button onClick={() => setShowEditModal(true)}>Изменить салон</Button>
        <Button onClick={handleDeleteSalon}>Удалить салон</Button>
        <Button onClick={() => setShowAttachModal(true)}>
          Прикрепить сотрудника
        </Button>
        <Button onClick={() => navigate(`/admin/salons/${id}/services`)}>
          Услуги
        </Button>
      </div>

      <h3 className={styles.title}>Сотрудники:</h3>
      {employees.length === 0 ? (
        <p>Нет сотрудников, прикреплённых к этому салону.</p>
      ) : (
        <ul className={styles.employeeList}>
          {employees.map((emp) => (
            <li key={emp.employee_id} className={styles.employeeItem}>
              {emp.name} {emp.surname}
              <Button
                myType={"delete"}
                onClick={() => handleDetach(emp.employee_id)}
              >
                Удалить
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Модалка редактирования салона */}
      {showEditModal && salon && (
        <EditSalonModal
          salon={salon}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            loadSalonData(id!);
          }}
        />
      )}

      {/* Модалка прикрепления сотрудников */}
      {showAttachModal && (
        <AddEmployeesModal
          salonId={salon.id}
          onClose={() => setShowAttachModal(false)}
        />
      )}
    </div>
  );
};

export default AdminSalonDetail;
