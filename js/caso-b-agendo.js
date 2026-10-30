/**
 * Lógica Financiera e Interactiva: Caso B · Agendo
 * Resuelve Nivel 1, Nivel 2 (Tablero en vivo) y Nivel 3 (Simulador 24 meses)
 */

window.CasoBAgendo = (function() {
  const adsCurve = [
    { x: 0, y: 0 },
    { x: 5000, y: 290 },
    { x: 10000, y: 500 },
    { x: 15000, y: 650 },
    { x: 20000, y: 760 },
    { x: 30000, y: 900 }
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
    inversionAds: 10000,
    trialConv: 0.14,
    churn: 0.06,
    precioMensual: 25.0,
    margenBrutoPct: 0.78,
    pctAnual: 0.0,
    comisionCliente: 20.0,
    clientesOrganicos: 50,
    activePlan: 'actual'
  };

  let chartTrap = null;
  let chartCashCurve = null;
  let chartLtvCac = null;
  let chartSim24m = null;

  function calculateUnitEconomics() {
    const trials = interp(state.inversionAds, adsCurve);
    const vendedoras = trials > 0 ? Math.ceil(trials / 500.0) : 0;
    const clientesAds = trials * state.trialConv;
    const totalNuevos = clientesAds + state.clientesOrganicos;

    const costoTotalAdq = state.inversionAds + (vendedoras * 1200.0) + (clientesAds * state.comisionCliente);
    const cacPaid = clientesAds > 0 ? costoTotalAdq / clientesAds : 0;
    const cacBlended = totalNuevos > 0 ? costoTotalAdq / totalNuevos : 0;

    const margenMensual = state.precioMensual * state.margenBrutoPct; // $19.50
    const factorRetencion24 = (1 - Math.pow(1 - state.churn, 24)) / state.churn;
    const ltv24m = margenMensual * factorRetencion24;
    const ltvInfinito = margenMensual / state.churn;

    const ratioPaid = cacPaid > 0 ? ltv24m / cacPaid : 0;
    const ratioBlended = cacBlended > 0 ? ltv24m / cacBlended : 0;

    // CAC Marginal al subir frente a $10,000 base
    let cacMarginal = 0;
    if (state.inversionAds > 10000) {
      const trialsBase = 500;
      const clientesAdsBase = 70;
      const costoTotalBase = 10000 + 1200 + (70 * 20); // 12,600
      const extraCosto = costoTotalAdq - costoTotalBase;
      const extraClientes = clientesAds - clientesAdsBase;
      cacMarginal = extraClientes > 0 ? extraCosto / extraClientes : 0;
    }

    const paybackMeses = cacPaid > 0 ? Math.ceil(cacPaid / margenMensual) : 0;

    return {
      trials,
      vendedoras,
      clientesAds,
      totalNuevos,
      costoTotalAdq,
      cacPaid,
      cacBlended,
      margenMensual,
      ltv24m,
      ltvInfinito,
      ratioPaid,
      ratioBlended,
      cacMarginal,
      paybackMeses
    };
  }

  function simulate24m(planKey) {
    const plans = {
      actual: { inv: Array(24).fill(10000), conv: 0.14, churn: 0.06, annual: 0.0 },
      valeria: { inv: Array(24).fill(30000), conv: 0.14, churn: 0.06, annual: 0.0 },
      conservative: { inv: Array(24).fill(5000), conv: 0.14, churn: 0.06, annual: 0.0 },
      master: { inv: Array(24).fill(12000), conv: 0.18, churn: 0.045, annual: 0.20 }
    };

    const cfg = plans[planKey] || plans.actual;
    let cash = 60000.0;
    const floor = 10000.0;
    const fixedCosts = 14000.0;
    let activeClients = 1150.0;
    const annualCohorts = [];
    const rows = [];
    let minCash = cash;
    let minCashMonth = 0;

    for (let m = 1; m <= 24; m++) {
      const inv = cfg.inv[m - 1];
      const trials = interp(inv, adsCurve);
      const reps = trials > 0 ? Math.ceil(trials / 500.0) : 0;
      const adPaying = trials * cfg.conv;
      const organicPaying = 50.0;
      const totalNew = adPaying + organicPaying;

      const newAnnual = totalNew * cfg.annual;
      const newMonthly = totalNew * (1.0 - cfg.annual);

      activeClients = (activeClients * (1.0 - cfg.churn)) + newMonthly;

      let inflows = activeClients * (25.0 * 0.78);
      if (newAnnual > 0) {
        annualCohorts.push({ month: m, count: newAnnual });
        inflows += newAnnual * (240.0 * 0.78);
      }

      // Renovaciones anuales
      for (let ac of annualCohorts) {
        if (m - ac.month === 12) {
          inflows += (ac.count * 0.70) * (240.0 * 0.78);
        }
      }

      const outflows = inv + (reps * 1200.0) + (adPaying * 20.0) + fixedCosts;
      const netFlow = inflows - outflows;
      cash += netFlow;

      if (cash < minCash) {
        minCash = cash;
        minCashMonth = m;
      }

      rows.push({
        mes: m,
        inv,
        trials,
        reps,
        totalNew,
        activeClients,
        entradas: inflows,
        salidas: outflows,
        flujoNeto: netFlow,
        cajaFinal: cash,
        alerta: cash < floor ? 'PELIGRO PISO' : 'OK'
      });
    }

    return { rows, minCash, minCashMonth, finalCash: cash, finalActiveClients: activeClients };
  }

  function updateDOM() {
    const u = calculateUnitEconomics();

    const elCacPaid = document.getElementById('agendo-val-cacpaid');
    const elCacBlended = document.getElementById('agendo-val-cacblended');
    const elLtv24m = document.getElementById('agendo-val-ltv24m');
    const elLtvCacPaid = document.getElementById('agendo-val-ltvcacpaid');
    const elPayback = document.getElementById('agendo-val-payback');
    const elVendedoras = document.getElementById('agendo-val-vendedoras');
    const elCacMarginal = document.getElementById('agendo-val-cacmarginal');
    const elSemaforo = document.getElementById('agendo-semaforo-ltv');

    if (elCacPaid) elCacPaid.textContent = `$${u.cacPaid.toFixed(2)}`;
    if (elCacBlended) elCacBlended.textContent = `$${u.cacBlended.toFixed(2)}`;
    if (elLtv24m) elLtv24m.textContent = `$${u.ltv24m.toFixed(2)}`;
    if (elLtvCacPaid) elLtvCacPaid.textContent = `${u.ratioPaid.toFixed(2)}x`;
    if (elPayback) elPayback.textContent = `${u.paybackMeses} meses`;
    if (elVendedoras) elVendedoras.textContent = `${u.vendedoras} (${(u.trials / (u.vendedoras * 500 || 1) * 100).toFixed(0)}% cupo)`;
    if (elCacMarginal) elCacMarginal.textContent = u.cacMarginal > 0 ? `$${u.cacMarginal.toFixed(2)}` : 'N/A';

    if (elSemaforo) {
      elSemaforo.className = 'badge-status ' + (u.ratioPaid >= 3.0 ? 'good' : u.ratioPaid >= 1.0 ? 'warn' : 'danger');
      elSemaforo.textContent = u.ratioPaid >= 3.0 ? 'Sano (>3x)' : u.ratioPaid >= 1.0 ? 'Precario (1x-3x)' : 'Destructivo (<1x)';
    }

    const bInv = document.getElementById('badge-agendo-inv');
    const bConv = document.getElementById('badge-agendo-conv');
    const bChurn = document.getElementById('badge-agendo-churn');
    const bAnual = document.getElementById('badge-agendo-anual');

    if (bInv) bInv.textContent = `$${state.inversionAds.toLocaleString()}`;
    if (bConv) bConv.textContent = `${(state.trialConv * 100).toFixed(0)}%`;
    if (bChurn) bChurn.textContent = `${(state.churn * 100).toFixed(1)}%`;
    if (bAnual) bAnual.textContent = `${(state.pctAnual * 100).toFixed(0)}%`;

    renderCharts(u);
    renderSimulationTable(state.activePlan);
  }

  function renderCharts(u) {
    if (!window.ChartsEngine || !window.ChartsEngine.isAvailable) return;

    // Gráfico 1: La Trampa de Valeria (LTV:CAC reportado vs Paid vs Marginal)
    chartTrap = window.ChartsEngine.createOrUpdate(chartTrap, 'chart-agendo-trap', {
      type: 'bar',
      data: {
        labels: ['Reportado por Valeria (Blended)', 'Real Anuncios (Paid)', 'Marginal si Triplica a $30k'],
        datasets: [{
          label: 'Ratio LTV : CAC (x)',
          data: [2.39, u.ratioPaid, 0.63],
          backgroundColor: ['#6fa0c4', '#1e354a', '#c97d8b'],
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Múltiplo LTV:CAC (x)' }
          }
        }
      }
    });

    // Gráfico 2: Curva de Caja acumulada (Mensual vs Anual)
    const curveLabels = Array.from({ length: 25 }, (_, i) => `M${i}`);
    const curveMensual = [-u.cacPaid];
    const curveAnual = [-u.cacPaid + (240.0 * 0.78)]; // paga de inmediato
    let accumMensual = -u.cacPaid;

    for (let m = 1; m <= 24; m++) {
      accumMensual += Math.pow(1 - state.churn, m - 1) * u.margenMensual;
      curveMensual.push(accumMensual);

      // Anual mantiene hasta mes 12 y renueva mes 13
      if (m <= 12) {
        curveAnual.push(curveAnual[1]);
      } else {
        curveAnual.push(curveAnual[1] + (0.70 * 240.0 * 0.78));
      }
    }

    chartCashCurve = window.ChartsEngine.createOrUpdate(chartCashCurve, 'chart-agendo-cashcurve', {
      type: 'line',
      data: {
        labels: curveLabels,
        datasets: [
          {
            label: 'Cliente Mensual ($25/mes)',
            data: curveMensual,
            borderColor: '#1e354a',
            tension: 0.2
          },
          {
            label: 'Cliente Anual ($240 adelantado)',
            data: curveAnual,
            borderColor: '#6fa0c4',
            tension: 0.2
          },
          {
            label: 'Línea de Equilibrio ($0)',
            data: Array(25).fill(0),
            borderColor: '#888888',
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: {
        scales: {
          y: { title: { display: true, text: 'Caja Neta Acumulada por Cliente ($)' } }
        }
      }
    });

    // Gráfico 3: LTV frente a CAC Paid vs Blended
    chartLtvCac = window.ChartsEngine.createOrUpdate(chartLtvCac, 'chart-agendo-ltvcac', {
      type: 'bar',
      data: {
        labels: ['CAC Paid (Real)', 'CAC Blended (Valeria)', 'LTV a 24 Meses'],
        datasets: [{
          label: 'Dólares ($)',
          data: [u.cacPaid, u.cacBlended, u.ltv24m],
          backgroundColor: ['#1e354a', '#6fa0c4', '#b88a4c'],
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Dólares ($)' } }
        }
      }
    });
  }

  function renderSimulationTable(planKey) {
    const sim = simulate24m(planKey);
    const tbody = document.getElementById('tbody-agendo-24m');
    if (!tbody) return;

    tbody.innerHTML = '';
    sim.rows.forEach(r => {
      const tr = document.createElement('tr');
      if (r.cajaFinal < 10000) tr.className = 'highlight-danger';
      tr.innerHTML = `
        <td><strong>Mes ${r.mes}</strong></td>
        <td>$${r.inv.toLocaleString()}</td>
        <td>${r.trials.toFixed(0)}</td>
        <td>${r.reps}</td>
        <td>${r.totalNew.toFixed(1)}</td>
        <td><strong>${r.activeClients.toFixed(0)}</strong></td>
        <td>$${r.entradas.toFixed(0)}</td>
        <td>$${r.salidas.toFixed(0)}</td>
        <td style="color:${r.flujoNeto >= 0 ? '#1b5e20' : '#991b1b'};font-weight:600;">$${r.flujoNeto.toFixed(0)}</td>
        <td><strong>$${r.cajaFinal.toFixed(0)}</strong></td>
        <td><span class="badge-status ${r.alerta === 'OK' ? 'good' : 'danger'}">${r.alerta}</span></td>
      `;
      tbody.appendChild(tr);
    });

    if (window.ChartsEngine && window.ChartsEngine.isAvailable) {
      chartSim24m = window.ChartsEngine.createOrUpdate(chartSim24m, 'chart-agendo-sim24m', {
        type: 'line',
        data: {
          labels: sim.rows.map(r => `M${r.mes}`),
          datasets: [
            {
              label: 'Saldo Bancario Final ($)',
              data: sim.rows.map(r => r.cajaFinal),
              borderColor: '#1e354a',
              backgroundColor: 'rgba(30, 53, 74, 0.08)',
              fill: true,
              tension: 0.25
            },
            {
              label: 'Piso de Seguridad ($10,000)',
              data: Array(24).fill(10000),
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
    const slInv = document.getElementById('slider-agendo-inv');
    const slConv = document.getElementById('slider-agendo-conv');
    const slChurn = document.getElementById('slider-agendo-churn');
    const slAnual = document.getElementById('slider-agendo-anual');
    const btnReset = document.getElementById('btn-agendo-reset');

    if (slInv) slInv.addEventListener('input', e => { state.inversionAds = parseFloat(e.target.value); updateDOM(); });
    if (slConv) slConv.addEventListener('input', e => { state.trialConv = parseFloat(e.target.value) / 100; updateDOM(); });
    if (slChurn) slChurn.addEventListener('input', e => { state.churn = parseFloat(e.target.value) / 100; updateDOM(); });
    if (slAnual) slAnual.addEventListener('input', e => { state.pctAnual = parseFloat(e.target.value) / 100; updateDOM(); });

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.inversionAds = 10000;
        state.trialConv = 0.14;
        state.churn = 0.06;
        state.pctAnual = 0.0;
        state.activePlan = 'actual';

        if (slInv) slInv.value = 10000;
        if (slConv) slConv.value = 14;
        if (slChurn) slChurn.value = 6;
        if (slAnual) slAnual.value = 0;

        document.querySelectorAll('.plan-btn-agendo').forEach(b => b.classList.remove('active'));
        const defPlan = document.querySelector('.plan-btn-agendo[data-plan="actual"]');
        if (defPlan) defPlan.classList.add('active');

        updateDOM();
      });
    }

    document.querySelectorAll('.plan-btn-agendo').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.plan-btn-agendo').forEach(b => b.classList.remove('active'));
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

  return { init, updateDOM, reset: () => document.getElementById('btn-agendo-reset')?.click() };
})();
