/**
 * Caso C · Sol de Casa (Paneles Solares Residenciales)
 * Nivel 1, Nivel 2 y Nivel 3 (Simulador 24 meses en tiempo real con Jugada de Ocupación 100% Exacta)
 */

window.CasoCSolDeCasa = (function() {
  const metaHistorical = [
    { x: 0, y: 0 },
    { x: 2000, y: 280 },
    { x: 4000, y: 500 },
    { x: 6000, y: 680 },
    { x: 8000, y: 840 },
    { x: 10000, y: 960 }
  ];

  const googleHistorical = [
    { x: 0, y: 0 },
    { x: 2000, y: 55 },
    { x: 4000, y: 100 },
    { x: 6000, y: 135 },
    { x: 8000, y: 160 }
  ];

  function interp(x, points) {
    if (x <= 0) return 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      if (x >= p0.x && x <= p1.x) {
        if (p1.x === p0.x) return p0.y;
        return p0.y + ((p1.y - p0.y) * (x - p0.x)) / (p1.x - p0.x);
      }
    }
    return points[points.length - 1].y;
  }

  const state = {
    invGoogle: 4000,
    invMeta: 4000,
    costoVisita: 60.0,
    capacidadVisitas: 100,
    filtroMetaActivo: false
  };

  // Estado del Nivel 3 en Tiempo Real (soporta Meta M1-M2 y Meta M3-M24)
  const rtState = {
    invG: 8000,
    invM1: 2600,
    invM2: 6000,
    tech3: true,
    filter: true,
    activePreset: 'master'
  };

  let chartTrap = null;
  let chartFunnel = null;
  let chartCapacity = null;
  let chartUnitCash = null;
  let chartSim24m = null;

  function calculateUnitEconomics() {
    let leadsMeta = interp(state.invMeta, metaHistorical);
    const leadsGoogle = interp(state.invGoogle, googleHistorical);

    let tasaContactoM = 0.55;
    let tasaAgendaM = 0.30;
    let tasaVisitaM = 0.70;
    let tasaCierreM = 0.18;

    if (state.filtroMetaActivo) {
      leadsMeta *= 0.80;
      tasaContactoM = 0.80;
      tasaAgendaM = 0.40;
      tasaVisitaM = 0.75;
      tasaCierreM = 0.22;
    }

    const visitasReqMeta = leadsMeta * tasaContactoM * tasaAgendaM * tasaVisitaM;
    const visitasReqGoogle = leadsGoogle * 0.85 * 0.55 * 0.85;
    const totalVisitasReq = visitasReqMeta + visitasReqGoogle;

    const visitasHechasGoogle = Math.min(visitasReqGoogle, state.capacidadVisitas);
    const cupoRestante = Math.max(0, state.capacidadVisitas - visitasHechasGoogle);
    const visitasHechasMeta = Math.min(visitasReqMeta, cupoRestante);
    const totalVisitasHechas = visitasHechasGoogle + visitasHechasMeta;

    const ventasGoogle = visitasHechasGoogle * 0.30;
    const ventasMeta = visitasHechasMeta * tasaCierreM;
    const totalVentas = ventasGoogle + ventasMeta;

    const contribucionLTV = 1625.0;

    const cacRealGoogle = ventasGoogle > 0 ? (state.invGoogle + visitasHechasGoogle * state.costoVisita) / ventasGoogle : 0;
    const cacRealMeta = ventasMeta > 0 ? (state.invMeta + visitasHechasMeta * state.costoVisita) / ventasMeta : 0;
    const costoTotalAdq = state.invGoogle + state.invMeta + totalVisitasHechas * state.costoVisita;
    const cacRealPromedio = totalVentas > 0 ? costoTotalAdq / totalVentas : 0;

    const ratioLtvCacBlended = cacRealPromedio > 0 ? contribucionLTV / cacRealPromedio : 0;
    const valorVisitaGoogle = 0.30 * contribucionLTV - state.costoVisita;
    const valorVisitaMeta = tasaCierreM * contribucionLTV - state.costoVisita;

    return {
      leadsMeta,
      leadsGoogle,
      tasaContactoM,
      visitasReqMeta,
      visitasReqGoogle,
      totalVisitasReq,
      visitasHechasGoogle,
      visitasHechasMeta,
      totalVisitasHechas,
      utilizacionPct: (totalVisitasHechas / state.capacidadVisitas) * 100,
      visitasPerdidas: Math.max(0, totalVisitasReq - state.capacidadVisitas),
      ventasGoogle,
      ventasMeta,
      totalVentas,
      contribucionLTV,
      cacRealGoogle,
      cacRealMeta,
      cacRealPromedio,
      ratioLtvCacBlended,
      valorVisitaGoogle,
      valorVisitaMeta
    };
  }

  function runSimulation24m(config) {
    let cash = 12000.0;
    const floor = 5000.0;
    const fixedCosts = 18000.0;
    const salesHistory = [22.0];

    const rows = [];
    const cashSeries = [12000.0];
    let minCash = cash;
    let minCashMonth = 0;
    let totalInstalls = 0;
    let lastVisitasReq = 0;
    let finalCap = 100;

    for (let m = 1; m <= 24; m++) {
      const extraTechs = config.tech3 && m >= 3 ? 1 : 0;
      const capacity = config.tech3 && m >= 3 ? 150 : 100;
      finalCap = capacity;

      const invM = m <= 2 ? config.invM1 : config.invM2;
      const invG = config.invG;

      let leadsM = interp(invM, metaHistorical);
      const leadsG = interp(invG, googleHistorical);

      let reqVisitasM, cierreM;
      if (config.filter) {
        leadsM *= 0.80;
        reqVisitasM = leadsM * 0.80 * 0.40 * 0.75;
        cierreM = 0.22;
      } else {
        reqVisitasM = leadsM * 0.55 * 0.30 * 0.70;
        cierreM = 0.18;
      }

      const reqVisitasG = leadsG * 0.85 * 0.55 * 0.85;
      const cierreG = 0.30;
      const totalReq = reqVisitasM + reqVisitasG;
      lastVisitasReq = totalReq;

      const doneG = Math.min(reqVisitasG, capacity);
      const rem = Math.max(0, capacity - doneG);
      const doneM = Math.min(reqVisitasM, rem);
      const totalDone = doneG + doneM;

      const salesM = doneG * cierreG + doneM * cierreM;
      totalInstalls += salesM;

      const prevSales = salesHistory[salesHistory.length - 1];
      salesHistory.push(salesM);

      const inflows = 0.50 * 6500.0 * salesM + 0.50 * 6500.0 * prevSales;
      const techCost = extraTechs > 0 ? 1800.0 : 0.0;
      const outflows =
        0.55 * 6500.0 * salesM +
        0.03 * 6500.0 * salesM +
        0.17 * 6500.0 * prevSales +
        60.0 * totalDone +
        invM +
        invG +
        fixedCosts +
        techCost;

      const netFlow = inflows - outflows;
      cash += netFlow;
      cashSeries.push(cash);

      if (cash < minCash) {
        minCash = cash;
        minCashMonth = m;
      }

      rows.push({
        mes: m,
        invM,
        invG,
        visitasReq: totalReq,
        capacidad: capacity,
        visitasHechas: totalDone,
        ventas: salesM,
        entradas: inflows,
        salidas: outflows,
        flujoNeto: netFlow,
        cajaFinal: cash,
        rompePiso: cash < floor
      });
    }

    return {
      rows,
      cashSeries,
      minCash,
      minCashMonth,
      finalCash: cash,
      totalInstalls,
      lastVisitasReq,
      finalCap
    };
  }

  function formatMoney(n) {
    const sign = n < 0 ? '-' : '';
    return sign + '$' + Math.round(Math.abs(n)).toLocaleString('es-ES');
  }

  function updateDOM() {
    const u = calculateUnitEconomics();

    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setTxt('sol-val-cacgoogle', u.cacRealGoogle > 0 ? `$${u.cacRealGoogle.toFixed(2).replace('.', ',')}` : '$0');
    setTxt('sol-val-cacmeta', u.cacRealMeta > 0 ? `$${u.cacRealMeta.toFixed(2).replace('.', ',')}` : '$0');
    setTxt('sol-val-valorg', `$${u.valorVisitaGoogle.toFixed(2).replace('.', ',')}`);
    setTxt('sol-val-valorm', `$${u.valorVisitaMeta.toFixed(2).replace('.', ',')}`);
    setTxt('sol-val-usocap', `${u.utilizacionPct.toFixed(1).replace('.', ',')}% (${u.totalVisitasHechas.toFixed(1)}/${state.capacidadVisitas})`);
    setTxt('sol-note-desborde', u.visitasPerdidas > 0 ? `Pierde ${u.visitasPerdidas.toFixed(1)} visitas por tope` : 'Sin visitas perdidas');
    setTxt('sol-val-ventas', `${u.totalVentas.toFixed(2).replace('.', ',')} instalac.`);
    setTxt('sol-val-ltvcac', `${u.ratioLtvCacBlended.toFixed(2).replace('.', ',')}x`);

    const elSem = document.getElementById('sol-semaforo-ltv');
    if (elSem) {
      if (u.ratioLtvCacBlended >= 3.0) {
        elSem.className = 'status-pill good';
        elSem.textContent = `LTV:CAC ${u.ratioLtvCacBlended.toFixed(2).replace('.', ',')}x (Verde: >= 3x)`;
      } else if (u.ratioLtvCacBlended >= 2.0) {
        elSem.className = 'status-pill warn';
        elSem.textContent = `LTV:CAC ${u.ratioLtvCacBlended.toFixed(2).replace('.', ',')}x (Amarillo)`;
      } else {
        elSem.className = 'status-pill danger';
        elSem.textContent = `LTV:CAC ${u.ratioLtvCacBlended.toFixed(2).replace('.', ',')}x (Rojo)`;
      }
    }

    setTxt('badge-sol-invgoogle', `$${state.invGoogle.toLocaleString('es-ES')}`);
    setTxt('badge-sol-invmeta', `$${state.invMeta.toLocaleString('es-ES')}`);
    setTxt('badge-sol-visita', `$${state.costoVisita.toFixed(0)}`);
    setTxt('badge-sol-cap', `${state.capacidadVisitas}`);

    renderLevel2Charts(u);
    updateRealtimeLevel3();
  }

  function renderLevel2Charts(u) {
    if (!window.ChartsEngine || !window.ChartsEngine.isAvailable) return;

    chartTrap = window.ChartsEngine.createOrUpdate(chartTrap, 'chart-sol-trap', {
      type: 'bar',
      data: {
        labels: ['Costo por Lead (CPL)', 'CAC Real por Cliente Instalado'],
        datasets: [
          {
            label: 'Google Ads',
            data: [40, Number(u.cacRealGoogle.toFixed(2))],
            backgroundColor: '#3d231a',
            borderRadius: 5
          },
          {
            label: 'Meta Ads',
            data: [8, Number(u.cacRealMeta.toFixed(2))],
            backgroundColor: '#d47a9e',
            borderRadius: 5
          }
        ]
      }
    });

    chartFunnel = window.ChartsEngine.createOrUpdate(chartFunnel, 'chart-sol-funnel', {
      type: 'bar',
      data: {
        labels: ['Leads', 'Contactados', 'Visitas Hechas', 'Ventas Cerradas'],
        datasets: [
          {
            label: 'Google Ads',
            data: [
              Math.round(u.leadsGoogle),
              Math.round(u.leadsGoogle * 0.85),
              Number(u.visitasHechasGoogle.toFixed(1)),
              Number(u.ventasGoogle.toFixed(1))
            ],
            backgroundColor: '#3d231a',
            borderRadius: 5
          },
          {
            label: 'Meta Ads',
            data: [
              Math.round(u.leadsMeta),
              Math.round(u.leadsMeta * u.tasaContactoM),
              Number(u.visitasHechasMeta.toFixed(1)),
              Number(u.ventasMeta.toFixed(1))
            ],
            backgroundColor: '#d47a9e',
            borderRadius: 5
          }
        ]
      }
    });

    chartCapacity = window.ChartsEngine.createOrUpdate(chartCapacity, 'chart-sol-capacity', {
      type: 'bar',
      data: {
        labels: ['Visitas Google', 'Visitas Meta', 'Demanda Total', 'Capacidad Técnicos'],
        datasets: [{
          label: 'Visitas / Mes',
          data: [
            Number(u.visitasHechasGoogle.toFixed(1)),
            Number(u.visitasHechasMeta.toFixed(1)),
            Number(u.totalVisitasReq.toFixed(1)),
            state.capacidadVisitas
          ],
          backgroundColor: ['#3d231a', '#d47a9e', u.totalVisitasReq > state.capacidadVisitas ? '#c94a5e' : '#5a9e68', '#181316'],
          borderRadius: 5
        }]
      },
      options: {
        plugins: { legend: { display: false } }
      }
    });

    chartUnitCash = window.ChartsEngine.createOrUpdate(chartUnitCash, 'chart-sol-unitcash', {
      type: 'line',
      data: {
        labels: ['Antes de visita', 'Mes 1 (Firma + Paneles)', 'Mes 2 (Instalación + Saldo 50%)'],
        datasets: [
          {
            label: 'Flujo Acumulado por Venta (sin pauta)',
            data: [-state.costoVisita * 3.33, -520 - state.costoVisita * 3.33, 1625 - state.costoVisita * 3.33],
            borderColor: '#3d231a',
            backgroundColor: 'rgba(61, 35, 26, 0.12)',
            fill: true,
            borderWidth: 2.5,
            tension: 0.15
          },
          {
            label: 'Línea del Cero ($0)',
            data: [0, 0, 0],
            borderColor: '#777777',
            borderDash: [3, 3],
            pointRadius: 0
          }
        ]
      }
    });
  }

  function updateRealtimeLevel3() {
    const liveSim = runSimulation24m(rtState);

    const planActual = runSimulation24m({ invG: 4000, invM1: 4000, invM2: 4000, tech3: false, filter: false });
    const planLeadly = runSimulation24m({ invG: 0, invM1: 8000, invM2: 8000, tech3: false, filter: false });
    const planFijo = runSimulation24m({ invG: 8000, invM1: 4000, invM2: 4000, tech3: true, filter: true });
    const planMaster = runSimulation24m({ invG: 8000, invM1: 2600, invM2: 6000, tech3: true, filter: true });

    const banner = document.getElementById('sol-rt-verdict');
    const titleEl = document.getElementById('sol-verdict-title');
    const descEl = document.getElementById('sol-verdict-desc');
    const kpiMin = document.getElementById('sol-vkpi-min');
    const kpiFinal = document.getElementById('sol-vkpi-final');
    const kpiSubs = document.getElementById('sol-vkpi-subs');
    const kpiCac = document.getElementById('sol-vkpi-cac');

    const metaLabel = rtState.invM1 === rtState.invM2
      ? `${formatMoney(rtState.invM1)} M`
      : `${formatMoney(rtState.invM1)}->${formatMoney(rtState.invM2)} M`;
    const invText = `${formatMoney(rtState.invG)} G + ${metaLabel}`;

    if (kpiMin) kpiMin.textContent = `${formatMoney(liveSim.minCash)} (M${liveSim.minCashMonth})`;
    if (kpiFinal) kpiFinal.textContent = formatMoney(liveSim.finalCash);
    if (kpiSubs) kpiSubs.textContent = `${Math.round(liveSim.totalInstalls)} techos`;
    if (kpiCac) kpiCac.textContent = `${liveSim.lastVisitasReq.toFixed(1)} / ${liveSim.finalCap}`;

    if (banner && titleEl && descEl) {
      if (liveSim.minCash < 5000) {
        banner.className = 'verdict-live-banner danger';
        const firstBreak = liveSim.rows.find(r => r.rompePiso);
        titleEl.textContent = `NO ES BUENO PARA INVERTIR (${invText}) — ROMPE EL PISO DE $5.000 EN EL MES ${firstBreak ? firstBreak.mes : liveSim.minCashMonth}`;
        descEl.textContent = `Con esta combinación la caja cae a ${formatMoney(liveSim.minCash)}. Si quitas Google o gastas demasiado en Meta en los meses 1 y 2 antes de cobrar el 50% final de las instalaciones, perforas el piso.`;
      } else if (liveSim.lastVisitasReq > liveSim.finalCap) {
        banner.className = 'verdict-live-banner warn';
        titleEl.textContent = `DESBORDE DE CAPACIDAD (${invText}) — SE DESPERDICIAN VISITAS PAGADAS`;
        descEl.textContent = `No baja de $5.000, pero pides ${liveSim.lastVisitasReq.toFixed(1)} visitas/mes cuando tus técnicos solo pueden hacer ${liveSim.finalCap}. Activa el 3er técnico o reduce Meta Ads.`;
      } else {
        banner.className = 'verdict-live-banner good';
        titleEl.textContent = `SÍ ES BUENO PARA INVERTIR (${invText}) — OCUPACIÓN ÓPTIMA Y MÁXIMA CAJA`;
        descEl.textContent = `Respeta siempre el piso de $5.000 (mínimo ${formatMoney(liveSim.minCash)} en M${liveSim.minCashMonth}), llena la capacidad técnica sin desperdiciar visitas y cierra el Mes 24 con ${formatMoney(liveSim.finalCash)} y ${Math.round(liveSim.totalInstalls)} instalaciones.`;
      }
    }

    if (window.ChartsEngine && window.ChartsEngine.isAvailable) {
      const labels24 = Array.from({ length: 25 }, (_, i) => `M${i}`);
      const liveColor = liveSim.minCash < 5000 ? '#c94a5e' : '#2e7d32';
      const liveBg = liveSim.minCash < 5000 ? 'rgba(201, 74, 94, 0.14)' : 'rgba(46, 125, 50, 0.12)';

      chartSim24m = window.ChartsEngine.createOrUpdate(chartSim24m, 'chart-sol-sim24m', {
        type: 'line',
        data: {
          labels: labels24,
          datasets: [
            {
              label: `Tu Simulación en Vivo (${invText})`,
              data: liveSim.cashSeries.map(v => Math.round(v)),
              borderColor: liveColor,
              backgroundColor: liveBg,
              borderWidth: 3,
              fill: true,
              tension: 0.2,
              pointRadius: 2.5
            },
            {
              label: 'Plan Hoy ($4k Meta + $4k Google)',
              data: planActual.cashSeries.map(v => Math.round(v)),
              borderColor: '#3d231a',
              borderDash: [5, 4],
              borderWidth: 2,
              fill: false,
              tension: 0.2,
              pointRadius: 0
            },
            {
              label: 'Propuesta Leadly ($8k Meta + $0 Google)',
              data: planLeadly.cashSeries.map(v => Math.round(v)),
              borderColor: '#c94a5e',
              borderDash: [3, 3],
              borderWidth: 1.8,
              fill: false,
              tension: 0.2,
              pointRadius: 0
            },
            {
              label: 'Piso de Seguridad ($5.000)',
              data: Array(25).fill(5000),
              borderColor: '#871c2d',
              borderWidth: 1.5,
              borderDash: [2, 2],
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          scales: {
            y: { title: { display: true, text: 'Saldo en Banco ($)' } }
          }
        }
      });
    }

    const tbodyComp = document.getElementById('tbody-sol-compare');
    if (tbodyComp) {
      const compRows = [
        { name: 'Tu Simulación en Vivo', inv: invText, sim: liveSim, cls: 'row-live' },
        { name: 'Plan 1: Hoy ($4k M + $4k G)', inv: '$4k M + $4k G', sim: planActual, cls: '' },
        { name: 'Plan 2: Leadly ($8k Meta + $0 G)', inv: '$8k M + $0 G', sim: planLeadly, cls: 'row-danger' },
        { name: 'Plan 3: Propio Fijo ($8k G + $4k M)', inv: '$4k M + $8k G', sim: planFijo, cls: '' },
        { name: 'Plan 4: Jugada Maestra ($8k G + $2,6k->$6k M)', inv: '$8k G + $2,6k->$6k M', sim: planMaster, cls: 'row-winner' }
      ];

      tbodyComp.innerHTML = compRows.map(item => `
        <tr class="${item.cls}">
          <td><strong>${item.name}</strong></td>
          <td>${item.inv}</td>
          <td>${formatMoney(item.sim.minCash)} (M${item.sim.minCashMonth})</td>
          <td><strong>${formatMoney(item.sim.finalCash)}</strong></td>
          <td>${Math.round(item.sim.totalInstalls)}</td>
        </tr>
      `).join('');
    }

    const tbody24 = document.getElementById('tbody-sol-24m');
    if (tbody24) {
      tbody24.innerHTML = liveSim.rows.map(r => `
        <tr class="${r.rompePiso ? 'row-danger' : ''}">
          <td><strong>M${r.mes}</strong></td>
          <td>${formatMoney(r.invM)} / ${formatMoney(r.invG)}</td>
          <td>${r.visitasReq.toFixed(1)}</td>
          <td>${r.capacidad}</td>
          <td>${r.visitasHechas.toFixed(1)}</td>
          <td><strong>${r.ventas.toFixed(1)}</strong></td>
          <td>${formatMoney(r.entradas)}</td>
          <td>${formatMoney(r.salidas)}</td>
          <td><strong>${formatMoney(r.cajaFinal)}</strong></td>
        </tr>
      `).join('');
    }
  }

  function applyPresetPlan(planKey) {
    rtState.activePreset = planKey;
    if (planKey === 'actual') {
      rtState.invG = 4000;
      rtState.invM1 = 4000;
      rtState.invM2 = 4000;
      rtState.tech3 = false;
      rtState.filter = false;
    } else if (planKey === 'leadly') {
      rtState.invG = 0;
      rtState.invM1 = 8000;
      rtState.invM2 = 8000;
      rtState.tech3 = false;
      rtState.filter = false;
    } else if (planKey === 'googlemax') {
      rtState.invG = 8000;
      rtState.invM1 = 4000;
      rtState.invM2 = 4000;
      rtState.tech3 = true;
      rtState.filter = true;
    } else {
      rtState.invG = 8000;
      rtState.invM1 = 2600;
      rtState.invM2 = 6000;
      rtState.tech3 = true;
      rtState.filter = true;
    }

    const numG = document.getElementById('sol-rt-invg-num');
    const sldG = document.getElementById('sol-rt-invg-slider');
    const numM1 = document.getElementById('sol-rt-invm-num');
    const numM2 = document.getElementById('sol-rt-invm2-num');
    const sldM = document.getElementById('sol-rt-invm-slider');
    const chkT3 = document.getElementById('sol-rt-tech3');
    const chkFl = document.getElementById('sol-rt-filter');

    if (numG) numG.value = rtState.invG;
    if (sldG) sldG.value = rtState.invG;
    if (numM1) numM1.value = rtState.invM1;
    if (numM2) numM2.value = rtState.invM2;
    if (sldM) sldM.value = rtState.invM2;
    if (chkT3) chkT3.checked = rtState.tech3;
    if (chkFl) chkFl.checked = rtState.filter;

    updateRealtimeLevel3();
  }

  function initListeners() {
    const slG = document.getElementById('slider-sol-invgoogle');
    const slM = document.getElementById('slider-sol-invmeta');
    const slV = document.getElementById('slider-sol-visita');
    const slCap = document.getElementById('slider-sol-cap');
    const chkFiltro = document.getElementById('chk-sol-filtro');
    const btnReset = document.getElementById('btn-sol-reset');

    if (slG) slG.addEventListener('input', e => { state.invGoogle = parseFloat(e.target.value); updateDOM(); });
    if (slM) slM.addEventListener('input', e => { state.invMeta = parseFloat(e.target.value); updateDOM(); });
    if (slV) slV.addEventListener('input', e => { state.costoVisita = parseFloat(e.target.value); updateDOM(); });
    if (slCap) slCap.addEventListener('change', e => { state.capacidadVisitas = parseInt(e.target.value, 10); updateDOM(); });
    if (chkFiltro) chkFiltro.addEventListener('change', e => { state.filtroMetaActivo = e.target.checked; updateDOM(); });

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.invGoogle = 4000;
        state.invMeta = 4000;
        state.costoVisita = 60.0;
        state.capacidadVisitas = 100;
        state.filtroMetaActivo = false;

        if (slG) slG.value = 4000;
        if (slM) slM.value = 4000;
        if (slV) slV.value = 60;
        if (slCap) slCap.value = 100;
        if (chkFiltro) chkFiltro.checked = false;

        updateDOM();
      });
    }

    const numG = document.getElementById('sol-rt-invg-num');
    const sldG = document.getElementById('sol-rt-invg-slider');
    const numM1 = document.getElementById('sol-rt-invm-num');
    const numM2 = document.getElementById('sol-rt-invm2-num');
    const sldM = document.getElementById('sol-rt-invm-slider');
    const chkT3 = document.getElementById('sol-rt-tech3');
    const chkFl = document.getElementById('sol-rt-filter');

    const clearPresetActive = () => {
      document.querySelectorAll('.plan-btn-sol').forEach(b => b.classList.remove('active'));
    };

    if (numG) {
      numG.addEventListener('input', e => {
        const val = Math.max(0, Math.min(8000, parseFloat(e.target.value) || 0));
        rtState.invG = val;
        if (sldG) sldG.value = val;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }
    if (sldG) {
      sldG.addEventListener('input', e => {
        const val = parseFloat(e.target.value) || 0;
        rtState.invG = val;
        if (numG) numG.value = val;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }
    if (numM1) {
      numM1.addEventListener('input', e => {
        const val = Math.max(0, Math.min(10000, parseFloat(e.target.value) || 0));
        rtState.invM1 = val;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }
    if (numM2) {
      numM2.addEventListener('input', e => {
        const val = Math.max(0, Math.min(10000, parseFloat(e.target.value) || 0));
        rtState.invM2 = val;
        if (sldM) sldM.value = val;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }
    if (sldM) {
      sldM.addEventListener('input', e => {
        const val = parseFloat(e.target.value) || 0;
        rtState.invM2 = val;
        if (numM2) numM2.value = val;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }

    if (chkT3) {
      chkT3.addEventListener('change', e => {
        rtState.tech3 = e.target.checked;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }
    if (chkFl) {
      chkFl.addEventListener('change', e => {
        rtState.filter = e.target.checked;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }

    document.querySelectorAll('.plan-btn-sol').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.plan-btn-sol').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyPresetPlan(btn.getAttribute('data-plan'));
      });
    });
  }

  function init() {
    initListeners();
    updateDOM();
  }

  return { init, updateDOM };
})();
