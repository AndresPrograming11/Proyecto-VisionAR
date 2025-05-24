// src/views/camisas.jsx
import React, { useState, useEffect } from "react";
import "../style/camisas.css";
import ModalProducto from "./ModalProducto";
import { obtenerArticulos } from "../services/articulos";

const BASE_URL = "http://localhost/carrito-backend/";

function Camisas({ carritoItems, setCarritoItems }) {
  const [camisasData, setCamisasData] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerArticulos();
        if (Array.isArray(data)) {
          setCamisasData(data.filter(item => item.categoria === "camisas"));
        } else {
          console.error("Datos inválidos:", data);
        }
      } catch (error) {
        console.error("Error al obtener camisas:", error);
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
    <div className="camisas-container">
      <h1>CAMISAS</h1>
      <div className="camisas-grid">
        {camisasData.map(camisa => (
          <div className="camisa-card" key={camisa.id} onClick={() => abrirModal(camisa)}>
            <img src={`${BASE_URL}${camisa.imagen}`} alt={camisa.nombre} className="camisa-img" />
            <h3>{camisa.nombre}</h3>
            <p>${parseInt(camisa.precio)}</p>
          </div>
        ))}
      </div>

      {modalAbierto && productoSeleccionado && (
        <ModalProducto
          producto={productoSeleccionado}
          onClose={cerrarModal}
          setCarritoItems={setCarritoItems}
        />
      )}

      <div className="carrito-indicador">
        <p>Carrito: {carritoItems.length} productos</p>
      </div>
    </div>
  );
}

export default Camisas;
