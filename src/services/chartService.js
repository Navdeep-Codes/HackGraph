const { createCanvas } = require('canvas');
const Chart = require('chart.js/auto');
const dataTransformer = require('../utils/dataTransformer');

class ChartService {
  /**
   * Generate chart data configuration
   * @param {Array} notionData - Raw data from Notion
   * @param {Object} chartConfig - Chart configuration
   * @returns {Object} Chart.js compatible data
   */
  prepareChartData(notionData, chartConfig) {
    return dataTransformer.transformForChart(
      notionData, 
      chartConfig
    );
  }

  /**
   * Generate chart configuration
   * @param {Object} data - Transformed data
   * @param {Object} config - Chart configuration
   * @returns {Object} Chart.js configuration
   */
  generateChartConfig(data, config) {
    const { chartType, title } = config;
    
    return {
      type: chartType || 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: !!title,
            text: title
          }
        }
      }
    };
  }
}

module.exports = new ChartService();