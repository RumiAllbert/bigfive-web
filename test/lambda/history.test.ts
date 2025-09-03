import { handler } from '../../src/lambda/history';
import { createMockEvent, parseResponseBody, validateResponse } from '../setup';

describe('History Lambda Function', () => {
  describe('GET /assessment/history', () => {
    test('should return stateless history message', async () => {
      const event = createMockEvent('GET', '/assessment/history', null, {
        userId: 'test-user'
      });

      const response = await handler(event);
      validateResponse(response, 200);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('userId', 'test-user');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('apiType', 'stateless');
      expect(body).toHaveProperty('history');
      expect(body).toHaveProperty('note');

      // Validate history is empty array since it's stateless
      expect(body.history).toEqual([]);

      // Validate message content
      expect(body.message).toContain('stateless API');
      expect(body.note).toContain('Use your own database');
    });

    test('should reject missing userId', async () => {
      const event = createMockEvent('GET', '/assessment/history');

      const response = await handler(event);
      validateResponse(response, 400);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'userId is required');
    });

    test('should handle OPTIONS request', async () => {
      const event = createMockEvent('OPTIONS', '/assessment/history');

      const response = await handler(event);
      validateResponse(response, 200);
    });
  });

  describe('Unsupported methods', () => {
    test('should return 405 for POST method', async () => {
      const event = createMockEvent('POST', '/assessment/history');

      const response = await handler(event);
      validateResponse(response, 405);

      const body = parseResponseBody(response);
      expect(body).toHaveProperty('error', 'Method not allowed');
    });
  });
});
