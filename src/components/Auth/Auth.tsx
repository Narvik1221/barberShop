// src/components/Auth/Auth.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./Auth.module.scss";
import { register, login } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";

interface AuthFormData {
  email: string;
  password: string;
  surname: string;
  name: string;
}

const Auth: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    surname: "",
    name: "",
  });
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("mail", formData.email);
        navigate("/profile");
      }
      setFormData({ email: "", password: "", surname: "", name: "" });
    } catch (error: any) {
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
          <Button className={styles.reg} type="submit">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </Button>
        </form>
        <p>
          {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
          <Button
            type="button"
            className={styles.switch}
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
            }}
          >
            {isRegister ? "Войти" : "Зарегистрироваться"}
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
