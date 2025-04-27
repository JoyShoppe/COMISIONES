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

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // Efecto de botón pulsado
        const btn = event.target.querySelector('button[type="submit"]');
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 200);
        
        calculateCommission();
    });

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

        // Mostrar modal con animación
        resultAmount.textContent = `S/ ${comision.toFixed(2)}`;
        penaltyDetailsDiv.innerHTML = detalles;
        modal.classList.remove('hidden');
        modal.classList.add('fade-in');
        
        // Agregar clase para el resultado
        if (comision > 0) {
            resultAmount.classList.add('positive-result');
            resultAmount.classList.remove('zero-result');
        } else {
            resultAmount.classList.add('zero-result');
            resultAmount.classList.remove('positive-result');
        }
    }

    closeModal.addEventListener('click', () => {
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('fade-out');
        }, 300);
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal.click();
        }
    });

    // No permitir valores negativos
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value < 0) input.value = 0;
            
            // Validar máximos según el campo
            if (input.id === 'efectividad' && input.value > 100) input.value = 100;
            if (input.id === 'Noaplica' && input.value > 100) input.value = 100;
            if (input.id === 'caidaFront' && input.value > 100) input.value = 100;
            if (input.id === 'csat' && input.value > 10) input.value = 10;
        });
    });
});
