const express = require('express');
const router = express.Router();
const notionService = require('../services/notionService');
const chartService = require('../services/chartService');

// Get list of available databases
router.get('/databases', async (req, res) => {
  try {
    const databases = await notionService.listDatabases();
    res.json(databases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get database data
router.get('/database/:id', async (req, res) => {
  try {
    const databaseId = req.params.id;
    const data = await notionService.getDatabaseItems(databaseId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate chart data
router.post('/chart-data', async (req, res) => {
  try {
    const { databaseId, chartConfig } = req.body;
    
    // Fetch data from Notion
    const notionData = await notionService.getDatabaseItems(databaseId);
    
    // Transform data for charting
    const chartData = chartService.prepareChartData(notionData, chartConfig);
    
    // Generate chart configuration
    const config = chartService.generateChartConfig(chartData, chartConfig);
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;