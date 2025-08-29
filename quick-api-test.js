#!/usr/bin/env node

/**
 * Quick API Test - Manual Testing Helper
 * Run with: node quick-api-test.js
 */

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(name, endpoint, options = {}) {
  console.log(`\n🔍 Testing: ${name}`);
  console.log(`📍 ${options.method || 'GET'} ${endpoint}`);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Response:`, JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log(`✅ SUCCESS`);
    } else {
      console.log(`❌ ERROR: ${data.error || 'Unknown error'}`);
    }

    return { response, data };
  } catch (error) {
    console.log(`💥 NETWORK ERROR: ${error.message}`);
    return { error: error.message };
  }
}

async function runQuickTests() {
  console.log('🚀 Big Five API - Quick Test Suite');
  console.log('=' .repeat(50));

  // Test 1: Get questions via GET
  const test1 = await testEndpoint(
    'Get Questions (GET)',
    '/api/assessment/questions?userId=quick-test&language=en'
  );

  // Store assessment ID for next tests
  const assessmentId = test1.data?.assessmentId;

  // Test 2: Get questions via POST
  await testEndpoint(
    'Get Questions (POST)',
    '/api/assessment/questions',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'quick-test-post', language: 'en' })
    }
  );

  // Test 3: Validate answers
  if (assessmentId && test1.data?.questions) {
    const sampleAnswers = test1.data.questions.slice(0, 5).map(q => ({
      questionId: q.id,
      score: Math.floor(Math.random() * 5) + 1
    }));

    await testEndpoint(
      'Validate Answers',
      '/api/assessment/answers',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          answers: sampleAnswers
        })
      }
    );
  }

  // Test 4: Calculate results
  if (assessmentId && test1.data?.questions) {
    const allAnswers = test1.data.questions.map(q => ({
      questionId: q.id,
      score: Math.floor(Math.random() * 5) + 1
    }));

    await testEndpoint(
      'Calculate Results',
      '/api/assessment/results',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          answers: allAnswers,
          language: 'en'
        })
      }
    );
  }

  // Test 5: Error cases
  console.log(`\n🚨 Testing Error Cases:`);

  await testEndpoint(
    'Missing userId',
    '/api/assessment/questions',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'en' })
    }
  );

  await testEndpoint(
    'Invalid endpoint',
    '/api/assessment/invalid'
  );

  console.log('\n' + '=' .repeat(50));
  console.log('✅ Quick test complete!');
  console.log('🔗 API Documentation: http://localhost:3000/docs');
}

// Run tests
runQuickTests().catch(console.error);
