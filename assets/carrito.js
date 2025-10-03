// CARRITO DE COMPRAS - RENTFAGELU
// Archivo creado por estudiantes para proyecto académico

// Variable global para guardar las casas en el carrito
let carritoDeCompras = [];

// Función para inicializar el carrito cuando se carga la página
function iniciarCarrito() {
    console.log('Iniciando sistema de carrito...'); // Debug
    
    // Cargar carrito guardado si existe
    const carritoGuardado = localStorage.getItem('carritoRentfagelu');
    if (carritoGuardado) {
        carritoDeCompras = JSON.parse(carritoGuardado);
        console.log('Carrito cargado desde localStorage:', carritoDeCompras); // Debug
    }
    
    // Actualizar el número en el carrito
    actualizarContadorCarrito();
    
    // Conectar botones de comprar
    conectarBotonesComprar();
    
    console.log('Sistema de carrito iniciado correctamente'); // Debug
}

// Función para conectar los botones de comprar
function conectarBotonesComprar() {
    const botonesComprar = document.querySelectorAll('.boton-comprar');
    console.log('Botones encontrados:', botonesComprar.length); // Debug
    
    botonesComprar.forEach((boton, index) => {
        boton.addEventListener('click', function(evento) {
            evento.preventDefault(); // Prevenir cualquier comportamiento por defecto
            console.log('Botón clickeado, índice:', index); // Debug
            agregarCasaAlCarrito(index);
        });
    });
}

// Función para agregar una casa al carrito
function agregarCasaAlCarrito(indiceCasa) {
    console.log('Intentando agregar casa con índice:', indiceCasa); // Debug
    
    // Obtener información de la casa
    const tarjetasCasas = document.querySelectorAll('.tarjeta-propiedad');
    const tarjeta = tarjetasCasas[indiceCasa];
    
    console.log('Tarjetas encontradas:', tarjetasCasas.length); // Debug
    console.log('Tarjeta seleccionada:', tarjeta); // Debug
    
    if (!tarjeta) {
        mostrarMensaje('Error: No se encontró la casa', 'error');
        return;
    }
    
    // Obtener datos de la casa
    const nombreCasa = tarjeta.querySelector('.nombre-propiedad').textContent;
    const precioCasa = tarjeta.querySelector('.precio-propiedad').textContent;
    const ubicacionCasa = tarjeta.querySelector('.ubicacion-propiedad').textContent;
    
    console.log('Datos de la casa:', { nombreCasa, precioCasa, ubicacionCasa }); // Debug
    
    // Verificar si la casa ya está en el carrito
    const casaExiste = carritoDeCompras.find(casa => casa.nombre === nombreCasa);
    
    if (casaExiste) {
        mostrarMensaje('Esta casa ya está en tu carrito', 'advertencia');
        return;
    }
    
    // Crear objeto de la casa
    const nuevaCasa = {
        id: Date.now(), // ID único basado en tiempo
        nombre: nombreCasa,
        precio: precioCasa,
        ubicacion: ubicacionCasa,
        cantidad: 1
    };
    
    // Agregar al carrito
    carritoDeCompras.push(nuevaCasa);
    console.log('Casa agregada. Carrito actual:', carritoDeCompras); // Debug
    
    // Guardar en localStorage
    localStorage.setItem('carritoRentfagelu', JSON.stringify(carritoDeCompras));
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Mostrar mensaje de éxito
    mostrarMensaje(`${nombreCasa} agregada al carrito`, 'exito');
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const contador = document.querySelector('.contador-carrito');
    console.log('Buscando contador. Elemento encontrado:', contador); // Debug
    
    if (contador) {
        const totalCasas = carritoDeCompras.length;
        console.log('Actualizando contador con:', totalCasas, 'casas'); // Debug
        contador.textContent = totalCasas;
        contador.style.display = totalCasas > 0 ? 'inline' : 'none';
    } else {
        console.log('No se encontró el elemento .contador-carrito'); // Debug
    }
}

// Función para quitar casa del carrito
function quitarCasaDelCarrito(idCasa) {
    carritoDeCompras = carritoDeCompras.filter(casa => casa.id !== idCasa);
    localStorage.setItem('carritoRentfagelu', JSON.stringify(carritoDeCompras));
    actualizarContadorCarrito();
    mostrarCarritoCompleto(); // Actualizar vista del carrito
}

// Función para mostrar el carrito completo (para página carrito.html)
function mostrarCarritoCompleto() {
    const contenedorCarrito = document.getElementById('cart-list');
    const carritoVacio = document.getElementById('empty-cart');
    const carritoItems = document.getElementById('cart-items');
    const totalItems = document.getElementById('total-items');
    const totalPrecio = document.getElementById('total-price');
    
    if (!contenedorCarrito) {
        console.log('No estamos en la página del carrito');
        return; // No estamos en la página del carrito
    }
    
    if (carritoDeCompras.length === 0) {
        // Mostrar carrito vacío
        if (carritoVacio) carritoVacio.style.display = 'block';
        if (carritoItems) carritoItems.style.display = 'none';
        return;
    }
    
    // Mostrar carrito con items
    if (carritoVacio) carritoVacio.style.display = 'none';
    if (carritoItems) carritoItems.style.display = 'block';
    
    let htmlCarrito = '';
    let totalPrecioNumerico = 0;
    
    carritoDeCompras.forEach(casa => {
        // Convertir precio a número (quitar $ y puntos)
        const precioNumero = parseInt(casa.precio.replace(/[$.]/g, ''));
        totalPrecioNumerico += precioNumero;
        
        htmlCarrito += `
            <div class="item-carrito">
                <div class="detalle-casa">
                    <div class="icono-casa">🏠</div>
                    <div class="info-casa">
                        <h3 class="nombre-casa">${casa.nombre}</h3>
                        <p class="ubicacion-casa">${casa.ubicacion}</p>
                        <p class="precio-casa">${casa.precio}</p>
                        <div class="cantidad-casa">
                            <span class="etiqueta-cantidad">Cantidad: </span>
                            <span class="numero-cantidad">${casa.cantidad}</span>
                        </div>
                    </div>
                </div>
                
                <div class="acciones-casa">
                    <button onclick="volverAMirar('${casa.nombre}')" class="boton-volver">
                        Volver a mirar
                    </button>
                    <button onclick="quitarCasaDelCarrito(${casa.id})" class="boton-eliminar">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    });
    
    contenedorCarrito.innerHTML = htmlCarrito;
    
    // Actualizar totales
    if (totalItems) totalItems.textContent = carritoDeCompras.length;
    if (totalPrecio) totalPrecio.textContent = '$' + totalPrecioNumerico.toLocaleString();
    
    // Conectar botón de pagar
    const botonPagar = document.getElementById('proceed-payment');
    if (botonPagar) {
        botonPagar.onclick = function() {
            procesarCompraCarrito();
        };
    }
}

// Función para volver a mirar una casa específica
function volverAMirar(nombreCasa) {
    // Buscar la casa en las páginas de propiedades
    // Por simplicidad, redirigimos a la página de propiedades
    mostrarMensaje(`Redirigiendo para ver "${nombreCasa}" nuevamente`, 'info');
    
    setTimeout(() => {
        window.location.href = 'propiedades.html';
    }, 1500);
}

// Función para procesar la compra desde el carrito
function procesarCompraCarrito() {
    if (carritoDeCompras.length === 0) {
        mostrarMensaje('Tu carrito está vacío', 'error');
        return;
    }
    
    const totalCasas = carritoDeCompras.length;
    const totalPrecio = carritoDeCompras.reduce((total, casa) => {
        return total + parseInt(casa.precio.replace(/[$.]/g, ''));
    }, 0);
    
    const mensaje = `¿Confirmar compra de ${totalCasas} casa(s) por $${totalPrecio.toLocaleString()}?`;
    
    if (confirm(mensaje)) {
        // Simular procesamiento de pago
        mostrarMensaje('Procesando pago...', 'info');
        
        setTimeout(() => {
            mostrarMensaje('¡Compra realizada exitosamente! Te contactaremos pronto', 'exito');
            
            // Vaciar carrito después de compra exitosa
            carritoDeCompras = [];
            localStorage.removeItem('carritoRentfagelu');
            actualizarContadorCarrito();
            mostrarCarritoCompleto();
            
            // Redirigir después de un momento
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }, 2000);
    }
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        carritoDeCompras = [];
        localStorage.removeItem('carritoRentfagelu');
        actualizarContadorCarrito();
        mostrarCarritoCompleto();
        mostrarMensaje('Carrito vaciado', 'exito');
    }
}

// Función para procesar compra
function procesarCompra() {
    if (carritoDeCompras.length === 0) {
        mostrarMensaje('Tu carrito está vacío', 'error');
        return;
    }
    
    const totalCasas = carritoDeCompras.length;
    if (confirm(`¿Confirmar compra de ${totalCasas} casa(s)?`)) {
        mostrarMensaje('¡Compra realizada! Te contactaremos pronto', 'exito');
        // Vaciar carrito después de compra exitosa
        carritoDeCompras = [];
        localStorage.removeItem('carritoRentfagelu');
        actualizarContadorCarrito();
        mostrarCarritoCompleto();
    }
}

// Función para mostrar mensajes al usuario
function mostrarMensaje(texto, tipo) {
    // Crear elemento del mensaje
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje-carrito ${tipo}`;
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
    }
    
    // Agregar al documento
    document.body.appendChild(mensaje);
    
    // Quitar después de 3 segundos
    setTimeout(() => {
        if (mensaje.parentNode) {
            mensaje.parentNode.removeChild(mensaje);
        }
    }, 3000);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    iniciarCarrito();
    
    // Si estamos en la página del carrito, mostrar contenido y conectar botones
    if (document.getElementById('cart-items')) {
        mostrarCarritoCompleto();
        conectarBotonesCarrito();
    }
});

// Función para conectar botones específicos de la página carrito.html
function conectarBotonesCarrito() {
    // Botón vaciar carrito
    const botonVaciar = document.getElementById('clear-cart');
    if (botonVaciar) {
        botonVaciar.onclick = function() {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                carritoDeCompras = [];
                localStorage.removeItem('carritoRentfagelu');
                actualizarContadorCarrito();
                mostrarCarritoCompleto();
                mostrarMensaje('Carrito vaciado', 'exito');
            }
        };
    }
    
    // Botón seguir comprando
    const botonSeguir = document.getElementById('continue-shopping');
    if (botonSeguir) {
        botonSeguir.onclick = function() {
            window.location.href = 'propiedades.html';
        };
    }
}