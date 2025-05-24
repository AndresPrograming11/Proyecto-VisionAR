import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "../style/NavbarTop.css";
import { registrarUsuario } from "../services/registro";
import { crearArticulo } from "../services/articulos";
import {
  obtenerCarrito,  
} from "../services/carritoItem";
import { pagarConStripe } from "../services/pagoStripe";
import { crearFactura } from '../services/factura';
import { actualizarCantidadCarrito, eliminarDelCarritoBD } from '../services/carritoItem';

function NavbarTop() {
  const location = useLocation();
  const [MenuRedespegable, setMenuRedespegable] = useState(false);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState("usuario");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "user");
  const [carritoItems, setCarritoItems] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const userId = localStorage.getItem("userId");

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
    if (userId) {
      obtenerCarrito(userId)
        .then(setCarritoItems)
        .catch(error => console.error("Error al cargar el carrito:", error));
    } else {
      setCarritoItems([]);
    }
  }, [userId]);

  const calcularTotal = useCallback((items) => {
    if (!Array.isArray(items) || items.length === 0) {
      setTotalCarrito(0);
      return;
    }
    const nuevoTotal = items.reduce((acc, item) => {
      const precio = parseFloat(item.precio) || 0;
      const cantidad = Number(item.cantidad) || 1;
      return acc + precio * cantidad;
    }, 0);
    setTotalCarrito(nuevoTotal);
  }, []);

  useEffect(() => {
    calcularTotal(carritoItems);
  }, [carritoItems, calcularTotal]);

  const toggleMenuRedespegable = () => setMenuRedespegable(!MenuRedespegable);

  const AbrirTienda = async () => {
    const carrito = await obtenerCarrito(userId);
    setCarritoItems(carrito);
    setTiendaSeleccionada(true);
  };
  
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
      setDatosRegistrados({ nombre, correo, usuario });
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

const aumentarCantidadCarrito = async (itemId) => {
  const updatedCarrito = carritoItems.map(item =>
    item.id === itemId ? { ...item, cantidad: (item.cantidad || 0) + 1 } : item
  );
  setCarritoItems(updatedCarrito);
  await actualizarCantidadCarrito(itemId, (carritoItems.find(i => i.id === itemId)?.cantidad || 0) + 1);
};

const disminuirCantidadCarrito = async (itemId) => {
  const item = carritoItems.find(i => i.id === itemId);
  if (item && item.cantidad > 1) {
    const updatedCarrito = carritoItems.map(i =>
      i.id === itemId ? { ...i, cantidad: i.cantidad - 1 } : i
    );
    setCarritoItems(updatedCarrito);
    await actualizarCantidadCarrito(itemId, item.cantidad - 1);
  }
};

const eliminarItem = async (itemId) => {
  const updatedCarrito = carritoItems.filter(item => item.id !== itemId);
  setCarritoItems(updatedCarrito);
  await eliminarDelCarritoBD(itemId);
};
  

  const realizarPago = async () => {
    if (!carritoItems?.length) {
      return alert("Tu carrito está vacío.");
    }
  
    const factura = {
      usuario_id: userId,
      fecha: new Date().toISOString().split('T')[0],
      total: totalCarrito,
      items: carritoItems.map(({ id, cantidad, talla }) => ({
        producto_id: id,
        cantidad,
        talla: talla || null,
      })),
    };
    console.log("Detalles de factura a crear:",factura); // 👈 Mostrar detalles
    try {
      const { success, id, message } = await crearFactura(factura);
  
      if (!success || !id) {
        console.error("❌ Error al crear la factura:", message);
        return alert("No se pudo crear la factura.");
      }
  
      alert("Factura creada correctamente.");
      pagarConStripe({ items: carritoItems, total: totalCarrito });
  
    } catch (error) {
      console.error("🔥 Error inesperado:", error);
      alert("Ocurrió un error al procesar el pago.");
    }
  };
  
  


  // Funciones de ejemplo para agregar items (puedes eliminarlas o adaptarlas)
  const handleAgregarCamisaAzul = () => {
    const nuevoItem = {
      id: Date.now() + 1,
      nombre: 'Camisa Azul',
      precio: 20.00,
      cantidad: 1,
      talla: 'M',
      precioTotal: 20.00,
      imagen: 'https://media.falabella.com/falabellaCO/126474214_01/w=1500,h=1500,fit=pad',
    };
    setCarritoItems([...carritoItems, nuevoItem]);
  };

  const handleAgregarPantalonNegro = () => {
    const nuevoItem = {
      id: Date.now() + 2,
      nombre: 'Pantalón Negro',
      precio: 35.00,
      cantidad: 1,
      talla: 'L',
      precioTotal: 35.00,
      imagen: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTp5DFqQ3JyvuSJmSEmsCBw93bzbe4RsLFW2fkOJjKNRQuP-pFA4E7DcinQklE-eXSiOJLJDAytkxnixHllyhVH-1VYPFFaEBXTAGR8MjP3WLAvAuC2WauSXw',
    };
    setCarritoItems([...carritoItems, nuevoItem]);
  };

  const handleAgregarZapatosDeportivos = () => {
    const nuevoItem = {
      id: Date.now() + 3,
      nombre: 'Zapatos Deportivos',
      precio: 60.00,
      cantidad: 1,
      talla: '42',
      precioTotal: 60.00,
      imagen: 'https://versilia.com.co/cdn/shop/products/HOMBREADONAIAZULREF004640-3.jpg?v=1656173363&width=1200',
    };
    setCarritoItems([...carritoItems, nuevoItem]);
  };

  console.log("Estado carritoItems en NavbarTop:", carritoItems);

  return (
    <nav className="navbar-top">
      {userRole === "user" ? (
        <>
          <ul className="nav-links-top">
            <li onClick={toggleMenuRedespegable}>{getTitle()}</li>
            {/* Estos botones son solo de ejemplo para agregar al carrito */}
            <button onClick={handleAgregarCamisaAzul}>camisa azul al carrito</button>
            <button onClick={handleAgregarPantalonNegro}>pantalón negro al carrito</button>
            <button onClick={handleAgregarZapatosDeportivos}>Agregar los zapatos al carrito</button>
            <li><button onClick={AbrirTienda} className={tiendaSeleccionada ? "tienda-seleccionada" : ""}>🛒</button></li>
          </ul>
          {tiendaSeleccionada && (
            <div className="fondo-negro">
              <div className="carrito-contenedor">
                <div className="titulo-carrito">
                  <button className="cerrar-carrito" onClick={CerrarTienda}>⬅</button>
                  <h2>🛒 Tu carrito</h2>
                </div>
                <div className="carrito-lista">
                  {Array.isArray(carritoItems) && carritoItems.length > 0 ? (
                    carritoItems.map(item => (
                      <div className="carrito-item" key={item.id}>
                        {item.imagen && <img src={item.imagen} alt={item.nombre} />}
                        <div className="info-carrito">
                          <h4>{item.nombre || item.articulo_id}</h4>
                          <div className="contador">
                            <button onClick={() => aumentarCantidadCarrito(item.id)}>+</button>
                            <span>{item.cantidad || 1}</span>
                            <button onClick={() => disminuirCantidadCarrito(item.id)}>-</button>
                          </div>
                          {item.talla && <span>Talla: {item.talla}</span>}
                          <button className="borrar-btn" onClick={() => eliminarItem(item.id)}>🗑</button>
                        </div>
                        <div className="precio-carrito">
                          <span>${((parseFloat(item.precio) || 0) * (item.cantidad || 1))}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="carrito-vacio">El carrito está vacío.</p>
                  )}
                </div>
                {Array.isArray(carritoItems) && carritoItems.length > 0 && (
                  <div className="total-carrito">
                    <button onClick={realizarPago}>Pagar: ${totalCarrito}</button>
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
}

export default NavbarTop;