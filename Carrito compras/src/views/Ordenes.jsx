import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerOrdenes } from "../services/ordenes";

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");

  useEffect(() => {
    if (!usuarioId || isNaN(usuarioId)) return;

    async function cargarOrdenes() {
      const response = await obtenerOrdenes(usuarioId);
      if (response?.success && Array.isArray(response.data)) {
        setOrdenes(response.data);
      } else {
        console.error("Error en la respuesta del servidor:", response);
      }
    }

    cargarOrdenes();
  }, [usuarioId]);

  const descargarFacturaPDF = (orden) => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text(`Factura Orden #${orden.id}`, 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Cliente: ${orden.nombre_usuario} (${orden.correo})`, 10, y);
    y += 7;
    doc.text(`Fecha: ${orden.fecha}`, 10, y);
    y += 10;

    doc.text("Productos:", 10, y);
    y += 7;

    if (orden.items && orden.items.length) {
      orden.items.forEach((item, i) => {
        doc.text(
          `${i + 1}. ${item.nombre_producto} - Cantidad: ${item.cantidad} - Talla: ${item.talla} - Precio: $${item.precio_unitario}`,
          10,
          y
        );
        y += 7;
      });
    } else {
      doc.text("No hay items.", 10, y);
      y += 7;
    }

    y += 5;
    doc.text(`Total a pagar: $${orden.total}`, 10, y);

    doc.save(`factura_orden_${orden.id}.pdf`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Órdenes</h2>

      <label>Ingrese el ID del usuario:</label>
      <input
        type="number"
        value={usuarioId}
        onChange={(e) => setUsuarioId(e.target.value)}
        placeholder="Ejemplo: 19"
        style={{ margin: "10px", padding: "5px" }}
      />

      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", marginBottom: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Items</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.id}>
              <td>{orden.id}</td>
              <td>{orden.nombre_usuario}</td>
              <td>{orden.correo}</td>
              <td>{orden.fecha}</td>
              <td>${orden.total}</td>
              <td>
                {orden.items &&
                  orden.items.map((item, index) => (
                    <div key={index}>
                      {item.nombre_producto} - Cantidad: {item.cantidad} - Talla: {item.talla} - Precio: ${item.precio_unitario}
                    </div>
                  ))}
              </td>
              <td>
                <button onClick={() => descargarFacturaPDF(orden)}>Descargar factura</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ordenes;
