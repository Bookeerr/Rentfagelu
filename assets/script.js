// Script principal para Rentfagelu

document.addEventListener('DOMContentLoaded', function() {
    // Verificar estado de autenticación
    checkAuthState();
    
    // Configurar eventos
    setupEventListeners();
});

// Verificar estado de autenticación y actualizar UI
function checkAuthState() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const adminLink = document.getElementById('admin-link');
    
    if (currentUser) {
        // Usuario logueado
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (userName) userName.textContent = `¡Hola, ${currentUser.nombre || currentUser.name}!`;
        
        // Mostrar enlace de admin si es administrador
        if (adminLink && currentUser.userType === 'administrador') {
            adminLink.style.display = 'inline';
        }
    } else {
        // Usuario no logueado
        if (loginLink) loginLink.style.display = 'inline';
        if (registerLink) registerLink.style.display = 'inline';
        if (userInfo) userInfo.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // Botón "Ver propiedades" en hero
    const heroButton = document.querySelector('.hero button');
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            window.location.href = 'propiedades.html';
        });
    }
}

// Función de logout
function logout() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rentfagelu_current_user');
        
        // Limpiar carrito si existe
        if (typeof clearCart === 'function') {
            clearCart();
        }
        
        // Recargar página para actualizar UI
        window.location.reload();
    }
}

// Función para navegar a detalles de propiedad
function viewPropertyDetails(propertyId) {
    window.location.href = `detalle-propiedad.html?id=${propertyId}`;
}