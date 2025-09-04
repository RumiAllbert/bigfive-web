exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Test Lambda function working!',
      timestamp: new Date().toISOString(),
      event: event
    })
  };
};
