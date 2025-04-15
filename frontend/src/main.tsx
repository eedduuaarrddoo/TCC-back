import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes"; // Importando o sistema de rotas
import "./style.css"; // Opcional: caso tenha um CSS global

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
