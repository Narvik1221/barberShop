import React, { useEffect, useState } from "react";
import axios from "axios";
import { AddServiceModal } from "../modals/AddServiceModal";
import { EditServiceModal } from "../modals/EditServiceModal";
import styles from "./ServicesPage.module.scss";
import { useParams } from "react-router-dom";
import { Button } from "../Button/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Service {
  id: number;
  salon_id: number;
  name: string;
  description: string;
  price: number;
}

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const { salonId } = useParams();
  useEffect(() => {
    console.log(salonId);
    fetchServices();
  }, [salonId]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/services/salon/${salonId}`
      );
      setServices(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке услуг:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить услугу?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/api/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchServices();
      } catch (err) {
        console.error("Ошибка при удалении услуги:", err);
        alert("Ошибка при удалении услуги.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Услуги салона</h2>
      <Button className={styles.btn} onClick={() => setShowAddModal(true)}>
        Добавить услугу
      </Button>
      {loading ? (
        <p>Загрузка услуг...</p>
      ) : services.length === 0 ? (
        <p>Нет услуг для отображения.</p>
      ) : (
        <ul className={styles.serviceList}>
          {services.map((service) => (
            <li key={service.id} className={styles.serviceItem}>
              <div>
                <strong>{service.name}</strong> – {service.description} (
                {service.price} руб.)
              </div>
              <div className={styles.btns}>
                <Button onClick={() => setEditService(service)}>
                  Изменить
                </Button>
                <Button
                  myType="delete"
                  onClick={() => handleDeleteService(service.id)}
                >
                  Удалить
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showAddModal && (
        <AddServiceModal
          salonId={salonId}
          onClose={() => setShowAddModal(false)}
          onAdded={fetchServices}
        />
      )}
      {editService && (
        <EditServiceModal
          service={editService}
          onClose={() => setEditService(null)}
          onUpdated={fetchServices}
        />
      )}
    </div>
  );
};
