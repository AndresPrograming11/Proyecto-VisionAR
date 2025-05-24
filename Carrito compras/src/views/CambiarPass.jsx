import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../style/RestablecerPass.css";

function CambiarPass() {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setError("Token inválido.");
    } else {
      setToken(t);
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    setMensaje("");
    setError("");

    if (!newPass || !confirmPass) {
      setError("Completa todos los campos.");
      return;
    }

    if (newPass !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("carrito-backend/reset-password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: newPass }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="contenedor">
      <div className="formulario">
        <h1>Cambiar contraseña</h1>
        {error && <div className="mensaje-error">{error}</div>}
        {mensaje && <div className="mensaje-success">{mensaje}</div>}
        {!mensaje && !error && (
          <>
            <label>Nueva contraseña</label>
            <input
              type="password"
              placeholder="Nueva contraseña"
              onChange={(e) => setNewPass(e.target.value)}
            />
            <label>Confirmar contraseña</label>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <button onClick={handleSubmit}>Cambiar contraseña</button>
          </>
        )}
      </div>
    </div>
  );
}

export default CambiarPass;
