
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cancel() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/ordenes"); // Ruta interna relativa
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="p-4 text-center">
    <h1 className="text-2xl font-bold text-green-600">✅ ¡Pago realizado con éxito!</h1>
    <p>Gracias por tu compra.</p>
  </div>
  );
}



   
  