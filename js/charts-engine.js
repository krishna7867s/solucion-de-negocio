/**
 * Motor Gráfico con Estilo Artesanal para Chart.js
 * Proporciona tipografía editorial, paletas de imprenta y tooltips claros.
 */

window.ChartsEngine = (function() {
  const isChartJsAvailable = typeof Chart !== 'undefined';

  const defaultFontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
  const titleFontFamily = "'Fraunces', Georgia, serif";

  const brandPalettes = {
    tueste: {
      primary: '#3b2216',
      secondary: '#c46d6d',
      accent: '#d89f66',
      light: '#f4dcd9',
      border: '#5c3826'
    },
    agendo: {
      primary: '#1e354a',
      secondary: '#c97d8b',
      accent: '#6fa0c4',
      light: '#e2eaf0',
      border: '#111d28'
    },
    soldecasa: {
      primary: '#274c3a',
      secondary: '#d9822b',
      accent: '#d4a017',
      light: '#e1ede6',
      border: '#15271e'
    }
  };

  function createOrUpdateChart(chartInstance, canvasId, config) {
    if (!isChartJsAvailable) {
      console.warn('Chart.js no está cargado en el entorno.');
      return null;
    }

    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    if (chartInstance) {
      chartInstance.destroy();
    }

    // Aplicar estilos por defecto a las fuentes
    if (!config.options) config.options = {};
    if (!config.options.plugins) config.options.plugins = {};
    
    config.options.responsive = true;
    config.options.maintainAspectRatio = false;

    return new Chart(canvas, config);
  }

  return {
    isAvailable: isChartJsAvailable,
    palettes: brandPalettes,
    createOrUpdate: createOrUpdateChart
  };
})();
