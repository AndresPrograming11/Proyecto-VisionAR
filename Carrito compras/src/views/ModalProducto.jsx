// src/components/ModalProducto.js
import React, { useState, useEffect } from "react";
import "../style/ModalProducto.css";
import { agregarItemAlCarrito } from "../services/carritoItem";

const BASE_URL = "http://localhost/carrito-backend/";

const ModalProducto = ({ producto, onClose, setCarritoItems, carritoActual }) => {
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [precioTotal, setPrecioTotal] = useState(producto ? parseFloat(producto.precio) : 0);

  useEffect(() => {
    if (producto && producto.precio) {
      setPrecioTotal(parseFloat(producto.precio) * cantidad);
    }
  }, [cantidad, producto]);

  const Incrementar = () => setCantidad(cantidad + 1);
  const Decrementar = () => cantidad > 1 && setCantidad(cantidad - 1);
  const SeleccionarTalla = (talla) => setTallaSeleccionada(talla);

  const AgregarAlCarrito = async () => {
    if (!tallaSeleccionada) {
      alert("Por favor, selecciona una talla.");
      return;
    }

    const nuevoItem = {
      id: producto.id,
      articulo_id: producto.id,
      cantidad,
      talla: tallaSeleccionada,
      precio: parseFloat(producto.precio),
    };

    try {
      const nuevoCarrito = await agregarItemAlCarrito(carritoActual, nuevoItem);
      setCarritoItems(nuevoCarrito);
      console.log("Carrito actualizado:", nuevoCarrito);
      onClose();
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  // --- Funcionalidad para descargar modelos 3D ---
  const esperar = (ms) => new Promise((res) => setTimeout(res, ms));

  const descargarModelos = async (producto) => {
    const archivos = [
      { url: producto.modelo_3D_GLB, nombre: `${producto.nombre}.glb` },
      { url: producto.modelo_3D_USDZ, nombre: `${producto.nombre}.usdz` },
    ];

    for (const { url, nombre } of archivos) {
      if (url) {
        const enlace = document.createElement("a");
        enlace.href = `${BASE_URL}${url}`;
        enlace.download = nombre;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        await esperar(1000); // Espera 1 segundo antes de continuar
      }
    }
  };

  return (
    <div className="modal-detalle">
      <div className="modal-contenido">
        <button className="modal-cerrar" onClick={onClose}>✖</button>

        <h2>{producto.nombre}</h2>
        <img src={`${BASE_URL}${producto.imagen}`} alt={producto.nombre} />

        <div className="descripcion-detalle">
          <p>Descripción</p>
          <span>{producto.descripcion}</span>
        </div>

        <div className="control-detalle">
          <div className="control-seccion">
            <p>Precio</p>
            <span>${parseFloat(producto.precio)}</span>
          </div>

          <div className="control-seccion">
            <p>Cantidad</p>
            <div className="contador-detalle">
              <button onClick={Decrementar}>-</button>
              <span>{cantidad}</span>
              <button onClick={Incrementar}>+</button>
            </div>
          </div>

          <div className="control-seccion">
            <p>Talla</p>
            <div className="contador-detalle">
              {["S", "M", "L", "XL"].map((talla) => (
                <button
                  key={talla}
                  className={tallaSeleccionada === talla ? "seleccionada" : ""}
                  onClick={() => SeleccionarTalla(talla)}
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>

          <div className="control-seccion">
            <p>Precio Total</p>
            <span>${precioTotal}</span>
          </div>
        </div>

        <div className="botones-detalle">
          <button onClick={() => descargarModelos(producto)}>
            Visualizar en realidad aumentada
          </button>
          <button onClick={AgregarAlCarrito}>
            Agregar al carrito de compras
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalProducto;

