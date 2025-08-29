import { getItems } from '@bigfive-org/questions';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/assessment/results - Calculate personality assessment results
export async function POST(request: NextRequest) {
  try {
    const { assessmentId, answers, language = 'en' } = await request.json();

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'assessmentId is required' },
        { status: 400 }
      );
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'answers array is required and must not be empty' },
        { status: 400 }
      );
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
    answers.forEach((answer: any) => {
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

    // Calculate results
    const calculateResult = (score: number, count: number): string => {
      const avgScore = score / count;
      if (avgScore > 3.5) return 'high';
      if (avgScore < 2.5) return 'low';
      return 'neutral';
    };

    // Prepare results object
    const assessmentResults = {
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
          result: calculateResult(data.score, data.count)
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
            result: calculateResult(data.score, data.count)
          };
        }
      });
    });

    return NextResponse.json({
      assessmentId,
      results: assessmentResults,
      status: 'completed',
      language,
      answersProcessed: answers.length
    });

  } catch (error) {
    console.error('Error calculating results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/assessment/results?assessmentId=xxx - This endpoint is not needed for stateless API
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'GET method not supported. Use POST method with assessmentId and answers to calculate results.'
    },
    { status: 405 }
  );
}
