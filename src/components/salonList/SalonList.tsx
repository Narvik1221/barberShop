// src/components/SalonList/SalonList.tsx
import React, { useEffect, useState } from "react";
import { getSalons } from "../../api/salonApi";
import SalonSearch from "../salonSearch/SalonSearch";
import SalonCard from "../salonCard/SalonCard";
import styles from "./SalonList.module.scss";

interface Salon {
  id: number;
  name: string;
  address: string;
  imagesrc: string;
}

const SalonList = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getSalons(query).then(setSalons);
  }, [query]);

  return (
    <div className="container">
      <SalonSearch setQuery={setQuery} />
      <div className={styles.list}>
        {salons.map((salon) => (
          <SalonCard key={salon.id} salon={salon} />
        ))}
      </div>
    </div>
  );
};

export default SalonList;
