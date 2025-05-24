import { useEffect, useState } from "react";

export default function Success() {
  const [facturaId, setFacturaId] = useState(null);

  useEffect(() => {
    const crearFactura = async () => {
      const factura = {
        usuario_id: 1, // <-- Reemplaza con ID real del usuario
        fecha: new Date().toISOString().slice(0, 19).replace("T", " "),
        total: 99.99, // <-- Monto de la compra
        items: [
          {
            nombre: "Camisa roja",
            cantidad: 2,
            precio: 19.99,
          },
          {
            nombre: "Pantalón azul",
            cantidad: 1,
            precio: 59.99,
          },
        ],
      };

      try {
        const response = await fetch("http://localhost/tu-backend/controller/facturaController.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(factura),
        });

        const data = await response.json();

        if (data.success) {
          setFacturaId(data.id);
        } else {
          console.error("Error en la respuesta del backend:", data);
        }
      } catch (error) {
        console.error("Error al crear la factura:", error);
      }
    };

    crearFactura();
  }, []);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold text-green-600">✅ ¡Pago realizado con éxito!</h1>
      <p>Gracias por tu compra.</p>

      {facturaId && (
        <a
          href={`http://localhost/carrito-backend/descargarFactura.php?id=${facturaId}`}
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          download
        >
          Descargar factura
        </a>
      )}
    </div>
  );
}
