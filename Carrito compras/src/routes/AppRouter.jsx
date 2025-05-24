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
import Ordenes from "../views/Ordenes";
import Success from "../views/Sucess";
import Cancel from "../views/Cancel";
import CambiarClave from "../views/CambiarClave";

function ProtectedRoute({ isAuth, role, allowedRoles, children }) {
  if (!isAuth) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}

function AppRouter() {
  const [isAuth, autentificar] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [carritoItems, setCarritoItems] = useState([]);

  const loguearse = () => {
    autentificar(false);
    setRole("user");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("role");
  };

  return (
    <Router>
      {isAuth && <NavbarTop carritoItems={carritoItems} setCarritoItems={setCarritoItems} />}
      {isAuth && <Navbar loguearse={loguearse} role={role} />}

      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login autentificar={autentificar} setRole={setRole} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/restablecerpass" element={<RestablecerPass />} />        
        <Route path="/cambiarclave" element={<CambiarClave />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/ordenes" element={<Ordenes />} />

        {/* Usuario autenticado */}
        {isAuth && role === "user" && (
          <>
            <Route
              path="/"
              element={
                <TodosLosProductos carritoItems={carritoItems} setCarritoItems={setCarritoItems} />
              }
            />
            <Route
              path="/camisas"
              element={<Camisas carritoItems={carritoItems} setCarritoItems={setCarritoItems} />}
            />
            <Route
              path="/pantalonesYSudaderas"
              element={
                <PantalonesYSudaderas
                  carritoItems={carritoItems}
                  setCarritoItems={setCarritoItems}
                />
              }
            />
            <Route
              path="/uniformes"
              element={<Uniformes carritoItems={carritoItems} setCarritoItems={setCarritoItems} />}
            />
         
          </>
        )}

        {/* Admin autenticado */}
        {isAuth && role === "admin" && (
          <>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/articulos" element={<AdminArticulos />} />
          </>
        )}

        {/* Redirección para rutas no autorizadas o no autenticadas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
