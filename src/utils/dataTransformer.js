/**
 * Transform Notion data into a format suitable for charting
 */
class DataTransformer {
    /**
     * Extract specific properties from Notion database items
     * @param {Array} items - Notion database items
     * @param {Object} config - Configuration for data extraction
     * @returns {Object} Formatted data for charts
     */
    transformForChart(items, config) {
      const { xAxis, yAxis, chartType } = config;
      
      // Different transformations based on chart type
      switch (chartType) {
        case 'bar':
        case 'line':
          return this.transformForXYChart(items, xAxis, yAxis);
        case 'pie':
          return this.transformForPieChart(items, xAxis, yAxis);
        default:
          return this.transformForXYChart(items, xAxis, yAxis);
      }
    }
  
    /**
     * Transform data for XY charts (bar, line)
     */
    transformForXYChart(items, xAxisProperty, yAxisProperty) {
      const labels = [];
      const data = [];
  
      items.forEach(item => {
        const xValue = this.extractPropertyValue(item, xAxisProperty);
        const yValue = this.extractPropertyValue(item, yAxisProperty);
        
        if (xValue !== null && yValue !== null) {
          labels.push(xValue);
          data.push(yValue);
        }
      });
  
      return {
        labels,
        datasets: [{
          data,
          backgroundColor: this.generateColors(data.length)
        }]
      };
    }
  
    /**
     * Transform data for pie charts
     */
    transformForPieChart(items, labelProperty, valueProperty) {
      return this.transformForXYChart(items, labelProperty, valueProperty);
    }
  
    /**
     * Extract property value from Notion item based on property name
     */
    extractPropertyValue(item, propertyName) {
      const property = item.properties[propertyName];
      
      if (!property) return null;
  
      // Handle different property types
      switch (property.type) {
        case 'title':
          return property.title.length > 0 ? property.title[0].plain_text : null;
        case 'rich_text':
          return property.rich_text.length > 0 ? property.rich_text[0].plain_text : null;
        case 'number':
          return property.number;
        case 'select':
          return property.select?.name || null;
        case 'date':
          return property.date?.start || null;
        default:
          return null;
      }
    }
  
    /**
     * Generate random colors for charts
     */
    generateColors(count) {
      const colors = [];
      for (let i = 0; i < count; i++) {
        colors.push(`hsl(${(i * 360) / count}, 70%, 60%)`);
      }
      return colors;
    }
  }
  
  module.exports = new DataTransformer();