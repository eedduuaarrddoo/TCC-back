import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import MenuAdmin from "../pages/MenuAdmin";
import MenuUsuario from "../pages/MenuUsuario";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menuUsuario" element={<MenuUsuario />} />
        <Route path="/menuadmin" element={<MenuAdmin />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
