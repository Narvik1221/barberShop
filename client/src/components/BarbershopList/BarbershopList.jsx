import React, { useEffect, useState } from "react";
import { getBarbershops } from "../../api/barbershopApi";
import BarbershopSearch from "../BarbershopSearch/BarbershopSearch";
import BarbershopCard from "../BarbershopCard/BarbershopCard";
import styles from "./BarbershopList.module.scss";

const BarbershopList = () => {
  const [barbershops, setBarbershops] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getBarbershops(query).then(setBarbershops);
  }, [query]);

  return (
    <div className="container">
      <BarbershopSearch setQuery={setQuery} />
      <div className={styles.list}>
        {barbershops.map((shop) => (
          <BarbershopCard key={shop.id} barbershop={shop} />
        ))}
      </div>
    </div>
  );
};

export default BarbershopList;
