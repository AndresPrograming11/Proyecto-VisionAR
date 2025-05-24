import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import TodosLosProductos from "../views/todosLosProductos";
import Camisas from "../views/camisas";
import PantalonesYSudaderas from "../views/PantalonesYSudaderas";
import Uniformes from "../views/Uniformes";
import Navbar from "../components/Navbar";
import NavbarTop from "../components/NavbarTop";
import Login from "../views/Login";
import AdminPanel from "../views/AdminPanel";
import Registro from "../views/Registro";
import RestablecerPass from "../views/Restablecerpass";
import AdminUsuarios from "../views/AdminUsuarios";
import AdminArticulos from "../views/AdminArticulos";

function AppRouter() {
  const [isAuth, autentificar] = useState(false);  // Iniciar como 'false' para forzar login
  const [role, setRole] = useState(localStorage.getItem("role") || "user");

  const loguearse = () => {
    autentificar(false);
    setRole("user");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("role");
  };

  return (
    <Router>
      {isAuth && <NavbarTop />}
      {isAuth && <Navbar loguearse={loguearse} role={role} />}

      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login autentificar={autentificar} setRole={setRole} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/restablecerpass" element={<RestablecerPass />} />

        {/* Usuario */}
        {isAuth && role === "user" && (
          <>
            <Route path="/" element={<TodosLosProductos />} />
            <Route path="/camisas" element={<Camisas />} />
            <Route path="/pantalonesYSudaderas" element={<PantalonesYSudaderas />} />
            <Route path="/uniformes" element={<Uniformes />} />
          </>
        )}

        {/* Admin */}
        {isAuth && role === "admin" && (
          <>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/articulos" element={<AdminArticulos />} />
          </>
        )}

        {/* Si no está autenticado, redirige todo al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
