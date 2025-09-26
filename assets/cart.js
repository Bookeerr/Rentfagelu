// Sistema de Carrito de Compras
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.updateCartBadge();
    }

    // Agregar propiedad al carrito
    addItem(property) {
        const existingItem = this.items.find(item => item.id === property.id);
        
        if (existingItem) {
            // Si existe, preguntar si quiere actualizar el método de pago
            if (property.paymentType && property.paymentType !== existingItem.paymentType) {
                const paymentTypes = {
                    'cash': 'Pago al contado',
                    'credit': 'Crédito hipotecario',
                    'installments': 'Pago en cuotas'
                };
                
                const currentPayment = paymentTypes[existingItem.paymentType] || 'Pago al contado';
                const newPayment = paymentTypes[property.paymentType] || 'Pago al contado';
                
                if (confirm(`Esta propiedad ya está en el carrito con "${currentPayment}". ¿Desea actualizar a "${newPayment}"?`)) {
                    existingItem.paymentType = property.paymentType;
                }
            }
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: property.id,
                title: property.title,
                price: property.price,
                image: property.image,
                location: property.location,
                paymentType: property.paymentType || 'installments',
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartBadge();
        this.showAddedToCartMessage(property.title);
    }

    // Remover propiedad del carrito
    removeItem(propertyId) {
        this.items = this.items.filter(item => item.id !== propertyId);
        this.saveCart();
        this.updateCartBadge();
        this.renderCart();
    }

    // Actualizar cantidad
    updateQuantity(propertyId, newQuantity) {
        const item = this.items.find(item => item.id === propertyId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(propertyId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartBadge();
                this.renderCart();
            }
        }
    }

    // Obtener total del carrito
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (this.parsePrice(item.price) * item.quantity);
        }, 0);
    }

    // Obtener cantidad total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Parsear precio (convertir texto a número)
    parsePrice(priceText) {
        return parseFloat(priceText.replace(/[^\d.]/g, ''));
    }

    // Formatear precio
    formatPrice(price) {
        return `$${price.toLocaleString('es-CL')}`;
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    // Actualizar badge del carrito en el header
    updateCartBadge() {
        const cartBadge = document.querySelector('.cart-badge');
        const totalItems = this.getTotalItems();
        
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    // Mostrar mensaje de "agregado al carrito"
    showAddedToCartMessage(propertyTitle) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <span class="notification-text">¡${propertyTitle} agregado al carrito!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Ocultar y remover después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Renderizar página del carrito
    renderCart() {
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const emptyMessage = document.getElementById('empty-cart-message');
        
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.style.display = 'none';
            emptyMessage.style.display = 'block';
            cartTotal.textContent = this.formatPrice(0);
            return;
        }

        cartContainer.style.display = 'block';
        emptyMessage.style.display = 'none';

        cartContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-location">📍 ${item.location}</p>
                    <p class="cart-item-price">${item.price}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="cart.removeItem('${item.id}')">🗑️ Eliminar</button>
                </div>
                <div class="cart-item-subtotal">
                    ${this.formatPrice(this.parsePrice(item.price) * item.quantity)}
                </div>
            </div>
        `).join('');

        cartTotal.textContent = this.formatPrice(this.getTotal());
    }

    // Vaciar carrito
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartBadge();
        this.renderCart();
    }

    // Proceder al checkout
    checkout() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        const total = this.getTotal();
        const itemsCount = this.getTotalItems();
        
        if (confirm(`¿Proceder con la compra de ${itemsCount} propiedad(es) por ${this.formatPrice(total)}?`)) {
            // Aquí podrías integrar con un sistema de pagos real
            alert('¡Gracias por tu compra! Te contactaremos pronto para coordinar los detalles.');
            this.clearCart();
        }
    }
}

// Inicializar carrito
const cart = new ShoppingCart();

// Funciones para agregar propiedades al carrito
function addToCart(button) {
    const propertyCard = button.closest('.property-card');
    
    // Obtener la imagen desde el CSS background-image
    const imgContainer = propertyCard.querySelector('.img-container');
    const computedStyle = window.getComputedStyle(imgContainer);
    const backgroundImage = computedStyle.backgroundImage;
    
    // Extraer la URL de la imagen
    let imageUrl = '';
    if (backgroundImage && backgroundImage !== 'none') {
        imageUrl = backgroundImage.slice(4, -1).replace(/["']/g, "");
    }
    
    const property = {
        id: propertyCard.dataset.id || Date.now().toString(),
        title: propertyCard.querySelector('h3').textContent,
        price: propertyCard.querySelector('.price').textContent,
        image: imageUrl,
        location: propertyCard.querySelector('p').textContent,
        paymentType: 'installments' // Método de pago por defecto
    };
    
    cart.addItem(property);
}

// Event listeners para botones de comprar
document.addEventListener('DOMContentLoaded', function() {
    // Agregar event listeners a todos los botones de "Comprar"
    const buyButtons = document.querySelectorAll('.btn-comprar');
    buyButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart(this);
        });
        
        // Asignar ID únicos a las tarjetas si no las tienen
        const card = button.closest('.property-card');
        if (!card.dataset.id) {
            card.dataset.id = `property-${index + 1}`;
        }
    });
});