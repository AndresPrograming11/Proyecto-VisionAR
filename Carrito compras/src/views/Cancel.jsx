
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cancel() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold text-red-600">❌ Pago cancelado</h1>
      <p>Tu transacción ha sido cancelada. Puedes intentarlo de nuevo cuando quieras.</p>
    </div>
  );
}



   
  
  