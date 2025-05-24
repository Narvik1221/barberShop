// src/components/BarbershopHeader.tsx
import React, { useContext } from "react";
import styles from "./Header.module.scss";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import account from "../../assets/account.svg";
import { AuthContext } from "../../context/AuthContext";

const BarbershopHeader = () => {
  const { user } = useContext(AuthContext);

  const userAdminSalonId =
    user?.role == "salon_admin" ? "/" + user?.salon_id : "";
  const dashboardPath = user
    ? `/dashboard/${user.role}${userAdminSalonId}`
    : `/dashboard/client`;
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
