// src/components/SalonSearch/SalonSearch.tsx
import React, { Dispatch, SetStateAction } from "react";
import styles from "./SalonSearch.module.scss";

interface SalonSearchProps {
  setQuery: Dispatch<SetStateAction<string>>;
}

const SalonSearch: React.FC<SalonSearchProps> = ({ setQuery }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className={styles.search}>
      <input
        type="text"
        placeholder="Поиск салона..."
        onChange={handleChange}
      />
    </div>
  );
};

export default SalonSearch;
