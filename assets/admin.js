// ===============================
// ADMINISTRADOR - JAVASCRIPT
// ===============================

// Variables globales
let currentUser = null;
let properties = [];
let users = [];
let currentEditingProperty = null;
let currentEditingUser = null;

// Datos de regiones y comunas de Chile
const regionsData = {
    "1": {
        name: "Arica y Parinacota",
        communes: ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    "2": {
        name: "Tarapacá", 
        communes: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
    },
    "3": {
        name: "Antofagasta",
        communes: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
    },
    "4": {
        name: "Atacama",
        communes: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
    },
    "5": {
        name: "Coquimbo",
        communes: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
    },
    "13": {
        name: "Metropolitana",
        communes: ["Santiago", "Providencia", "Las Condes", "Vitacura", "Ñuñoa", "La Reina", "Peñalolén", "Macul", "San Joaquín", "La Granja", "La Pintana", "San Ramón", "El Bosque", "Pedro Aguirre Cerda", "Lo Espejo", "Estación Central", "Maipú", "Cerrillos", "Lo Prado", "Pudahuel", "Quilicura", "Renca", "Conchalí", "Huechuraba", "Recoleta", "Independencia", "Quinta Normal", "Cerro Navia"]
    },
    "6": {
        name: "O'Higgins",
        communes: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente"]
    }
};

// ===============================
// INICIALIZACIÓN
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    initializeAdmin();
    loadRegions();
    loadSampleData();
});

// Verificar autenticación de administrador
function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser || currentUser.userType !== 'administrador') {
        alert('Acceso denegado. Solo los administradores pueden acceder a esta sección.');
        window.location.href = 'login.html';
        return;
    }
    
    // Actualizar nombre de usuario en la interfaz
    document.getElementById('admin-user-name').textContent = currentUser.name || 'Administrador';
}

// Inicializar funcionalidad del administrador
function initializeAdmin() {
    // Mostrar sección dashboard por defecto
    showSection('dashboard');
    
    // Cargar datos iniciales
    loadProperties();
    loadUsers();
    
    // Event listeners para formularios
    document.getElementById('property-form').addEventListener('submit', handlePropertySubmit);
    document.getElementById('user-form').addEventListener('submit', handleUserSubmit);
}

// ===============================
// NAVEGACIÓN ENTRE SECCIONES
// ===============================

function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Encontrar y marcar como activo el enlace correspondiente
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`).closest('.nav-item');
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Actualizar título de página
    const titles = {
        'dashboard': '¡HOLA Administrador!',
        'properties': 'Gestión de Propiedades',
        'users': 'Gestión de Usuarios',
        'reports': 'Reportes',
        'settings': 'Configuración'
    };
    
    document.getElementById('page-title').textContent = titles[sectionName] || 'Panel de Administración';
    
    // Cargar datos específicos de la sección
    if (sectionName === 'properties') {
        displayProperties();
    } else if (sectionName === 'users') {
        displayUsers();
    }
}

// ===============================
// GESTIÓN DE PROPIEDADES
// ===============================

function loadProperties() {
    const savedProperties = localStorage.getItem('adminProperties');
    if (savedProperties) {
        properties = JSON.parse(savedProperties);
    } else {
        // Datos de ejemplo
        properties = [
            {
                id: 'PROP001',
                code: 'PROP001',
                name: 'Condominio Quillayes de Chicureo',
                description: 'Hermosa casa en condominio cerrado',
                price: 450000,
                stock: 1,
                criticalStock: 0,
                category: 'casa',
                image: null
            },
            {
                id: 'PROP002',
                code: 'PROP002',
                name: 'Casa Borde Blanco',
                description: 'Elegante propiedad en sector exclusivo',
                price: 650000,
                stock: 1,
                criticalStock: 0,
                category: 'casa',
                image: null
            }
        ];
        localStorage.setItem('adminProperties', JSON.stringify(properties));
    }
}

function displayProperties() {
    const propertyList = document.getElementById('property-list');
    
    if (properties.length === 0) {
        propertyList.innerHTML = '<p>No hay propiedades registradas.</p>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    properties.forEach(property => {
        const stockWarning = property.criticalStock && property.stock <= property.criticalStock ? 'style="color: red; font-weight: bold;"' : '';
        
        html += `
            <tr>
                <td>${property.code}</td>
                <td>${property.name}</td>
                <td>${property.category}</td>
                <td>$${property.price.toLocaleString()}</td>
                <td ${stockWarning}>${property.stock}</td>
                <td>
                    <button onclick="editProperty('${property.id}')" class="btn-secondary" style="margin-right: 5px;">Editar</button>
                    <button onclick="deleteProperty('${property.id}')" class="btn-secondary" style="background: #e74c3c;">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    propertyList.innerHTML = html;
}

function showPropertyForm() {
    currentEditingProperty = null;
    document.getElementById('property-form-title').textContent = 'Nueva Propiedad';
    document.getElementById('property-form').reset();
    clearPropertyErrors();
    document.getElementById('property-form-modal').style.display = 'flex';
}

function editProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    currentEditingProperty = property;
    document.getElementById('property-form-title').textContent = 'Editar Propiedad';
    
    // Llenar el formulario con los datos de la propiedad
    document.getElementById('property-code').value = property.code;
    document.getElementById('property-name').value = property.name;
    document.getElementById('property-description').value = property.description || '';
    document.getElementById('property-price').value = property.price;
    document.getElementById('property-stock').value = property.stock;
    document.getElementById('property-critical-stock').value = property.criticalStock || '';
    document.getElementById('property-category').value = property.category;
    
    clearPropertyErrors();
    document.getElementById('property-form-modal').style.display = 'flex';
}

function deleteProperty(propertyId) {
    if (confirm('¿Está seguro de que desea eliminar esta propiedad?')) {
        properties = properties.filter(p => p.id !== propertyId);
        localStorage.setItem('adminProperties', JSON.stringify(properties));
        displayProperties();
        updateDashboardStats();
    }
}

function closePropertyForm() {
    document.getElementById('property-form-modal').style.display = 'none';
    currentEditingProperty = null;
}

function handlePropertySubmit(e) {
    e.preventDefault();
    
    if (validatePropertyForm()) {
        const formData = new FormData(e.target);
        const propertyData = {
            id: currentEditingProperty ? currentEditingProperty.id : 'PROP' + Date.now(),
            code: formData.get('code'),
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            criticalStock: formData.get('criticalStock') ? parseInt(formData.get('criticalStock')) : null,
            category: formData.get('category'),
            image: null // Por ahora no manejamos imágenes
        };
        
        if (currentEditingProperty) {
            // Editar propiedad existente
            const index = properties.findIndex(p => p.id === currentEditingProperty.id);
            properties[index] = propertyData;
        } else {
            // Agregar nueva propiedad
            properties.push(propertyData);
        }
        
        localStorage.setItem('adminProperties', JSON.stringify(properties));
        displayProperties();
        updateDashboardStats();
        closePropertyForm();
    }
}

function validatePropertyForm() {
    let isValid = true;
    clearPropertyErrors();
    
    // Validar código
    const code = document.getElementById('property-code').value.trim();
    if (!code || code.length < 3) {
        showPropertyError('code-error', 'El código es requerido y debe tener al menos 3 caracteres');
        isValid = false;
    }
    
    // Validar nombre
    const name = document.getElementById('property-name').value.trim();
    if (!name) {
        showPropertyError('name-error', 'El nombre es requerido');
        isValid = false;
    } else if (name.length > 100) {
        showPropertyError('name-error', 'El nombre no puede exceder 100 caracteres');
        isValid = false;
    }
    
    // Validar descripción
    const description = document.getElementById('property-description').value.trim();
    if (description && description.length > 500) {
        showPropertyError('description-error', 'La descripción no puede exceder 500 caracteres');
        isValid = false;
    }
    
    // Validar precio
    const price = parseFloat(document.getElementById('property-price').value);
    if (isNaN(price) || price < 0) {
        showPropertyError('price-error', 'El precio debe ser un número mayor o igual a 0');
        isValid = false;
    }
    
    // Validar stock
    const stock = parseInt(document.getElementById('property-stock').value);
    if (isNaN(stock) || stock < 0) {
        showPropertyError('stock-error', 'El stock debe ser un número entero mayor o igual a 0');
        isValid = false;
    }
    
    // Validar stock crítico
    const criticalStock = document.getElementById('property-critical-stock').value;
    if (criticalStock && (isNaN(parseInt(criticalStock)) || parseInt(criticalStock) < 0)) {
        showPropertyError('critical-stock-error', 'El stock crítico debe ser un número entero mayor o igual a 0');
        isValid = false;
    }
    
    // Validar categoría
    const category = document.getElementById('property-category').value;
    if (!category) {
        showPropertyError('category-error', 'La categoría es requerida');
        isValid = false;
    }
    
    return isValid;
}

function clearPropertyErrors() {
    document.querySelectorAll('#property-form .error-message').forEach(error => {
        error.textContent = '';
    });
}

function showPropertyError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

// ===============================
// GESTIÓN DE USUARIOS
// ===============================

function loadUsers() {
    const savedUsers = localStorage.getItem('adminUsers');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Datos de ejemplo
        users = [
            {
                id: 'USER001',
                run: '19011022K',
                name: 'Juan',
                lastname: 'Pérez González',
                email: 'juan.perez@gmail.com',
                birthdate: '1990-01-10',
                userType: 'cliente',
                region: '13',
                commune: 'Santiago',
                address: 'Av. Libertador 1234'
            }
        ];
        localStorage.setItem('adminUsers', JSON.stringify(users));
    }
}

function displayUsers() {
    const userList = document.getElementById('user-list');
    
    if (users.length === 0) {
        userList.innerHTML = '<p>No hay usuarios registrados.</p>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>RUN</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    users.forEach(user => {
        html += `
            <tr>
                <td>${user.run}</td>
                <td>${user.name} ${user.lastname}</td>
                <td>${user.email}</td>
                <td>${user.userType}</td>
                <td>Activo</td>
                <td>
                    <button onclick="editUser('${user.id}')" class="btn-secondary" style="margin-right: 5px;">Editar</button>
                    <button onclick="deleteUser('${user.id}')" class="btn-secondary" style="background: #e74c3c;">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    userList.innerHTML = html;
}

function showUserForm() {
    currentEditingUser = null;
    document.getElementById('user-form-title').textContent = 'Nuevo Usuario';
    document.getElementById('user-form').reset();
    clearUserErrors();
    document.getElementById('user-form-modal').style.display = 'flex';
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentEditingUser = user;
    document.getElementById('user-form-title').textContent = 'Editar Usuario';
    
    // Llenar el formulario con los datos del usuario
    document.getElementById('user-run').value = user.run;
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-lastname').value = user.lastname;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-birthdate').value = user.birthdate || '';
    document.getElementById('user-type').value = user.userType;
    document.getElementById('user-region').value = user.region || '';
    document.getElementById('user-address').value = user.address;
    
    // Cargar comunas si hay región seleccionada
    if (user.region) {
        loadCommunesByRegion();
        setTimeout(() => {
            document.getElementById('user-commune').value = user.commune || '';
        }, 100);
    }
    
    clearUserErrors();
    document.getElementById('user-form-modal').style.display = 'flex';
}

function deleteUser(userId) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('adminUsers', JSON.stringify(users));
        displayUsers();
        updateDashboardStats();
    }
}

function closeUserForm() {
    document.getElementById('user-form-modal').style.display = 'none';
    currentEditingUser = null;
}

function handleUserSubmit(e) {
    e.preventDefault();
    
    if (validateUserForm()) {
        const formData = new FormData(e.target);
        const userData = {
            id: currentEditingUser ? currentEditingUser.id : 'USER' + Date.now(),
            run: formData.get('run'),
            name: formData.get('name'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            birthdate: formData.get('birthdate'),
            userType: formData.get('userType'),
            region: formData.get('region'),
            commune: formData.get('commune'),
            address: formData.get('address')
        };
        
        if (currentEditingUser) {
            // Editar usuario existente
            const index = users.findIndex(u => u.id === currentEditingUser.id);
            users[index] = userData;
        } else {
            // Agregar nuevo usuario
            users.push(userData);
        }
        
        localStorage.setItem('adminUsers', JSON.stringify(users));
        displayUsers();
        updateDashboardStats();
        closeUserForm();
    }
}

function validateUserForm() {
    let isValid = true;
    clearUserErrors();
    
    // Validar RUN
    const run = document.getElementById('user-run').value.trim();
    if (!run) {
        showUserError('run-error', 'El RUN es requerido');
        isValid = false;
    } else if (run.length < 7 || run.length > 9) {
        showUserError('run-error', 'El RUN debe tener entre 7 y 9 caracteres');
        isValid = false;
    } else if (!validateRun(run)) {
        showUserError('run-error', 'El RUN no es válido');
        isValid = false;
    }
    
    // Validar nombre
    const name = document.getElementById('user-name').value.trim();
    if (!name) {
        showUserError('user-name-error', 'El nombre es requerido');
        isValid = false;
    } else if (name.length > 50) {
        showUserError('user-name-error', 'El nombre no puede exceder 50 caracteres');
        isValid = false;
    }
    
    // Validar apellidos
    const lastname = document.getElementById('user-lastname').value.trim();
    if (!lastname) {
        showUserError('lastname-error', 'Los apellidos son requeridos');
        isValid = false;
    } else if (lastname.length > 100) {
        showUserError('lastname-error', 'Los apellidos no pueden exceder 100 caracteres');
        isValid = false;
    }
    
    // Validar email
    const email = document.getElementById('user-email').value.trim();
    if (!email) {
        showUserError('email-error', 'El correo es requerido');
        isValid = false;
    } else if (email.length > 100) {
        showUserError('email-error', 'El correo no puede exceder 100 caracteres');
        isValid = false;
    } else if (!validateEmail(email)) {
        showUserError('email-error', 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com');
        isValid = false;
    }
    
    // Validar tipo de usuario
    const userType = document.getElementById('user-type').value;
    if (!userType) {
        showUserError('user-type-error', 'El tipo de usuario es requerido');
        isValid = false;
    }
    
    // Validar dirección
    const address = document.getElementById('user-address').value.trim();
    if (!address) {
        showUserError('address-error', 'La dirección es requerida');
        isValid = false;
    } else if (address.length > 300) {
        showUserError('address-error', 'La dirección no puede exceder 300 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function clearUserErrors() {
    document.querySelectorAll('#user-form .error-message').forEach(error => {
        error.textContent = '';
    });
}

function showUserError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

// ===============================
// VALIDACIONES
// ===============================

function validateRun(run) {
    // Algoritmo validador de RUN chileno
    const cleanRun = run.toUpperCase().replace(/[^0-9K]/g, '');
    if (cleanRun.length < 8) return false;
    
    const body = cleanRun.slice(0, -1);
    const verifier = cleanRun.slice(-1);
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const expectedVerifier = 11 - (sum % 11);
    const finalVerifier = expectedVerifier === 11 ? '0' : expectedVerifier === 10 ? 'K' : expectedVerifier.toString();
    
    return verifier === finalVerifier;
}

function validateEmail(email) {
    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return allowedDomains.some(domain => email.endsWith(domain));
}

// ===============================
// REGIONES Y COMUNAS
// ===============================

function loadRegions() {
    const regionSelect = document.getElementById('user-region');
    regionSelect.innerHTML = '<option value="">Seleccionar región</option>';
    
    Object.keys(regionsData).forEach(regionId => {
        const option = document.createElement('option');
        option.value = regionId;
        option.textContent = regionsData[regionId].name;
        regionSelect.appendChild(option);
    });
}

function loadCommunesByRegion() {
    const regionId = document.getElementById('user-region').value;
    const communeSelect = document.getElementById('user-commune');
    
    communeSelect.innerHTML = '<option value="">Seleccionar comuna</option>';
    
    if (regionId && regionsData[regionId]) {
        regionsData[regionId].communes.forEach(commune => {
            const option = document.createElement('option');
            option.value = commune;
            option.textContent = commune;
            communeSelect.appendChild(option);
        });
    }
}

// ===============================
// DASHBOARD Y ESTADÍSTICAS
// ===============================

function updateDashboardStats() {
    document.getElementById('total-properties').textContent = properties.length;
    document.getElementById('total-users').textContent = users.length;
}

function loadSampleData() {
    updateDashboardStats();
}

// ===============================
// UTILIDADES
// ===============================

function logout() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}