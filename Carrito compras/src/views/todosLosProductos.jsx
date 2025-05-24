import React, { useState, useEffect } from "react";
import "../style/todosLosProductos.css";
import ModalProducto from "../views/ModalProducto"; 
import { obtenerArticulos } from "../services/articulos"; 
const BASE_URL = "http://localhost/carrito-backend/";

function Productos({ setCarritoItems }) {
  const [productosData, setProductosData] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerArticulos();
        if (data && Array.isArray(data)) {
          setProductosData(data);
        } else {
          console.error("Datos inválidos:", data);
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchData();
  }, []);

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  return (
    <div className="productos-container">
      <h1>PRODUCTOS</h1>
      <div className="productos-grid">
        {productosData.map(producto => (
          <div className="producto-card" key={producto.id} onClick={() => abrirModal(producto)}>
            <img src={`${BASE_URL}${producto.imagen}`} alt={producto.nombre} className="producto-img" />
            <h3>{producto.nombre}</h3>
            <p>${parseInt(producto.precio)}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalAbierto && productoSeleccionado && (
        <ModalProducto
          producto={productoSeleccionado}
          onClose={cerrarModal}
          setCarritoItems={setCarritoItems} // Pasamos la función al Modal
        />
      )}
    </div>
  );
}

export default Productos;
