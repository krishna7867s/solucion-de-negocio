/**
 * Caso B · Agendo (SaaS B2B para Barberías y Salones)
 * Nivel 1, Nivel 2 y Nivel 3 (Simulador 24 meses en tiempo real en 2 etapas)
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

  function getTramoMarginalCac(inv, conv) {
    if (inv <= 0) return 0;
    let x0 = 0, x1 = 5000;
    if (inv <= 5000) { x0 = 0; x1 = 5000; }
    else if (inv <= 10000) { x0 = 5000; x1 = 10000; }
    else if (inv <= 15000) { x0 = 10000; x1 = 15000; }
    else if (inv <= 20000) { x0 = 15000; x1 = 20000; }
    else { x0 = 20000; x1 = 30000; }

    const t0 = interp(x0, adsCurve);
    const t1 = interp(x1, adsCurve);
    const r0 = t0 > 0 ? Math.ceil(t0 / 500.0) : 0;
    const r1 = t1 > 0 ? Math.ceil(t1 / 500.0) : 0;
    const c0 = t0 * conv;
    const c1 = t1 * conv;
    const cost0 = x0 + r0 * 1200 + c0 * 20;
    const cost1 = x1 + r1 * 1200 + c1 * 20;
    return c1 > c0 ? (cost1 - cost0) / (c1 - c0) : 0;
  }

  const state = {
    inversionAds: 10000,
    trialConv: 0.14,
    churn: 0.06,
    precioMensual: 25.0,
    pctAnual: 0.0
  };

  const rtState = {
    inv1: 10000,
    inv2: 15000,
    onboard: true,
    annual: true,
    activePreset: 'master'
  };

  let chartTrap = null;
  let chartCashCurve = null;
  let chartLtvCac = null;
  let chartMarginal = null;
  let chartSim24m = null;

  function calculateUnitEconomics() {
    const trials = interp(state.inversionAds, adsCurve);
    const vendedoras = trials > 0 ? Math.ceil(trials / 500.0) : 0;
    const clientesAds = trials * state.trialConv;
    const totalNuevos = clientesAds + 50.0;

    const costoTotalAdq = state.inversionAds + vendedoras * 1200.0 + clientesAds * 20.0;
    const cacPaid = clientesAds > 0 ? costoTotalAdq / clientesAds : 0;
    const cacBlended = totalNuevos > 0 ? costoTotalAdq / totalNuevos : 0;
    const cacMarginal = getTramoMarginalCac(state.inversionAds, state.trialConv);

    const margenMensual = state.precioMensual * 0.78;
    const factorRetencion24 = (1 - Math.pow(1 - state.churn, 24)) / state.churn;
    const ltv24m = margenMensual * factorRetencion24;
    const ltvInfinito = margenMensual / state.churn;

    const ratioPaid = cacPaid > 0 ? ltv24m / cacPaid : 0;

    let accum = -cacPaid;
    let paybackMes = null;
    for (let m = 1; m <= 24; m++) {
      accum += Math.pow(1 - state.churn, m - 1) * margenMensual;
      if (paybackMes === null && accum >= 0) {
        paybackMes = m;
      }
    }

    return {
      trials,
      vendedoras,
      clientesAds,
      totalNuevos,
      cacPaid,
      cacBlended,
      cacMarginal,
      margenMensual,
      ltv24m,
      ltvInfinito,
      ratioPaid,
      paybackTexto: cacPaid === 0 ? 'Inmediato' : paybackMes !== null ? `${paybackMes}m` : '>24m'
    };
  }

  function runSimulation24m(config) {
    let cash = 60000.0;
    const floor = 10000.0;
    const fixedCosts = 14000.0;
    let activeClients = 1150.0;

    const conv = config.onboard ? 0.18 : 0.14;
    const churn = config.onboard ? 0.045 : 0.06;
    const annualShare = config.annual ? 0.25 : 0.0;

    const annualCohorts = [];
    const rows = [];
    const cashSeries = [60000.0];
    let minCash = cash;
    let minCashMonth = 0;

    for (let m = 1; m <= 24; m++) {
      const inv = m <= 4 ? config.inv1 : config.inv2;
      const trials = interp(inv, adsCurve);
      const reps = trials > 0 ? Math.ceil(trials / 500.0) : 0;
      const adPaying = trials * conv;
      const organicPaying = 50.0;
      const totalNew = adPaying + organicPaying;

      const newAnnual = totalNew * annualShare;
      const newMonthly = totalNew * (1.0 - annualShare);

      activeClients = activeClients * (1.0 - churn) + newMonthly;

      let inflows = activeClients * (25.0 * 0.78);
      if (newAnnual > 0) {
        annualCohorts.push({ month: m, count: newAnnual });
        inflows += newAnnual * (240.0 * 0.78);
      }

      for (let i = 0; i < annualCohorts.length; i++) {
        const ac = annualCohorts[i];
        if (m - ac.month === 12) {
          inflows += ac.count * 0.70 * (240.0 * 0.78);
        }
      }

      const outflows = inv + reps * 1200.0 + adPaying * 20.0 + fixedCosts;
      const netFlow = inflows - outflows;
      cash += netFlow;
      cashSeries.push(cash);

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
        rompePiso: cash < floor
      });
    }

    const trialsCfg = interp(config.inv1, adsCurve);
    const repsCfg = trialsCfg > 0 ? Math.ceil(trialsCfg / 500.0) : 0;
    const adClientsCfg = trialsCfg * conv;
    const cacPaidCfg = adClientsCfg > 0 ? (config.inv1 + repsCfg * 1200 + adClientsCfg * 20) / adClientsCfg : 0;
    const cacMargCfg = getTramoMarginalCac(config.inv2, conv);
    const ltv24Cfg = 19.50 * ((1 - Math.pow(1 - churn, 24)) / churn);

    return {
      rows,
      cashSeries,
      minCash,
      minCashMonth,
      finalCash: cash,
      finalActiveClients: activeClients,
      cacPaidCfg,
      cacMargCfg,
      ltv24Cfg
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

    setTxt('agendo-val-cacblended', `$${u.cacBlended.toFixed(2).replace('.', ',')}`);
    setTxt('agendo-val-cacpaid', `$${u.cacPaid.toFixed(2).replace('.', ',')}`);
    setTxt('agendo-val-vendedoras', `${u.vendedoras} (${u.vendedoras > 0 ? Math.round((u.trials / (u.vendedoras * 500)) * 100) : 0}% cupo)`);
    setTxt('agendo-val-cacmarginal', `$${u.cacMarginal.toFixed(2).replace('.', ',')}`);
    setTxt('agendo-val-cads', u.clientesAds.toFixed(1).replace('.', ','));
    setTxt('agendo-val-ltv24m', `$${u.ltv24m.toFixed(2).replace('.', ',')}`);
    setTxt('agendo-val-ltvinf', `$${u.ltvInfinito.toFixed(2).replace('.', ',')}`);
    setTxt('agendo-val-ltvcacpaid', `${u.ratioPaid.toFixed(2).replace('.', ',')}x`);
    setTxt('agendo-val-payback', u.paybackTexto);

    const elSem = document.getElementById('agendo-semaforo-ltv');
    if (elSem) {
      if (u.ratioPaid >= 3.0) {
        elSem.className = 'status-pill good';
        elSem.textContent = `LTV:CAC Paid ${u.ratioPaid.toFixed(2).replace('.', ',')}x (Verde)`;
      } else if (u.ratioPaid >= 1.0) {
        elSem.className = 'status-pill warn';
        elSem.textContent = `LTV:CAC Paid ${u.ratioPaid.toFixed(2).replace('.', ',')}x (Amarillo: 1x a 3x)`;
      } else {
        elSem.className = 'status-pill danger';
        elSem.textContent = `LTV:CAC Paid ${u.ratioPaid.toFixed(2).replace('.', ',')}x (Rojo: < 1x)`;
      }
    }

    setTxt('badge-agendo-inv', `$${state.inversionAds.toLocaleString('es-ES')}`);
    setTxt('badge-agendo-conv', `${Math.round(state.trialConv * 100)}%`);
    setTxt('badge-agendo-churn', `${(state.churn * 100).toFixed(1).replace('.', ',')}%`);
    setTxt('badge-agendo-precio', `$${state.precioMensual.toFixed(0)}`);
    setTxt('badge-agendo-anual', `${Math.round(state.pctAnual * 100)}%`);

    renderLevel2Charts(u);
    updateRealtimeLevel3();
  }

  function renderLevel2Charts(u) {
    if (!window.ChartsEngine || !window.ChartsEngine.isAvailable) return;

    chartTrap = window.ChartsEngine.createOrUpdate(chartTrap, 'chart-agendo-trap', {
      type: 'bar',
      data: {
        labels: ['Lámina Valeria (2,40x)', 'Paid Real Actual', 'Marginal a $30k (0,63x)'],
        datasets: [{
          label: 'LTV:CAC (x)',
          data: [2.40, Number(u.ratioPaid.toFixed(2)), 0.63],
          backgroundColor: ['#d47a9e', '#3d231a', '#c94a5e'],
          borderRadius: 5
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    const labels24 = Array.from({ length: 25 }, (_, i) => `M${i}`);
    const curveMensual = [-u.cacPaid];
    const curveAnual = [-u.cacPaid + 240.0 * 0.78];
    let accM = -u.cacPaid;

    for (let m = 1; m <= 24; m++) {
      accM += Math.pow(1 - state.churn, m - 1) * u.margenMensual;
      curveMensual.push(Number(accM.toFixed(2)));
      if (m <= 12) {
        curveAnual.push(Number(curveAnual[1].toFixed(2)));
      } else {
        curveAnual.push(Number((curveAnual[1] + 0.70 * 240.0 * 0.78).toFixed(2)));
      }
    }

    chartCashCurve = window.ChartsEngine.createOrUpdate(chartCashCurve, 'chart-agendo-cashcurve', {
      type: 'line',
      data: {
        labels: labels24,
        datasets: [
          {
            label: 'Cliente Mensual',
            data: curveMensual,
            borderColor: '#3d231a',
            borderWidth: 2.3,
            tension: 0.2,
            pointRadius: 1.5
          },
          {
            label: 'Cliente Plan Anual ($240 Día 1)',
            data: curveAnual,
            borderColor: '#2e7d32',
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 1.5
          },
          {
            label: 'Línea del Cero ($0)',
            data: Array(25).fill(0),
            borderColor: '#777777',
            borderDash: [3, 3],
            borderWidth: 1.2,
            pointRadius: 0
          }
        ]
      }
    });

    chartLtvCac = window.ChartsEngine.createOrUpdate(chartLtvCac, 'chart-agendo-ltvcac', {
      type: 'bar',
      data: {
        labels: ['CAC Paid Real', 'LTV 24 Meses', 'Umbral 1:1', 'Umbral 3:1'],
        datasets: [{
          label: 'Dólares ($)',
          data: [
            Number(u.cacPaid.toFixed(2)),
            Number(u.ltv24m.toFixed(2)),
            Number(u.cacPaid.toFixed(2)),
            Number((u.cacPaid * 3).toFixed(2))
          ],
          backgroundColor: ['#3d231a', '#d47a9e', '#d49b35', '#5a9e68'],
          borderRadius: 5
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    chartMarginal = window.ChartsEngine.createOrUpdate(chartMarginal, 'chart-agendo-marginal', {
      type: 'bar',
      data: {
        labels: ['$5k', '$10k (Hoy)', '$15k', '$20k', '$30k (Valeria)'],
        datasets: [
          {
            type: 'line',
            label: 'Trials de Anuncios',
            data: [290, 500, 650, 760, 900],
            borderColor: '#3d231a',
            backgroundColor: '#3d231a',
            borderWidth: 2.3,
            yAxisID: 'y'
          },
          {
            type: 'bar',
            label: 'CAC Marginal Tramo ($)',
            data: [173.16, 196.21, 318.10, 344.68, 526.32],
            backgroundColor: ['#5a9e68', '#d49b35', '#d47a9e', '#c94a5e', '#871c2d'],
            borderRadius: 5,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        scales: {
          y: { type: 'linear', position: 'left', beginAtZero: true, title: { display: true, text: 'Trials' } },
          y1: { type: 'linear', position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'CAC Marginal ($)' } }
        }
      }
    });
  }

  function updateRealtimeLevel3() {
    const liveSim = runSimulation24m(rtState);

    const planActual = runSimulation24m({ inv1: 10000, inv2: 10000, onboard: false, annual: false });
    const planValeria = runSimulation24m({ inv1: 30000, inv2: 30000, onboard: false, annual: false });
    const planFijo = runSimulation24m({ inv1: 12000, inv2: 12000, onboard: true, annual: true });
    const planMaster = runSimulation24m({ inv1: 10000, inv2: 15000, onboard: true, annual: true });

    const banner = document.getElementById('agendo-rt-verdict');
    const titleEl = document.getElementById('agendo-verdict-title');
    const descEl = document.getElementById('agendo-verdict-desc');
    const kpiMin = document.getElementById('agendo-vkpi-min');
    const kpiFinal = document.getElementById('agendo-vkpi-final');
    const kpiSubs = document.getElementById('agendo-vkpi-subs');
    const kpiCac = document.getElementById('agendo-vkpi-cac');

    const invLabel = rtState.inv1 === rtState.inv2
      ? `${formatMoney(rtState.inv1)} fijos`
      : `${formatMoney(rtState.inv1)} (M1-4) -> ${formatMoney(rtState.inv2)} (M5-24)`;

    if (kpiMin) kpiMin.textContent = `${formatMoney(liveSim.minCash)} (M${liveSim.minCashMonth})`;
    if (kpiFinal) kpiFinal.textContent = formatMoney(liveSim.finalCash);
    if (kpiSubs) kpiSubs.textContent = `${Math.round(liveSim.finalActiveClients)} activas`;
    if (kpiCac) kpiCac.textContent = rtState.inv1 > 0 ? `$${liveSim.cacPaidCfg.toFixed(2).replace('.', ',')}` : '$0';

    if (banner && titleEl && descEl) {
      if (liveSim.minCash < 10000) {
        banner.className = 'verdict-live-banner danger';
        const firstBreak = liveSim.rows.find(r => r.rompePiso);
        titleEl.textContent = `NO ES BUENO PARA INVERTIR (${invLabel}) — PERFORA EL PISO DE $10.000 EN EL MES ${firstBreak ? firstBreak.mes : liveSim.minCashMonth}`;
        descEl.textContent = `Con esta pauta la caja cae a ${formatMoney(liveSim.minCash)}, rompiendo el piso de seguridad de Ricardo. El CAC marginal ($${liveSim.cacMargCfg.toFixed(2)}) destruye valor frente al LTV.`;
      } else if (liveSim.cacMargCfg > liveSim.ltv24Cfg) {
        banner.className = 'verdict-live-banner warn';
        titleEl.textContent = `PRECAUCIÓN (${invLabel}) — EL CAC MARGINAL SUPERA EL LTV DE 24 MESES`;
        descEl.textContent = `No rompe el piso de $10.000 (mínimo ${formatMoney(liveSim.minCash)}), pero en la Etapa 2 cada cliente extra cuesta $${liveSim.cacMargCfg.toFixed(2)} frente a un LTV de $${liveSim.ltv24Cfg.toFixed(2)}.`;
      } else {
        banner.className = 'verdict-live-banner good';
        titleEl.textContent = `SÍ ES BUENO PARA INVERTIR (${invLabel}) — JUGADA RENTABLE Y SIN DESPERDICIO DE CUPO`;
        descEl.textContent = `Respeta siempre el piso de $10.000 (mínimo ${formatMoney(liveSim.minCash)} en M${liveSim.minCashMonth}), aprovecha el cupo de vendedoras y cierra el Mes 24 con ${formatMoney(liveSim.finalCash)} y ${Math.round(liveSim.finalActiveClients)} barberías activas.`;
      }
    }

    if (window.ChartsEngine && window.ChartsEngine.isAvailable) {
      const labels24 = Array.from({ length: 25 }, (_, i) => `M${i}`);
      const liveColor = liveSim.minCash < 10000 ? '#c94a5e' : '#2e7d32';
      const liveBg = liveSim.minCash < 10000 ? 'rgba(201, 74, 94, 0.14)' : 'rgba(46, 125, 50, 0.12)';

      chartSim24m = window.ChartsEngine.createOrUpdate(chartSim24m, 'chart-agendo-sim24m', {
        type: 'line',
        data: {
          labels: labels24,
          datasets: [
            {
              label: `Tu Simulación en Vivo (${invLabel})`,
              data: liveSim.cashSeries.map(v => Math.round(v)),
              borderColor: liveColor,
              backgroundColor: liveBg,
              borderWidth: 3,
              fill: true,
              tension: 0.2,
              pointRadius: 2.5
            },
            {
              label: 'Plan Hoy ($10.000 fijos)',
              data: planActual.cashSeries.map(v => Math.round(v)),
              borderColor: '#3d231a',
              borderDash: [5, 4],
              borderWidth: 2,
              fill: false,
              tension: 0.2,
              pointRadius: 0
            },
            {
              label: 'Propuesta Valeria ($30.000 fijos)',
              data: planValeria.cashSeries.map(v => Math.round(v)),
              borderColor: '#c94a5e',
              borderDash: [3, 3],
              borderWidth: 1.8,
              fill: false,
              tension: 0.2,
              pointRadius: 0
            },
            {
              label: 'Piso de Seguridad ($10.000)',
              data: Array(25).fill(10000),
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

    const tbodyComp = document.getElementById('tbody-agendo-compare');
    if (tbodyComp) {
      const compRows = [
        { name: 'Tu Simulación en Vivo', inv: invLabel, sim: liveSim, cls: 'row-live' },
        { name: 'Plan 1: Hoy ($10.000 fijos)', inv: '$10.000 fijos', sim: planActual, cls: '' },
        { name: 'Plan 2: Valeria ($30.000 fijos)', inv: '$30.000 fijos', sim: planValeria, cls: 'row-danger' },
        { name: 'Plan 3: Propio Fijo ($12k + Anual)', inv: '$12.000 fijos', sim: planFijo, cls: '' },
        { name: 'Plan 4: Jugada Maestra ($10k->$15k + Anual)', inv: '$10k -> $15k', sim: planMaster, cls: 'row-winner' }
      ];

      tbodyComp.innerHTML = compRows.map(item => `
        <tr class="${item.cls}">
          <td><strong>${item.name}</strong></td>
          <td>${item.inv}</td>
          <td>${formatMoney(item.sim.minCash)} (M${item.sim.minCashMonth})</td>
          <td><strong>${formatMoney(item.sim.finalCash)}</strong></td>
          <td>${Math.round(item.sim.finalActiveClients)}</td>
        </tr>
      `).join('');
    }

    const tbody24 = document.getElementById('tbody-agendo-24m');
    if (tbody24) {
      tbody24.innerHTML = liveSim.rows.map(r => `
        <tr class="${r.rompePiso ? 'row-danger' : ''}">
          <td><strong>M${r.mes}</strong></td>
          <td>${formatMoney(r.inv)}</td>
          <td>${Math.round(r.trials)}</td>
          <td>${r.reps}</td>
          <td>${r.totalNew.toFixed(1)}</td>
          <td><strong>${Math.round(r.activeClients)}</strong></td>
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
      rtState.inv1 = 10000;
      rtState.inv2 = 10000;
      rtState.onboard = false;
      rtState.annual = false;
    } else if (planKey === 'valeria') {
      rtState.inv1 = 30000;
      rtState.inv2 = 30000;
      rtState.onboard = false;
      rtState.annual = false;
    } else if (planKey === 'conservative') {
      rtState.inv1 = 12000;
      rtState.inv2 = 12000;
      rtState.onboard = true;
      rtState.annual = true;
    } else {
      rtState.inv1 = 10000;
      rtState.inv2 = 15000;
      rtState.onboard = true;
      rtState.annual = true;
    }

    const num1 = document.getElementById('agendo-rt-inv-num');
    const sld1 = document.getElementById('agendo-rt-inv-slider');
    const num2 = document.getElementById('agendo-rt-inv2-num');
    const sld2 = document.getElementById('agendo-rt-inv2-slider');
    const chkOnb = document.getElementById('agendo-rt-onboard');
    const chkAnn = document.getElementById('agendo-rt-annual');

    if (num1) num1.value = rtState.inv1;
    if (sld1) sld1.value = rtState.inv1;
    if (num2) num2.value = rtState.inv2;
    if (sld2) sld2.value = rtState.inv2;
    if (chkOnb) chkOnb.checked = rtState.onboard;
    if (chkAnn) chkAnn.checked = rtState.annual;

    updateRealtimeLevel3();
  }

  function initListeners() {
    const bindSlider = (id, prop, transform = v => v) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', e => {
        state[prop] = transform(parseFloat(e.target.value));
        updateDOM();
      });
    };

    bindSlider('slider-agendo-inv', 'inversionAds');
    bindSlider('slider-agendo-conv', 'trialConv', v => v / 100);
    bindSlider('slider-agendo-churn', 'churn', v => v / 100);
    bindSlider('slider-agendo-precio', 'precioMensual');
    bindSlider('slider-agendo-anual', 'pctAnual', v => v / 100);

    const btnReset = document.getElementById('btn-agendo-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.inversionAds = 10000;
        state.trialConv = 0.14;
        state.churn = 0.06;
        state.precioMensual = 25.0;
        state.pctAnual = 0.0;

        const setVal = (id, v) => {
          const el = document.getElementById(id);
          if (el) el.value = v;
        };
        setVal('slider-agendo-inv', 10000);
        setVal('slider-agendo-conv', 14);
        setVal('slider-agendo-churn', 6);
        setVal('slider-agendo-precio', 25);
        setVal('slider-agendo-anual', 0);

        updateDOM();
      });
    }

    const num1 = document.getElementById('agendo-rt-inv-num');
    const sld1 = document.getElementById('agendo-rt-inv-slider');
    const num2 = document.getElementById('agendo-rt-inv2-num');
    const sld2 = document.getElementById('agendo-rt-inv2-slider');
    const chkOnb = document.getElementById('agendo-rt-onboard');
    const chkAnn = document.getElementById('agendo-rt-annual');

    const clearPresetActive = () => {
      document.querySelectorAll('.plan-btn-agendo').forEach(b => b.classList.remove('active'));
    };

    if (num1) {
      num1.addEventListener('input', e => {
        const val = Math.max(0, Math.min(30000, parseFloat(e.target.value) || 0));
        rtState.inv1 = val;
        if (sld1) sld1.value = val;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }
    if (sld1) {
      sld1.addEventListener('input', e => {
        const val = parseFloat(e.target.value) || 0;
        rtState.inv1 = val;
        if (num1) num1.value = val;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }
    if (num2) {
      num2.addEventListener('input', e => {
        const val = Math.max(0, Math.min(30000, parseFloat(e.target.value) || 0));
        rtState.inv2 = val;
        if (sld2) sld2.value = val;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }
    if (sld2) {
      sld2.addEventListener('input', e => {
        const val = parseFloat(e.target.value) || 0;
        rtState.inv2 = val;
        if (num2) num2.value = val;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }

    if (chkOnb) {
      chkOnb.addEventListener('change', e => {
        rtState.onboard = e.target.checked;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }
    if (chkAnn) {
      chkAnn.addEventListener('change', e => {
        rtState.annual = e.target.checked;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    }

    document.querySelectorAll('.plan-btn-agendo').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.plan-btn-agendo').forEach(b => b.classList.remove('active'));
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
