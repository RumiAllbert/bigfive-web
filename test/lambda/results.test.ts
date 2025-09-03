import { handler } from '../../src/lambda/results';
import { createMockEvent, parseResponseBody, validateResponse } from '../setup';

describe('Results Lambda Function', () => {
  describe('POST /assessment/results', () => {
    test('should calculate results with valid answers', async () => {
      // Get real questions to use their actual IDs
      const { getItems } = await import('@bigfive-org/questions');
      const questions = getItems('en');

      // Create answers for the first 10 questions to test the calculation
      const mockAnswers = questions.slice(0, 10).map((question, index) => ({
        questionId: question.id,
        score: (index % 5) + 1 // Scores: 1, 2, 3, 4, 5, 1, 2, 3, 4, 5
      }));

      const event = createMockEvent('POST', '/assessment/results', {
        assessmentId: 'test-assessment-123',
        answers: mockAnswers,
        language: 'en'
      });

      const response = await handler(event);

      // Log response for debugging if it fails
      if (response.statusCode !== 200) {
        console.error('Response status:', response.statusCode);
        console.error('Response body:', response.body);
        throw new Error(`Expected status 200 but got ${response.statusCode}. Response: ${response.body}`);
      }

      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('assessmentId', 'test-assessment-123');
      expect(body).toHaveProperty('results');
      expect(body).toHaveProperty('status', 'completed');
      expect(body).toHaveProperty('language', 'en');
      expect(body).toHaveProperty('answersProcessed', 10);

      // Validate results structure
      const results = body.results;
      expect(results).toHaveProperty('overall');
      expect(results).toHaveProperty('facets');
      expect(results).toHaveProperty('generatedAt');
      expect(results).toHaveProperty('rawScores');

      // Validate Big Five domains are present
      const expectedDomains = ['O', 'C', 'E', 'A', 'N'];
      expectedDomains.forEach(domain => {
        expect(results.overall).toHaveProperty(domain);
        expect(results.overall[domain]).toHaveProperty('score');
        expect(results.overall[domain]).toHaveProperty('count');
        expect(results.overall[domain]).toHaveProperty('result');

        // Validate result is one of: high, neutral, low
        expect(['high', 'neutral', 'low']).toContain(results.overall[domain].result);
      });
    });

    test('should reject missing assessmentId', async () => {
      const event = createMockEvent('POST', '/assessment/results', {
        answers: [{ questionId: '1', score: 3 }]
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'assessmentId is required');
    });

    test('should reject missing answers', async () => {
      const event = createMockEvent('POST', '/assessment/results', {
        assessmentId: 'test-assessment-123'
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'answers array is required and must not be empty');
    });

    test('should reject empty answers array', async () => {
      const event = createMockEvent('POST', '/assessment/results', {
        assessmentId: 'test-assessment-123',
        answers: []
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'answers array is required and must not be empty');
    });

    test('should handle missing request body', async () => {
      const event = createMockEvent('POST', '/assessment/results');

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'Request body is required');
    });

    test('should handle OPTIONS request', async () => {
      const event = createMockEvent('OPTIONS', '/assessment/results');

      const response = await handler(event);
      validateResponse(response, 200);
    });
  });

  describe('GET /assessment/results', () => {
    test('should return method not supported message', async () => {
      const event = createMockEvent('GET', '/assessment/results');

      const response = await handler(event);
      validateResponse(response, 405);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('GET method not supported');
    });
  });

  describe('Unsupported methods', () => {
    test('should return 405 for PUT method', async () => {
      const event = createMockEvent('PUT', '/assessment/results');

      const response = await handler(event);
      validateResponse(response, 405);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'Method not allowed');
    });
  });
});
