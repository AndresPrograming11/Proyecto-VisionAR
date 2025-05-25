Prototipo de Aplicación Web con Realidad Aumentada para la Tienda USC

Este proyecto consiste en el desarrollo de un prototipo funcional de una aplicación web para la Tienda de la Universidad Santiago de Cali (USC), el cual incorpora tecnologías de Realidad Aumentada (RA) con el objetivo de enriquecer la experiencia de compra en línea de los usuarios.

Tabla de Contenidos:

Descripción
Tecnologías Utilizadas
Instalación
Uso del Sistema
Estructura del Proyecto
Manual de usuario subido en moodle
Contribuciones
Autores y Créditos
Licencia
Contacto

Descripción:

La aplicación permite a los usuarios explorar los productos de la tienda universitaria mediante visualizaciones 3D y en Realidad Aumentada desde navegadores compatibles o dispositivos móviles. Esto no solo moderniza la experiencia de compra, sino que también facilita la toma de decisiones al ofrecer una vista más realista de los artículos.

Funcionalidades destacadas:

Catálogo interactivo de productos.
Visualización 3D y RA (formatos GLB y USDZ).
Carrito de compras básico.
Panel de administración para la gestión de productos.
Tecnologías Utilizadas
Frontend: HTML5, CSS3, JavaScript, React
Backend: PHP
Base de Datos: MySQL
RA: Model Viewer (compatible con GLB y USDZ)
Otros: Vite

Instalación
Requisitos Previos
Servidor local (XAMPP)
PHP >= 7.4

MySQL
Node.js y npm (para compilar React)

Pasos de Instalación

Clona el repositorio:

git clone https://github.com/tuusuario/nombre-del-repo.git
Copia la carpeta del proyecto al directorio htdocs de XAMPP.
Importa la base de datos desde /db/tienda_usc.sql usando phpMyAdmin.
Configura el archivo de conexión a la base de datos en /backend/config/conexion.php.

Instala las dependencias del frontend:
cd frontend
npm install
npm run dev
Accede al sistema desde http://localhost/carrito compras.

Uso del Sistema
Los usuarios pueden explorar el catálogo, seleccionar productos y visualizar modelos en RA mediante la opción "Ver en RA".

Los administradores tienen acceso a un panel donde pueden agregar, editar o eliminar productos.

Estructura del Proyecto

/frontend          -> Código React (interfaz de usuario)
/backend           -> Código PHP (lógica del servidor y conexión a la BD)
/conexion               -> Scripts SQL para la base de datos
/imagenes            -> Imágenes y modelos 3D (GLB, USDZ)


Contenido usuario manual usuario:

Acceso al sistema
Navegación por el catálogo
Visualización de productos en RA
Gestión del carrito de compras


Contenido tambien manual usuario:
Ingreso al panel administrativo
Gestión de productos (agregar, editar, eliminar)
Recomendaciones sobre formatos y dimensiones de modelos 3D

Contribuciones
¡Las contribuciones son bienvenidas! Para colaborar:
Github

Crea una nueva rama:

git checkout -b mi-nueva-funcionalidad
Realiza los cambios y confirma:


git commit -m "Agrega nueva funcionalidad"
Haz push a tu fork:

git push origin mi-nueva-funcionalidad
Abre un Pull Request desde GitHub.

Autores y Créditos

Jair Sanclemente – Product Owner
Carlos Andrés Torres – Scrum Master y Desarrollador
Santiago Argote – Diseñador UI/UX
Oscar David Juagibioy – Tester
María José Vargas – Control de calidad
Julian H. Pérez / Alexander Q. – Análisis y Planeación
Tienda USC – Cliente evaluador
Estudiantes USC – Usuarios de prueba

Licencia
Este proyecto está licenciado bajo la Licencia MIT (Licencia de codigo abierto)

Contacto
Para dudas, sugerencias o soporte técnico, puedes contactar a:
Carlos A. Torres – carlos.torres13@usc.edu.co
