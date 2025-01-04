import React, { useState } from "react";
import styles from "./Auth.module.scss";
import { register, login } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    surname: "",
    name: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(formData);
        setMessage("Регистрация прошла успешно!");
      } else {
        const data = await login({
          email: formData.email,
          password: formData.password,
        });
        setMessage("Вы вошли в систему!");
        localStorage.setItem("token", data.token); // Сохраняем токен
        localStorage.setItem("mail", formData.email); // Сохраняем токен
        navigate("/profile");
      }
      setFormData({ email: "", password: "", surname: "", name: "" }); // Очистка формы
    } catch (error) {
      setMessage(error.error || "Произошла ошибка!");
    }
  };

  return (
    <div className={styles.auth__inner}>
      <div className={styles.auth}>
        <h2>{isRegister ? "Регистрация" : "Авторизация"}</h2>
        {message && <p className={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Имя"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="surname"
                placeholder="Фамилия"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>
        <p>
          {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
          <button
            type="button"
            className={styles.switch}
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
            }}
          >
            {isRegister ? "Войти" : "Зарегистрироваться"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
