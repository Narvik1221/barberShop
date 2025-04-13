import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminAuth.module.scss";
import { employeeLogin, employeeRegister } from "../../api/employeeAuthApi";
import { Button } from "../Button/Button";

interface FormData {
  email: string;
  password: string;
  name: string;
  surname: string;
  role: "employee" | "admin";
  registrationCode: string;
}

const AdminAuth: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    surname: "",
    role: "employee",
    registrationCode: "",
  });
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const response = await employeeRegister(formData);
        localStorage.setItem("token", response.token);
        setMessage("Регистрация прошла успешно!");
        navigate("/profile");
      } else {
        const response = await employeeLogin({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", response.token);
        setMessage("Вы вошли в систему!");
        navigate("/profile");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Произошла ошибка!");
    }
  };

  return (
    <div className={styles.auth__inner}>
      <div className={styles.auth}>
        <h2>
          {isRegister
            ? "Регистрация сотрудника/админа"
            : "Авторизация сотрудника/админа"}
        </h2>
        {message && <p className={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
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
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="employee">Сотрудник</option>
                <option value="admin">Администратор</option>
              </select>
              <input
                type="text"
                name="registrationCode"
                placeholder={
                  formData.role === "admin"
                    ? "Секретный код для администратора"
                    : "Секретный код для сотрудника"
                }
                value={formData.registrationCode}
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

export default AdminAuth;
