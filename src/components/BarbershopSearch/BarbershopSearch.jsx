import React from "react";
import styles from "./BarbershopSearch.module.scss";

const BarbershopSearch = ({ setQuery }) => {
  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className={styles.search}>
      <input
        type="text"
        placeholder="Найти парикмахерскую..."
        onChange={handleSearch}
      />
    </div>
  );
};

export default BarbershopSearch;
