// ModalProducto.js
import React, { useState, useEffect } from "react";
import "../style/ModalProducto.css";

const ModalProducto = ({ producto, onClose, setCarritoItems }) => {
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [precioTotal, setPrecioTotal] = useState(producto ? parseInt(producto.precio) : 0);

  useEffect(() => {
    if (producto && producto.precio) {
      setPrecioTotal(parseFloat(producto.precio) * cantidad);
    }
  }, [cantidad, producto]);

  const handleIncrementar = () => {
    setCantidad(cantidad + 1);
  };

  const handleDecrementar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleSeleccionarTalla = (talla) => {
    setTallaSeleccionada(talla);
  };

  const handleAgregarAlCarrito = () => {
    if (!tallaSeleccionada) {
      alert("Por favor, selecciona una talla.");
      return;
    }
    const nuevoItem = {
      id: producto.id, // Asegúrate de que esto sea correcto
      ...producto,
      cantidad: cantidad,
      talla: tallaSeleccionada,
      precioTotal: precioTotal,
    };
    console.log("Agregando al carrito:", nuevoItem); // Verifica el nuevo artículo
    setCarritoItems(prevItems => [...prevItems, nuevoItem]);
    onClose(); // Cierra el modal después de agregar
  };

  return (
    <div className="modal-detalle">
      <div className="modal-contenido">
        <button className="modal-cerrar" onClick={onClose}>
          ✖
        </button>

        <h2>{producto.nombre}</h2>
        <img src={producto.imagen} alt={producto.nombre} />

        <div className="descripcion-detalle">
          <p>Descripción</p>
          <span>{producto.descripcion}</span>
        </div>

        <div className="control-detalle">
          <div className="control-seccion">
            <p>Precio</p>
            <span>${parseInt(producto.precio)}</span>
          </div>

          <div className="control-seccion">
            <p>Cantidad</p>
            <div className="contador-detalle">
              <button onClick={handleDecrementar}>-</button>
              <span>{cantidad}</span>
              <button onClick={handleIncrementar}>+</button>
            </div>
          </div>

          <div className="control-seccion">
            <p>Talla</p>
            <div className="contador-detalle">
              {["S", "M", "L", "XL"].map((talla) => (
                <button
                  key={talla}
                  className={tallaSeleccionada === talla ? "seleccionada" : ""}
                  onClick={() => handleSeleccionarTalla(talla)}
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
          <button>Visualizar en realidad aumentada</button>
          <button onClick={handleAgregarAlCarrito}>Agregar al carrito de compras</button>
        </div>
      </div>
    </div>
  );
};

export default ModalProducto;
