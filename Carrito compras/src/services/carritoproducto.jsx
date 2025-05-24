const agregarAlCarrito = async () => {
    if (!talla || cantidad <= 0) {
      alert("Selecciona una talla y cantidad válida.");
      return;
    }
  
    const item = {
      usuario_id: usuario.id, // este valor debe venir por props o contexto
      articulo_id: producto.id,
      cantidad,
      talla,
      precio_unitario: producto.precio,
    };
  
    try {
      const response = await fetch("http://localhost/carrito-backend/carrito-controller.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Agregado correctamente");
        setCarritoItems((prev) => [...prev, item]);
        onClose(); // cierra modal
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Error al conectar: " + err.message);
    }
  };
  