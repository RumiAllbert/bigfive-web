import { getInfo, getItems } from '@bigfive-org/questions';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/assessment/questions - Get questions for assessment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const { userId, language = 'en' } = body;

    // Get questions for the specified language (fallback to English if unsupported)
    let questions;
    try {
      questions = await getItems(language as any);
    } catch (error) {
      console.warn(`Language '${language}' not supported, falling back to English`);
      questions = await getItems('en' as any);
    }
    const assessmentInfo = getInfo();

    // Generate a simple assessment ID (you can store this on your side)
    const assessmentId = `assessment_${userId}_${Date.now()}`;

    return NextResponse.json({
      assessmentId,
      userId,
      questions,
      assessmentInfo: {
        name: assessmentInfo.name,
        id: assessmentInfo.id,
        shortId: assessmentInfo.shortId,
        time: assessmentInfo.time,
        questionsCount: assessmentInfo.questions,
        language
      },
      status: 'success'
    });

  } catch (error) {
    console.error('Error getting questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/assessment/questions?assessmentId=xxx&language=en - Get questions
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const assessmentId = url.searchParams.get('assessmentId');
    const userId = url.searchParams.get('userId');
    const language = url.searchParams.get('language') || 'en';

    // Allow either assessmentId or userId for demo purposes
    if (!assessmentId && !userId) {
      return NextResponse.json(
        { error: 'assessmentId or userId is required' },
        { status: 400 }
      );
    }

    // Get questions for the specified language (fallback to English if unsupported)
    let questions;
    try {
      questions = await getItems(language as any);
    } catch (error) {
      console.warn(`Language '${language}' not supported, falling back to English`);
      questions = await getItems('en' as any);
    }
    const assessmentInfo = getInfo();

    // Generate assessmentId if not provided
    const finalAssessmentId = assessmentId || `assessment_${userId}_${Date.now()}`;

    return NextResponse.json({
      assessmentId: finalAssessmentId,
      userId: userId || 'demo-user',
      questions,
      assessmentInfo: {
        name: assessmentInfo.name,
        id: assessmentInfo.id,
        shortId: assessmentInfo.shortId,
        time: assessmentInfo.time,
        questionsCount: assessmentInfo.questions,
        language
      },
      status: 'success'
    });

  } catch (error) {
    console.error('Error retrieving questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
