// ===========================
// ARCHIVO: detalle-propiedad.js
// FUNCIONES PARA DETALLE DE PROPIEDADES
// ===========================

// Datos de las propiedades
const datosPropiedad = {
  'propiedad-1': {
    nombre: 'Condominio Quillayes de Chicureo',
    ubicacion: 'Chicureo, Santiago',
    precio: '$950.000.000',
    habitaciones: ' 3 Habitaciones',
    banos: ' 2 Baños',
    metros: ' 120 m²',
    estacionamientos: ' 2 Estacionamientos',
    descripcion: 'Hermosa casa en condominio cerrado con amplios espacios verdes, seguridad 24/7 y excelente conectividad. Perfecta para familias que buscan tranquilidad sin alejarse de la ciudad.',
    imagen: 'img/D_NQ_NP_2X_914377-MLC85664600807_062025-F-condominio-quillayes-de-chicureo.webp'
  },
  'propiedad-2': {
    nombre: 'Casa Borde Blanco',
    ubicacion: 'Las Condes, Santiago',
    precio: '$1.350.000.000',
    habitaciones: ' 4 Habitaciones',
    banos: ' 3 Baños',
    metros: ' 180 m²',
    estacionamientos: ' 1 Estacionamiento',
    descripcion: 'Elegante propiedad en sector exclusivo con vista panorámica, jardín privado y acceso a todas las comodidades urbanas. Diseño moderno y acabados de lujo.',
    imagen: 'img/D_NQ_NP_2X_777412-MLC87507815933_072025-F-borde-blanco.webp'
  },
  'propiedad-3': {
    nombre: 'Alto Polkura',
    ubicacion: 'Providencia, Santiago',
    precio: '$850.000.000',
    habitaciones: ' 2 Habitaciones',
    banos: ' 2 Baños',
    metros: ' 85 m²',
    estacionamientos: ' 2 Estacionamientos',
    descripcion: 'Departamento moderno en el corazón de Providencia, cerca del metro y centros comerciales. Ideal para profesionales jóvenes o parejas.',
    imagen: 'img/D_NQ_NP_2X_821086-MLC85362248218_062025-F-alto-polkura.webp'
  },
  'propiedad-4': {
    nombre: 'Condominio Mirador Piedra Roja',
    ubicacion: 'Colina, Santiago',
    precio: '$1.100.000.000',
    habitaciones: ' 3 Habitaciones',
    banos: ' 2 Baños',
    metros: ' 140 m²',
    estacionamientos: ' 2 Estacionamientos',
    descripcion: 'Casa familiar en condominio con piscina, quincho y áreas verdes. Ambiente tranquilo y seguro para toda la familia con excelente calidad de vida.',
    imagen: 'img/D_NQ_NP_2X_865334-MLC80840345342_122024-F-condominio-mirador-piedra-roja.webp'
  }
};

// Cargar información de la propiedad
function cargarDetallePropiedad() {
  const urlParams = new URLSearchParams(window.location.search);
  const propiedadId = urlParams.get('id') || 'propiedad-1';
  
  if (datosPropiedad[propiedadId]) {
    const propiedad = datosPropiedad[propiedadId];
    
    document.getElementById('titulo-propiedad').textContent = propiedad.nombre;
    document.getElementById('ubicacion-propiedad').textContent = propiedad.ubicacion;
    document.getElementById('precio-propiedad').textContent = propiedad.precio;
    document.getElementById('habitaciones').textContent = propiedad.habitaciones;
    document.getElementById('banos').textContent = propiedad.banos;
    document.getElementById('metros').textContent = propiedad.metros;
    document.getElementById('estacionamientos').textContent = propiedad.estacionamientos;
    document.getElementById('descripcion-propiedad').textContent = propiedad.descripcion;
    document.getElementById('imagen-principal').src = propiedad.imagen;
    document.getElementById('imagen-principal').alt = propiedad.nombre;
    
    // Actualizar título de la página
    document.title = `${propiedad.nombre} - Rentfagelu`;
  }
}

// Función para volver a propiedades
function volverAPropiedades() {
  window.location.href = 'propiedades.html';
}

// Función para conectar botón comprar
function conectarBotonComprar() {
  const botonComprar = document.querySelector('.boton-comprar-detalle');
  if (botonComprar) {
    botonComprar.onclick = function() {
      const urlParams = new URLSearchParams(window.location.search);
      const propiedadId = urlParams.get('id') || 'propiedad-1';
      const propiedad = datosPropiedad[propiedadId];
      
      // Crear objeto de casa para el carrito
      const casa = {
        id: Date.now(),
        nombre: propiedad.nombre,
        ubicacion: propiedad.ubicacion,
        precio: propiedad.precio,
        cantidad: 1
      };
      
      // Agregar directamente al carrito
      agregarCasaDesdeDetalle(casa);
    };
  }
}

// Función específica para agregar casa desde la página de detalle
function agregarCasaDesdeDetalle(casa) {
  // Obtener carrito actual del localStorage (mismo nombre que carrito.js)
  let carritoDeCompras = JSON.parse(localStorage.getItem('carritoRentfagelu')) || [];
  
  // Verificar si la casa ya está en el carrito
  const casaExiste = carritoDeCompras.find(item => item.nombre === casa.nombre);
  
  if (casaExiste) {
    mostrarMensaje('Esta casa ya está en tu carrito', 'advertencia');
    return;
  }
  
  // Agregar la casa al carrito
  carritoDeCompras.push(casa);
  
  // Guardar en localStorage (mismo nombre que carrito.js)
  localStorage.setItem('carritoRentfagelu', JSON.stringify(carritoDeCompras));
  
  // Actualizar contador del carrito
  actualizarContadorCarrito();
  
  // Mostrar mensaje de confirmación
  mostrarMensaje(`${casa.nombre} agregada al carrito`, 'exito');
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  const carritoDeCompras = JSON.parse(localStorage.getItem('carritoRentfagelu')) || [];
  const contadorElemento = document.querySelector('.contador-carrito');
  
  if (contadorElemento) {
    contadorElemento.textContent = carritoDeCompras.length;
  }
}

// Función para mostrar mensajes al usuario
function mostrarMensaje(texto, tipo) {
  // Crear elemento del mensaje
  const mensaje = document.createElement('div');
  mensaje.className = `mensaje-detalle ${tipo}`;
  mensaje.textContent = texto;
  
  // Estilos del mensaje
  mensaje.style.position = 'fixed';
  mensaje.style.top = '20px';
  mensaje.style.right = '20px';
  mensaje.style.padding = '15px 20px';
  mensaje.style.borderRadius = '8px';
  mensaje.style.fontWeight = 'bold';
  mensaje.style.zIndex = '10000';
  mensaje.style.maxWidth = '300px';
  
  // Colores según el tipo
  if (tipo === 'exito') {
    mensaje.style.backgroundColor = '#4CAF50';
    mensaje.style.color = 'white';
  } else if (tipo === 'error') {
    mensaje.style.backgroundColor = '#f44336';
    mensaje.style.color = 'white';
  } else if (tipo === 'advertencia') {
    mensaje.style.backgroundColor = '#ff9800';
    mensaje.style.color = 'white';
  } else if (tipo === 'info') {
    mensaje.style.backgroundColor = '#2196F3';
    mensaje.style.color = 'white';
  }
  
  // Agregar al DOM
  document.body.appendChild(mensaje);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    if (mensaje.parentNode) {
      mensaje.parentNode.removeChild(mensaje);
    }
  }, 3000);
}

// Inicializar cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
  cargarDetallePropiedad();
  conectarBotonComprar();
  actualizarContadorCarrito(); // Actualizar contador al cargar la página
});