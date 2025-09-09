import { getItems } from '@bigfive-org/questions';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Type definitions
interface Answer {
  questionId: string;
  score: number;
}

interface ResultsRequest {
  assessmentId: string;
  answers: Answer[];
  language?: string;
}

interface DomainComputedResult {
  score: number;
  count: number;
  result: string; // high | neutral | low
  average: number; // 1-5 scale
  percentage: number; // 0-100 of max possible
}

interface AssessmentResults {
  overall: { [key: string]: DomainComputedResult };
  facets: { [key: string]: { [key: number]: DomainComputedResult } };
  generatedAt: Date;
  rawScores: { [key: string]: { score: number; count: number } };
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

// Calculate result based on average score
const calculateResult = (score: number, count: number): string => {
  const avgScore = score / count;
  if (avgScore > 3.5) return 'high';
  if (avgScore < 2.5) return 'low';
  return 'neutral';
};

// Calculate average (1-5) and percentage (0-100 of max possible)
const calculateAverage = (score: number, count: number): number => {
  return count > 0 ? score / count : 0;
};

const calculatePercentage = (score: number, count: number): number => {
  if (count === 0) return 0;
  const pct = (score / (count * 5)) * 100;
  return Math.round(pct);
};

// POST handler for results calculation
const handlePost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' });
    }

    const { assessmentId, answers, language = 'en' }: ResultsRequest = JSON.parse(event.body);

    if (!assessmentId) {
      return createResponse(400, { error: 'assessmentId is required' });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return createResponse(400, { error: 'answers array is required and must not be empty' });
    }

    // Get questions to map answers to domains/facets
    const questions = await getItems(language as any);

    // Create question lookup map
    const questionMap = new Map();
    questions.forEach(q => {
      questionMap.set(q.id, {
        domain: q.domain,
        facet: q.facet,
        keyed: q.keyed
      });
    });

    // Initialize score counters
    const domainScores: { [key: string]: { score: number; count: number; } } = {
      'O': { score: 0, count: 0 },
      'C': { score: 0, count: 0 },
      'E': { score: 0, count: 0 },
      'A': { score: 0, count: 0 },
      'N': { score: 0, count: 0 }
    };

    const facetScores: { [key: string]: { [key: number]: { score: number; count: number; } } } = {
      'O': {}, 'C': {}, 'E': {}, 'A': {}, 'N': {}
    };

    // Process answers
    answers.forEach((answer: Answer) => {
      const questionInfo = questionMap.get(answer.questionId);
      if (!questionInfo) {
        throw new Error(`Question ${answer.questionId} not found`);
      }

      // Adjust score based on question keying (plus/minus)
      const adjustedScore = questionInfo.keyed === 'minus' ? 6 - answer.score : answer.score;

      // Add to domain score
      domainScores[questionInfo.domain].score += adjustedScore;
      domainScores[questionInfo.domain].count += 1;

      // Add to facet score
      if (!facetScores[questionInfo.domain][questionInfo.facet]) {
        facetScores[questionInfo.domain][questionInfo.facet] = { score: 0, count: 0 };
      }
      facetScores[questionInfo.domain][questionInfo.facet].score += adjustedScore;
      facetScores[questionInfo.domain][questionInfo.facet].count += 1;
    });

    // Prepare results object
    const assessmentResults: AssessmentResults = {
      overall: {},
      facets: {},
      generatedAt: new Date(),
      rawScores: domainScores
    };

    // Extract overall scores
    Object.entries(domainScores).forEach(([domain, data]) => {
      if (data.count > 0) {
        assessmentResults.overall[domain] = {
          score: data.score,
          count: data.count,
          result: calculateResult(data.score, data.count),
          average: calculateAverage(data.score, data.count),
          percentage: calculatePercentage(data.score, data.count)
        };
      }
    });

    // Extract facet scores
    Object.entries(facetScores).forEach(([domain, facets]) => {
      assessmentResults.facets[domain] = {};
      Object.entries(facets).forEach(([facet, data]) => {
        if (data.count > 0) {
          assessmentResults.facets[domain][parseInt(facet)] = {
            score: data.score,
            count: data.count,
            result: calculateResult(data.score, data.count),
            average: calculateAverage(data.score, data.count),
            percentage: calculatePercentage(data.score, data.count)
          };
        }
      });
    });

    return createResponse(200, {
      assessmentId,
      results: assessmentResults,
      status: 'completed',
      language,
      answersProcessed: answers.length
    });

  } catch (error) {
    console.error('Error calculating results:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// GET handler (not supported for this endpoint)
const handleGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return createResponse(405, {
    error: 'GET method not supported. Use POST method with assessmentId and answers to calculate results.'
  });
};

// Main handler function
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Results API called:', {
    method: event.httpMethod,
    path: event.path,
    body: event.body ? JSON.parse(event.body) : null
  });

  switch (event.httpMethod) {
    case 'POST':
      return handlePost(event);
    case 'GET':
      return handleGet(event);
    case 'OPTIONS':
      return createResponse(200, {});
    default:
      return createResponse(405, { error: 'Method not allowed' });
  }
};
