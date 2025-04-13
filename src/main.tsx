// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import App from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Контейнер #root не найден");

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
