// Lista de usuarios registrados (se guarda en el navegador)
let usuariosRegistrados = [];

// Usuario actual que ha iniciado sesión
let usuarioActual = null;

// Función que se ejecuta cuando se carga la página
function iniciarSistemaAuth() {
    cargarUsuariosGuardados();
    crearUsuariosPorDefecto();
    verificarSesionActual();
    conectarFormularios();
}

// Cargar usuarios que están guardados en el navegador
function cargarUsuariosGuardados() {
    const usuariosGuardados = localStorage.getItem('usuariosRentfagelu');
    if (usuariosGuardados) {
        usuariosRegistrados = JSON.parse(usuariosGuardados);
    }
}

// Crear usuarios por defecto el sistema
function crearUsuariosPorDefecto() {
    // Verificar si ya existe el administrador
    const adminExiste = usuariosRegistrados.find(user => user.email === 'admin@rentfagelu.cl');
    
    if (!adminExiste) {
        // Crear usuario administrador
        const usuarioAdmin = {
            nombre: 'Administrador',
            email: 'admin@rentfagelu.cl',
            password: 'admin123',
            tipo: 'administrador'
        };
        usuariosRegistrados.push(usuarioAdmin);
        
        // Crear usuario vendedor
        const usuarioVendedor = {
            nombre: 'Vendedor Demo',
            email: 'vendedor@duoc.cl',
            password: 'vend123',
            tipo: 'vendedor'
        };
        usuariosRegistrados.push(usuarioVendedor);
        
        guardarUsuarios();
    }
    
    // Debug: Mostrar credenciales en consola
    console.log('=== CREDENCIALES DE ADMINISTRADOR ===');
    console.log('Email: admin@rentfagelu.cl');
    console.log('Contraseña: admin123');
    console.log('======================================');
}

// Guardar usuarios en el navegador
function guardarUsuarios() {
    localStorage.setItem('usuariosRentfagelu', JSON.stringify(usuariosRegistrados));
}

// Verificar si hay alguien que ya inició sesión
function verificarSesionActual() {
    const sesionGuardada = localStorage.getItem('sesionActualRentfagelu');
    if (sesionGuardada) {
        usuarioActual = JSON.parse(sesionGuardada);
        console.log('Sesión activa encontrada:', usuarioActual.nombre);
    }
    actualizarInterfazUsuario();
}

// Conectar los formularios de login y registro
function conectarFormularios() {
    // Formulario de registro
    const formRegistro = document.getElementById('formulario-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function(evento) {
            evento.preventDefault();
            procesarRegistro();
        });
    }
    
    // Formulario de login
    const formLogin = document.getElementById('login-form');
    if (formLogin) {
        formLogin.addEventListener('submit', function(evento) {
            evento.preventDefault();
            procesarLogin();
        });
    }
}

// Función para registrar un nuevo usuario
function procesarRegistro() {
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmarPassword = document.getElementById('confirm-password').value;
    
    // Validaciones básicas
    if (!nombre || !email || !password) {
        mostrarMensajeAuth('Todos los campos son obligatorios', 'error');
        return;
    }
    
    if (password !== confirmarPassword) {
        mostrarMensajeAuth('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 4 || password.length > 10) {
        mostrarMensajeAuth('La contraseña debe tener entre 4 y 10 caracteres', 'error');
        return;
    }
    
    // Verificar emails permitidos
    const emailsPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    const emailValido = emailsPermitidos.some(dominio => email.endsWith(dominio));
    
    if (!emailValido) {
        mostrarMensajeAuth('Solo se permiten emails @duoc.cl, @profesor.duoc.cl y @gmail.com', 'error');
        return;
    }
    
    // Verificar si el email ya existe
    const emailExiste = usuariosRegistrados.find(user => user.email === email);
    if (emailExiste) {
        mostrarMensajeAuth('Este email ya está registrado', 'error');
        return;
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
        nombre: nombre,
        email: email,
        password: password,
        tipo: 'cliente' // Por defecto es cliente
    };
    
    // Agregar a la lista
    usuariosRegistrados.push(nuevoUsuario);
    guardarUsuarios();
    
    mostrarMensajeAuth('¡Usuario registrado exitosamente! Redirigiendo al login...', 'exito');
    
    // Limpiar formulario
    document.getElementById('formulario-registro').reset();
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Función para iniciar sesión
function procesarLogin() {
    // Obtener datos del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    console.log('Intentando login con:', { email, password }); // Debug
    console.log('Usuarios registrados:', usuariosRegistrados); // Debug
    
    // Validaciones básicas
    if (!email || !password) {
        mostrarMensajeAuth('Email y contraseña son obligatorios', 'error');
        return;
    }
    
    // Buscar usuario
    const usuario = usuariosRegistrados.find(user => 
        user.email === email && user.password === password
    );
    
    console.log('Usuario encontrado:', usuario); // Debug
    
    if (!usuario) {
        mostrarMensajeAuth('Email o contraseña incorrectos', 'error');
        return;
    }
    
    // Guardar sesión
    usuarioActual = usuario;
    localStorage.setItem('sesionActualRentfagelu', JSON.stringify(usuario));
    
    console.log('Sesión guardada, tipo de usuario:', usuario.tipo); // Debug
    
    mostrarMensajeAuth(`¡Bienvenido ${usuario.nombre}!`, 'exito');
    
    // Redirigir según tipo de usuario
    setTimeout(() => {
        if (usuario.tipo === 'administrador') {
            console.log('Redirigiendo a admin.html'); // Debug
            window.location.href = 'admin.html';
        } else {
            console.log('Redirigiendo a index.html'); // Debug
            window.location.href = 'index.html';
        }
    }, 1500);
}

// Función para cerrar sesión
function cerrarSesion() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        usuarioActual = null;
        localStorage.removeItem('sesionActualRentfagelu');
        
        // Limpiar carrito también
        localStorage.removeItem('carritoRentfagelu');
        
        mostrarMensajeAuth('Sesión cerrada', 'exito');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Actualizar la interfaz según el usuario logueado
function actualizarInterfazUsuario() {
    // Buscar elementos con diferentes posibles IDs
    const linkLogin = document.getElementById('login-link') || document.getElementById('enlace-login');
    const linkRegistro = document.getElementById('register-link') || document.getElementById('enlace-registro');
    const infoUsuario = document.getElementById('user-info') || document.getElementById('info-usuario');
    const nombreUsuario = document.getElementById('user-name') || document.getElementById('nombre-usuario');
    
    if (usuarioActual) {
        // Usuario logueado - ocultar enlaces de login/registro
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkRegistro) linkRegistro.style.display = 'none';
        
        // Mostrar información del usuario
        if (infoUsuario) infoUsuario.style.display = 'flex';
        if (nombreUsuario) nombreUsuario.textContent = `Hola, ${usuarioActual.nombre}`;
        
        // Configurar botón de cerrar sesión
        let botonCerrarSesion = document.getElementById('logout-btn') || document.getElementById('boton-cerrar-sesion');
        if (botonCerrarSesion) {
            botonCerrarSesion.onclick = cerrarSesion;
            botonCerrarSesion.textContent = 'Cerrar Sesión';
        }
        
        console.log('Interfaz actualizada para usuario:', usuarioActual.nombre);
    } else {
        // Usuario no logueado - mostrar enlaces de login/registro
        if (linkLogin) {
            linkLogin.style.display = 'inline';
            linkLogin.textContent = 'Iniciar Sesión';
        }
        if (linkRegistro) {
            linkRegistro.style.display = 'inline';
            linkRegistro.textContent = 'Registrarse';
        }
        if (infoUsuario) infoUsuario.style.display = 'none';
        
        console.log('Interfaz actualizada para usuario no logueado');
    }
}

// Función para mostrar mensajes al usuario
function mostrarMensajeAuth(texto, tipo) {
    // Remover mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-auth');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
    
    // Crear nuevo mensaje
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje-auth ${tipo}`;
    mensaje.textContent = texto;
    
    // Agregar al documento
    document.body.appendChild(mensaje);
    
    // Quitar después de 4 segundos
    setTimeout(() => {
        if (mensaje.parentNode) {
            mensaje.parentNode.removeChild(mensaje);
        }
    }, 4000);
}

// Función para verificar si el usuario puede acceder a admin
function verificarAccesoAdmin() {
    console.log('Verificando acceso admin...'); // Debug
    console.log('Usuario actual:', usuarioActual); // Debug
    
    // Recargar sesión desde localStorage por si acaso
    const sesionGuardada = localStorage.getItem('sesionActualRentfagelu');
    if (sesionGuardada && !usuarioActual) {
        usuarioActual = JSON.parse(sesionGuardada);
        console.log('Sesión recargada:', usuarioActual); // Debug
    }
    
    if (!usuarioActual || usuarioActual.tipo !== 'administrador') {
        console.log('Acceso denegado - Redirigiendo a login'); // Debug
        alert('Acceso denegado. Solo los administradores pueden acceder.');
        window.location.href = 'login.html';
        return false;
    }
    
    console.log('Acceso admin permitido'); // Debug
    return true;
}

// Función para cerrar sesión del admin
function cerrarSesionAdmin() {
    // Limpiar datos de sesión
    localStorage.removeItem('sesionActualRentfagelu');
    usuarioActual = null;
    
    // Mostrar confirmación
    alert('Sesión cerrada correctamente');
    
    // Redirigir al login
    window.location.href = 'login.html';
}

// Inicializar cuando se carga cualquier página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando sistema de autenticación...'); // Debug
    iniciarSistemaAuth();
    
    // Si estamos en admin.html, verificar acceso
    const esAdmin = window.location.pathname.includes('admin.html') || 
                   window.location.href.includes('admin.html');
    
    if (esAdmin) {
        console.log('Detectada página admin, verificando acceso...'); // Debug
        // Dar un momento para que se cargue todo
        setTimeout(() => {
            verificarAccesoAdmin();
        }, 100);
    }
});