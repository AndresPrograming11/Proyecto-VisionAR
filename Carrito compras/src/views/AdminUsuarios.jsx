import { useState, useEffect } from "react";
import "../style/AdminUsuarios.css";
import { obtenerUsuarios } from "../services/gestionar_usuarios";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    };

    fetchUsuarios();
  }, []);

  const eliminarUsuario = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (confirmacion) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  const editarUsuario = (id) => {
    alert(`Aquí puedes redirigir o abrir un modal para editar al usuario con ID ${id}`);
  };

  return (
    <div className="admin-usuarios">
      <h2>Gestión de Usuarios</h2>
      <table className="usuarios-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.username}</td>
              <td>**********</td>
              <td>{usuario.role}</td>
              <td>
                <button onClick={() => editarUsuario(usuario.id)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarUsuario(usuario.id)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;
