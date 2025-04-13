// src/components/SalonCard/SalonCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./SalonCard.module.scss";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

interface Salon {
  id: number;
  name: string;
  address: string;
  imagesrc: string;
}

interface SalonCardProps {
  link?: any;
  salon: Salon;
  onClick?: () => void; // Пропс для обработки клика по карточке, если нужно
}

const SalonCard: React.FC<SalonCardProps> = ({
  salon,
  onClick,
  link = `/salons/${salon.id}`,
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <img
        className={styles.img}
        src={SERVER_URL + salon.imagesrc}
        alt={salon.name}
      />
      <h3 className={styles.title}>{salon.name}</h3>
      <p className={styles.address}>{salon.address}</p>
      <Link className={styles.link} to={link}>
        Подробнее
      </Link>
    </div>
  );
};

export default SalonCard;
