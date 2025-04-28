document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('comisionForm');
    const modal = document.getElementById('modalResultado');
    const closeModal = document.getElementById('closeModal');
    const resultAmount = document.querySelector('.result-amount');
    const penaltyDetailsDiv = document.getElementById('penaltyDetails');

    // Efecto de carga inicial
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 300);

    // Función para mostrar el modal con animación
    function showModal() {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('fade-in');
            // Scroll al inicio del modal cuando se abre
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollTop = 0;
            }
        }, 10);
    }

    // Función para cerrar el modal con animación
    function closeModalFunction() {
        modal.classList.remove('fade-in');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            form.reset();
        }, 300);
    }

    // Event listeners para el modal
    closeModal.addEventListener('click', closeModalFunction);
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModalFunction();
        }
    });
    
    // Cerrar al hacer clic fuera del contenido del modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunction();
        }
    });

    // Crear y agregar botón de cierre en la parte inferior
    function addBottomCloseButton() {
        const modalContent = document.querySelector('.modal-content');
        const bottomCloseBtn = document.createElement('button');
        bottomCloseBtn.textContent = 'Cerrar';
        bottomCloseBtn.className = 'btn-close-bottom';
        bottomCloseBtn.style.cssText = `
            display: block;
            width: 100%;
            padding: 0.8rem;
            margin-top: 1.5rem;
            background: var(--gray);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        bottomCloseBtn.addEventListener('mouseover', function() {
            this.style.background = 'var(--primary)';
        });
        bottomCloseBtn.addEventListener('mouseout', function() {
            this.style.background = 'var(--gray)';
        });
        bottomCloseBtn.addEventListener('click', closeModalFunction);
        modalContent.appendChild(bottomCloseBtn);
    }
    
    // Agregar el botón de cierre inferior
    addBottomCloseButton();

    // Manejo del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Animación del botón
        const btn = event.target.querySelector('button[type="submit"]');
        btn.classList.add('pulse');
        setTimeout(() => {
            btn.classList.remove('pulse');
            calculateCommission();
        }, 500);
    });

    // Función principal de cálculo
    function calculateCommission() {
        const puntos = parseFloat(document.getElementById('puntos').value) || 0;
        const efectividad = parseFloat(document.getElementById('efectividad').value) || 0;
        const noAplica = parseFloat(document.getElementById('Noaplica').value) || 0;
        const caidaFront = parseFloat(document.getElementById('caidaFront').value) || 0;
        const csat = parseFloat(document.getElementById('csat').value) || 0;

        const amonestaciones = parseInt(document.getElementById('amonestaciones').value) || 0;
        const suspensiones = parseInt(document.getElementById('suspensiones').value) || 0;
        const ausentismos = parseInt(document.getElementById('ausentismos').value) || 0;
        const malasPracticas = parseInt(document.getElementById('malasPracticas').value) || 0;

        // Escala de puntos
        let pagoPunto = 0;
        if (puntos <= 120) pagoPunto = 0;
        else if (puntos <= 179) pagoPunto = 0.80;
        else if (puntos <= 229) pagoPunto = 1.00;
        else pagoPunto = 1.60;
        
        let comision = puntos * pagoPunto;
        let detalles = "";

        // Filtro PEC
        if (efectividad < 70) {
            comision = 0;
            detalles += `<p class="penalty-text">❌ No cumple con efectividad mínima (70%)</p>`;
        }

        if (comision > 0) {
            // Efectividad
            if (efectividad >= 90) {
                comision *= 1.4;
                detalles += `<p class="bonus-text">✅ Bonificación por Efectividad alta (40%)</p>`;
            } else {
                comision *= 0.75;
                detalles += `<p class="penalty-text">❌ Penalidad por Efectividad baja (25%)</p>`;
            }

            // No Aplica
            if (noAplica <= 48) {
                comision *= 1.2;
                detalles += `<p class="bonus-text">✅ Bonificación por No Aplica bajo (≤48%) - 20%</p>`;
            } else {
                comision *= 0.95;
                detalles += `<p class="penalty-text">❌ Penalidad por No Aplica alto (>48%) - 5%</p>`;
            }

            // Caída Front
            if (caidaFront <= 2) {
                comision *= 1.2;
                detalles += `<p class="bonus-text">✅ Bonificación por Caída Front baja (≤2%) - 20%</p>`;
            } else {
                comision *= 0.95;
                detalles += `<p class="penalty-text">❌ Penalidad por Caída Front alta (>2%) - 5%</p>`;
            }

            // CSAT
            if (csat >= 8.8) {
                comision *= 1.2;
                detalles += `<p class="bonus-text">✅ Bonificación por CSAT alto (≥8.8) - 20%</p>`;
            } else {
                comision *= 0.95;
                detalles += `<p class="penalty-text">❌ Penalidad por CSAT bajo (<8.8) - 5%</p>`;
            }

            // Penalidades comportamiento
            if (amonestaciones > 0) {
                comision *= 0.7;
                detalles += `<p class="penalty-text">❌ Penalidad por amonestaciones (30%)</p>`;
            }
            if (ausentismos === 1) {
                comision *= 0.70;
                detalles += `<p class="penalty-text">❌ Penalidad por 2 ausentismos injustificados (30%)</p>`;
            }
            if (ausentismos === 2) {
                comision *= 0.40;
                detalles += `<p class="penalty-text">❌ Penalidad por 3 ausentismos injustificados (60%)</p>`;
            }
            if (ausentismos >= 3) {
                comision *= 0.10;
                detalles += `<p class="penalty-text">❌ Penalidad por 4+ ausentismos injustificados (90%)</p>`;
            }
            if (suspensiones > 0) {
                comision = 0;
                detalles += `<p class="penalty-text">❌ Penalidad por suspensiones (100%)</p>`;
            }
            if (malasPracticas > 0) {
                comision = 0;
                detalles += `<p class="penalty-text">❌ Penalidad por malas prácticas (100%)</p>`;
            }
        }

        // Mostrar resultado
        resultAmount.textContent = `S/ ${comision.toFixed(2)}`;
        
        // Agregar clase para el resultado
        if (comision > 0) {
            resultAmount.classList.add('positive-result');
            resultAmount.classList.remove('zero-result');
        } else {
            resultAmount.classList.add('zero-result');
            resultAmount.classList.remove('positive-result');
        }

        // Mostrar detalles
        penaltyDetailsDiv.innerHTML = detalles;

        // Mostrar el modal
        showModal();
    }

    // Efecto hover en inputs
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        input.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Validación de inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this.id === 'efectividad' && this.value > 100) this.value = 100;
            if (this.id === 'Noaplica' && this.value > 100) this.value = 100;
            if (this.id === 'caidaFront' && this.value > 100) this.value = 100;
            if (this.id === 'csat' && this.value > 10) this.value = 10;
        });
    });

    // Presionar Enter para calcular
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('.btn-calculate').click();
            }
        });
    });
});
