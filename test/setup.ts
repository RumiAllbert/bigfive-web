// Jest setup file for Lambda function tests
import { APIGatewayProxyEvent } from 'aws-lambda';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Helper function to create mock API Gateway events
export const createMockEvent = (
  method: string,
  path: string,
  body?: any,
  queryStringParameters?: Record<string, string>,
  pathParameters?: Record<string, string>
): APIGatewayProxyEvent => ({
  httpMethod: method,
  path,
  body: body ? JSON.stringify(body) : null,
  headers: {
    'Content-Type': 'application/json',
  },
  multiValueHeaders: {},
  queryStringParameters: queryStringParameters || null,
  multiValueQueryStringParameters: null,
  pathParameters: pathParameters || null,
  requestContext: {
    accountId: '123456789012',
    apiId: 'test-api',
    authorizer: {},
    httpMethod: method,
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '127.0.0.1',
      user: null,
      userAgent: 'jest-test',
      userArn: null,
    },
    path,
    protocol: 'HTTP/1.1',
    stage: 'test',
    requestId: 'test-request-id',
    requestTimeEpoch: Date.now(),
    resourceId: 'test-resource',
    resourcePath: path,
  },
  resource: path,
  stageVariables: null,
  isBase64Encoded: false,
});

// Helper function to validate response structure
export const validateResponse = (response: any, expectedStatusCode: number = 200) => {
  expect(response).toHaveProperty('statusCode', expectedStatusCode);
  expect(response).toHaveProperty('headers');
  expect(response.headers).toHaveProperty('Content-Type', 'application/json');
  expect(response.headers).toHaveProperty('Access-Control-Allow-Origin', '*');
  expect(response).toHaveProperty('body');

  if (response.body) {
    expect(() => JSON.parse(response.body)).not.toThrow();
  }
};

// Helper function to parse response body
export const parseResponseBody = (response: any) => {
  return JSON.parse(response.body);
};
