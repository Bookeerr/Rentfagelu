// SCRIPT PRINCIPAL - RENTFAGELU
// Archivo creado por estudiantes para proyecto académico

// Variable para guardar el usuario actual
let usuarioLogueado = null;

// Función que se ejecuta cuando se carga cualquier página
function iniciarPaginaPrincipal() {
    verificarUsuarioLogueado();
    configurarBotones();
    actualizarMenuUsuario();
}

// Verificar si hay un usuario que ya inició sesión
function verificarUsuarioLogueado() {
    const sesionGuardada = localStorage.getItem('sesionActualRentfagelu');
    if (sesionGuardada) {
        usuarioLogueado = JSON.parse(sesionGuardada);
    }
}

// Configurar los botones de la página
function configurarBotones() {
    // Botón "Ver propiedades" en la página principal
    const botonVerPropiedades = document.querySelector('.seccion-hero button');
    if (botonVerPropiedades) {
        botonVerPropiedades.addEventListener('click', function() {
            window.location.href = 'propiedades.html';
        });
    }
    
    // Botón de cerrar sesión
    const botonCerrarSesion = document.getElementById('logout-btn');
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener('click', function() {
            cerrarSesionUsuario();
        });
    }
    
    // Enlaces del menú
    configurarEnlacesMenu();
}

// Configurar enlaces del menú de navegación
function configurarEnlacesMenu() {
    // Agregar eventos a los enlaces si es necesario
    const enlacesMenu = document.querySelectorAll('.menu-navegacion a');
    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', function(evento) {
            // Aquí se puede agregar lógica adicional si es necesario
            // Por ejemplo, destacar el enlace activo
            marcarEnlaceActivo(this);
        });
    });
}

// Marcar el enlace activo en el menú
function marcarEnlaceActivo(enlaceClickeado) {
    // Quitar la clase activa de todos los enlaces
    const todosLosEnlaces = document.querySelectorAll('.menu-navegacion a');
    todosLosEnlaces.forEach(enlace => {
        enlace.classList.remove('activo');
    });
    
    // Agregar clase activa al enlace clickeado
    enlaceClickeado.classList.add('activo');
}

// Actualizar el menú según el usuario logueado
function actualizarMenuUsuario() {
    const enlaceLogin = document.getElementById('login-link');
    const enlaceRegistro = document.getElementById('register-link');
    const infoUsuario = document.getElementById('user-info');
    const nombreUsuario = document.getElementById('user-name');
    const enlaceAdmin = document.getElementById('admin-link');
    
    if (usuarioLogueado) {
        // Hay usuario logueado
        if (enlaceLogin) enlaceLogin.style.display = 'none';
        if (enlaceRegistro) enlaceRegistro.style.display = 'none';
        if (infoUsuario) infoUsuario.style.display = 'flex';
        if (nombreUsuario) nombreUsuario.textContent = `¡Hola, ${usuarioLogueado.nombre}!`;
        
        // Mostrar enlace de admin si es administrador
        if (enlaceAdmin && usuarioLogueado.tipo === 'administrador') {
            enlaceAdmin.style.display = 'inline';
        }
    } else {
        // No hay usuario logueado
        if (enlaceLogin) enlaceLogin.style.display = 'inline';
        if (enlaceRegistro) enlaceRegistro.style.display = 'inline';
        if (infoUsuario) infoUsuario.style.display = 'none';
        if (enlaceAdmin) enlaceAdmin.style.display = 'none';
    }
}

// Función para cerrar sesión
function cerrarSesionUsuario() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Limpiar datos guardados
        localStorage.removeItem('sesionActualRentfagelu');
        localStorage.removeItem('carritoRentfagelu');
        
        // Limpiar variable
        usuarioLogueado = null;
        
        // Mostrar mensaje
        mostrarMensajePrincipal('Sesión cerrada correctamente', 'exito');
        
        // Redirigir después de 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Función para ir a los detalles de una propiedad
function verDetallesPropiedad(idPropiedad) {
    window.location.href = `detalle-propiedad.html?id=${idPropiedad}`;
}

// Función para ir al carrito
function irAlCarrito() {
    window.location.href = 'carrito.html';
}

// Función para mostrar mensajes en la página
function mostrarMensajePrincipal(texto, tipo) {
    // Crear elemento del mensaje
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje-principal ${tipo}`;
    mensaje.textContent = texto;
    
    // Estilos del mensaje
    mensaje.style.position = 'fixed';
    mensaje.style.top = '20px';
    mensaje.style.left = '50%';
    mensaje.style.transform = 'translateX(-50%)';
    mensaje.style.padding = '15px 25px';
    mensaje.style.borderRadius = '8px';
    mensaje.style.fontWeight = 'bold';
    mensaje.style.zIndex = '10000';
    mensaje.style.textAlign = 'center';
    
    // Colores según el tipo
    if (tipo === 'exito') {
        mensaje.style.backgroundColor = '#4CAF50';
        mensaje.style.color = 'white';
    } else if (tipo === 'error') {
        mensaje.style.backgroundColor = '#f44336';
        mensaje.style.color = 'white';
    } else if (tipo === 'info') {
        mensaje.style.backgroundColor = '#2196F3';
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

// Función para verificar si el usuario puede acceder a ciertas páginas
function verificarAccesoUsuario(tipoRequerido) {
    if (!usuarioLogueado) {
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = 'login.html';
        return false;
    }
    
    if (tipoRequerido && usuarioLogueado.tipo !== tipoRequerido) {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Función para resaltar elementos cuando el usuario hace hover
function configurarEfectosVisuales() {
    // Efectos para las tarjetas de propiedades
    const tarjetasPropiedades = document.querySelectorAll('.tarjeta-propiedad');
    tarjetasPropiedades.forEach(tarjeta => {
        tarjeta.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        tarjeta.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Efectos para botones
    const botones = document.querySelectorAll('button');
    botones.forEach(boton => {
        boton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        boton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    iniciarPaginaPrincipal();
    configurarEfectosVisuales();
    
    // Verificar si estamos en la página de administración
    if (window.location.pathname.includes('admin.html')) {
        verificarAccesoUsuario('administrador');
    }
});

