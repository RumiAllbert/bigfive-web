import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Helper function to create response
const createResponse = (statusCode: number, body: any, headers?: any): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      ...headers
    },
    body: JSON.stringify(body)
  };
};

// GET handler for history
const handleGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = event.queryStringParameters || {};

    if (!userId) {
      return createResponse(400, { error: 'userId is required' });
    }

    // Since this is stateless, we can't provide actual history
    // You should track assessment history on your side
    return createResponse(200, {
      userId,
      message: 'This is a stateless API. Track assessment history on your side.',
      apiType: 'stateless',
      history: [], // Empty array since we don't store data
      note: 'Use your own database to store and retrieve assessment history.'
    });

  } catch (error) {
    console.error('Error processing history request:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// Main handler function
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('History API called:', {
    method: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters
  });

  switch (event.httpMethod) {
    case 'GET':
      return handleGet(event);
    case 'OPTIONS':
      return createResponse(200, {});
    default:
      return createResponse(405, { error: 'Method not allowed' });
  }
};
