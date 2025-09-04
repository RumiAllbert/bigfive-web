import { NextRequest, NextResponse } from 'next/server';

// POST /api/assessment/answers - Validate and acknowledge answers (stateless)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    if (!body.assessmentId) {
      return NextResponse.json(
        { error: 'assessmentId is required' },
        { status: 400 }
      );
    }

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: 'answers must be an array' },
        { status: 400 }
      );
    }

    const { assessmentId, answers } = body;

    // Validate answers format
    for (const answer of answers) {
      if (!answer.questionId || typeof answer.score !== 'number') {
        return NextResponse.json(
          { error: 'Each answer must have questionId and score (1-5)' },
          { status: 400 }
        );
      }

      if (answer.score < 1 || answer.score > 5) {
        return NextResponse.json(
          { error: 'Score must be between 1 and 5' },
          { status: 400 }
        );
      }
    }

    // Since you're handling data storage, this endpoint just validates and acknowledges
    return NextResponse.json({
      success: true,
      message: 'Answers validated successfully. Store them on your side and use /api/assessment/results to calculate personality results.',
      assessmentId,
      answersCount: answers.length,
      status: 'validated'
    });

  } catch (error) {
    console.error('Error validating answers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
