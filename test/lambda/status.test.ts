import { handler } from '../../src/lambda/status';
import { createMockEvent, parseResponseBody, validateResponse } from '../setup';

describe('Status Lambda Function', () => {
  describe('GET /assessment/status', () => {
    test('should return assessment status info', async () => {
      const event = createMockEvent('GET', '/assessment/status', null, {
        assessmentId: 'assessment_test-user_1234567890'
      });

      const response = await handler(event);
      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('assessmentId', 'assessment_test-user_1234567890');
      expect(body).toHaveProperty('userId', 'test-user');
      expect(body).toHaveProperty('status', 'info_only');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('apiType', 'stateless');

      // Validate message content
      expect(body.message).toContain('stateless API');
    });

    test('should extract userId from assessmentId format', async () => {
      const event = createMockEvent('GET', '/assessment/status', null, {
        assessmentId: 'assessment_different-user_9876543210'
      });

      const response = await handler(event);
      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('userId', 'different-user');
    });

    test('should handle unknown userId', async () => {
      const event = createMockEvent('GET', '/assessment/status', null, {
        assessmentId: 'random-format-without-user'
      });

      const response = await handler(event);
      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('userId', 'unknown');
    });

    test('should reject missing assessmentId', async () => {
      const event = createMockEvent('GET', '/assessment/status');

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'assessmentId is required');
    });

    test('should handle OPTIONS request', async () => {
      const event = createMockEvent('OPTIONS', '/assessment/status');

      const response = await handler(event);
      validateResponse(response, 200);
    });
  });

  describe('Unsupported methods', () => {
    test('should return 405 for POST method', async () => {
      const event = createMockEvent('POST', '/assessment/status');

      const response = await handler(event);
      validateResponse(response, 405);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'Method not allowed');
    });
  });
});
