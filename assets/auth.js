// Sistema de autenticación para Rentfagelu
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.initializeDefaultUsers();
        this.init();
    }

    // Cargar usuarios desde localStorage
    loadUsers() {
        const users = localStorage.getItem('rentfagelu_users');
        return users ? JSON.parse(users) : [];
    }

    // Guardar usuarios en localStorage
    saveUsers() {
        localStorage.setItem('rentfagelu_users', JSON.stringify(this.users));
    }

    // Inicializar usuarios por defecto
    initializeDefaultUsers() {
        // Crear usuario administrador por defecto si no existe
        const adminExists = this.users.find(user => user.email === 'admin@rentfagelu.cl');
        if (!adminExists) {
            const adminUser = {
                id: 'admin-001',
                nombre: 'Administrador',
                email: 'admin@rentfagelu.cl',
                password: 'admin123',
                userType: 'administrador',
                fechaRegistro: new Date().toISOString()
            };
            this.users.push(adminUser);
        }
        
        // Crear vendedor por defecto si no existe
        const vendorExists = this.users.find(user => user.email === 'vendedor@duoc.cl');
        if (!vendorExists) {
            const vendorUser = {
                id: 'vendor-001',
                nombre: 'Vendedor Demo',
                email: 'vendedor@duoc.cl',
                password: 'vend123',
                userType: 'vendedor',
                fechaRegistro: new Date().toISOString()
            };
            this.users.push(vendorUser);
        }
        
        this.saveUsers();
    }

    // Validar email con dominios específicos
    isValidEmail(email) {
        const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com', '@rentfagelu.cl'];
        return allowedDomains.some(domain => email.endsWith(domain));
    }

    // Validar contraseña (entre 4 y 10 caracteres)
    isValidPassword(password) {
        return password.length >= 4 && password.length <= 10;
    }

    // Verificar si el email ya existe
    emailExists(email) {
        return this.users.some(user => user.email === email);
    }

    // Registrar nuevo usuario
    register(nombre, email, password) {
        // Validaciones
        if (!nombre.trim()) {
            return { success: false, message: 'El nombre es requerido' };
        }

        if (!this.isValidEmail(email)) {
            return { success: false, message: 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com' };
        }

        if (!this.isValidPassword(password)) {
            return { success: false, message: 'La contraseña debe tener entre 4 y 10 caracteres' };
        }

        if (this.emailExists(email)) {
            return { success: false, message: 'Este email ya está registrado' };
        }

        // Crear nuevo usuario (por defecto como cliente)
        const newUser = {
            id: Date.now(),
            nombre: nombre.trim(),
            email: email.toLowerCase(),
            password: password,
            userType: 'cliente', // Por defecto los registros son clientes
            fechaRegistro: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        return { success: true, message: 'Usuario registrado exitosamente', user: newUser };
    }

    // Iniciar sesión
    login(email, password) {
        if (!this.isValidEmail(email)) {
            return { success: false, message: 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com' };
        }

        if (!this.isValidPassword(password)) {
            return { success: false, message: 'La contraseña debe tener entre 4 y 10 caracteres' };
        }

        const user = this.users.find(u => u.email === email.toLowerCase() && u.password === password);

        if (user) {
            // Guardar sesión actual
            localStorage.setItem('rentfagelu_current_user', JSON.stringify(user));
            localStorage.setItem('currentUser', JSON.stringify(user)); // Para compatibilidad
            return { success: true, message: 'Sesión iniciada correctamente', user: user };
        }

        return { success: false, message: 'Email o contraseña incorrectos' };
    }

    // Obtener usuario actual
    getCurrentUser() {
        const currentUser = localStorage.getItem('rentfagelu_current_user');
        return currentUser ? JSON.parse(currentUser) : null;
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem('rentfagelu_current_user');
        localStorage.removeItem('currentUser'); // Para compatibilidad
    }

    // Verificar si está logueado
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Mostrar mensaje
    showMessage(message, type = 'info') {
        // Remover mensaje anterior si existe
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Crear nuevo mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        
        // Estilos del mensaje
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;

        // Colores según tipo
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#10b981';
            messageDiv.style.color = '#ffffff';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#ef4444';
            messageDiv.style.color = '#ffffff';
        } else {
            messageDiv.style.backgroundColor = '#3b82f6';
            messageDiv.style.color = '#ffffff';
        }

        document.body.appendChild(messageDiv);

        // Remover después de 4 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    // Inicializar eventos
    init() {
        // Esperar a que el DOM esté cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    // Bindear eventos a los formularios
    bindEvents() {
        // Formulario de registro
        const registerForm = document.querySelector('#register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Formulario de login
        const loginForm = document.querySelector('#login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Verificar si está logueado y actualizar UI
        this.updateUI();
    }

    // Manejar registro
    handleRegister(e) {
        e.preventDefault();
        
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const result = this.register(nombre, email, password);

        if (result.success) {
            this.showMessage(result.message, 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    // Manejar login
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const result = this.login(email, password);

        if (result.success) {
            this.showMessage(`¡Bienvenido, ${result.user.nombre}!`, 'success');
            setTimeout(() => {
                // Redirigir según el tipo de usuario
                if (result.user.userType === 'administrador') {
                    window.location.href = 'admin.html';
                } else if (result.user.userType === 'vendedor') {
                    // Por ahora redirige al index, luego se puede crear una vista específica
                    window.location.href = 'index.html';
                } else {
                    // Cliente
                    window.location.href = 'index.html';
                }
            }, 1500);
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    // Actualizar UI basado en estado de login
    updateUI() {
        const currentUser = this.getCurrentUser();
        const userActions = document.querySelector('.user-actions');
        
        if (userActions && currentUser) {
            let adminLink = '';
            if (currentUser.userType === 'administrador') {
                adminLink = `<a href="admin.html">Admin Panel</a> | `;
            }
            
            userActions.innerHTML = `
                ${adminLink}
                <span>¡Hola, ${currentUser.nombre}!</span> | 
                <a href="#" onclick="authSystem.logout(); window.location.reload();">Cerrar sesión</a>
            `;
        }
    }
}

// Funciones legacy para compatibilidad
function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (!name || !email || !password || !confirmPassword) {
        alert('Todos los campos son obligatorios');
        return;
    }

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const result = authSystem.register(name, email, password);
    
    if (result.success) {
        alert(result.message);
        window.location.href = 'login.html';
    } else {
        alert(result.message);
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Todos los campos son obligatorios');
        return;
    }

    const result = authSystem.login(email, password);
    
    if (result.success) {
        alert('Bienvenido ' + result.user.nombre);
        
        // Redirigir según el tipo de usuario
        if (result.user.userType === 'administrador') {
            window.location.href = 'admin.html';
        } else if (result.user.userType === 'vendedor') {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        alert(result.message);
    }
}

// Inicializar el sistema de autenticación
const authSystem = new AuthSystem();