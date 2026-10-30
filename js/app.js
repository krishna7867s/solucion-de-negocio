/**
 * Navegación por pestañas de casos, selector de las 3 partes por caso
 * y sub-pestañas internas para evitar el scroll largo.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Pestañas principales de casos
  const caseButtons = document.querySelectorAll('.case-tab-btn');
  const caseSections = document.querySelectorAll('.case-section');

  function refreshActiveCaseCharts() {
    setTimeout(() => {
      if (window.CasoATueste) window.CasoATueste.updateDOM();
      if (window.CasoBAgendo) window.CasoBAgendo.updateDOM();
      if (window.CasoCSolDeCasa) window.CasoCSolDeCasa.updateDOM();
    }, 30);
  }

  caseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-case');
      if (!targetId) return;

      caseButtons.forEach(b => b.classList.toggle('active', b === btn));
      caseSections.forEach(sec => sec.classList.toggle('active', sec.id === targetId));

      refreshActiveCaseCharts();
    });
  });

  // 2. Botones de las 3 Partes dentro de cada caso (Nivel 1, Nivel 2, Nivel 3)
  const partGroups = document.querySelectorAll('.part-plaques-group');
  partGroups.forEach(group => {
    const buttons = group.querySelectorAll('.topic-plaque-btn');
    const parentSection = group.closest('.case-section');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const partId = btn.getAttribute('data-part');
        if (!partId || !parentSection) return;

        buttons.forEach(b => b.classList.toggle('active', b === btn));
        parentSection.querySelectorAll('.part-panel').forEach(panel => {
          panel.classList.toggle('active', panel.id === partId);
        });

        refreshActiveCaseCharts();
      });
    });
  });

  // 3. Sub-pestañas internas dentro de las tarjetas
  const subtabGroups = document.querySelectorAll('.inner-subtabs');
  subtabGroups.forEach(group => {
    const pills = group.querySelectorAll('.subtab-pill');
    const container = group.parentElement;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const paneId = pill.getAttribute('data-subpane');
        if (!paneId || !container) return;

        pills.forEach(p => p.classList.toggle('active', p === pill));
        container.querySelectorAll(':scope > .subtab-pane').forEach(pane => {
          pane.classList.toggle('active', pane.id === paneId);
        });
      });
    });
  });

  // 4. Inicializar los 3 casos
  if (window.CasoATueste) window.CasoATueste.init();
  if (window.CasoBAgendo) window.CasoBAgendo.init();
  if (window.CasoCSolDeCasa) window.CasoCSolDeCasa.init();
});
