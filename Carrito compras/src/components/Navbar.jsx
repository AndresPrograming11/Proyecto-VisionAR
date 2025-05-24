import { Link } from "react-router-dom";
import "../style/Navbar.css";

function Navbar({ loguearse, role }) {
  return (
    <nav className="navbar">
      <h1 className="titulo">{role === "admin" ? "ADMIN" : "Catálogo USC"}</h1>
      <ul className="nav-links">
        {/* Si es un usuario normal */}
        {role === "user" && (
          <>
            <li><Link to="/">Principales Productos</Link></li>
            <li><Link to="/camisas">Camisas</Link></li>        
            <li><Link to="/pantalonesYSudaderas">Pantalones y Sudaderas</Link></li>  
            <li><Link to="/uniformes">Uniformes</Link></li> 
          </>
        )}

        {/* Si es administrador */}
        {role === "admin" && (
          <>
            <li><Link to="/admin/usuarios">Gestionar Usuarios</Link></li>
            <li><Link to="/admin/articulos">Agregar Artículos</Link></li>
          </>
        )}

        {/* Botón de cerrar sesión (común para ambos) */}
        <li>
          <button onClick={loguearse} className="logout-button">Cerrar sesión</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
