import { getInfo, getItems } from '@bigfive-org/questions';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Type definitions for Lambda
interface AssessmentInfo {
  name: string;
  id: string;
  shortId: string;
  time: number;
  questionsCount: number;
  language: string;
}

interface AssessmentResponse {
  assessmentId: string;
  userId: string;
  questions: any[];
  assessmentInfo: AssessmentInfo;
  status: string;
}

// Helper function to create response
const createResponse = (statusCode: number, body: any, headers?: any): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      ...headers
    },
    body: JSON.stringify(body)
  };
};

// GET handler for questions
const handleGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { assessmentId, userId, language = 'en' } = event.queryStringParameters || {};

    // Allow either assessmentId or userId for demo purposes
    if (!assessmentId && !userId) {
      return createResponse(400, { error: 'assessmentId or userId is required' });
    }

    // Get questions for the specified language (fallback to English if unsupported)
    let questions;
    let finalLanguage = language;
    try {
      questions = getItems(language as any);
    } catch (error) {
      console.warn(`Language '${language}' not supported, falling back to English`);
      questions = getItems('en' as any);
      finalLanguage = 'en';
    }
    const assessmentInfo = getInfo();

    // Generate assessmentId if not provided
    const finalAssessmentId = assessmentId || `assessment_${userId}_${Date.now()}`;

    const response: AssessmentResponse = {
      assessmentId: finalAssessmentId,
      userId: userId || 'demo-user',
      questions,
      assessmentInfo: {
        name: assessmentInfo.name,
        id: assessmentInfo.id,
        shortId: assessmentInfo.shortId,
        time: assessmentInfo.time,
        questionsCount: assessmentInfo.questions,
        language: finalLanguage
      },
      status: 'success'
    };

    return createResponse(200, response);

  } catch (error) {
    console.error('Error retrieving questions:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// POST handler for questions
const handlePost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' });
    }

    const body = JSON.parse(event.body);

    // Validate request
    if (!body.userId) {
      return createResponse(400, { error: 'userId is required' });
    }

    const { userId, language = 'en' } = body;

    // Get questions for the specified language (fallback to English if unsupported)
    let questions;
    let finalLanguage = language;
    try {
      questions = getItems(language as any);
    } catch (error) {
      console.warn(`Language '${language}' not supported, falling back to English`);
      questions = getItems('en' as any);
      finalLanguage = 'en';
    }
    const assessmentInfo = getInfo();

    // Generate a simple assessment ID (you can store this on your side)
    const assessmentId = `assessment_${userId}_${Date.now()}`;

    const response: AssessmentResponse = {
      assessmentId,
      userId,
      questions,
      assessmentInfo: {
        name: assessmentInfo.name,
        id: assessmentInfo.id,
        shortId: assessmentInfo.shortId,
        time: assessmentInfo.time,
        questionsCount: assessmentInfo.questions,
        language: finalLanguage
      },
      status: 'success'
    };

    return createResponse(200, response);

  } catch (error) {
    console.error('Error getting questions:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// Main handler function - Force redeploy with Node.js 20.x
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Questions API called:', {
    method: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters
  });

  switch (event.httpMethod) {
    case 'GET':
      return handleGet(event);
    case 'POST':
      return handlePost(event);
    case 'OPTIONS':
      return createResponse(200, {});
    default:
      return createResponse(405, { error: 'Method not allowed' });
  }
};
