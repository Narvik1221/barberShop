// src/components/BarbershopHeader.tsx
import React, { useContext } from "react";
import styles from "./Header.module.scss";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import account from "../../assets/account.svg";
import { AuthContext } from "../../context/AuthContext";

const BarbershopHeader = () => {
  const { user } = useContext(AuthContext);
  console.log("header user", user);
  // Если данных о пользователе ещё нет, можно вывести загрузочный индикатор или задать значение по умолчанию.
  const dashboardPath = user ? `/dashboard/${user.role}` : `/dashboard/client`;
  const authPath = user ? "/profile" : "/auth";

  return (
    <header className={styles.header}>
      <div className="container">
        <nav>
          <NavLink to={dashboardPath}>
            <img className={styles.logo} src={logo} alt="Logo" />
          </NavLink>

          <div className={styles.content}>
            <NavLink to={authPath}>
              <img className={styles.account} src={account} alt="Account" />
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default BarbershopHeader;
