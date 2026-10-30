/**
 * Motor de gráficos Chart.js con paleta Coquette (Chocolate, Rosa Pastel y Negro)
 * Soporta actualización instantánea en tiempo real sin parpadeo.
 */

window.ChartsEngine = (function() {
  const isChartJsAvailable = typeof Chart !== 'undefined';

  if (isChartJsAvailable) {
    Chart.defaults.font.family = "'Plus Jakarta Sans', -apple-system, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#3d231a';
  }

  function createOrUpdateChart(chartInstance, canvasId, config) {
    if (!isChartJsAvailable) return null;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    config.options = config.options || {};
    config.options.responsive = true;
    config.options.maintainAspectRatio = false;
    config.options.animation = { duration: 180 };

    if (
      chartInstance &&
      chartInstance.canvas === canvas &&
      chartInstance.config.type === config.type &&
      chartInstance.data.datasets.length === config.data.datasets.length
    ) {
      chartInstance.data.labels = config.data.labels;
      config.data.datasets.forEach((ds, idx) => {
        Object.assign(chartInstance.data.datasets[idx], ds);
      });
      if (config.options.scales) {
        chartInstance.options.scales = config.options.scales;
      }
      chartInstance.update('none');
      return chartInstance;
    }

    if (chartInstance) {
      chartInstance.destroy();
    }

    return new Chart(canvas, config);
  }

  return {
    isAvailable: isChartJsAvailable,
    createOrUpdate: createOrUpdateChart
  };
})();
