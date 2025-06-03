import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSalonById, getServicesBySalon } from "../../api/salonApi";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./SalonDetail.module.scss";
import { Button } from "../Button/Button";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

interface Employee {
  id: number;
  name: string;
  surname: string;
  employee_id: number;
  patronymic: string;
  master_registration_date: string;
}

interface Service {
  service_id: number;
  salon_id: number;
  employee_id: number;
  service_name: string;
  description: string;
  price: string;
  employees: Employee[];
}

interface Salon {
  id: number;
  name: string;
  address: string;
  description: string;
  imagesrc: string;
}

interface BookingSlot {
  date: string;
  time: string;
}

const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<BookingSlot[]>([]);
  const [error, setError] = useState("");
  const [expandedEmployeeIds, setExpandedEmployeeIds] = useState<number[]>([]);

  const selectedService = services.find(
    (s) => s.service_id.toString() === selectedServiceId
  );

  useEffect(() => {
    if (id) {
      getSalonById(id).then(setSalon);
      getServicesBySalon(id).then(setServices);
    }
  }, [id]);

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchBookedSlots(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const fetchBookedSlots = async (employeeId: string) => {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/bookings/booked-slots/${employeeId}`
      );
      setBookedSlots(data);
    } catch (err) {
      console.error("Ошибка загрузки занятых слотов:", err);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    if (
      !selectedDate ||
      !selectedTime ||
      !selectedService ||
      !selectedEmployeeId
    ) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      await axios.post(
        `${SERVER_URL}/api/bookings`,
        {
          employee_id: selectedEmployeeId,
          service_id: selectedService.service_id,
          date: selectedDate.toLocaleDateString("en-CA"),
          time: selectedTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Запись успешно создана!");
      setSelectedServiceId("");
      setSelectedEmployeeId("");
      setSelectedDate(null);
      setSelectedTime("");
      setError("");
    } catch (err: any) {
      console.error("Ошибка при создании записи:", err.response?.data?.error);
      setError("Не удалось создать запись. Проверьте введенные данные.");
    }
  };

  const timeOptions = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];

  const isTimeBooked = (date: Date, time: string) => {
    const selectedDateStr = date.toISOString().split("T")[0];
    return bookedSlots.some((slot) => {
      const slotDate = slot.date.split("T")[0];
      const slotTime = slot.time.slice(0, 5);
      return slotDate === selectedDateStr && slotTime === time;
    });
  };

  const filteredTimeOptions =
    selectedDate &&
    timeOptions.filter((time) => !isTimeBooked(selectedDate, time));

  const toggleAccordion = (e: React.MouseEvent, employeeId: number) => {
    e.stopPropagation();
    setExpandedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  if (!salon) return <p>Загрузка...</p>;

  return (
    <div className="container">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.img}>
            <img src={SERVER_URL + salon.imagesrc} alt={salon.name} />
          </div>

          <div className={styles.booking_form}>
            <h3 className={styles.title}>Запись на услугу</h3>
            <form className={styles.form_group} onSubmit={handleBooking}>
              <div className={styles.field}>
                <label htmlFor="service">Выберите услугу:</label>
                <select
                  id="service"
                  value={selectedServiceId}
                  onChange={(e) => {
                    setSelectedServiceId(e.target.value);
                    setSelectedEmployeeId("");
                  }}
                  required
                >
                  <option value="">-- Выберите услугу --</option>
                  {services.map((service) => (
                    <option key={service.service_id} value={service.service_id}>
                      {service.service_name} ({service.price}₽)
                    </option>
                  ))}
                </select>
              </div>

              {selectedService && selectedService.employees.length > 0 && (
                <div className={styles.field}>
                  <label>Выберите специалиста:</label>
                  <ul className={styles.employeeList}>
                    {selectedService.employees.map((emp) => {
                      const isExpanded = expandedEmployeeIds.includes(emp.id);
                      const isChecked =
                        selectedEmployeeId === emp.employee_id.toString();
                      console.log(emp);
                      return (
                        <li key={emp.id} className={styles.employeeItem}>
                          <div className={styles.itemHeader}>
                            <label className={styles.label}>
                              <input
                                type="radio"
                                name="employee"
                                value={emp.employee_id}
                                checked={isChecked}
                                onChange={() =>
                                  setSelectedEmployeeId(
                                    emp.employee_id.toString()
                                  )
                                }
                                required
                              />
                              <span className={styles.label_text}>
                                {emp.name} {emp.surname}
                              </span>
                            </label>
                            <Button
                              className={styles.moreInfoBtn}
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                toggleAccordion(e, emp.id);
                              }}
                            >
                              {isExpanded ? "Скрыть" : "Подробнее"}
                            </Button>
                          </div>

                          {isExpanded && (
                            <div className={styles.accordionContent}>
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
                                <strong>Дата регистрации:</strong>
                                {emp.master_registration_date}
                              </p>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className={styles.field_date}>
                <label htmlFor="date">Выберите дату:</label>
                <DatePicker
                  id="date"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Выберите дату"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="time">Выберите время:</label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">-- Выберите время --</option>
                  {filteredTimeOptions &&
                    filteredTimeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                </select>
              </div>

              {error && <p className={styles.error}>{error}</p>}
              <Button type="submit">Записаться</Button>
            </form>
          </div>
        </div>

        <div className={styles.card_bottom}>
          <h3 className={styles.title}>{salon.name}</h3>
          <p className={styles.address}>{salon.address}</p>
          <p>{salon.description}</p>
        </div>
      </div>
    </div>
  );
};

export default SalonDetail;
