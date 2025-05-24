document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const databaseSelect = document.getElementById('database-select');
    const loadDatabasesBtn = document.getElementById('load-databases');
    const chartTypeSelect = document.getElementById('chart-type');
    const xAxisSelect = document.getElementById('x-axis');
    const yAxisSelect = document.getElementById('y-axis');
    const chartTitleInput = document.getElementById('chart-title');
    const generateChartBtn = document.getElementById('generate-chart');
    const chartContainer = document.getElementById('chart-container');
    const chartCanvas = document.getElementById('chart-canvas');
    
    let chartInstance = null;
    let databaseProperties = {};
    
    // Load available databases
    loadDatabasesBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/databases');
        const databases = await response.json();
        
        // Clear and populate database select
        databaseSelect.innerHTML = '<option value="">-- Select a database --</option>';
        
        databases.forEach(db => {
          const option = document.createElement('option');
          option.value = db.id;
          option.textContent = db.title[0]?.plain_text || 'Untitled';
          databaseSelect.appendChild(option);
        });
      } catch (error) {
        console.error('Error loading databases:', error);
        alert('Failed to load databases. Please check your Notion API key and permissions.');
      }
    });
    
    // When database is selected, load its properties
    databaseSelect.addEventListener('change', async () => {
      const databaseId = databaseSelect.value;
      
      if (!databaseId) {
        xAxisSelect.disabled = true;
        yAxisSelect.disabled = true;
        generateChartBtn.disabled = true;
        return;
      }
      
      try {
        const response = await fetch(`/api/database/${databaseId}`);
        const data = await response.json();
        
        if (data.length > 0) {
          // Get properties from the first item
          const properties = data[0].properties;
          databaseProperties = properties;
          
          // Clear and populate property selects
          xAxisSelect.innerHTML = '';
          yAxisSelect.innerHTML = '';
          
          Object.keys(properties).forEach(propName => {
            const xOption = document.createElement('option');
            xOption.value = propName;
            xOption.textContent = propName;
            xAxisSelect.appendChild(xOption);
            
            const yOption = document.createElement('option');
            yOption.value = propName;
            yOption.textContent = propName;
            yAxisSelect.appendChild(yOption);
          });
          
          xAxisSelect.disabled = false;
          yAxisSelect.disabled = false;
          generateChartBtn.disabled = false;
        }
      } catch (error) {
        console.error('Error loading database properties:', error);
        alert('Failed to load database properties.');
      }
    });
    
    // Generate chart
    generateChartBtn.addEventListener('click', async () => {
      const databaseId = databaseSelect.value;
      const chartType = chartTypeSelect.value;
      const xAxis = xAxisSelect.value;
      const yAxis = yAxisSelect.value;
      const title = chartTitleInput.value;
      
      if (!databaseId || !xAxis || !yAxis) {
        alert('Please select database, x-axis and y-axis properties.');
        return;
      }
      
      try {
        const response = await fetch('/api/chart-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            databaseId,
            chartConfig: {
              chartType,
              xAxis,
              yAxis,
              title
            }
          }),
        });
        
        const chartConfig = await response.json();
        
        // Display chart container
        chartContainer.style.display = 'block';
        
        // Destroy existing chart if any
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // Create new chart
        chartInstance = new Chart(
          chartCanvas.getContext('2d'),
          chartConfig
        );
        
        // Save chart configuration to localStorage
        const savedCharts = JSON.parse(localStorage.getItem('notion-charts') || '[]');
        savedCharts.push({
          id: Date.now(),
          databaseId,
          chartConfig: {
            chartType,
            xAxis,
            yAxis,
            title
          },
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('notion-charts', JSON.stringify(savedCharts));
        
      } catch (error) {
        console.error('Error generating chart:', error);
        alert('Failed to generate chart.');
      }
    });
    
    // Load databases on initial load
    loadDatabasesBtn.click();
  });