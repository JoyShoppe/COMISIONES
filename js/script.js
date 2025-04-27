document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('comisionForm');
    const modal = document.getElementById('modalResultado');
    const closeModal = document.getElementById('closeModal');
    const resultAmount = document.querySelector('.result-amount');
    const penaltyDetailsDiv = document.getElementById('penaltyDetails');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      calculateCommission();
    });
  
    function calculateCommission() {
      const puntos = parseFloat(document.getElementById('puntos').value) || 0;
      const efectividad = parseFloat(document.getElementById('efectividad').value) || 0;
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
        detalles += `<p>No cumple con efectividad mínima (70%)</p>`;
      }
  
      if (comision > 0) {
        // Efectividad
        if (efectividad >= 90) {
          comision *= 1.4;
          detalles += `<p>Bonificación por Efectividad alta (40%)</p>`;
        } else {
          comision *= 0.75;
          detalles += `<p>Penalidad por Efectividad baja (25%)</p>`;
        }
  
        // Caída Front
        if (caidaFront <= 2) {
          comision *= 1.2;
          detalles += `<p>Bonificación por Caída Front baja (20%)</p>`;
        } else {
          comision *= 0.95;
          detalles += `<p>Penalidad por Caída Front alta (5%)</p>`;
        }
  
        // CSAT
        if (csat >= 8.8) {
          comision *= 1.2;
          detalles += `<p>Bonificación por CSAT alto (20%)</p>`;
        } else {
          comision *= 0.95;
          detalles += `<p>Penalidad por CSAT bajo (5%)</p>`;
        }
  
        // Penalidades comportamiento
        if (amonestaciones > 0) {
          comision *= 0.7;
          detalles += `<p>Penalidad por amonestaciones (30%)</p>`;
        }
        if (ausentismos === 2) {
          comision *= 0.40;
          detalles += `<p>Penalidad por 2 ausentismos injustificados (60%)</p>`;
        }
        if (ausentismos === 3) {
          comision *= 0.1;
          detalles += `<p>Penalidad por 3 ausentismos injustificados (90%)</p>`;
        }
        if (ausentismos >= 4) {
          comision *= 0.0;
          detalles += `<p>Penalidad por 4 o más ausentismos injustificados (100%)</p>`;
        }
        if (suspensiones > 0) {
          comision = 0;
          detalles += `<p>Penalidad por suspensiones (100%)</p>`;
        }
        if (malasPracticas > 0) {
          comision = 0;
          detalles += `<p>Penalidad por malas prácticas (100%)</p>`;
        }
      }
  
      // Mostrar modal
      resultAmount.textContent = `S/ ${comision.toFixed(2)}`;
      penaltyDetailsDiv.innerHTML = detalles;
      modal.classList.remove('hidden');
      modal.classList.add('fade-in');
    }
  
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));
  
    // No permitir valores negativos
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', () => {
        if (input.value < 0) input.value = 0;
      });
    });
  });
  