/**
 * Lógica Financiera e Interactiva: Caso A · Tueste
 * Resuelve Nivel 1, Nivel 2 (Tablero en vivo) y Nivel 3 (Simulador 24 meses)
 */

window.CasoATueste = (function() {
  const metaHistorical = [
    { x: 0, y: 0 },
    { x: 4000, y: 100 },
    { x: 8000, y: 165 },
    { x: 12000, y: 210 },
    { x: 16000, y: 235 },
    { x: 20000, y: 250 }
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
    inversionMeta: 8000,
    precioBolsa: 17.0,
    costoCafeBolsa: 5.44,
    costoEnvio: 4.5,
    pctSuscriptores: 0.15,
    churnMensual: 0.09,
    feeAgencia: 1000,
    descuentoPrimerPedido: 0.0,
    activePlan: 'actual' // actual, agency, conservative, master
  };

  // Instancias de Chart.js
  let chartTrap = null;
  let chartCashCurve = null;
  let chartLtvCac = null;
  let chartSim24m = null;

  function calculateUnitEconomics() {
    const precioSuelto = state.precioBolsa * 2;
    const precioConDesc = precioSuelto * (1 - state.descuentoPrimerPedido);
    const precioSub = precioSuelto * 0.9; // 10% desc

    const costoCafe2 = state.costoCafeBolsa * 2;
    const pasarelaSuelto = precioConDesc * 0.045;
    const pasarelaSub = precioSub * 0.045;

    const costoDirSuelto = costoCafe2 + state.costoEnvio + pasarelaSuelto + 1.2;
    const costoDirSub = costoCafe2 + state.costoEnvio + pasarelaSub + 1.2;

    const margenSuelto = precioConDesc - costoDirSuelto;
    const margenSueltoPct = margenSuelto / precioConDesc;
    const roasBreakEven = 1 / margenSueltoPct;

    const margenSub = precioSub - costoDirSub;
    const margenSubPct = margenSub / precioSub;

    // Clientes Meta interpolados
    const clientesMeta = interp(state.inversionMeta, metaHistorical);
    const cacPauta = state.inversionMeta > 0 ? state.inversionMeta / clientesMeta : 0;
    const cacReal = state.inversionMeta > 0 ? (state.inversionMeta + state.feeAgencia) / clientesMeta : 0;

    // ROAS real primer pedido
    const facturacionPrimerPedido = clientesMeta * precioConDesc;
    const roasRealPrimerPedido = state.inversionMeta > 0 ? facturacionPrimerPedido / state.inversionMeta : 0;

    // LTV a 12 meses
    const ltvSuelto = margenSuelto * 3.0; // 3 pedidos al año
    const factorRetencionSub = (1 - Math.pow(1 - state.churnMensual, 12)) / state.churnMensual;
    const ltvSub = margenSub * factorRetencionSub;
    const ltvBlended = (1 - state.pctSuscriptores) * ltvSuelto + state.pctSuscriptores * ltvSub;

    const ratioLtvCac = cacReal > 0 ? ltvBlended / cacReal : 0;

    // Margen mes 1 y Payback
    const margenMes1 = (1 - state.pctSuscriptores) * margenSuelto + state.pctSuscriptores * margenSub;
    const paybackMeses = cacReal > 0 ? Math.min(24, Math.ceil(cacReal / (ltvBlended / 12))) : 0;

    return {
      precioSuelto,
      precioConDesc,
      margenSuelto,
      margenSueltoPct,
      roasBreakEven,
      margenSub,
      clientesMeta,
      cacPauta,
      cacReal,
      roasRealPrimerPedido,
      ltvSuelto,
      ltvSub,
      ltvBlended,
      ratioLtvCac,
      margenMes1,
      paybackMeses
    };
  }

  function simulate24m(planKey) {
    const plans = {
      actual: { inv: Array(24).fill(8000), desc: 0.0, sub: 0.15, pack: false, fee: 1000 },
      agency: { inv: Array(24).fill(16000), desc: 0.30, sub: 0.15, pack: false, fee: 1000 },
      conservative: { inv: Array(24).fill(4000), desc: 0.0, sub: 0.15, pack: false, fee: 0 },
      master: { inv: Array(24).fill(6000), desc: 0.0, sub: 0.28, pack: true, fee: 0 }
    };

    const cfg = plans[planKey] || plans.actual;
    const looseSchedule = [1.00, 0.15, 0.20, 0.20, 0.20, 0.20, 0.20, 0.15, 0.15, 0.15, 0.20, 0.20];

    let cash = 35000.0;
    const floor = 5000.0;
    const fixedCosts = 6500.0;
    const contribLooseNorm = cfg.pack ? 18.50 : 15.89;
    const contribSub = 12.643;

    const cohorts = [];
    const rows = [];
    let minCash = cash;
    let minCashMonth = 0;
    let finalActiveSubs = 0;

    for (let m = 1; m <= 24; m++) {
      const inv = cfg.inv[m - 1];
      const metaNew = interp(inv, metaHistorical);
      const totalNew = metaNew + 47.0; // 47 orgánicos
      const looseNew = totalNew * (1 - cfg.sub);
      const subNew = totalNew * cfg.sub;

      cohorts.push({
        month: m,
        looseCount: looseNew,
        subCount: subNew,
        discount: cfg.desc
      });

      const existingContrib = 9000.0 * Math.pow(0.97, m - 1);
      let newGroupsContrib = 0.0;
      let activeSubs = 0.0;

      for (let c of cohorts) {
        const age = m - c.month + 1;
        let cOrderMargin = contribLooseNorm;
        let ordersPerClient = 1.0;

        if (age === 1) {
          cOrderMargin = c.discount > 0 ? 6.149 : contribLooseNorm;
          ordersPerClient = 1.0;
        } else if (age <= 12) {
          cOrderMargin = contribLooseNorm;
          ordersPerClient = looseSchedule[age - 1];
        } else {
          cOrderMargin = contribLooseNorm;
          ordersPerClient = 0.10;
        }

        newGroupsContrib += c.looseCount * ordersPerClient * cOrderMargin;

        const retention = Math.pow(0.91, age - 1);
        const currentSubs = c.subCount * retention;
        activeSubs += currentSubs;
        newGroupsContrib += currentSubs * contribSub;
      }

      finalActiveSubs = activeSubs;
      const fee = inv > 0 ? cfg.fee : 0;
      const outflows = inv + fee + fixedCosts;
      const inflows = existingContrib + newGroupsContrib;
      const netFlow = inflows - outflows;
      cash += netFlow;

      if (cash < minCash) {
        minCash = cash;
        minCashMonth = m;
      }

      rows.push({
        mes: m,
        inv,
        clientesNuevos: totalNew,
        suscriptoresActivos: activeSubs,
        contribActuales: existingContrib,
        contribNuevos: newGroupsContrib,
        entradas: inflows,
        salidas: outflows,
        flujoNeto: netFlow,
        cajaFinal: cash,
        alerta: cash < floor ? 'PELIGRO PISO' : 'OK'
      });
    }

    return {
      rows,
      minCash,
      minCashMonth,
      finalCash: cash,
      finalActiveSubs
    };
  }

  function updateDOM() {
    const u = calculateUnitEconomics();

    // Actualizar valores en UI
    const elMargen = document.getElementById('tueste-val-margen');
    const elRoasBe = document.getElementById('tueste-val-roasbe');
    const elCacReal = document.getElementById('tueste-val-cacreal');
    const elLtv = document.getElementById('tueste-val-ltv');
    const elLtvCac = document.getElementById('tueste-val-ltvcac');
    const elPayback = document.getElementById('tueste-val-payback');
    const elRoasReal = document.getElementById('tueste-val-roasreal');
    const elSemaforo = document.getElementById('tueste-semaforo-ltv');

    if (elMargen) elMargen.textContent = `$${u.margenSuelto.toFixed(2)} (${(u.margenSueltoPct * 100).toFixed(1)}%)`;
    if (elRoasBe) elRoasBe.textContent = `${u.roasBreakEven.toFixed(2)}x`;
    if (elCacReal) elCacReal.textContent = `$${u.cacReal.toFixed(2)}`;
    if (elLtv) elLtv.textContent = `$${u.ltvBlended.toFixed(2)}`;
    if (elLtvCac) elLtvCac.textContent = `${u.ratioLtvCac.toFixed(2)}x`;
    if (elPayback) elPayback.textContent = `${u.paybackMeses} meses`;
    if (elRoasReal) elRoasReal.textContent = `${u.roasRealPrimerPedido.toFixed(2)}x`;

    if (elSemaforo) {
      elSemaforo.className = 'badge-status ' + (u.ratioLtvCac >= 3.0 ? 'good' : u.ratioLtvCac >= 1.0 ? 'warn' : 'danger');
      elSemaforo.textContent = u.ratioLtvCac >= 3.0 ? 'Excelente (>3x)' : u.ratioLtvCac >= 1.0 ? 'Precario (1x-3x)' : 'Destructivo (<1x)';
    }

    // Actualizar badges de inputs
    const bInv = document.getElementById('badge-tueste-inv');
    const bEnv = document.getElementById('badge-tueste-envio');
    const bSub = document.getElementById('badge-tueste-sub');
    const bDesc = document.getElementById('badge-tueste-desc');

    if (bInv) bInv.textContent = `$${state.inversionMeta.toLocaleString()}`;
    if (bEnv) bEnv.textContent = `$${state.costoEnvio.toFixed(2)}`;
    if (bSub) bSub.textContent = `${(state.pctSuscriptores * 100).toFixed(0)}%`;
    if (bDesc) bDesc.textContent = `${(state.descuentoPrimerPedido * 100).toFixed(0)}%`;

    renderCharts(u);
    renderSimulationTable(state.activePlan);
  }

  function renderCharts(u) {
    if (!window.ChartsEngine || !window.ChartsEngine.isAvailable) return;

    // Gráfico 1: La Trampa de ROAS
    chartTrap = window.ChartsEngine.createOrUpdate(chartTrap, 'chart-tueste-trap', {
      type: 'bar',
      data: {
        labels: ['ROAS Inflado (Meta Ads)', 'ROAS Mínimo Break-Even', 'ROAS Real Primer Pedido'],
        datasets: [{
          label: 'Ratio de Retorno de Facturación',
          data: [3.0, u.roasBreakEven, u.roasRealPrimerPedido],
          backgroundColor: ['#c46d6d', '#d89f66', '#3b2216'],
          borderRadius: 6
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Múltiplo de Retorno (x)' }
          }
        }
      }
    });

    // Gráfico 2: Curva de Caja acumulada de un cliente (Meses 0 a 12)
    const curveMonths = Array.from({ length: 13 }, (_, i) => `Mes ${i}`);
    const curveSuelto = [-u.cacReal];
    const curveSub = [-u.cacReal];
    let accumSuelto = -u.cacReal;
    let accumSub = -u.cacReal;

    const schedule = [1.00, 0.15, 0.20, 0.20, 0.20, 0.20, 0.20, 0.15, 0.15, 0.15, 0.20, 0.20];
    for (let m = 1; m <= 12; m++) {
      accumSuelto += schedule[m - 1] * u.margenSuelto;
      curveSuelto.push(accumSuelto);

      accumSub += Math.pow(1 - state.churnMensual, m - 1) * u.margenSub;
      curveSub.push(accumSub);
    }

    chartCashCurve = window.ChartsEngine.createOrUpdate(chartCashCurve, 'chart-tueste-cashcurve', {
      type: 'line',
      data: {
        labels: curveMonths,
        datasets: [
          {
            label: 'Cliente Suelto (85%)',
            data: curveSuelto,
            borderColor: '#3b2216',
            backgroundColor: '#3b2216',
            tension: 0.2
          },
          {
            label: 'Cliente Suscriptor (15%)',
            data: curveSub,
            borderColor: '#c46d6d',
            backgroundColor: '#c46d6d',
            tension: 0.2
          },
          {
            label: 'Punto de Equilibrio (Cero)',
            data: Array(13).fill(0),
            borderColor: '#888888',
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: {
        scales: {
          y: {
            title: { display: true, text: 'Caja Neta Acumulada ($)' }
          }
        }
      }
    });

    // Gráfico 3: LTV vs CAC con líneas 1:1 y 3:1
    chartLtvCac = window.ChartsEngine.createOrUpdate(chartLtvCac, 'chart-tueste-ltvcac', {
      type: 'bar',
      data: {
        labels: ['Costo Adquisición (CAC Real)', 'Valor Vida 12m (LTV)'],
        datasets: [{
          label: 'Dólares ($)',
          data: [u.cacReal, u.ltvBlended],
          backgroundColor: ['#5c3826', '#d89f66'],
          borderRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Dólares ($)' }
          }
        }
      }
    });
  }

  function renderSimulationTable(planKey) {
    const sim = simulate24m(planKey);
    const tbody = document.getElementById('tbody-tueste-24m');
    if (!tbody) return;

    tbody.innerHTML = '';
    sim.rows.forEach(r => {
      const tr = document.createElement('tr');
      if (r.cajaFinal < 5000) tr.className = 'highlight-danger';
      tr.innerHTML = `
        <td><strong>Mes ${r.mes}</strong></td>
        <td>$${r.inv.toLocaleString()}</td>
        <td>${r.clientesNuevos.toFixed(1)}</td>
        <td>${r.suscriptoresActivos.toFixed(0)}</td>
        <td>$${r.contribActuales.toFixed(0)}</td>
        <td>$${r.contribNuevos.toFixed(0)}</td>
        <td><strong>$${r.entradas.toFixed(0)}</strong></td>
        <td>$${r.salidas.toFixed(0)}</td>
        <td style="color:${r.flujoNeto >= 0 ? '#1b5e20' : '#991b1b'};font-weight:600;">$${r.flujoNeto.toFixed(0)}</td>
        <td><strong>$${r.cajaFinal.toFixed(0)}</strong></td>
        <td><span class="badge-status ${r.alerta === 'OK' ? 'good' : 'danger'}">${r.alerta}</span></td>
      `;
      tbody.appendChild(tr);
    });

    // Renderizar gráfico de trayectoria de caja 24m
    if (window.ChartsEngine && window.ChartsEngine.isAvailable) {
      chartSim24m = window.ChartsEngine.createOrUpdate(chartSim24m, 'chart-tueste-sim24m', {
        type: 'line',
        data: {
          labels: sim.rows.map(r => `M${r.mes}`),
          datasets: [
            {
              label: 'Saldo Bancario Final ($)',
              data: sim.rows.map(r => r.cajaFinal),
              borderColor: '#3b2216',
              backgroundColor: 'rgba(59, 34, 22, 0.08)',
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
    const slInv = document.getElementById('slider-tueste-inv');
    const slEnv = document.getElementById('slider-tueste-envio');
    const slSub = document.getElementById('slider-tueste-sub');
    const slDesc = document.getElementById('slider-tueste-desc');
    const btnReset = document.getElementById('btn-tueste-reset');

    if (slInv) {
      slInv.addEventListener('input', e => {
        state.inversionMeta = parseFloat(e.target.value);
        updateDOM();
      });
    }
    if (slEnv) {
      slEnv.addEventListener('input', e => {
        state.costoEnvio = parseFloat(e.target.value);
        updateDOM();
      });
    }
    if (slSub) {
      slSub.addEventListener('input', e => {
        state.pctSuscriptores = parseFloat(e.target.value) / 100;
        updateDOM();
      });
    }
    if (slDesc) {
      slDesc.addEventListener('input', e => {
        state.descuentoPrimerPedido = parseFloat(e.target.value) / 100;
        updateDOM();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.inversionMeta = 8000;
        state.costoEnvio = 4.5;
        state.pctSuscriptores = 0.15;
        state.descuentoPrimerPedido = 0.0;
        state.activePlan = 'actual';

        if (slInv) slInv.value = 8000;
        if (slEnv) slEnv.value = 4.5;
        if (slSub) slSub.value = 15;
        if (slDesc) slDesc.value = 0;

        document.querySelectorAll('.plan-btn-tueste').forEach(b => b.classList.remove('active'));
        const defPlan = document.querySelector('.plan-btn-tueste[data-plan="actual"]');
        if (defPlan) defPlan.classList.add('active');

        updateDOM();
      });
    }

    document.querySelectorAll('.plan-btn-tueste').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.plan-btn-tueste').forEach(b => b.classList.remove('active'));
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

  return { init, updateDOM, reset: () => document.getElementById('btn-tueste-reset')?.click() };
})();
