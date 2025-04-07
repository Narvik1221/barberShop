import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";
import account from "../../assets/account.svg";

const Header = () => {
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsRegister(true);
    }
  }, []);
  return (
    <header className={styles.header}>
      <div className="container">
        <nav>
          <NavLink to={"/"}>
            <img className={styles.logo} src={logo} alt="" />
          </NavLink>

          <div className={styles.content}>
            <NavLink to={isRegister ? "/profile" : "/auth"}>
              <img className={styles.account} src={account} alt="" />
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Header;
