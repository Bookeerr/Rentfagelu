// PANEL DE ADMINISTRACIÓN - RENTFAGELU
// Archivo creado por estudiantes para proyecto académico

// Variables globales para guardar datos
let listaPropiedades = [];
let listaUsuarios = [];
let usuarioAdmin = null;

// Función que se ejecuta cuando se carga la página de admin
function iniciarPanelAdmin() {
    verificarAccesoAdmin();
    cargarDatosGuardados();
    configurarEventosAdmin();
    mostrarSeccion('dashboard');
    actualizarEstadisticas();
}

// Verificar que solo administradores pueden entrar
function verificarAccesoAdmin() {
    const sesionActual = localStorage.getItem('sesionActualRentfagelu');
    if (!sesionActual) {
        alert('Debes iniciar sesión para acceder');
        window.location.href = 'login.html';
        return;
    }
    
    const usuario = JSON.parse(sesionActual);
    if (usuario.tipo !== 'administrador') {
        alert('Solo los administradores pueden acceder a esta página');
        window.location.href = 'index.html';
        return;
    }
    
    usuarioAdmin = usuario;
    document.getElementById('admin-user-name').textContent = usuario.nombre;
}

// Cargar datos guardados en el navegador
function cargarDatosGuardados() {
    // Cargar propiedades
    const propiedadesGuardadas = localStorage.getItem('propiedadesAdmin');
    if (propiedadesGuardadas) {
        listaPropiedades = JSON.parse(propiedadesGuardadas);
    } else {
        // Crear propiedades de ejemplo
        listaPropiedades = [
            {
                id: 1,
                nombre: 'Casa en Las Condes',
                precio: 120000000,
                ubicacion: 'Las Condes, Santiago',
                habitaciones: 3,
                banos: 2,
                metros: 120
            },
            {
                id: 2,
                nombre: 'Departamento en Providencia',
                precio: 95000000,
                ubicacion: 'Providencia, Santiago',
                habitaciones: 2,
                banos: 1,
                metros: 80
            }
        ];
        guardarPropiedades();
    }
    
    // Cargar usuarios
    const usuariosGuardados = localStorage.getItem('usuariosAdmin');
    if (usuariosGuardados) {
        listaUsuarios = JSON.parse(usuariosGuardados);
    } else {
        // Crear usuarios de ejemplo
        listaUsuarios = [
            {
                id: 1,
                nombre: 'Juan Pérez',
                email: 'juan@gmail.com',
                tipo: 'cliente'
            },
            {
                id: 2,
                nombre: 'María González',
                email: 'maria@duoc.cl',
                tipo: 'cliente'
            }
        ];
        guardarUsuarios();
    }
}

// Guardar propiedades en el navegador
function guardarPropiedades() {
    localStorage.setItem('propiedadesAdmin', JSON.stringify(listaPropiedades));
}

// Guardar usuarios en el navegador
function guardarUsuarios() {
    localStorage.setItem('usuariosAdmin', JSON.stringify(listaUsuarios));
}

// Configurar botones y eventos
function configurarEventosAdmin() {
    // Botones del menú lateral
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const seccion = this.dataset.seccion;
            if (seccion) {
                mostrarSeccion(seccion);
            }
        });
    });
    
    // Botón de cerrar sesión
    document.getElementById('logout-admin').addEventListener('click', function() {
        cerrarSesionAdmin();
    });
}

// Mostrar una sección específica del panel
function mostrarSeccion(nombreSeccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(seccion => {
        seccion.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(nombreSeccion + '-section').classList.add('active');
    
    // Actualizar menú activo
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const itemActivo = document.querySelector(`[data-seccion="${nombreSeccion}"]`);
    if (itemActivo) {
        itemActivo.classList.add('active');
    }
    
    // Cargar contenido según la sección
    if (nombreSeccion === 'properties') {
        mostrarListaPropiedades();
    } else if (nombreSeccion === 'users') {
        mostrarListaUsuarios();
    }
}

// Mostrar lista de propiedades
function mostrarListaPropiedades() {
    const contenedor = document.getElementById('property-list');
    
    if (listaPropiedades.length === 0) {
        contenedor.innerHTML = '<p>No hay propiedades registradas.</p>';
        return;
    }
    
    let html = '<table><tr><th>Nombre</th><th>Precio</th><th>Ubicación</th><th>Acciones</th></tr>';
    
    listaPropiedades.forEach(propiedad => {
        html += `
            <tr>
                <td>${propiedad.nombre}</td>
                <td>$${propiedad.precio.toLocaleString()}</td>
                <td>${propiedad.ubicacion}</td>
                <td>
                    <button onclick="editarPropiedad(${propiedad.id})">Editar</button>
                    <button onclick="eliminarPropiedad(${propiedad.id})" style="background: #e74c3c;">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    html += '</table>';
    contenedor.innerHTML = html;
}

// Mostrar lista de usuarios
function mostrarListaUsuarios() {
    const contenedor = document.getElementById('user-list');
    
    if (listaUsuarios.length === 0) {
        contenedor.innerHTML = '<p>No hay usuarios registrados.</p>';
        return;
    }
    
    let html = '<table><tr><th>Nombre</th><th>Email</th><th>Tipo</th><th>Acciones</th></tr>';
    
    listaUsuarios.forEach(usuario => {
        html += `
            <tr>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>${usuario.tipo}</td>
                <td>
                    <button onclick="editarUsuario(${usuario.id})">Editar</button>
                    <button onclick="eliminarUsuario(${usuario.id})" style="background: #e74c3c;">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    html += '</table>';
    contenedor.innerHTML = html;
}

// Agregar nueva propiedad
function agregarPropiedad() {
    const nombre = prompt('Nombre de la propiedad:');
    const precio = prompt('Precio:');
    const ubicacion = prompt('Ubicación:');
    
    if (nombre && precio && ubicacion) {
        const nuevaPropiedad = {
            id: Date.now(),
            nombre: nombre,
            precio: parseInt(precio),
            ubicacion: ubicacion,
            habitaciones: 2,
            banos: 1,
            metros: 80
        };
        
        listaPropiedades.push(nuevaPropiedad);
        guardarPropiedades();
        mostrarListaPropiedades();
        actualizarEstadisticas();
        
        alert('Propiedad agregada exitosamente');
    }
}

// Editar propiedad existente
function editarPropiedad(id) {
    const propiedad = listaPropiedades.find(p => p.id === id);
    if (!propiedad) return;
    
    const nuevoNombre = prompt('Nombre:', propiedad.nombre);
    const nuevoPrecio = prompt('Precio:', propiedad.precio);
    const nuevaUbicacion = prompt('Ubicación:', propiedad.ubicacion);
    
    if (nuevoNombre && nuevoPrecio && nuevaUbicacion) {
        propiedad.nombre = nuevoNombre;
        propiedad.precio = parseInt(nuevoPrecio);
        propiedad.ubicacion = nuevaUbicacion;
        
        guardarPropiedades();
        mostrarListaPropiedades();
        
        alert('Propiedad actualizada exitosamente');
    }
}

// Eliminar propiedad
function eliminarPropiedad(id) {
    if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
        listaPropiedades = listaPropiedades.filter(p => p.id !== id);
        guardarPropiedades();
        mostrarListaPropiedades();
        actualizarEstadisticas();
        
        alert('Propiedad eliminada');
    }
}

// Agregar nuevo usuario
function agregarUsuario() {
    const nombre = prompt('Nombre del usuario:');
    const email = prompt('Email:');
    const tipo = prompt('Tipo (cliente/vendedor/administrador):') || 'cliente';
    
    if (nombre && email) {
        const nuevoUsuario = {
            id: Date.now(),
            nombre: nombre,
            email: email,
            tipo: tipo
        };
        
        listaUsuarios.push(nuevoUsuario);
        guardarUsuarios();
        mostrarListaUsuarios();
        actualizarEstadisticas();
        
        alert('Usuario agregado exitosamente');
    }
}

// Editar usuario existente
function editarUsuario(id) {
    const usuario = listaUsuarios.find(u => u.id === id);
    if (!usuario) return;
    
    const nuevoNombre = prompt('Nombre:', usuario.nombre);
    const nuevoEmail = prompt('Email:', usuario.email);
    const nuevoTipo = prompt('Tipo (cliente/vendedor/administrador):', usuario.tipo);
    
    if (nuevoNombre && nuevoEmail && nuevoTipo) {
        usuario.nombre = nuevoNombre;
        usuario.email = nuevoEmail;
        usuario.tipo = nuevoTipo;
        
        guardarUsuarios();
        mostrarListaUsuarios();
        
        alert('Usuario actualizado exitosamente');
    }
}

// Eliminar usuario
function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        listaUsuarios = listaUsuarios.filter(u => u.id !== id);
        guardarUsuarios();
        mostrarListaUsuarios();
        actualizarEstadisticas();
        
        alert('Usuario eliminado');
    }
}

// Actualizar estadísticas del dashboard
function actualizarEstadisticas() {
    document.getElementById('total-properties').textContent = listaPropiedades.length;
    document.getElementById('total-users').textContent = listaUsuarios.length;
}

// Cerrar sesión del administrador
function cerrarSesionAdmin() {
    if (confirm('¿Cerrar sesión de administrador?')) {
        localStorage.removeItem('sesionActualRentfagelu');
        window.location.href = 'index.html';
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    iniciarPanelAdmin();
});