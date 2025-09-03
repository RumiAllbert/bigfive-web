import { handler as answersHandler } from '../../src/lambda/answers';
import { handler as historyHandler } from '../../src/lambda/history';
import { handler as questionsHandler } from '../../src/lambda/questions';
import { handler as resultsHandler } from '../../src/lambda/results';
import { handler as statusHandler } from '../../src/lambda/status';
import { createMockEvent, parseResponseBody, validateResponse } from '../setup';

describe('API Integration Tests', () => {
  test('complete assessment workflow', async () => {
    const userId = 'integration-test-user';
    const language = 'en';

    // Step 1: Get questions
    console.log('🧪 Step 1: Getting questions...');
    const getQuestionsEvent = createMockEvent('GET', '/assessment/questions', null, {
      userId,
      language
    });

    const questionsResponse = await questionsHandler(getQuestionsEvent);
    validateResponse(questionsResponse, 200);

    const questionsData = parseResponseBody(questionsResponse);
    expect(questionsData).toHaveProperty('assessmentId');
    expect(questionsData).toHaveProperty('questions');
    expect(Array.isArray(questionsData.questions)).toBe(true);
    expect(questionsData.questions.length).toBeGreaterThan(0);

    const assessmentId = questionsData.assessmentId;
    const questions = questionsData.questions;

    console.log(`✅ Got ${questions.length} questions for assessment: ${assessmentId}`);

    // Step 2: Validate answers (simulate user answers)
    console.log('🧪 Step 2: Validating answers...');
    const sampleAnswers = questions.slice(0, 10).map(q => ({
      questionId: q.id,
      score: Math.floor(Math.random() * 5) + 1 // Random score 1-5
    }));

    const validateAnswersEvent = createMockEvent('POST', '/assessment/answers', {
      assessmentId,
      answers: sampleAnswers
    });

    const answersResponse = await answersHandler(validateAnswersEvent);
    validateResponse(answersResponse, 200);

    const answersData = parseResponseBody(answersResponse);
    expect(answersData).toHaveProperty('success', true);
    expect(answersData).toHaveProperty('assessmentId', assessmentId);
    expect(answersData).toHaveProperty('answersCount', sampleAnswers.length);

    console.log(`✅ Validated ${sampleAnswers.length} answers`);

    // Step 3: Calculate complete results (using all questions)
    console.log('🧪 Step 3: Calculating personality results...');
    const completeAnswers = questions.map(q => ({
      questionId: q.id,
      score: Math.floor(Math.random() * 5) + 1
    }));

    const calculateResultsEvent = createMockEvent('POST', '/assessment/results', {
      assessmentId,
      answers: completeAnswers,
      language
    });

    const resultsResponse = await resultsHandler(calculateResultsEvent);
    validateResponse(resultsResponse, 200);

    const resultsData = parseResponseBody(resultsResponse);
    expect(resultsData).toHaveProperty('assessmentId', assessmentId);
    expect(resultsData).toHaveProperty('results');
    expect(resultsData).toHaveProperty('status', 'completed');
    expect(resultsData).toHaveProperty('answersProcessed', completeAnswers.length);

    // Validate Big Five personality results
    const results = resultsData.results;
    expect(results).toHaveProperty('overall');
    expect(results).toHaveProperty('facets');

    // Check all Big Five domains are present
    const domains = ['O', 'C', 'E', 'A', 'N'];
    domains.forEach(domain => {
      expect(results.overall).toHaveProperty(domain);
      expect(results.overall[domain]).toHaveProperty('score');
      expect(results.overall[domain]).toHaveProperty('count');
      expect(results.overall[domain]).toHaveProperty('result');
      expect(['high', 'neutral', 'low']).toContain(results.overall[domain].result);
    });

    console.log('✅ Calculated personality results:');
    domains.forEach(domain => {
      const domainResult = results.overall[domain];
      console.log(`   ${domain}: ${domainResult.result} (${domainResult.score}/${domainResult.count})`);
    });

    // Step 4: Check assessment status
    console.log('🧪 Step 4: Checking assessment status...');
    const statusEvent = createMockEvent('GET', '/assessment/status', null, {
      assessmentId
    });

    const statusResponse = await statusHandler(statusEvent);
    validateResponse(statusResponse, 200);

    const statusData = parseResponseBody(statusResponse);
    expect(statusData).toHaveProperty('assessmentId', assessmentId);
    expect(statusData).toHaveProperty('status', 'info_only');
    expect(statusData).toHaveProperty('apiType', 'stateless');

    console.log('✅ Status check completed');

    // Step 5: Check assessment history (should be empty for stateless API)
    console.log('🧪 Step 5: Checking assessment history...');
    const historyEvent = createMockEvent('GET', '/assessment/history', null, {
      userId
    });

    const historyResponse = await historyHandler(historyEvent);
    validateResponse(historyResponse, 200);

    const historyData = parseResponseBody(historyResponse);
    expect(historyData).toHaveProperty('userId', userId);
    expect(historyData).toHaveProperty('history');
    expect(Array.isArray(historyData.history)).toBe(true);
    expect(historyData.history.length).toBe(0); // Should be empty for stateless API

    console.log('✅ History check completed (empty as expected for stateless API)');

    console.log('\n🎉 Integration test completed successfully!');
    console.log(`📊 Assessment ID: ${assessmentId}`);
    console.log(`📝 User ID: ${userId}`);
    console.log(`❓ Questions processed: ${questions.length}`);
    console.log(`✅ Answers validated: ${completeAnswers.length}`);
    console.log(`🧠 Personality results calculated for ${domains.length} domains`);
  });

  test('error handling across API endpoints', async () => {
    console.log('🧪 Testing error handling across endpoints...');

    // Test missing parameters for each endpoint
    const errorTests = [
      {
        name: 'Questions without userId',
        handler: questionsHandler,
        event: createMockEvent('GET', '/assessment/questions')
      },
      {
        name: 'Answers without assessmentId',
        handler: answersHandler,
        event: createMockEvent('POST', '/assessment/answers', { answers: [] })
      },
      {
        name: 'Results without assessmentId',
        handler: resultsHandler,
        event: createMockEvent('POST', '/assessment/results', { answers: [] })
      },
      {
        name: 'History without userId',
        handler: historyHandler,
        event: createMockEvent('GET', '/assessment/history')
      },
      {
        name: 'Status without assessmentId',
        handler: statusHandler,
        event: createMockEvent('GET', '/assessment/status')
      }
    ];

    for (const test of errorTests) {
      console.log(`   Testing: ${test.name}`);
      const response = await test.handler(test.event);
      validateResponse(response, 400);
      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error');
    }

    console.log('✅ All error handling tests passed');
  });

  test('CORS headers are present on all responses', async () => {
    console.log('🧪 Testing CORS headers...');

    const corsTests = [
      { handler: questionsHandler, event: createMockEvent('OPTIONS', '/assessment/questions') },
      { handler: answersHandler, event: createMockEvent('OPTIONS', '/assessment/answers') },
      { handler: resultsHandler, event: createMockEvent('OPTIONS', '/assessment/results') },
      { handler: historyHandler, event: createMockEvent('OPTIONS', '/assessment/history') },
      { handler: statusHandler, event: createMockEvent('OPTIONS', '/assessment/status') }
    ];

    for (const test of corsTests) {
      const response = await test.handler(test.event);
      validateResponse(response, 200);

      expect(response.headers).toHaveProperty('Access-Control-Allow-Origin', '*');
      expect(response.headers).toHaveProperty('Access-Control-Allow-Headers');
      expect(response.headers).toHaveProperty('Access-Control-Allow-Methods');
    }

    console.log('✅ All CORS headers are present');
  });
});
