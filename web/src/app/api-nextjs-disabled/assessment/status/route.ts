import { NextRequest, NextResponse } from 'next/server';

// GET /api/assessment/status?assessmentId=xxx - Get basic assessment info (stateless)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const assessmentId = url.searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'assessmentId is required' },
        { status: 400 }
      );
    }

    // Since this is stateless, we just return basic info about the assessment ID
    // You should track the actual status on your side
    const userId = assessmentId.split('_')[1]; // Extract from our format: assessment_userId_timestamp

    return NextResponse.json({
      assessmentId,
      userId: userId || 'unknown',
      status: 'info_only', // This API doesn't track status
      message: 'This is a stateless API. Track assessment status on your side.',
      apiType: 'stateless'
    });

  } catch (error) {
    console.error('Error processing status request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
