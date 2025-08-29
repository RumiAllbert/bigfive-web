#!/usr/bin/env node

/**
 * Simple test script to demonstrate Big Five API usage
 * Make sure to start the Next.js server first: npm run dev
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  try {
    console.log('🚀 Testing Big Five Personality Assessment API\n');

    // 1. Create assessment
    console.log('1. Creating assessment...');
    const createResponse = await fetch(`${BASE_URL}/api/assessment/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test-user-123',
        language: 'en'
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Create assessment failed: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    const { assessmentId, questions } = createData;

    console.log(`✅ Assessment created: ${assessmentId}`);
    console.log(`📋 Questions loaded: ${questions.length}\n`);

    // 2. Submit some sample answers (first 10 questions)
    console.log('2. Submitting sample answers...');
    const sampleAnswers = questions.slice(0, 10).map(question => ({
      questionId: question.id,
      score: Math.floor(Math.random() * 5) + 1 // Random score 1-5
    }));

    const answersResponse = await fetch(`${BASE_URL}/api/assessment/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentId,
        answers: sampleAnswers
      })
    });

    if (!answersResponse.ok) {
      throw new Error(`Submit answers failed: ${answersResponse.status}`);
    }

    console.log(`✅ Submitted ${sampleAnswers.length} answers\n`);

    // 3. Check status
    console.log('3. Checking assessment status...');
    const statusResponse = await fetch(`${BASE_URL}/api/assessment/status?assessmentId=${assessmentId}`);

    if (!statusResponse.ok) {
      throw new Error(`Status check failed: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();
    console.log(`📊 Status: ${statusData.status}`);
    console.log(`📝 Answers count: ${statusData.answersCount}\n`);

    // 4. For demonstration, submit all answers and get results
    console.log('4. Submitting all answers and calculating results...');
    const allAnswers = questions.map(question => ({
      questionId: question.id,
      score: Math.floor(Math.random() * 5) + 1
    }));

    await fetch(`${BASE_URL}/api/assessment/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentId,
        answers: allAnswers
      })
    });

    // Get results
    const resultsResponse = await fetch(`${BASE_URL}/api/assessment/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId })
    });

    if (!resultsResponse.ok) {
      throw new Error(`Get results failed: ${resultsResponse.status}`);
    }

    const resultsData = await resultsResponse.json();

    console.log('✅ Results calculated successfully!');
    console.log('\n📊 Personality Assessment Results:');

    // Display overall scores
    console.log('\n🏆 Overall Scores:');
    Object.entries(resultsData.results.overall).forEach(([domain, data]) => {
      const domainNames = {
        'O': 'Openness',
        'C': 'Conscientiousness',
        'E': 'Extraversion',
        'A': 'Agreeableness',
        'N': 'Neuroticism'
      };

      console.log(`  ${domainNames[domain]}: ${data.result} (${data.score}/${data.count * 5})`);
    });

    console.log('\n🎉 API test completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure the Next.js server is running: npm run dev');
  }
}

// Run the test
testAPI();
