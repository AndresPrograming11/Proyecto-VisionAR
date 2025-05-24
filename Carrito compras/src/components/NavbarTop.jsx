import { Link, useLocation } from "react-router-dom";
import "../style/NavbarTop.css";
import { useState, useEffect } from "react";
import { registrarUsuario } from "../services/registro";
import { crearArticulo } from "../services/articulos";
import {
  agregarAlCarrito,
  aumentarCantidad,
  disminuirCantidad,
  eliminarDelCarrito,
} from "../services/carritoItem";

function NavbarTop() {
  const location = useLocation();
  const [MenuRedespegable, setMenuRedespegable] = useState(false);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState("usuario");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "user");

  const [carritoItems, setCarritoItems] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);

  // Usuario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [datosRegistrados, setDatosRegistrados] = useState(null);

  // Artículo
  const [nombreArticulo, setNombreArticulo] = useState("");
  const [precioArticulo, setPrecioArticulo] = useState("");
  const [imagen, setImagen] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [glb, setGlb] = useState(null);
  const [usdz, setUsdz] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) setUserRole(role);
  }, []);

  useEffect(() => {
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
    setMensaje("");
    setDatosRegistrados(null);
    setModalAbierto(true);
  };

  const manejarRegistroUsuario = async () => {
    const res = await registrarUsuario(nombre, correo, usuario, contraseña);
    setMensaje(res.message);
    if (res.success) {
      setDatosRegistrados({
        nombre,
        correo,
        usuario
      });
      setNombre("");
      setCorreo("");
      setUsuario("");
      setContraseña("");
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
    setMensaje(res.message);
    if (res.success) {
      setDatosRegistrados({
        nombre: nombreArticulo,
        precio: precioArticulo,
        descripcion,
        categoria,
        imagen: imagen.name,
        glb: glb?.name || "No adjunto",
        usdz: usdz?.name || "No adjunto"
      });
      setNombreArticulo("");
      setPrecioArticulo("");
      setImagen(null);
      setDescripcion("");
      setCategoria("");
      setGlb(null);
      setUsdz(null);
    }
  };

  

 // Funciones para manejar la lógica del carrito
 const agregarItemAlCarrito = (nuevoItem) => {
  const updatedCarrito = agregarAlCarrito(carritoItems, nuevoItem);
  setCarritoItems(updatedCarrito);
  calcularTotal(updatedCarrito);
};
  // Ejemplo de cómo llamar a la función cuando un artículo se agrega
  const handleAgregarArticulo = () => {
    const nuevoItem = {
      id: 1, // ID de ejemplo
      nombre: 'Camisa Azul',
      precio: 20.00,
      cantidad: 1,
      talla: 'M',
      precioTotal: 20.00, // precio * cantidad
      imagen: 'url_de_imagen',
    };
    
    agregarItemAlCarrito(nuevoItem);  // Agregar el artículo al carrito
  };
const aumentarCantidadCarrito = (itemId) => {
  const updatedCarrito = aumentarCantidad(carritoItems, itemId);
  setCarritoItems(updatedCarrito);
  calcularTotal(updatedCarrito);
};

const disminuirCantidadCarrito = (itemId) => {
  const updatedCarrito = disminuirCantidad(carritoItems, itemId);
  setCarritoItems(updatedCarrito);
  calcularTotal(updatedCarrito);
};

const eliminarItem = (itemId) => {
  const updatedCarrito = eliminarDelCarrito(carritoItems, itemId);
  setCarritoItems(updatedCarrito);
  calcularTotal(updatedCarrito);
};

const calcularTotal = (carrito) => {
  const total = carrito.reduce((sum, item) => sum + item.precioTotal, 0);
  setTotalCarrito(total);
};

  const realizarPago = () => {
    alert(`¡Redirigiendo al pago por un total de $${totalCarrito.toFixed(2)}!`);
  };

  return (
    <nav className="navbar-top">
      {userRole === "user" ? (
        <>
          <ul className="nav-links-top">
            <li onClick={toggleMenuRedespegable}>{getTitle()}</li>
            <button onClick={handleAgregarArticulo}>Agregar Camisa Azul</button>
            {MenuRedespegable && location.pathname.includes("uniformes") && (
              <ul className="MenuRedespegable-list">
                <li><Link to="/medicina">Medicina</Link></li>
                <li><Link to="/odontologia">Odontología</Link></li>
                <li><Link to="/fisioterapia">Fisioterapia</Link></li>
              </ul>
            )}
            <li><button onClick={AbrirTienda} className={tiendaSeleccionada ? "tienda-seleccionada" : ""}>🛒</button></li>
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
                
                <div className="carrito-lista">
                  {carritoItems.length > 0 ? (
                    carritoItems.map(item => (
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
                    ))
                  ) : (
                    <p className="carrito-vacio">El carrito está vacío.</p>
                  )}
                </div>

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

                {mensaje && <p className="mensaje">{mensaje}</p>}
                {datosRegistrados && (
                  <div className="datos-confirmacion">
                    <h4>Información guardada:</h4>
                    <pre>{JSON.stringify(datosRegistrados, null, 2)}</pre>
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
};

export default NavbarTop;
