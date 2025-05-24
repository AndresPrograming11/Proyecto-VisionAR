// services/carritoItem.jsx

export const agregarAlCarrito = (carritoActual, nuevoItem) => {
  const userId = localStorage.getItem("userId"); // Obtener el ID del usuario

  const existente = carritoActual.find(
    (item) => item.id === nuevoItem.id && item.talla === nuevoItem.talla
  );

  if (existente) {
    const carritoActualizado = carritoActual.map((item) =>
      item.id === nuevoItem.id && item.talla === nuevoItem.talla
        ? {
            ...item,
            cantidad: item.cantidad + nuevoItem.cantidad,
            precioTotal: (item.cantidad + nuevoItem.cantidad) * item.precio,
            usuario_id: userId, // Asignar usuario_id
          }
        : item
    );

    // Enviar al backend
    agregarItemAlCarrito(existente);

    return carritoActualizado;
  } else {
    const nuevoCarrito = [...carritoActual, { ...nuevoItem, usuario_id: userId }];
    
    // Enviar nuevo artículo al backend
    agregarItemAlCarrito(nuevoItem);

    return nuevoCarrito;
  }
};

export async function obtenerCarrito(userId) {
  try {
    const response = await fetch(`http://localhost/carrito-backend/Models/obtener_carrito.php?usuario_id=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return [];
  }
}


const API_URL = "http://localhost/carrito-backend/Models/"; // Ajusta esta URL

export const actualizarCantidadCarrito = async (id, cantidad) => {
  const response = await fetch(`${API_URL}/actualizar_carrito.php`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, cantidad }),
  });

  return response.json();
};

export const eliminarDelCarritoBD = async (id) => {
  const response = await fetch(`${API_URL}/eliminar_item_carrito.php`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  return response.json();
};



  
// src/services/carritoItem.jsx
export async function agregarItemAlCarrito(carritoActual, nuevoItem) {
  try {
    // Verificar que carritoActual sea un array
    if (!Array.isArray(carritoActual)) {
      console.error("Error: carritoActual no es un array, inicializando como []");
      carritoActual = [];
    }

    const userId = localStorage.getItem("userId"); // Obtener ID del usuario
    if (!userId) {
      console.error("El usuario no está autenticado.");
      return carritoActual; // Retornar el carrito sin cambios si no hay usuario autenticado
    }

    // Agregar usuario_id al nuevo item
    const itemConUsuario = { ...nuevoItem, usuario_id: userId };

    // Verificar si el artículo ya existe en el carrito
    const existente = carritoActual.find(
      (item) => item.id === nuevoItem.id && item.talla === nuevoItem.talla
    );

    let nuevoCarrito;
    if (existente) {
      nuevoCarrito = carritoActual.map((item) =>
        item.id === nuevoItem.id && item.talla === nuevoItem.talla
          ? {
              ...item,
              cantidad: item.cantidad + nuevoItem.cantidad,
              precioTotal: (item.cantidad + nuevoItem.cantidad) * item.precio,
              usuario_id: userId,
            }
          : item
      );
    } else {
      nuevoCarrito = [...carritoActual, itemConUsuario];
    }

    // Enviar datos al backend
    const response = await fetch("http://localhost/carrito-backend/Models/agregar_carrito_item.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(itemConUsuario),
    });

    const result = await response.text();
    console.log("Respuesta del backend:", result);

    return nuevoCarrito; // Retornar el nuevo estado del carrito
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    throw error;
  }
}

// Aumentar cantidad de un ítem en el carrito
export const aumentarCantidad = (carritoActual, itemId) => {
  if (!Array.isArray(carritoActual)) return []; // Validar que es un array
  return carritoActual.map((item) =>
    item.id === itemId
      ? { ...item, cantidad: item.cantidad + 1, precioTotal: (item.cantidad + 1) * item.precio }
      : item
  );
};

// Disminuir cantidad de un ítem en el carrito
export const disminuirCantidad = (carritoActual, itemId) => {
  if (!Array.isArray(carritoActual)) return []; // Validar que es un array
  return carritoActual.map((item) =>
    item.id === itemId && item.cantidad > 1
      ? { ...item, cantidad: item.cantidad - 1, precioTotal: (item.cantidad - 1) * item.precio }
      : item
  );
};

// Eliminar un ítem del carrito
export const eliminarDelCarrito = (carritoActual, itemId) => {
  if (!Array.isArray(carritoActual)) return []; // Validar que es un array
  return carritoActual.filter((item) => item.id !== itemId);
};
