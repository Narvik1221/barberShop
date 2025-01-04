import React from "react";
import { Link } from "react-router-dom";
import styles from "./BarbershopCard.module.scss";
const SERVER_URL = import.meta.env.VITE_API_BASE_URL;
const BarbershopCard = ({ barbershop }) => {
  return (
    <div className={styles.card}>
      <img
        className={styles.img}
        src={SERVER_URL + barbershop.imagesrc}
        alt={barbershop.name}
      />
      <h3 className={styles.title}>{barbershop.name}</h3>
      <p className={styles.address}>{barbershop.address}</p>
      <Link className={styles.link} to={`/barbershops/${barbershop.id}`}>
        Подробнее
      </Link>
    </div>
  );
};

export default BarbershopCard;
