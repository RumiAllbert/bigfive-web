import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Type definitions
interface Answer {
  questionId: string;
  score: number;
}

interface AnswersRequest {
  assessmentId: string;
  answers: Answer[];
}

// Helper function to create response
const createResponse = (statusCode: number, body: any, headers?: any): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      ...headers
    },
    body: JSON.stringify(body)
  };
};

// POST handler for answers
const handlePost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' });
    }

    const body: AnswersRequest = JSON.parse(event.body);

    // Validate request
    if (!body.assessmentId) {
      return createResponse(400, { error: 'assessmentId is required' });
    }

    if (!body.answers || !Array.isArray(body.answers) || body.answers.length === 0) {
      return createResponse(400, { error: 'answers must be a non-empty array' });
    }

    const { assessmentId, answers } = body;

    // Validate answers format
    for (const answer of answers) {
      if (!answer.questionId || typeof answer.score !== 'number') {
        return createResponse(400, { error: 'Each answer must have questionId and score (1-5)' });
      }

      if (answer.score < 1 || answer.score > 5) {
        return createResponse(400, { error: 'Score must be between 1 and 5' });
      }
    }

    // Since you're handling data storage, this endpoint just validates and acknowledges
    return createResponse(200, {
      success: true,
      message: 'Answers validated successfully. Store them on your side and use /api/assessment/results to calculate personality results.',
      assessmentId,
      answersCount: answers.length,
      status: 'validated'
    });

  } catch (error) {
    console.error('Error validating answers:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// Main handler function
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Answers API called:', {
    method: event.httpMethod,
    path: event.path,
    body: event.body ? JSON.parse(event.body) : null
  });

  switch (event.httpMethod) {
    case 'POST':
      return handlePost(event);
    case 'OPTIONS':
      return createResponse(200, {});
    default:
      return createResponse(405, { error: 'Method not allowed' });
  }
};
