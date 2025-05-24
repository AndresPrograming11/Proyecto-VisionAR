<?php
require_once __DIR__ . '/conexion.php';

// Función auxiliar para subir archivos
function guardarArchivo($archivo) {
    if ($archivo && $archivo['error'] === 0) {
        $nombreArchivo = uniqid() . '_' . basename($archivo["name"]);
        $ruta = "imagenes/" . $nombreArchivo;
        if (move_uploaded_file($archivo["tmp_name"], $ruta)) {
            return $ruta;
        }
    }
    return null;
}

// Listar todos los artículos
function listarArticulos() {
    global $conn;
    $sql = "SELECT * FROM Articulos";
    $result = $conn->query($sql);

    $articulos = [];
    while ($fila = $result->fetch_assoc()) {
        $articulos[] = $fila;
    }

    return $articulos;
}

// Crear un nuevo artículo
function crearArticulo($post, $files) {
    global $conn;

    $nombre = $post['nombre'] ?? '';
    $precio = $post['precio'] ?? '';
    $descripcion = $post['descripcion'] ?? '';
    $categoria = $post['categoria'] ?? '';

    $imagen = guardarArchivo($files['imagen'] ?? null);
    $modeloGLB = guardarArchivo($files['modeloGLB'] ?? null);
    $modeloUSDZ = guardarArchivo($files['modeloUSDZ'] ?? null);

    $stmt = $conn->prepare("INSERT INTO Articulos (nombre, precio, descripcion, categoria, imagen, modelo_3D_GLB, modelo_3D_USDZ) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sdsssss", $nombre, $precio, $descripcion, $categoria, $imagen, $modeloGLB, $modeloUSDZ);

    if ($stmt->execute()) {
        return ["success" => true, "message" => "Artículo creado correctamente."];
    } else {
        return ["success" => false, "message" => "Error al guardar el artículo."];
    }
}

// Eliminar artículo por ID
function eliminarArticulo($id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM Articulos WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        return ["success" => true, "message" => "Artículo eliminado correctamente."];
    } else {
        return ["success" => false, "message" => "Error al eliminar el artículo."];
    }
}

// Actualizar un artículo por ID
function actualizarArticulo($id, $post, $files) {
    global $conn;

    $nombre = $post['nombre'] ?? '';
    $precio = $post['precio'] ?? '';
    $descripcion = $post['descripcion'] ?? '';
    $categoria = $post['categoria'] ?? '';

    // Obtener el artículo existente
    $stmt = $conn->prepare("SELECT imagen, modelo_3D_GLB, modelo_3D_USDZ FROM Articulos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($imagenActual, $glbActual, $usdzActual);
    $stmt->fetch();
    $stmt->close();

    // Si se proporcionan nuevos archivos, reemplazar los existentes
    $imagen = $imagenActual;
    if (isset($files['imagen']) && $files['imagen']['error'] === 0) {
        $imagen = guardarArchivo($files['imagen']);
    }

    $modeloGLB = $glbActual;
    if (isset($files['modeloGLB']) && $files['modeloGLB']['error'] === 0) {
        $modeloGLB = guardarArchivo($files['modeloGLB']);
    }

    $modeloUSDZ = $usdzActual;
    if (isset($files['modeloUSDZ']) && $files['modeloUSDZ']['error'] === 0) {
        $modeloUSDZ = guardarArchivo($files['modeloUSDZ']);
    }

    $stmt = $conn->prepare("UPDATE Articulos SET nombre = ?, precio = ?, descripcion = ?, categoria = ?, imagen = ?, modelo_3D_GLB = ?, modelo_3D_USDZ = ? WHERE id = ?");
    $stmt->bind_param("sdsssssi", $nombre, $precio, $descripcion, $categoria, $imagen, $modeloGLB, $modeloUSDZ, $id);

    if ($stmt->execute()) {
        return ["success" => true, "message" => "Artículo actualizado correctamente."];
    } else {
        return ["success" => false, "message" => "Error al actualizar el artículo."];
    }
}
?>
