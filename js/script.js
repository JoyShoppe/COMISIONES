        // Abrir y cerrar menú lateral
        const menuBtn = document.getElementById('menu-btn');
        const sideMenu = document.getElementById('side-menu');
        const closeMenu = document.getElementById('close-menu');

        menuBtn.addEventListener('click', () => {
        sideMenu.classList.remove('translate-x-full');
        });

        closeMenu.addEventListener('click', () => {
        sideMenu.classList.add('translate-x-full');
        });

        // Cerrar menú al hacer clic en un elemento del menú
        document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            sideMenu.classList.add('translate-x-full');
            
            // Resaltar categoría seleccionada
            const category = item.dataset.category;
            highlightCategory(category);
        });
        });

        // Funcionalidad para las imágenes de miniatura
        document.querySelectorAll('.thumb-img').forEach(img => {
        img.addEventListener('click', () => {
            // Obtener el target (id de la imagen principal)
            const targetId = img.dataset.target;
            const mainImg = document.getElementById(targetId);
            
            if (mainImg) {
            // Cambiar la imagen principal
            mainImg.src = img.src;
            
            // Resaltar la miniatura seleccionada
            const thumbsInSameGroup = document.querySelectorAll(`[data-target="${targetId}"]`);
            thumbsInSameGroup.forEach(thumb => {
                thumb.classList.remove('active');
            });
            img.classList.add('active');
            }
        });
        });

        // Modal de imagen - actualizado para incluir imágenes de reseñas
        const imageModal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        const modalClose = document.getElementById('modal-close');
        const modalPrev = document.getElementById('modal-prev');
        const modalNext = document.getElementById('modal-next');

        let currentProductImages = [];
        let currentImageIndex = 0;

        // Abrir modal al hacer clic en la imagen principal o en imágenes de reseñas
        document.querySelectorAll('.zoomable').forEach(img => {
        img.addEventListener('click', () => {
            // Guardar referencia a las imágenes actuales
            let product, images;
            
            // Verificar si es una imagen de reseña
            if (img.classList.contains('review-img')) {
            const reviewId = img.dataset.reviewId;
            
            // Para imágenes de reseñas, solo mostrar esa imagen específica
            currentProductImages = [img.src];
            currentImageIndex = 0;
            
            // Configurar botones de navegación
            modalPrev.style.display = 'none';
            modalNext.style.display = 'none';
            } else {
            // Es una imagen de producto normal
            product = img.closest('.producto');
            currentProductImages = Array.from(product.querySelectorAll('.thumb-img')).map(thumb => thumb.src);
            
            // Si no hay miniaturas, usar solo la imagen principal
            if (currentProductImages.length === 0) {
                currentProductImages = [img.src];
            }
            
            // Encontrar el índice de la imagen actual
            currentImageIndex = currentProductImages.indexOf(img.src);
            if (currentImageIndex === -1) currentImageIndex = 0;
            
            // Mostrar botones de navegación si hay más de una imagen
            modalPrev.style.display = currentProductImages.length > 1 ? 'flex' : 'none';
            modalNext.style.display = currentProductImages.length > 1 ? 'flex' : 'none';
            }
            
            // Mostrar la imagen en el modal
            modalImg.src = img.src;
            
            // Establecer un tamaño uniforme para todas las imágenes del modal
            modalImg.style.width = 'auto';
            modalImg.style.height = 'auto';
            modalImg.style.maxWidth = '100%';
            modalImg.style.maxHeight = '70vh'; // Altura máxima para mantener proporción
            modalImg.style.objectFit = 'contain'; // Mantener proporción de aspecto
            
            imageModal.classList.remove('hidden');
        });
        });

        // Implementar animación para imágenes de reseñas
        document.querySelectorAll('.review-img').forEach(img => {
        img.addEventListener('mouseover', () => {
            img.classList.add('review-img-hover');
        });
        
        img.addEventListener('mouseout', () => {
            img.classList.remove('review-img-hover');
        });
        });

        // Cerrar modal
        modalClose.addEventListener('click', () => {
        imageModal.classList.add('hidden');
        });

        // También cerrar modal al hacer clic fuera de la imagen
        imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.add('hidden');
        }
        });

        // Navegación en el modal
        modalPrev.addEventListener('click', () => {
        if (currentProductImages.length <= 1) return;
        
        currentImageIndex = (currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
        modalImg.src = currentProductImages[currentImageIndex];
        });

        modalNext.addEventListener('click', () => {
        if (currentProductImages.length <= 1) return;
        
        currentImageIndex = (currentImageIndex + 1) % currentProductImages.length;
        modalImg.src = currentProductImages[currentImageIndex];
        });

        // Selección de tallas
        document.querySelectorAll('.size-button').forEach(button => {
        button.addEventListener('click', () => {
            // Quitar la clase active de todos los botones en el mismo grupo
            const sizeButtons = button.parentElement.querySelectorAll('.size-button');
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir la clase active al botón seleccionado
            button.classList.add('active');
        });
        });

        // Selección de colores
        document.querySelectorAll('.color-box').forEach(colorBox => {
        colorBox.addEventListener('click', () => {
            // Quitar la clase selected de todos los colores en el mismo grupo
            const colorBoxes = colorBox.parentElement.querySelectorAll('.color-box');
            colorBoxes.forEach(box => box.classList.remove('selected'));
            
            // Añadir la clase selected al color seleccionado
            colorBox.classList.add('selected');
        });
        });

        // Función para resaltar la categoría seleccionada
        function highlightCategory(category) {
        // Quitar resaltado de todas las categorías
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('category-active');
        });
        
        // Resaltar la categoría seleccionada
        const categoryCard = document.querySelector(`.category-card[data-category="${category}"]`);
        if (categoryCard) {
            categoryCard.classList.add('category-active');
        }
        
        // Hacer scroll a la sección de la categoría
        const categorySection = document.getElementById(category);
        if (categorySection) {
            categorySection.scrollIntoView({ behavior: 'smooth' });
        }
        }

        // Evento para las tarjetas de categorías
        document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            highlightCategory(category);
        });
        });

        // Animación de productos añadidos al carrito
        function showAddedToCart(product) {
        product.classList.add('added-to-cart');
        
        setTimeout(() => {
            product.classList.remove('added-to-cart');
        }, 2000);
        }

        // Función para mostrar notificaciones
        function showNotification(message, type = 'success') {
        // Crear el elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        
        notification.innerHTML = `
            <div class="flex items-center gap-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
            </div>
        `;
        
        // Añadir al DOM
        document.body.appendChild(notification);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => {
            document.body.removeChild(notification);
            }, 300);
        }, 3000);
        }

        // Ejemplo de uso en productos de WhatsApp
        document.querySelectorAll('.producto a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // No prevenir la navegación predeterminada para que el enlace siga funcionando
            // e.preventDefault();
            
            // Mostrar animación de añadido al carrito
            const product = link.closest('.producto');
            showAddedToCart(product);
            
            // Mostrar notificación
            showNotification('¡Redirigiendo a WhatsApp!');
        });
        });

        // Inicialización - Activar la primera categoría por defecto
        window.addEventListener('DOMContentLoaded', () => {
        // Activar la primera miniatura de cada producto
        document.querySelectorAll('.producto').forEach(producto => {
            const firstThumb = producto.querySelector('.thumb-img');
            if (firstThumb) {
            firstThumb.classList.add('active');
            }
        });
        
        // Si hay un hash en la URL, navegar a esa categoría
        if (window.location.hash) {
            const category = window.location.hash.substring(1);
            highlightCategory(category);
        }
        
        // Ajustar las reseñas para que tengan un tamaño uniforme
        formatReviews();
        
        // Inicializar los toggles de reseñas de productos
        initProductReviewsToggles();
        });

        // Inicializar toggles de reseñas en productos
        function initProductReviewsToggles() {
        document.querySelectorAll('.product-reviews-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
            // Encontrar el contenedor de reseñas asociado
            const reviewsContent = toggle.closest('.bg-slate-50').querySelector('.product-reviews-content');
            const icon = toggle.querySelector('i');
            
            // Alternar la visibilidad
            if (reviewsContent.style.maxHeight === '0px' || reviewsContent.style.maxHeight === '') {
                reviewsContent.style.maxHeight = reviewsContent.scrollHeight + 'px';
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
                toggle.innerHTML = 'Ocultar <i class="fas fa-chevron-up ml-1"></i>';
            } else {
                reviewsContent.style.maxHeight = '0px';
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                toggle.innerHTML = 'Ver todas <i class="fas fa-chevron-down ml-1"></i>';
            }
            });
        });
        }

        // Función para formatear las reseñas con altura uniforme
        function formatReviews() {
        const reviews = document.querySelectorAll('.reseña');
        
        // Primero, resetear cualquier altura establecida anteriormente
        reviews.forEach(review => {
            const textContent = review.querySelector('p:not([class*="text-yellow"])');
            if (textContent) {
            textContent.style.height = 'auto';
            }
        });
        
        // Encontrar la altura máxima entre todas las reseñas
        let maxHeight = 80; // Altura mínima por defecto (en píxeles)
        
        // Aplicar la misma altura a todos los párrafos de reseñas
        reviews.forEach(review => {
            const textContent = review.querySelector('p:not([class*="text-yellow"])');
            if (textContent) {
            textContent.style.height = `${maxHeight}px`;
            textContent.style.overflow = 'auto';
            textContent.style.display = '-webkit-box';
            textContent.style.webkitLineClamp = '4';
            textContent.style.webkitBoxOrient = 'vertical';
            textContent.style.textOverflow = 'ellipsis';
            }
        });
        
        // Establecer ancho fijo para todas las reseñas
        reviews.forEach(review => {
            review.style.width = '280px';
            review.style.minWidth = '280px';
        });
        }

        // Ajustar las reseñas si se redimensiona la ventana
        window.addEventListener('resize', formatReviews);

        // Soporte para teclas en el modal
        document.addEventListener('keydown', (e) => {
        if (!imageModal.classList.contains('hidden')) {
            if (e.key === 'Escape') {
            imageModal.classList.add('hidden');
            } else if (e.key === 'ArrowLeft') {
            modalPrev.click();
            } else if (e.key === 'ArrowRight') {
            modalNext.click();
            }
        }
        });
        // Implementar animación para imágenes de reseñas
        document.querySelectorAll('.review-img').forEach(img => {
            img.addEventListener('mouseover', () => {
            img.classList.add('review-img-hover');
            });
            
            img.addEventListener('mouseout', () => {
            img.classList.remove('review-img-hover');
            });
        });
        // Mostrar notificación de envío gratuito (centrada)
window.addEventListener('DOMContentLoaded', () => {
    const freeDeliveryNotification = document.getElementById('free-delivery-notification');
    const closeNotification = document.getElementById('close-notification');
    const acceptNotification = document.getElementById('accept-notification');
    
    // Comprobar si ya se mostró anteriormente en esta sesión
    if (sessionStorage.getItem('deliveryNotificationShown') !== 'true') {
      // Mostrar la notificación después de un pequeño retraso
      setTimeout(() => {
        freeDeliveryNotification.classList.remove('opacity-0', 'pointer-events-none');
        freeDeliveryNotification.querySelector('div').classList.remove('scale-95');
        freeDeliveryNotification.querySelector('div').classList.add('scale-100');
      }, 1000);
      
      // Marcar como mostrado
      sessionStorage.setItem('deliveryNotificationShown', 'true');
    }
    
    // Función para cerrar la notificación
    function closeModal() {
      freeDeliveryNotification.classList.add('opacity-0', 'pointer-events-none');
      freeDeliveryNotification.querySelector('div').classList.remove('scale-100');
      freeDeliveryNotification.querySelector('div').classList.add('scale-95');
    }
    
    // Cerrar al hacer clic en el botón de cerrar
    closeNotification.addEventListener('click', closeModal);
    
    // Cerrar al hacer clic en el botón Entendido
    acceptNotification.addEventListener('click', closeModal);
    
    // También cerrar al hacer clic fuera del modal
    freeDeliveryNotification.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
    
    // Cerrar con la tecla ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !freeDeliveryNotification.classList.contains('opacity-0')) {
        closeModal();
      }
    });
  });
