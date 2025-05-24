// services/carritoItem.jsx

export const agregarAlCarrito = (carritoActual, nuevoItem) => {
    const existente = carritoActual.find(
      (item) => item.id === nuevoItem.id && item.talla === nuevoItem.talla
    );
  
    if (existente) {
      return carritoActual.map((item) =>
        item.id === nuevoItem.id && item.talla === nuevoItem.talla
          ? {
              ...item,
              cantidad: item.cantidad + nuevoItem.cantidad,
              precioTotal: (item.cantidad + nuevoItem.cantidad) * item.precio,
            }
          : item
      );
    } else {
      return [...carritoActual, nuevoItem];
    }
  };
  
  export const aumentarCantidad = (carritoActual, itemId) => {
    return carritoActual.map((item) =>
      item.id === itemId
        ? {
            ...item,
            cantidad: item.cantidad + 1,
            precioTotal: (item.cantidad + 1) * item.precio,
          }
        : item
    );
  };
  
  export const disminuirCantidad = (carritoActual, itemId) => {
    return carritoActual.map((item) =>
      item.id === itemId && item.cantidad > 1
        ? {
            ...item,
            cantidad: item.cantidad - 1,
            precioTotal: (item.cantidad - 1) * item.precio,
          }
        : item
    );
  };
  
  export const eliminarDelCarrito = (carritoActual, itemId) => {
    return carritoActual.filter((item) => item.id !== itemId);
  };
  