// FORMULARIO DE CONTACTO - RENTFAGELU
// Archivo creado por estudiantes para proyecto académico

// Función que se ejecuta cuando se carga la página de contacto
document.addEventListener('DOMContentLoaded', function() {
    const formularioContacto = document.getElementById('formulario-contacto');
    
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que se envíe el formulario
            
            // Mostrar mensaje de éxito como en el carrito
            mostrarMensajeContacto('¡Mensaje enviado exitosamente!', 'exito');
            
            // Limpiar el formulario
            this.reset();
        });
    }
});

// Función para mostrar mensajes al usuario (igual que en carrito.js)
function mostrarMensajeContacto(texto, tipo) {
    // Crear elemento del mensaje
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje-contacto ${tipo}`;
    mensaje.textContent = texto;
    
    // Estilos del mensaje (igual que en el carrito)
    mensaje.style.position = 'fixed';
    mensaje.style.top = '20px';
    mensaje.style.right = '20px';
    mensaje.style.padding = '15px 20px';
    mensaje.style.borderRadius = '8px';
    mensaje.style.fontWeight = 'bold';
    mensaje.style.zIndex = '10000';
    mensaje.style.maxWidth = '300px';
    mensaje.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    // Colores según el tipo (igual que el mensaje del carrito)
    if (tipo === 'exito') {
        mensaje.style.backgroundColor = '#ff9800'; // Color naranja como en la imagen
        mensaje.style.color = 'white';
    } else if (tipo === 'error') {
        mensaje.style.backgroundColor = '#f44336';
        mensaje.style.color = 'white';
    }
    
    // Agregar al documento
    document.body.appendChild(mensaje);
    
    // Quitar después de 3 segundos (igual que el carrito)
    setTimeout(() => {
        if (mensaje.parentNode) {
            mensaje.parentNode.removeChild(mensaje);
        }
    }, 3000);
}