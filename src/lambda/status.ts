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

// GET handler for status
const handleGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { assessmentId } = event.queryStringParameters || {};

    if (!assessmentId) {
      return createResponse(400, { error: 'assessmentId is required' });
    }

    // Since this is stateless, we just return basic info about the assessment ID
    // You should track the actual status on your side
    const userId = assessmentId.split('_')[1]; // Extract from our format: assessment_userId_timestamp

    return createResponse(200, {
      assessmentId,
      userId: userId || 'unknown',
      status: 'info_only', // This API doesn't track status
      message: 'This is a stateless API. Track assessment status on your side.',
      apiType: 'stateless',
      answersCount: 0
    });

  } catch (error) {
    console.error('Error processing status request:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// Main handler function
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Status API called:', {
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
