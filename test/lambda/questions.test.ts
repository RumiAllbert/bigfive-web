import { handler } from '../../src/lambda/questions';
import { createMockEvent, parseResponseBody, validateResponse } from '../setup';

describe('Questions Lambda Function', () => {
  describe('GET /assessment/questions', () => {
    test('should return questions with valid userId', async () => {
      const event = createMockEvent('GET', '/assessment/questions', null, {
        userId: 'test-user',
        language: 'en'
      });

      const response = await handler(event);
      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('assessmentId');
      expect(body).toHaveProperty('userId', 'test-user');
      expect(body).toHaveProperty('questions');
      expect(body).toHaveProperty('assessmentInfo');
      expect(body).toHaveProperty('status', 'success');

      // Validate questions structure
      expect(Array.isArray(body.questions)).toBe(true);
      expect(body.questions.length).toBeGreaterThan(0);

      // Validate assessment info
      expect(body.assessmentInfo).toHaveProperty('name');
      expect(body.assessmentInfo).toHaveProperty('language', 'en');
      expect(body.assessmentInfo).toHaveProperty('questionsCount');
    });

    test('should return questions with assessmentId only', async () => {
      const event = createMockEvent('GET', '/assessment/questions', null, {
        assessmentId: 'test-assessment-123'
      });

      const response = await handler(event);
      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('assessmentId');
      expect(body).toHaveProperty('userId', 'demo-user');
      expect(body).toHaveProperty('questions');
    });

    test('should handle missing parameters', async () => {
      const event = createMockEvent('GET', '/assessment/questions');

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('assessmentId or userId is required');
    });

    test('should handle unsupported language fallback', async () => {
      const event = createMockEvent('GET', '/assessment/questions', null, {
        userId: 'test-user',
        language: 'unsupported-lang'
      });

      const response = await handler(event);
      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('assessmentInfo.language', 'en');
    });

    test('should handle OPTIONS request', async () => {
      const event = createMockEvent('OPTIONS', '/assessment/questions');

      const response = await handler(event);
      validateResponse(response, 200);
    });
  });

  describe('POST /assessment/questions', () => {
    test('should create assessment with valid userId', async () => {
      const event = createMockEvent('POST', '/assessment/questions', {
        userId: 'test-user-post',
        language: 'en'
      });

      const response = await handler(event);
      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('assessmentId');
      expect(body).toHaveProperty('userId', 'test-user-post');
      expect(body).toHaveProperty('questions');
      expect(body).toHaveProperty('assessmentInfo');
      expect(body).toHaveProperty('status', 'success');

      // Validate assessment ID format
      expect(body.assessmentId).toMatch(/^assessment_test-user-post_\d+$/);
    });

    test('should handle missing userId', async () => {
      const event = createMockEvent('POST', '/assessment/questions', {
        language: 'en'
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'userId is required');
    });

    test('should handle missing request body', async () => {
      const event = createMockEvent('POST', '/assessment/questions');

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'Request body is required');
    });

    test('should handle invalid JSON', async () => {
      const event = createMockEvent('POST', '/assessment/questions');
      event.body = 'invalid json';

      const response = await handler(event);
      validateResponse(response, 500);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'Internal server error');
    });
  });

  describe('Unsupported methods', () => {
    test('should return 405 for unsupported methods', async () => {
      const event = createMockEvent('PUT', '/assessment/questions');

      const response = await handler(event);
      validateResponse(response, 405);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'Method not allowed');
    });
  });
});
