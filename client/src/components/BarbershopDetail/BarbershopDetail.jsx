import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBarbershopById } from "../../api/barbershopApi";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./BarbershopDetail.module.scss";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

const BarbershopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barbershop, setBarbershop] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getBarbershopById(id).then(setBarbershop);
  }, [id]);

  useEffect(() => {
    if (selectedMaster) {
      fetchBookedSlots(selectedMaster);
    }
  }, [selectedMaster]);

  const fetchBookedSlots = async (masterId) => {
    try {
      console.log(masterId);
      const { data } = await axios.get(
        `${SERVER_URL}/api/bookings/booked-slots/${masterId}`
      );
      setBookedSlots(data);
    } catch (err) {
      console.error("Ошибка загрузки занятых слотов:", err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      await axios.post(
        `${SERVER_URL}/api/bookings`,
        {
          master_id: selectedMaster,
          date: selectedDate.toLocaleDateString("en-CA"), // формат YYYY-MM-DD
          time: selectedTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Запись успешно создана!");
      setSelectedMaster("");
      setSelectedDate(null);
      setSelectedTime("");
    } catch (err) {
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

  const isTimeBooked = (date, time) => {
    const selectedDate = date.toISOString().split("T")[0]; // Формат YYYY-MM-DD

    console.log("Проверка времени:", { selectedDate, time });

    return bookedSlots.some((slot) => {
      const slotDate = slot.date.split("T")[0]; // Берем только дату без времени
      const slotTime = slot.time.slice(0, 5); // Приводим время к формату HH:mm

      console.log("Сравнение слота:", {
        slotDate,
        selectedDate,
        slotTime,
        time,
      });

      return slotDate === selectedDate && slotTime === time;
    });
  };

  const filteredTimeOptions =
    selectedDate &&
    timeOptions.filter((time) => {
      const result = !isTimeBooked(selectedDate, time);
      console.log("Время:", time, "Результат фильтрации:", result);
      return result;
    });

  console.log("Отфильтрованные опции времени:", filteredTimeOptions);

  if (!barbershop) return <p>Загрузка...</p>;

  return (
    <div className="container">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.img}>
            <img src={SERVER_URL + barbershop.imagesrc} alt={barbershop.name} />
          </div>

          <div className={styles.booking_form}>
            <h3 className={styles.title}>Запись к мастеру</h3>
            <form className={styles.form_group} onSubmit={handleBooking}>
              <div className={styles.field}>
                <label htmlFor="master">Выберите мастера:</label>
                <select
                  id="master"
                  value={selectedMaster}
                  onChange={(e) => setSelectedMaster(e.target.value)}
                  required
                >
                  <option value="">-- Выберите мастера --</option>
                  {barbershop?.masters &&
                    barbershop.masters.map((master) => (
                      <option key={master.id} value={master.id}>
                        {`${master.name} ${master.surname}`}
                      </option>
                    ))}
                </select>
              </div>

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
                  {filteredTimeOptions?.length > 0 &&
                    filteredTimeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                </select>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submit_button}>
                Записаться
              </button>
            </form>
          </div>
        </div>
        <div className={styles.card_bottom}>
          <h3 className={styles.title}>{barbershop.name}</h3>
          <p className={styles.address}>{barbershop.address}</p>
          <div>Мастера:</div>
          <ul className={styles.masters_list}>
            {barbershop?.masters &&
              barbershop.masters.map((master) => (
                <li key={master.id}>{`${master.name} ${master.surname}`}</li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BarbershopDetail;
