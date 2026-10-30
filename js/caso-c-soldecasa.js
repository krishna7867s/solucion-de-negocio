/**
 * Lógica Financiera e Interactiva: Caso C · Sol de Casa
 * Resuelve Nivel 1, Nivel 2 (Tablero en vivo) y Nivel 3 (Simulador 24 meses)
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
    if (x <= points[0].x) return points[0].y * (x / points[0].x || 0);
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

  // Estado reactivo
  const state = {
    invMeta: 4000,
    invGoogle: 4000,
    costoVisita: 60.0,
    capacidadVisitas: 100, // 100 base o 150 con técnico extra
    filtroMetaActivo: false, // Supuesto 7
    precioInstalacion: 6500.0,
    activePlan: 'actual'
  };

  let chartTrap = null;
  let chartFunnel = null;
  let chartCapacity = null;
  let chartSim24m = null;

  function calculateUnitEconomics() {
    let leadsMeta = interp(state.invMeta, metaHistorical);
    const leadsGoogle = interp(state.invGoogle, googleHistorical);

    let tasaContactoMeta = 0.55;
    let tasaAgendaMeta = 0.30;
    let tasaVisitaMeta = 0.70;
    let tasaCierreMeta = 0.18;

    if (state.filtroMetaActivo) {
      // Supuesto 7: -20% leads, 80% contacto, 40% agenda, 75% visitas, 22% cierre
      leadsMeta *= 0.80;
      tasaContactoMeta = 0.80;
      tasaAgendaMeta = 0.40;
      tasaVisitaMeta = 0.75;
      tasaCierreMeta = 0.22;
    }

    const visitasReqMeta = leadsMeta * tasaContactoMeta * tasaAgendaMeta * tasaVisitaMeta;
    const visitasReqGoogle = leadsGoogle * 0.85 * 0.55 * 0.85; // 39.7375 a $4k
    const totalVisitasReq = visitasReqMeta + visitasReqGoogle;

    // Prioridad operativa: Google primero, luego Meta hasta agotar capacidad
    const visitasHechasGoogle = Math.min(visitasReqGoogle, state.capacidadVisitas);
    const cupoRestante = Math.max(0, state.capacidadVisitas - visitasHechasGoogle);
    const visitasHechasMeta = Math.min(visitasReqMeta, cupoRestante);
    const totalVisitasHechas = visitasHechasGoogle + visitasHechasMeta;

    const ventasGoogle = visitasHechasGoogle * 0.30;
    const ventasMeta = visitasHechasMeta * tasaCierreMeta;
    const totalVentas = ventasGoogle + ventasMeta;

    // Unit Economics y LTV
    const margenBruto = state.precioInstalacion * (1 - 0.55 - 0.17); // 28% = $1,820
    const comision = state.precioInstalacion * 0.03; // $195
    const contribucionLTV = margenBruto - comision; // $1,625

    // CACs
    const costoVisitasGoogle = visitasHechasGoogle * state.costoVisita;
    const costoVisitasMeta = visitasHechasMeta * state.costoVisita;

    const cacAnunciosGoogle = ventasGoogle > 0 ? state.invGoogle / ventasGoogle : 0;
    const cacRealGoogle = ventasGoogle > 0 ? (state.invGoogle + costoVisitasGoogle) / ventasGoogle : 0;

    const cacAnunciosMeta = ventasMeta > 0 ? state.invMeta / ventasMeta : 0;
    const cacRealMeta = ventasMeta > 0 ? (state.invMeta + costoVisitasMeta) / ventasMeta : 0;

    const costoTotalAdq = state.invMeta + state.invGoogle + (totalVisitasHechas * state.costoVisita);
    const cacRealPromedio = totalVentas > 0 ? costoTotalAdq / totalVentas : 0;

    // Ratios
    const ratioLtvCacGoogle = cacRealGoogle > 0 ? contribucionLTV / cacRealGoogle : 0;
    const ratioLtvCacMeta = cacRealMeta > 0 ? contribucionLTV / cacRealMeta : 0;
    const ratioLtvCacBlended = cacRealPromedio > 0 ? contribucionLTV / cacRealPromedio : 0;

    // Valor Neto de una Visita: (Cierre * LTV) - CostoVisita
    const valorVisitaGoogle = (0.30 * contribucionLTV) - state.costoVisita; // $427.50
    const valorVisitaMeta = (tasaCierreMeta * contribucionLTV) - state.costoVisita; // $232.50

    return {
      leadsMeta,
      leadsGoogle,
      visitasReqMeta,
      visitasReqGoogle,
      totalVisitasReq,
      visitasHechasGoogle,
      visitasHechasMeta,
      totalVisitasHechas,
      utilizacionCapacidad: totalVisitasHechas / state.capacidadVisitas,
      ventasGoogle,
      ventasMeta,
      totalVentas,
      contribucionLTV,
      cacRealGoogle,
      cacRealMeta,
      cacRealPromedio,
      ratioLtvCacGoogle,
      ratioLtvCacMeta,
      ratioLtvCacBlended,
      valorVisitaGoogle,
      valorVisitaMeta
    };
  }

  function simulate24m(planKey) {
    const plans = {
      actual: { meta: Array(24).fill(4000), google: Array(24).fill(4000), extraHire: null, filter: false },
      leadly: { meta: Array(24).fill(8000), google: Array(24).fill(0), extraHire: null, filter: false },
      googlemax: { meta: Array(24).fill(2000), google: Array(24).fill(8000), extraHire: null, filter: false },
      master: { meta: Array(24).fill(4000), google: Array(24).fill(8000), extraHire: 3, filter: true }
    };

    const cfg = plans[planKey] || plans.actual;
    let cash = 12000.0;
    const floor = 5000.0;
    const fixedCosts = 18000.0;
    const salesHistory = [22.0];
    const rows = [];
    let minCash = cash;
    let minCashMonth = 0;
    let totalInstalls = 0;

    for (let m = 1; m <= 24; m++) {
      const extraTechs = (cfg.extraHire && m >= cfg.extraHire) ? 1 : 0;
      const capacity = (cfg.extraHire && m > cfg.extraHire) ? 150 : 100;

      const invM = cfg.meta[m - 1];
      const invG = cfg.google[m - 1];

      let leadsM = interp(invM, metaHistorical);
      const leadsG = interp(invG, googleHistorical);

      let reqVisitasM, cierreM;
      if (cfg.filter) {
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

      const doneG = Math.min(reqVisitasG, capacity);
      const rem = Math.max(0, capacity - doneG);
      const doneM = Math.min(reqVisitasM, rem);
      const totalDone = doneG + doneM;

      const salesM = (doneG * cierreG) + (doneM * cierreM);
      totalInstalls += salesM;

      const prevSales = salesHistory[salesHistory.length - 1];
      salesHistory.push(salesM);

      const inflows = (0.50 * 6500.0 * salesM) + (0.50 * 6500.0 * prevSales);

      const techCost = extraTechs > 0 ? 1800.0 : 0.0;
      const outflows = (0.55 * 6500.0 * salesM) +
                       (0.03 * 6500.0 * salesM) +
                       (0.17 * 6500.0 * prevSales) +
                       (60.0 * totalDone) +
                       invM + invG + fixedCosts + techCost;

      const netFlow = inflows - outflows;
      cash += netFlow;

      if (cash < minCash) {
        minCash = cash;
        minCashMonth = m;
      }

      rows.push({
        mes: m,
        invM,
        invG,
        leadsM,
        leadsG,
        visitasReq: totalReq,
        capacidad: capacity,
        visitasHechas: totalDone,
        ventas: salesM,
        entradas: inflows,
        salidas: outflows,
        flujoNeto: netFlow,
        cajaFinal: cash,
        alerta: cash < floor ? 'PELIGRO PISO' : 'OK'
      });
    }

    return { rows, minCash, minCashMonth, finalCash: cash, totalInstalls };
  }

  function updateDOM() {
    const u = calculateUnitEconomics();

    const elCacRealG = document.getElementById('sol-val-cacgoogle');
    const elCacRealM = document.getElementById('sol-val-cacmeta');
    const elVentasTot = document.getElementById('sol-val-ventas');
    const elUsoCap = document.getElementById('sol-val-usocap');
    const elValorG = document.getElementById('sol-val-valorg');
    const elValorM = document.getElementById('sol-val-valorm');
    const elLtvCac = document.getElementById('sol-val-ltvcac');
    const elSemaforo = document.getElementById('sol-semaforo-ltv');
    const elAlertaCap = document.getElementById('sol-alerta-capacidad');

    if (elCacRealG) elCacRealG.textContent = `$${u.cacRealGoogle.toFixed(2)}`;
    if (elCacRealM) elCacRealM.textContent = `$${u.cacRealMeta.toFixed(2)}`;
    if (elVentasTot) elVentasTot.textContent = `${u.totalVentas.toFixed(1)} instalac.`;
    if (elUsoCap) elUsoCap.textContent = `${(u.utilizacionCapacidad * 100).toFixed(1)}% (${u.totalVisitasHechas.toFixed(1)} / ${state.capacidadVisitas})`;
    if (elValorG) elValorG.textContent = `$${u.valorVisitaGoogle.toFixed(2)}`;
    if (elValorM) elValorM.textContent = `$${u.valorVisitaMeta.toFixed(2)}`;
    if (elLtvCac) elLtvCac.textContent = `${u.ratioLtvCacBlended.toFixed(2)}x`;

    if (elSemaforo) {
      elSemaforo.className = 'badge-status ' + (u.ratioLtvCacBlended >= 3.0 ? 'good' : u.ratioLtvCacBlended >= 2.0 ? 'warn' : 'danger');
      elSemaforo.textContent = u.ratioLtvCacBlended >= 3.0 ? 'Excelente (>3x)' : u.ratioLtvCacBlended >= 2.0 ? 'Aceptable (2x-3x)' : 'Bajo (<2x)';
    }

    if (elAlertaCap) {
      if (u.totalVisitasReq > state.capacidadVisitas) {
        elAlertaCap.style.display = 'block';
        elAlertaCap.textContent = `Cuello de botella detectado: Se solicitan ${u.totalVisitasReq.toFixed(1)} visitas pero el tope físico es ${state.capacidadVisitas}. Se desperdician ${(u.totalVisitasReq - state.capacidadVisitas).toFixed(1)} visitas.`;
      } else {
        elAlertaCap.style.display = 'none';
      }
    }

    const bInvM = document.getElementById('badge-sol-invmeta');
    const bInvG = document.getElementById('badge-sol-invgoogle');
    const bCap = document.getElementById('badge-sol-cap');

    if (bInvM) bInvM.textContent = `$${state.invMeta.toLocaleString()}`;
    if (bInvG) bInvG.textContent = `$${state.invGoogle.toLocaleString()}`;
    if (bCap) bCap.textContent = `${state.capacidadVisitas} visitas/mes`;

    renderCharts(u);
    renderSimulationTable(state.activePlan);
  }

  function renderCharts(u) {
    if (!window.ChartsEngine || !window.ChartsEngine.isAvailable) return;

    // Gráfico 1: La Trampa de Leadly (CPL vs CAC Real)
    chartTrap = window.ChartsEngine.createOrUpdate(chartTrap, 'chart-sol-trap', {
      type: 'bar',
      data: {
        labels: ['Costo por Lead (CPL)', 'CAC Real por Cliente Cerrado'],
        datasets: [
          {
            label: 'Meta Ads',
            data: [8.0, u.cacRealMeta],
            backgroundColor: '#d9822b',
            borderRadius: 6
          },
          {
            label: 'Google Ads',
            data: [40.0, u.cacRealGoogle],
            backgroundColor: '#274c3a',
            borderRadius: 6
          }
        ]
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Dólares ($)' } }
        }
      }
    });

    // Gráfico 2: Embudo Comparado Meta vs Google
    chartFunnel = window.ChartsEngine.createOrUpdate(chartFunnel, 'chart-sol-funnel', {
      type: 'bar',
      data: {
        labels: ['Leads', 'Contactados', 'Agendados', 'Visitas Hechas', 'Ventas'],
        datasets: [
          {
            label: 'Meta Ads',
            data: [u.leadsMeta, u.leadsMeta * 0.55, u.leadsMeta * 0.55 * 0.30, u.visitasHechasMeta, u.ventasMeta],
            backgroundColor: '#d9822b',
            borderRadius: 6
          },
          {
            label: 'Google Ads',
            data: [u.leadsGoogle, u.leadsGoogle * 0.85, u.leadsGoogle * 0.85 * 0.55, u.visitasHechasGoogle, u.ventasGoogle],
            backgroundColor: '#274c3a',
            borderRadius: 6
          }
        ]
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Volumen de Personas' } }
        }
      }
    });

    // Gráfico 3: Visitas Solicitadas vs Capacidad
    chartCapacity = window.ChartsEngine.createOrUpdate(chartCapacity, 'chart-sol-capacity', {
      type: 'bar',
      data: {
        labels: ['Visitas Google', 'Visitas Meta', 'Demanda Total', 'Capacidad Instalada'],
        datasets: [{
          label: 'Visitas Técnicas / Mes',
          data: [u.visitasHechasGoogle, u.visitasHechasMeta, u.totalVisitasReq, state.capacidadVisitas],
          backgroundColor: ['#274c3a', '#d9822b', '#c97d8b', '#15271e'],
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Número de Visitas' } }
        }
      }
    });
  }

  function renderSimulationTable(planKey) {
    const sim = simulate24m(planKey);
    const tbody = document.getElementById('tbody-sol-24m');
    if (!tbody) return;

    tbody.innerHTML = '';
    sim.rows.forEach(r => {
      const tr = document.createElement('tr');
      if (r.cajaFinal < 5000) tr.className = 'highlight-danger';
      tr.innerHTML = `
        <td><strong>Mes ${r.mes}</strong></td>
        <td>$${r.invM.toLocaleString()} / $${r.invG.toLocaleString()}</td>
        <td>${r.visitasReq.toFixed(1)}</td>
        <td>${r.capacidad}</td>
        <td>${r.visitasHechas.toFixed(1)}</td>
        <td><strong>${r.ventas.toFixed(2)}</strong></td>
        <td>$${r.entradas.toFixed(0)}</td>
        <td>$${r.salidas.toFixed(0)}</td>
        <td style="color:${r.flujoNeto >= 0 ? '#1b5e20' : '#991b1b'};font-weight:600;">$${r.flujoNeto.toFixed(0)}</td>
        <td><strong>$${r.cajaFinal.toFixed(0)}</strong></td>
        <td><span class="badge-status ${r.alerta === 'OK' ? 'good' : 'danger'}">${r.alerta}</span></td>
      `;
      tbody.appendChild(tr);
    });

    if (window.ChartsEngine && window.ChartsEngine.isAvailable) {
      chartSim24m = window.ChartsEngine.createOrUpdate(chartSim24m, 'chart-sol-sim24m', {
        type: 'line',
        data: {
          labels: sim.rows.map(r => `M${r.mes}`),
          datasets: [
            {
              label: 'Saldo Bancario Final ($)',
              data: sim.rows.map(r => r.cajaFinal),
              borderColor: '#274c3a',
              backgroundColor: 'rgba(39, 76, 58, 0.08)',
              fill: true,
              tension: 0.25
            },
            {
              label: 'Piso de Seguridad ($5,000)',
              data: Array(24).fill(5000),
              borderColor: '#e53e3e',
              borderDash: [6, 6],
              pointRadius: 0
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
  }

  function initListeners() {
    const slM = document.getElementById('slider-sol-invmeta');
    const slG = document.getElementById('slider-sol-invgoogle');
    const slCap = document.getElementById('slider-sol-cap');
    const chkFiltro = document.getElementById('chk-sol-filtro');
    const btnReset = document.getElementById('btn-sol-reset');

    if (slM) slM.addEventListener('input', e => { state.invMeta = parseFloat(e.target.value); updateDOM(); });
    if (slG) slG.addEventListener('input', e => { state.invGoogle = parseFloat(e.target.value); updateDOM(); });
    if (slCap) slCap.addEventListener('input', e => { state.capacidadVisitas = parseInt(e.target.value); updateDOM(); });
    if (chkFiltro) chkFiltro.addEventListener('change', e => { state.filtroMetaActivo = e.target.checked; updateDOM(); });

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.invMeta = 4000;
        state.invGoogle = 4000;
        state.capacidadVisitas = 100;
        state.filtroMetaActivo = false;
        state.activePlan = 'actual';

        if (slM) slM.value = 4000;
        if (slG) slG.value = 4000;
        if (slCap) slCap.value = 100;
        if (chkFiltro) chkFiltro.checked = false;

        document.querySelectorAll('.plan-btn-sol').forEach(b => b.classList.remove('active'));
        const defPlan = document.querySelector('.plan-btn-sol[data-plan="actual"]');
        if (defPlan) defPlan.classList.add('active');

        updateDOM();
      });
    }

    document.querySelectorAll('.plan-btn-sol').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.plan-btn-sol').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activePlan = btn.getAttribute('data-plan');
        renderSimulationTable(state.activePlan);
      });
    });
  }

  function init() {
    initListeners();
    updateDOM();
  }

  return { init, updateDOM, reset: () => document.getElementById('btn-sol-reset')?.click() };
})();
