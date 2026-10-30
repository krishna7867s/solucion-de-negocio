/**
 * Caso A · Tueste (Café de Especialidad DTC)
 * Nivel 1, Nivel 2 (9 controles + 4 gráficos) y Nivel 3 (Simulador 24 meses en tiempo real en 2 etapas)
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

  const baseLooseSchedule = [1.00, 0.15, 0.20, 0.20, 0.20, 0.20, 0.20, 0.15, 0.15, 0.15, 0.20, 0.20];

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

  function getTramoMarginalCac(inv) {
    if (inv <= 0) return 0;
    if (inv <= 4000) return 4000 / 100; // $40.00
    if (inv <= 8000) return 4000 / (165 - 100); // $61.54
    if (inv <= 12000) return 4000 / (210 - 165); // $88.89
    if (inv <= 16000) return 4000 / (235 - 210); // $160.00
    return 4000 / (250 - 235); // $266.67
  }

  const state = {
    inversionMeta: 8000,
    precioBolsa: 17.0,
    costoCafeBolsa: 5.44,
    costoEnvio: 4.50,
    pctSuscriptores: 0.15,
    churnMensual: 0.09,
    pedidos12mSuelto: 3.00,
    feeAgencia: 1000,
    descuentoPrimerPedido: 0.0
  };

  // Estado del Nivel 3 en Tiempo Real (soporta 2 etapas: M1-M4 y M5-M24)
  const rtState = {
    inv1: 4000,
    inv2: 7500,
    pack: true,
    sub28: true,
    noAgency: true,
    desc30: false,
    activePreset: 'master'
  };

  let chartTrap = null;
  let chartCashCurve = null;
  let chartLtvCac = null;
  let chartMarginal = null;
  let chartSim24m = null;

  function calculateUnitEconomics() {
    const precioSuelto = state.precioBolsa * 2;
    const precioPrimerPedidoSuelto = precioSuelto * (1 - state.descuentoPrimerPedido);
    const precioSub = precioSuelto * 0.90;

    const costoCafe2 = state.costoCafeBolsa * 2;
    const pasarelaSueltoNormal = precioSuelto * 0.045;
    const pasarelaSueltoPrimero = precioPrimerPedidoSuelto * 0.045;
    const pasarelaSub = precioSub * 0.045;

    const margenSueltoNormal = precioSuelto - (costoCafe2 + state.costoEnvio + pasarelaSueltoNormal + 1.20);
    const margenSueltoPrimero = precioPrimerPedidoSuelto - (costoCafe2 + state.costoEnvio + pasarelaSueltoPrimero + 1.20);
    const margenSueltoPct = margenSueltoPrimero / precioPrimerPedidoSuelto;
    const roasBreakEven = margenSueltoPct > 0 ? 1 / margenSueltoPct : 99;

    const margenSub = precioSub - (costoCafe2 + state.costoEnvio + pasarelaSub + 1.20);

    const clientesMeta = interp(state.inversionMeta, metaHistorical);
    const feeEfectivo = state.inversionMeta > 0 ? state.feeAgencia : 0;
    const cacPauta = clientesMeta > 0 ? state.inversionMeta / clientesMeta : 0;
    const cacReal = clientesMeta > 0 ? (state.inversionMeta + feeEfectivo) / clientesMeta : 0;
    const cacMarginal = getTramoMarginalCac(state.inversionMeta);

    const facturacionPrimerPedido = clientesMeta * precioPrimerPedidoSuelto;
    const roasRealPrimerPedido = state.inversionMeta > 0 ? facturacionPrimerPedido / state.inversionMeta : 0;

    const pedidosRestantes = Math.max(0, state.pedidos12mSuelto - 1);
    const ltvSuelto = margenSueltoPrimero + pedidosRestantes * margenSueltoNormal;

    let factorSub12m = 0;
    for (let m = 1; m <= 12; m++) {
      factorSub12m += Math.pow(1 - state.churnMensual, m - 1);
    }
    const ltvSub = margenSub * factorSub12m;
    const ltvBlended = (1 - state.pctSuscriptores) * ltvSuelto + state.pctSuscriptores * ltvSub;
    const ratioLtvCac = cacReal > 0 ? ltvBlended / cacReal : 0;

    const scaleFactor = state.pedidos12mSuelto > 1 ? (state.pedidos12mSuelto - 1) / 2.0 : 0;
    let accum = -cacReal;
    const curveBlended = [accum];
    let paybackMes = null;

    for (let m = 1; m <= 12; m++) {
      const ordersLooseM = m === 1 ? 1.0 : baseLooseSchedule[m - 1] * scaleFactor;
      const marginLooseM = m === 1 ? margenSueltoPrimero : margenSueltoNormal;
      const contribLooseM = ordersLooseM * marginLooseM;
      const contribSubM = Math.pow(1 - state.churnMensual, m - 1) * margenSub;
      const blendedM = (1 - state.pctSuscriptores) * contribLooseM + state.pctSuscriptores * contribSubM;
      accum += blendedM;
      curveBlended.push(accum);
      if (paybackMes === null && accum >= 0) {
        paybackMes = m;
      }
    }

    return {
      precioSuelto,
      precioPrimerPedidoSuelto,
      margenSueltoNormal,
      margenSueltoPrimero,
      margenSueltoPct,
      roasBreakEven,
      margenSub,
      clientesMeta,
      cacPauta,
      cacReal,
      cacMarginal,
      roasRealPrimerPedido,
      ltvSuelto,
      ltvSub,
      ltvBlended,
      ratioLtvCac,
      curveBlended,
      paybackTexto: cacReal === 0 ? 'Inmediato' : paybackMes !== null ? `Mes ${paybackMes}` : '> 12 meses'
    };
  }

  function runSimulation24m(config) {
    let cash = 35000.0;
    const floor = 5000.0;
    const fixedCosts = 6500.0;

    // Pack de $48 (con envío gratis solo >$45; 2 bolsas pagan su envío de $4,50 -> margen promedio suelto sube a $21,50)
    const contribLooseNorm = config.pack ? 21.50 : 15.89;
    const contribLooseDiscount = 6.149;
    const contribSub = 12.643;
    const subShare = config.sub28 ? 0.28 : 0.15;
    const feeAmount = config.noAgency ? 0.0 : 1000.0;

    const cohorts = [];
    const rows = [];
    const cashSeries = [35000.0];
    let minCash = cash;
    let minCashMonth = 0;
    let finalActiveSubs = 0;
    let sumInv1to12 = 0;

    for (let m = 1; m <= 24; m++) {
      const inv = m <= 4 ? config.inv1 : config.inv2;
      if (m <= 12) sumInv1to12 += inv;

      const metaNew = interp(inv, metaHistorical);
      const totalNew = metaNew + 47.0;
      const looseNew = totalNew * (1 - subShare);
      const subNew = totalNew * subShare;

      cohorts.push({
        month: m,
        looseCount: looseNew,
        subCount: subNew,
        hasDiscount: config.desc30
      });

      const existingContrib = 9000.0 * Math.pow(0.97, m - 1);
      let newGroupsContrib = 0.0;
      let activeSubs = 0.0;

      for (let i = 0; i < cohorts.length; i++) {
        const c = cohorts[i];
        const age = m - c.month + 1;
        let orderMargin = contribLooseNorm;
        let ordersPerClient = 0.10;

        if (age === 1) {
          orderMargin = c.hasDiscount ? contribLooseDiscount : contribLooseNorm;
          ordersPerClient = 1.00;
        } else if (age <= 12) {
          orderMargin = contribLooseNorm;
          ordersPerClient = baseLooseSchedule[age - 1];
        } else {
          orderMargin = contribLooseNorm;
          ordersPerClient = 0.10;
        }

        newGroupsContrib += c.looseCount * ordersPerClient * orderMargin;

        const subRetention = Math.pow(0.91, age - 1);
        const currentCohortSubs = c.subCount * subRetention;
        activeSubs += currentCohortSubs;
        newGroupsContrib += currentCohortSubs * contribSub;
      }

      finalActiveSubs = activeSubs;
      const fee = inv > 0 ? feeAmount : 0.0;
      const outflows = inv + fee + fixedCosts;
      const inflows = existingContrib + newGroupsContrib;
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
        clientesNuevos: totalNew,
        suscriptoresActivos: activeSubs,
        contribActuales: existingContrib,
        contribNuevos: newGroupsContrib,
        entradas: inflows,
        salidas: outflows,
        flujoNeto: netFlow,
        cajaFinal: cash,
        rompePiso: cash < floor
      });
    }

    // Verificar en qué mes exacto se puede comprar la 2da tostadora ($14.000) sin que la caja futura baje nunca de $5.000
    let roasterMonth = null;
    for (let m = 1; m <= 24; m++) {
      let futureMin = Infinity;
      for (let k = m; k <= 24; k++) {
        if (cashSeries[k] < futureMin) futureMin = cashSeries[k];
      }
      if (futureMin - 14000 >= 5000) {
        roasterMonth = m;
        break;
      }
    }

    const avg1to12 = sumInv1to12 / 12.0;
    const violatesRule13 = config.inv2 < avg1to12 - 0.01;

    return {
      rows,
      cashSeries,
      minCash,
      minCashMonth,
      finalCash: cash,
      finalActiveSubs,
      roasterMonth,
      avg1to12,
      violatesRule13
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

    setTxt('tueste-val-margen', `$${u.margenSueltoPrimero.toFixed(2).replace('.', ',')} (${(u.margenSueltoPct * 100).toFixed(1).replace('.', ',')}%)`);
    setTxt('tueste-val-roasbe', `${u.roasBreakEven.toFixed(2).replace('.', ',')}x`);
    setTxt('tueste-val-cacreal', `$${u.cacReal.toFixed(2).replace('.', ',')}`);
    setTxt('tueste-val-cacmarg', `$${u.cacMarginal.toFixed(2).replace('.', ',')}`);
    setTxt('tueste-val-roasreal', `${u.roasRealPrimerPedido.toFixed(2).replace('.', ',')}x`);
    setTxt('tueste-val-cmeta', `${u.clientesMeta.toFixed(0)}`);
    setTxt('tueste-val-ltv', `$${u.ltvBlended.toFixed(2).replace('.', ',')}`);
    setTxt('tueste-val-ltvcac', `${u.ratioLtvCac.toFixed(2).replace('.', ',')}x`);
    setTxt('tueste-val-payback', u.paybackTexto);

    const elSem = document.getElementById('tueste-semaforo-ltv');
    if (elSem) {
      if (u.ratioLtvCac >= 3.0) {
        elSem.className = 'status-pill good';
        elSem.textContent = `LTV:CAC ${u.ratioLtvCac.toFixed(2).replace('.', ',')}x (Verde: >= 3x)`;
      } else if (u.ratioLtvCac >= 1.0) {
        elSem.className = 'status-pill warn';
        elSem.textContent = `LTV:CAC ${u.ratioLtvCac.toFixed(2).replace('.', ',')}x (Amarillo: 1x a 3x)`;
      } else {
        elSem.className = 'status-pill danger';
        elSem.textContent = `LTV:CAC ${u.ratioLtvCac.toFixed(2).replace('.', ',')}x (Rojo: < 1x · Pierde plata)`;
      }
    }

    setTxt('badge-tueste-inv', `$${state.inversionMeta.toLocaleString('es-ES')}`);
    setTxt('badge-tueste-precio', `$${state.precioBolsa.toFixed(2).replace('.', ',')}`);
    setTxt('badge-tueste-cafe', `$${state.costoCafeBolsa.toFixed(2).replace('.', ',')}`);
    setTxt('badge-tueste-envio', `$${state.costoEnvio.toFixed(2).replace('.', ',')}`);
    setTxt('badge-tueste-sub', `${Math.round(state.pctSuscriptores * 100)}%`);
    setTxt('badge-tueste-churn', `${(state.churnMensual * 100).toFixed(1).replace('.', ',')}%`);
    setTxt('badge-tueste-pedidos', state.pedidos12mSuelto.toFixed(2).replace('.', ','));
    setTxt('badge-tueste-fee', `$${state.feeAgencia.toLocaleString('es-ES')}`);
    setTxt('badge-tueste-desc', `${Math.round(state.descuentoPrimerPedido * 100)}%`);

    renderLevel2Charts(u);
    updateRealtimeLevel3();
  }

  function renderLevel2Charts(u) {
    if (!window.ChartsEngine || !window.ChartsEngine.isAvailable) return;

    chartTrap = window.ChartsEngine.createOrUpdate(chartTrap, 'chart-tueste-trap', {
      type: 'bar',
      data: {
        labels: ['ROAS Ads Manager (3,0)', 'ROAS Break-Even', 'ROAS Real 1er Pedido'],
        datasets: [{
          label: 'ROAS (x)',
          data: [3.0, Number(u.roasBreakEven.toFixed(2)), Number(u.roasRealPrimerPedido.toFixed(2))],
          backgroundColor: ['#d47a9e', '#3d231a', '#c94a5e'],
          borderRadius: 5
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    const labels12 = Array.from({ length: 13 }, (_, i) => `M${i}`);
    const curveAgency = [-72.34];
    let accAg = -72.34;
    const curveMaster = [-40.00];
    let accMa = -40.00;

    for (let m = 1; m <= 12; m++) {
      const cLooseAg = m === 1 ? 6.15 : baseLooseSchedule[m - 1] * 15.89;
      const cSubAg = Math.pow(0.91, m - 1) * 12.643;
      accAg += 0.85 * cLooseAg + 0.15 * cSubAg;
      curveAgency.push(Number(accAg.toFixed(2)));

      const cLooseMa = baseLooseSchedule[m - 1] * 21.50;
      const cSubMa = Math.pow(0.91, m - 1) * 12.643;
      accMa += 0.72 * cLooseMa + 0.28 * cSubMa;
      curveMaster.push(Number(accMa.toFixed(2)));
    }

    chartCashCurve = window.ChartsEngine.createOrUpdate(chartCashCurve, 'chart-tueste-cashcurve', {
      type: 'line',
      data: {
        labels: labels12,
        datasets: [
          {
            label: 'Simulación Actual (Controles)',
            data: u.curveBlended.map(v => Number(v.toFixed(2))),
            borderColor: '#3d231a',
            backgroundColor: '#3d231a',
            borderWidth: 2.5,
            tension: 0.2,
            pointRadius: 2
          },
          {
            label: 'Jugada Maestra ($4k->$7,5k + Pack)',
            data: curveMaster,
            borderColor: '#2e7d32',
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 1.5
          },
          {
            label: 'Propuesta Agencia ($16k + 30% desc)',
            data: curveAgency,
            borderColor: '#c94a5e',
            borderDash: [4, 3],
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 1.5
          },
          {
            label: 'Línea del Cero ($0)',
            data: Array(13).fill(0),
            borderColor: '#777777',
            borderDash: [3, 3],
            borderWidth: 1.2,
            pointRadius: 0
          }
        ]
      }
    });

    chartLtvCac = window.ChartsEngine.createOrUpdate(chartLtvCac, 'chart-tueste-ltvcac', {
      type: 'bar',
      data: {
        labels: ['CAC Real Actual', 'LTV a 12 Meses', 'Umbral 1:1', 'Umbral 3:1'],
        datasets: [{
          label: 'Dólares ($)',
          data: [
            Number(u.cacReal.toFixed(2)),
            Number(u.ltvBlended.toFixed(2)),
            Number(u.cacReal.toFixed(2)),
            Number((u.cacReal * 3).toFixed(2))
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

    chartMarginal = window.ChartsEngine.createOrUpdate(chartMarginal, 'chart-tueste-marginal', {
      type: 'bar',
      data: {
        labels: ['$4k (Mar)', '$8k (Sep)', '$12k (Oct)', '$16k (Abr)', '$20k (Jun)'],
        datasets: [
          {
            type: 'line',
            label: 'Clientes Nuevos Meta',
            data: [100, 165, 210, 235, 250],
            borderColor: '#3d231a',
            backgroundColor: '#3d231a',
            borderWidth: 2.5,
            yAxisID: 'y'
          },
          {
            type: 'bar',
            label: 'CAC Marginal del Tramo ($)',
            data: [40.00, 61.54, 88.89, 160.00, 266.67],
            backgroundColor: ['#5a9e68', '#d49b35', '#d47a9e', '#c94a5e', '#871c2d'],
            borderRadius: 5,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        scales: {
          y: { type: 'linear', position: 'left', beginAtZero: true, title: { display: true, text: 'Clientes' } },
          y1: { type: 'linear', position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'CAC Marginal ($)' } }
        }
      }
    });
  }

  function updateRealtimeLevel3() {
    const liveSim = runSimulation24m(rtState);

    const planActual = runSimulation24m({ inv1: 8000, inv2: 8000, pack: false, sub28: false, noAgency: false, desc30: false });
    const planAgency = runSimulation24m({ inv1: 16000, inv2: 16000, pack: false, sub28: false, noAgency: false, desc30: true });
    const planFijo = runSimulation24m({ inv1: 6000, inv2: 6000, pack: true, sub28: true, noAgency: true, desc30: false });
    const planMaster = runSimulation24m({ inv1: 4000, inv2: 7500, pack: true, sub28: true, noAgency: true, desc30: false });

    const banner = document.getElementById('tueste-rt-verdict');
    const titleEl = document.getElementById('tueste-verdict-title');
    const descEl = document.getElementById('tueste-verdict-desc');
    const kpiMin = document.getElementById('tueste-vkpi-min');
    const kpiFinal = document.getElementById('tueste-vkpi-final');
    const kpiSubs = document.getElementById('tueste-vkpi-subs');
    const kpiRoaster = document.getElementById('tueste-vkpi-cac');

    const invLabel = rtState.inv1 === rtState.inv2
      ? `${formatMoney(rtState.inv1)} fijos`
      : `${formatMoney(rtState.inv1)} (M1-4) -> ${formatMoney(rtState.inv2)} (M5-24)`;

    if (kpiMin) kpiMin.textContent = `${formatMoney(liveSim.minCash)} (M${liveSim.minCashMonth})`;
    if (kpiFinal) kpiFinal.textContent = formatMoney(liveSim.finalCash);
    if (kpiSubs) kpiSubs.textContent = `${Math.round(liveSim.finalActiveSubs)} activos`;
    if (kpiRoaster) kpiRoaster.textContent = liveSim.roasterMonth ? `Lista en Mes ${liveSim.roasterMonth}` : 'No alcanza';

    if (banner && titleEl && descEl) {
      if (liveSim.minCash < 5000) {
        banner.className = 'verdict-live-banner danger';
        const firstBreak = liveSim.rows.find(r => r.rompePiso);
        titleEl.textContent = `NO ES BUENO PARA INVERTIR (${invLabel}) — ROMPE EL PISO DE $5.000 EN EL MES ${firstBreak ? firstBreak.mes : liveSim.minCashMonth}`;
        descEl.textContent = `Con este monto la caja cae a ${formatMoney(liveSim.minCash)} porque el costo de captar clientes nuevos supera la contribución mensual de la base. Baja el monto inicial o activa el Pack de $48.`;
      } else if (liveSim.violatesRule13) {
        banner.className = 'verdict-live-banner warn';
        titleEl.textContent = `INCUMPLE REGLA DEL MES 13 (${invLabel}) — LA ETAPA 2 NO PUEDE SER MENOR A ${formatMoney(liveSim.avg1to12)}`;
        descEl.textContent = `El reglamento exige que desde el Mes 13 la inversión no sea menor al promedio de los meses 1 a 12 (${formatMoney(liveSim.avg1to12)}). Sube el monto de M5-M24 por encima de M1-M4.`;
      } else if (!liveSim.roasterMonth || liveSim.finalCash < 55000) {
        banner.className = 'verdict-live-banner warn';
        titleEl.textContent = `INVERSIÓN EN ZONA DE RIESGO (${invLabel}) — POCA ACUMULACIÓN DE CAJA`;
        descEl.textContent = `No rompe el piso de $5.000 (mínimo ${formatMoney(liveSim.minCash)} en M${liveSim.minCashMonth}), pero el CAC marginal alto frena la caja (${formatMoney(liveSim.finalCash)} al Mes 24).`;
      } else {
        banner.className = 'verdict-live-banner good';
        titleEl.textContent = `SÍ ES BUENO PARA INVERTIR (${invLabel}) — RENTABLE Y CUMPLE TODAS LAS REGLAS`;
        descEl.textContent = `La caja nunca baja de ${formatMoney(liveSim.minCash)}, permite pagar al contado la 2da tostadora de $14.000 desde el Mes ${liveSim.roasterMonth} sin romper el piso y cierra el Mes 24 con ${formatMoney(liveSim.finalCash)} y ${Math.round(liveSim.finalActiveSubs)} suscriptores.`;
      }
    }

    if (window.ChartsEngine && window.ChartsEngine.isAvailable) {
      const labels24 = Array.from({ length: 25 }, (_, i) => `M${i}`);
      const liveColor = liveSim.minCash < 5000 ? '#c94a5e' : '#2e7d32';
      const liveBg = liveSim.minCash < 5000 ? 'rgba(201, 74, 94, 0.14)' : 'rgba(46, 125, 50, 0.12)';

      chartSim24m = window.ChartsEngine.createOrUpdate(chartSim24m, 'chart-tueste-sim24m', {
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
              label: 'Plan Hoy ($8.000 fijos)',
              data: planActual.cashSeries.map(v => Math.round(v)),
              borderColor: '#3d231a',
              borderDash: [5, 4],
              borderWidth: 2,
              fill: false,
              tension: 0.2,
              pointRadius: 0
            },
            {
              label: 'Propuesta Agencia ($16k + 30% desc)',
              data: planAgency.cashSeries.map(v => Math.round(v)),
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

    const tbodyComp = document.getElementById('tbody-tueste-compare');
    if (tbodyComp) {
      const compRows = [
        { name: 'Tu Simulación en Vivo', inv: invLabel, sim: liveSim, cls: 'row-live' },
        { name: 'Plan 1: Hoy ($8.000 fijos)', inv: '$8.000 fijos', sim: planActual, cls: '' },
        { name: 'Plan 2: Agencia ($16k + 30% desc)', inv: '$16.000 fijos', sim: planAgency, cls: 'row-danger' },
        { name: 'Plan 3: Propio Fijo ($6k + Pack)', inv: '$6.000 fijos', sim: planFijo, cls: '' },
        { name: 'Plan 4: Jugada Maestra ($4k->$7,5k + Pack)', inv: '$4k -> $7,5k', sim: planMaster, cls: 'row-winner' }
      ];

      tbodyComp.innerHTML = compRows.map(item => `
        <tr class="${item.cls}">
          <td><strong>${item.name}</strong></td>
          <td>${item.inv}</td>
          <td>${formatMoney(item.sim.minCash)} (M${item.sim.minCashMonth})</td>
          <td><strong>${formatMoney(item.sim.finalCash)}</strong></td>
          <td>${Math.round(item.sim.finalActiveSubs)}</td>
        </tr>
      `).join('');
    }

    const tbody24 = document.getElementById('tbody-tueste-24m');
    if (tbody24) {
      tbody24.innerHTML = liveSim.rows.map(r => `
        <tr class="${r.rompePiso ? 'row-danger' : ''}">
          <td><strong>M${r.mes}</strong></td>
          <td>${formatMoney(r.inv)}</td>
          <td>${r.clientesNuevos.toFixed(1)}</td>
          <td>${formatMoney(r.contribActuales)}</td>
          <td>${formatMoney(r.contribNuevos)}</td>
          <td>${formatMoney(r.salidas)}</td>
          <td><strong>${formatMoney(r.cajaFinal)}</strong></td>
          <td><span class="status-pill ${r.rompePiso ? 'danger' : 'good'}">${r.rompePiso ? 'BAJO PISO' : 'OK'}</span></td>
        </tr>
      `).join('');
    }
  }

  function applyPresetPlan(planKey) {
    rtState.activePreset = planKey;
    if (planKey === 'actual') {
      rtState.inv1 = 8000;
      rtState.inv2 = 8000;
      rtState.pack = false;
      rtState.sub28 = false;
      rtState.noAgency = false;
      rtState.desc30 = false;
    } else if (planKey === 'agency') {
      rtState.inv1 = 16000;
      rtState.inv2 = 16000;
      rtState.pack = false;
      rtState.sub28 = false;
      rtState.noAgency = false;
      rtState.desc30 = true;
    } else if (planKey === 'conservative') {
      rtState.inv1 = 6000;
      rtState.inv2 = 6000;
      rtState.pack = true;
      rtState.sub28 = true;
      rtState.noAgency = true;
      rtState.desc30 = false;
    } else {
      rtState.inv1 = 4000;
      rtState.inv2 = 7500;
      rtState.pack = true;
      rtState.sub28 = true;
      rtState.noAgency = true;
      rtState.desc30 = false;
    }

    syncRtInputsFromState();
    updateRealtimeLevel3();
  }

  function syncRtInputsFromState() {
    const num1 = document.getElementById('tueste-rt-inv-num');
    const sld1 = document.getElementById('tueste-rt-inv-slider');
    const num2 = document.getElementById('tueste-rt-inv2-num');
    const sld2 = document.getElementById('tueste-rt-inv2-slider');
    const chkPack = document.getElementById('tueste-rt-pack');
    const chkSub = document.getElementById('tueste-rt-sub28');
    const chkNoAg = document.getElementById('tueste-rt-noagency');
    const chkDesc = document.getElementById('tueste-rt-desc30');

    if (num1) num1.value = rtState.inv1;
    if (sld1) sld1.value = rtState.inv1;
    if (num2) num2.value = rtState.inv2;
    if (sld2) sld2.value = rtState.inv2;
    if (chkPack) chkPack.checked = rtState.pack;
    if (chkSub) chkSub.checked = rtState.sub28;
    if (chkNoAg) chkNoAg.checked = rtState.noAgency;
    if (chkDesc) chkDesc.checked = rtState.desc30;
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

    bindSlider('slider-tueste-inv', 'inversionMeta');
    bindSlider('slider-tueste-precio', 'precioBolsa');
    bindSlider('slider-tueste-cafe', 'costoCafeBolsa');
    bindSlider('slider-tueste-envio', 'costoEnvio');
    bindSlider('slider-tueste-sub', 'pctSuscriptores', v => v / 100);
    bindSlider('slider-tueste-churn', 'churnMensual', v => v / 100);
    bindSlider('slider-tueste-pedidos', 'pedidos12mSuelto');
    bindSlider('slider-tueste-fee', 'feeAgencia');
    bindSlider('slider-tueste-desc', 'descuentoPrimerPedido', v => v / 100);

    const btnReset = document.getElementById('btn-tueste-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.inversionMeta = 8000;
        state.precioBolsa = 17.0;
        state.costoCafeBolsa = 5.44;
        state.costoEnvio = 4.50;
        state.pctSuscriptores = 0.15;
        state.churnMensual = 0.09;
        state.pedidos12mSuelto = 3.00;
        state.feeAgencia = 1000;
        state.descuentoPrimerPedido = 0.0;

        const setVal = (id, v) => {
          const el = document.getElementById(id);
          if (el) el.value = v;
        };
        setVal('slider-tueste-inv', 8000);
        setVal('slider-tueste-precio', 17);
        setVal('slider-tueste-cafe', 5.44);
        setVal('slider-tueste-envio', 4.5);
        setVal('slider-tueste-sub', 15);
        setVal('slider-tueste-churn', 9);
        setVal('slider-tueste-pedidos', 3.0);
        setVal('slider-tueste-fee', 1000);
        setVal('slider-tueste-desc', 0);

        updateDOM();
      });
    }

    const num1 = document.getElementById('tueste-rt-inv-num');
    const sld1 = document.getElementById('tueste-rt-inv-slider');
    const num2 = document.getElementById('tueste-rt-inv2-num');
    const sld2 = document.getElementById('tueste-rt-inv2-slider');
    const chkPack = document.getElementById('tueste-rt-pack');
    const chkSub = document.getElementById('tueste-rt-sub28');
    const chkNoAg = document.getElementById('tueste-rt-noagency');
    const chkDesc = document.getElementById('tueste-rt-desc30');

    const clearPresetActive = () => {
      document.querySelectorAll('.plan-btn-tueste').forEach(b => b.classList.remove('active'));
    };

    if (num1) {
      num1.addEventListener('input', e => {
        const val = Math.max(0, Math.min(20000, parseFloat(e.target.value) || 0));
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
        const val = Math.max(0, Math.min(20000, parseFloat(e.target.value) || 0));
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

    const bindRtCheck = (el, prop) => {
      if (!el) return;
      el.addEventListener('change', e => {
        rtState[prop] = e.target.checked;
        clearPresetActive();
        updateRealtimeLevel3();
      });
    };

    bindRtCheck(chkPack, 'pack');
    bindRtCheck(chkSub, 'sub28');
    bindRtCheck(chkNoAg, 'noAgency');
    bindRtCheck(chkDesc, 'desc30');

    document.querySelectorAll('.plan-btn-tueste').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.plan-btn-tueste').forEach(b => b.classList.remove('active'));
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
