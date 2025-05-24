require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ 
  auth: process.env.NOTION_API_KEY 
});

async function testNotionConnection() {
  try {
    console.log('Testing Notion API connection...');
    const response = await notion.search({
      filter: {
        value: 'database',
        property: 'object'
      }
    });
    
    console.log('Connection successful!');
    console.log(`Found ${response.results.length} databases`);
    
    // Print database names if available
    response.results.forEach((db, index) => {
      const title = db.title?.[0]?.plain_text || 'Untitled Database';
      console.log(`${index + 1}. ${title} (${db.id})`);
    });
    
  } catch (error) {
    console.error('Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testNotionConnection();