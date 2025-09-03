import { handler } from '../../src/lambda/answers';
import { createMockEvent, parseResponseBody, validateResponse } from '../setup';

describe('Answers Lambda Function', () => {
  describe('POST /assessment/answers', () => {
    test('should validate correct answers', async () => {
      const validAnswers = [
        { questionId: '1', score: 4 },
        { questionId: '2', score: 2 },
        { questionId: '3', score: 5 },
        { questionId: '4', score: 1 },
        { questionId: '5', score: 3 }
      ];

      const event = createMockEvent('POST', '/assessment/answers', {
        assessmentId: 'test-assessment-123',
        answers: validAnswers
      });

      const response = await handler(event);
      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('assessmentId', 'test-assessment-123');
      expect(body).toHaveProperty('answersCount', 5);
      expect(body).toHaveProperty('status', 'validated');
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('Answers validated successfully');
    });

    test('should reject missing assessmentId', async () => {
      const event = createMockEvent('POST', '/assessment/answers', {
        answers: [{ questionId: '1', score: 3 }]
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'assessmentId is required');
    });

    test('should reject missing answers array', async () => {
      const event = createMockEvent('POST', '/assessment/answers', {
        assessmentId: 'test-assessment-123'
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'answers must be a non-empty array');
    });

    test('should reject empty answers array', async () => {
      const event = createMockEvent('POST', '/assessment/answers', {
        assessmentId: 'test-assessment-123',
        answers: []
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'answers must be a non-empty array');
    });

    test('should reject invalid answer format - missing questionId', async () => {
      const invalidAnswers = [
        { score: 3 }, // missing questionId
        { questionId: '2', score: 4 }
      ];

      const event = createMockEvent('POST', '/assessment/answers', {
        assessmentId: 'test-assessment-123',
        answers: invalidAnswers
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('Each answer must have questionId and score');
    });

    test('should reject invalid answer format - missing score', async () => {
      const invalidAnswers = [
        { questionId: '1' }, // missing score
        { questionId: '2', score: 4 }
      ];

      const event = createMockEvent('POST', '/assessment/answers', {
        assessmentId: 'test-assessment-123',
        answers: invalidAnswers
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('Each answer must have questionId and score');
    });

    test('should reject score below minimum', async () => {
      const invalidAnswers = [
        { questionId: '1', score: 0 }, // score too low
        { questionId: '2', score: 3 }
      ];

      const event = createMockEvent('POST', '/assessment/answers', {
        assessmentId: 'test-assessment-123',
        answers: invalidAnswers
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('Score must be between 1 and 5');
    });

    test('should reject score above maximum', async () => {
      const invalidAnswers = [
        { questionId: '1', score: 6 }, // score too high
        { questionId: '2', score: 3 }
      ];

      const event = createMockEvent('POST', '/assessment/answers', {
        assessmentId: 'test-assessment-123',
        answers: invalidAnswers
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('Score must be between 1 and 5');
    });

    test('should reject non-numeric score', async () => {
      const invalidAnswers = [
        { questionId: '1', score: 'three' }, // non-numeric score
        { questionId: '2', score: 3 }
      ];

      const event = createMockEvent('POST', '/assessment/answers', {
        assessmentId: 'test-assessment-123',
        answers: invalidAnswers
      });

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('Each answer must have questionId and score');
    });

    test('should handle missing request body', async () => {
      const event = createMockEvent('POST', '/assessment/answers');

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'Request body is required');
    });

    test('should handle OPTIONS request', async () => {
      const event = createMockEvent('OPTIONS', '/assessment/answers');

      const response = await handler(event);
      validateResponse(response, 200);
    });
  });

  describe('Unsupported methods', () => {
    test('should return 405 for GET method', async () => {
      const event = createMockEvent('GET', '/assessment/answers');

      const response = await handler(event);
      validateResponse(response, 405);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'Method not allowed');
    });
  });
});
