import React from "react";
import "../style/ModalCamisa.css"; // Asegúrate de tener el CSS que te pasé antes

const ModalCamisa = ({ producto, onClose }) => {
  return (
    <div className="modal-detalle">
      <div className="modal-contenido">
        <button className="modal-cerrar" onClick={onClose}>✖</button>
        
        <h2>{producto.nombre}</h2>
        <img src={producto.imagen} alt={producto.nombre} />

        <div className="descripcion-detalle">
          <p>Descripción</p>
          <span>{producto.descripcion}</span>
        </div>

        <div className="control-detalle">
          <div className="control-seccion">
            <p>Precio</p>
            <span>${producto.precio}</span>
          </div>

          <div className="control-seccion">
            <p>Cantidad</p>
            <div className="contador-detalle">
              <button>-</button>
              <span>3</span>
              <button>+</button>
            </div>
          </div>

          <div className="control-seccion">
            <p>Talla</p>
            <div className="contador-detalle">
              {["S", "M", "L", "XL"].map((talla) => (
                <button key={talla}>{talla}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="botones-detalle">
          <button>Visualizar en realidad aumentada</button>
          <button>Agregar al carrito de compras</button>
        </div>
      </div>
    </div>
  );
};

export default ModalCamisa;
