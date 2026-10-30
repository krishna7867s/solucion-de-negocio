/**
 * Controlador Maestro de la Plataforma de Soluciones de Negocio
 * Coordina navegación de pestañas, comparador transversal y arranque de módulos.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(targetId) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === targetId);
    });

    tabContents.forEach(content => {
      const isTarget = content.id === targetId;
      content.classList.toggle('active', isTarget);
    });

    // Disparar re-render de gráficos según la pestaña activa
    setTimeout(() => {
      if (targetId === 'tab-tueste' && window.CasoATueste) {
        window.CasoATueste.updateDOM();
      } else if (targetId === 'tab-agendo' && window.CasoBAgendo) {
        window.CasoBAgendo.updateDOM();
      } else if (targetId === 'tab-soldecasa' && window.CasoCSolDeCasa) {
        window.CasoCSolDeCasa.updateDOM();
      }
    }, 50);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (targetId) switchTab(targetId);
    });
  });

  // Inicializar módulos de casos
  if (window.CasoATueste) window.CasoATueste.init();
  if (window.CasoBAgendo) window.CasoBAgendo.init();
  if (window.CasoCSolDeCasa) window.CasoCSolDeCasa.init();

  console.log('Plataforma Maestra de Negocios cargada y operativa.');
});
