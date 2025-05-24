import { Link, useLocation } from "react-router-dom";
import "../style/NavbarTop.css";
import { useState, useEffect } from "react";
import { registrarUsuario } from "../services/registro";
import { crearArticulo } from "../services/articulos"; // Asegúrate que esta ruta sea correcta

function NavbarTop() {
  const location = useLocation();
  const [MenuRedespegable, setMenuRedespegable] = useState(false);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState("usuario");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "user");

  // Estado para los items del carrito
  const [carritoItems, setCarritoItems] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);

  // Campos para usuario (sin cambios)
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Campos para artículo (sin cambios)
  const [nombreArticulo, setNombreArticulo] = useState("");
  const [precioArticulo, setPrecioArticulo] = useState(""); // Usar un nombre diferente para evitar confusión
  const [imagen, setImagen] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [glb, setGlb] = useState(null);
  const [usdz, setUsdz] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    // Recalcular el total cada vez que los items del carrito cambian
    const nuevoTotal = carritoItems.reduce((sum, item) => sum + item.precioTotal, 0);
    setTotalCarrito(nuevoTotal);
  }, [carritoItems]);

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

  const manejarRegistroUsuario = async () => {
    const res = await registrarUsuario(nombre, correo, usuario, contraseña);
    setMensaje(res.message);
    if (res.success) {
      setNombre("");
      setCorreo("");
      setUsuario("");
      setContraseña("");
      setTimeout(() => setModalAbierto(false), 2000);
    }
  };

  const manejarGuardarArticulo = async () => {
    if (!nombreArticulo || !precioArticulo || !descripcion || !categoria || !imagen) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }
    const formData = new FormData();
    formData.append("nombre", nombreArticulo);
    formData.append("precio", precioArticulo);
    formData.append("imagen", imagen);
    formData.append("descripcion", descripcion);
    formData.append("categoria", categoria);
    if (glb) formData.append("modeloGLB", glb);
    if (usdz) formData.append("modeloUSDZ", usdz);
    const res = await crearArticulo(formData);
    if (res.success) {
      // Limpiar los campos después de guardar
      setNombreArticulo("");
      setPrecioArticulo("");
      setImagen(null);
      setDescripcion("");
      setCategoria("");
      setGlb(null);
      setUsdz(null);
      setMensaje("Artículo creado correctamente.");
      setTimeout(() => setModalAbierto(false), 2000);
    } else {
      alert(res.message || "Error al crear artículo");
    }
  };

  const aumentarCantidadCarrito = (itemId) => {
    setCarritoItems(carritoItems.map(item =>
      item.id === itemId ? { ...item, cantidad: item.cantidad + 1, precioTotal: (item.cantidad + 1) * item.precio } : item
    ));
  };

  const disminuirCantidadCarrito = (itemId) => {
    setCarritoItems(carritoItems.map(item =>
      item.id === itemId && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1, precioTotal: (item.cantidad - 1) * item.precio } : item
    ));
  };

  // Función para eliminar un item del carrito
  const eliminarItem = (itemId) => {
    setCarritoItems(carritoItems.filter(item => item.id !== itemId));
  };

  const realizarPago = () => {
    alert(`¡Redirigiendo al pago por un total de $${totalCarrito.toFixed(2)}! (Funcionalidad de pago no implementada)`);
    // Aquí iría la lógica para redirigir a la página de pago
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
                {carritoItems.map(item => (
                  <div className="carrito-item" key={item.id}>
                    <img src={item.imagen} alt={item.nombre} />
                    <div className="info-carrito">
                      <h4>{item.nombre}</h4>
                      <button className="talla-btn">{item.talla}</button>
                      <div className="contador">
                        <button onClick={() => aumentarCantidadCarrito(item.id)}>+</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => disminuirCantidadCarrito(item.id)}>-</button>
                      </div>
                      <button className="borrar-btn" onClick={() => eliminarItem(item.id)}>🗑</button>
                    </div>
                    <div className="precio-carrito">
                      <span>${item.precioTotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                {carritoItems.length === 0 && <p className="carrito-vacio">El carrito está vacío.</p>}
                {carritoItems.length > 0 && (
                  <div className="total-carrito">
                    <button onClick={realizarPago}>Pagar: ${totalCarrito.toFixed(2)}</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        // ... (El código para el panel de administración se mantiene igual)
        <>
          <ul className="nav-links-top-admin admin-panel-top">
            <li><h1>Panel de Administración</h1></li>
            {location.pathname.includes("admin") && (
              <li>
                {location.pathname.includes("usuarios") ? (
                  <button className="admin-btn" onClick={() => abrirModal("usuario")}>Agregar Usuario</button>
                ) : (
                  <button className="admin-btn" onClick={() => abrirModal("articulo")}>Agregar Artículo</button>
                )}
              </li>
            )}
          </ul>

          {modalAbierto && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="modal-close" onClick={() => setModalAbierto(false)}>✕</button>
                <h2>Agregar {tipoModal === "usuario" ? "usuario" : "artículo"}</h2>

                {tipoModal === "usuario" ? (
                  <div className="modal-grid">
                    <div><label>Nombre</label><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
                    <div><label>Correo</label><input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} /></div>
                    <div><label>Usuario</label><input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} /></div>
                    <div><label>Contraseña</label><input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} /></div>
                    {mensaje && <p>{mensaje}</p>}
                  </div>
                ) : (
                  <div className="modal-grid">
                    <div><label>Nombre</label><input type="text" value={nombreArticulo} onChange={(e) => setNombreArticulo(e.target.value)} /></div>
                    <div><label>Precio</label><input type="text" value={precioArticulo} onChange={(e) => setPrecioArticulo(e.target.value)} /></div>
                    <div><label>Imagen</label><input type="file" onChange={(e) => setImagen(e.target.files[0])} /></div>
                    <div style={{ gridColumn: "1 / 2" }}><label>Descripción</label><textarea rows="5" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></div>
                    <div><label>Categoría</label>
                      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        <option>Seleccionar categoría</option>
                        <option value="camisas">Camisas</option>
                        <option value="pantalones">Pantalones</option>
                        <option value="uniformes">Uniformes</option>
                      </select>
                    </div>
                    <div><label>Modelo 3D GLB</label><input type="file" onChange={(e) => setGlb(e.target.files[0])} /></div>
                    <div><label>Modelo 3D USDZ</label><input type="file" onChange={(e) => setUsdz(e.target.files[0])} /></div>
                  </div>
                )}

                <button
                  className="guardar-btn"
                  onClick={tipoModal === "usuario" ? manejarRegistroUsuario : manejarGuardarArticulo}
                >
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