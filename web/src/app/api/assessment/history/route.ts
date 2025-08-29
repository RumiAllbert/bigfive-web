import { NextRequest, NextResponse } from 'next/server';

// GET /api/assessment/history?userId=xxx - Get user's assessment history info (stateless)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Since this is stateless, we can't provide actual history
    // You should track assessment history on your side
    return NextResponse.json({
      userId,
      message: 'This is a stateless API. Track assessment history on your side.',
      apiType: 'stateless',
      history: [], // Empty array since we don't store data
      note: 'Use your own database to store and retrieve assessment history.'
    });

  } catch (error) {
    console.error('Error processing history request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
