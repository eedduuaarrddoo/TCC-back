import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
//import MenuUsuario from "../pages/menuUsuario";
import MenuAdmin from "../pages/MenuAdmin";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/menuusuario" element={<MenuUsuario />} /> */}
        <Route path="/menuadmin" element={<MenuAdmin />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
