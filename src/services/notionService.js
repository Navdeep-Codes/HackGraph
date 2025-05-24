const { notion } = require('../config/notion');

class NotionService {
  /**
   * Fetch data from a Notion database
   * @param {string} databaseId - The ID of the Notion database/table
   * @returns {Promise<Array>} The database items
   */
  async getDatabaseItems(databaseId) {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
      });
      
      return response.results;
    } catch (error) {
      console.error('Error fetching Notion database:', error);
      throw error;
    }
  }

  /**
   * Get a list of available databases for the integration
   * @returns {Promise<Array>} List of databases
   */
  async listDatabases() {
    try {
      const response = await notion.search({
        filter: {
          value: 'database',
          property: 'object'
        }
      });
      
      return response.results;
    } catch (error) {
      console.error('Error listing databases:', error);
      throw error;
    }
  }
}

module.exports = new NotionService();