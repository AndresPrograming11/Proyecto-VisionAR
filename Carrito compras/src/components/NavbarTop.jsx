import { Link, useLocation } from "react-router-dom";
import "../style/NavbarTop.css";
import { useState, useEffect } from "react";


function NavbarTop() {
  const location = useLocation();
  const [MenuRedespegable, setMenuRedespegable] = useState(false);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState("usuario");

  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "user");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(role);
    }
  }, []);

  const toggleMenuRedespegable = () => setMenuRedespegable(!MenuRedespegable);
  const AbrirTienda = () => setTiendaSeleccionada(true);
  const CerrarTienda = () => setTiendaSeleccionada(false);

  const getTitle = () => {
    if (location.pathname.includes("camisas")) return "Camisas";
    if (location.pathname.includes("pantalones")) return "Pantalones";
    if (location.pathname.includes("uniformes")) return "Uniformes";
    return "Principal productos";
  };

  const abrirModal = (tipo) => {
    setTipoModal(tipo);
    setModalAbierto(true);
  };

  return (
    <nav className="navbar-top">
      {userRole === "user" ? (
        <>
          <ul className="nav-links-top">
            <li onClick={toggleMenuRedespegable}>{getTitle()}</li>
            {MenuRedespegable && location.pathname.includes("uniformes") && (
              <ul className="MenuRedespegable-list">
                <li><Link to="/medicina">Medicina</Link></li>
                <li><Link to="/odontologia">Odontología</Link></li>
                <li><Link to="/fisioterapia">Fisioterapia</Link></li>
              </ul>
            )}
            <li>
              <button onClick={AbrirTienda} className={tiendaSeleccionada ? "tienda-seleccionada" : ""}>🛒</button>
            </li>
            <li><Link to="/services">👤</Link></li>
            <li><Link to="/opciones"><button>///</button></Link></li>
          </ul>

          {tiendaSeleccionada && (
            <div className="fondo-negro">
              <div className="carrito-contenedor">
                <div className="titulo-carrito">
                  <button className="cerrar-carrito" onClick={CerrarTienda}>⬅</button>
                  <h2>🛒 Tu carrito</h2>
                </div>
                <div className="carrito-item">
                  <img src="https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" alt="Producto" />
                  <div className="info-carrito">
                    <h4>Nombre de prenda</h4>
                    <button className="talla-btn">M</button>
                    <div className="contador">
                      <button>+</button>
                      <span>1</span>
                      <button>-</button>
                    </div>
                    <button className="borrar-btn">🗑</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <ul className="nav-links-top-admin admin-panel-top">
            <li><h1>Panel de Administración</h1></li>

            {location.pathname.includes("admin") && (
              <>
                <li>
                  {location.pathname.includes("usuarios") ? (
                    <button className="admin-btn" onClick={() => abrirModal("usuario")}>Agregar Usuario</button>
                  ) : (
                    <button className="admin-btn" onClick={() => abrirModal("articulo")}>Agregar Artículo</button>
                  )}
                </li>
              </>
            )}
          </ul>

          {modalAbierto && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="modal-close" onClick={() => setModalAbierto(false)}>✕</button>
                <h2>Agregar {tipoModal === "usuario" ? "usuario" : "artículo"}</h2>

                {tipoModal === "usuario" ? (
                  <div className="modal-grid">
                    <div><label>Nombre</label><input type="text" placeholder="Ingresar nombre" /></div>
                    <div><label>Correo</label><input type="email" placeholder="Ingresar correo" /></div>
                    <div><label>Usuario</label><input type="text" placeholder="Ingresar usuario" /></div>
                    <div><label>Contraseña</label><input type="password" placeholder="Ingresar contraseña" /></div>
                    
                  </div>
                ) : (
                  <div className="modal-grid">
                    <div><label>Nombre</label><input type="text" placeholder="Ingresar nombre" /></div>
                    <div><label>Precio</label><input type="text" placeholder="Ingresar precio" /></div>
                    <div><label>Imagen</label><input type="file" /></div>
                    <div style={{ gridColumn: "1 / 2" }}><label>Descripción</label><textarea rows="5" placeholder="Ingresar descripción" /></div>
                    <div><label>Categoría</label>
                      <select>
                        <option>Seleccionar categoría</option>
                        <option value="camisas">Camisas</option>
                        <option value="pantalones">Pantalones</option>
                        <option value="uniformes">Uniformes</option>
                      </select>
                    </div>
                    <div><label>Modelo 3D GLB</label><input type="file" /></div>
                    <div><label>Modelo 3D USDZ</label><input type="file" /></div>
                  </div>
                )}

                <button className="guardar-btn">
                  {tipoModal === "usuario" ? "Guardar usuario" : "Guardar artículo"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </nav>
  );
}

export default NavbarTop;