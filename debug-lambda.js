
const { getItems, getInfo } = require('@bigfive-org/questions');

exports.handler = async (event) => {
  try {
    console.log('DEBUG: Starting handler');
    console.log('DEBUG: Event:', JSON.stringify(event, null, 2));
    
    // Test package import
    console.log('DEBUG: Testing getItems import');
    const items = getItems('en');
    console.log('DEBUG: Items loaded, count:', items.length);
    
    console.log('DEBUG: Testing getInfo import');
    const info = getInfo();
    console.log('DEBUG: Info loaded:', info.name);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Debug test passed',
        questionsCount: items.length,
        assessmentName: info.name
      })
    };
  } catch (error) {
    console.error('DEBUG ERROR:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Debug error: ' + error.message,
        stack: error.stack
      })
    };
  }
};
