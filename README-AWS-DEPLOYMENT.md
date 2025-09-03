# Big Five Personality Assessment - AWS Serverless Deployment

This branch contains the AWS Lambda/serverless version of the Big Five personality assessment API.

## Architecture Overview

The API has been transformed from Next.js routes to pure AWS Lambda functions with API Gateway:

- **Questions API**: `/assessment/questions` - GET/POST
- **Answers API**: `/assessment/answers` - POST
- **Results API**: `/assessment/results` - POST
- **History API**: `/assessment/history` - GET
- **Status API**: `/assessment/status` - GET

## Stateless Design

**This API is completely stateless** - it doesn't require or use any database connections. All operations happen in-memory:

- Questions are loaded from the `@bigfive-org/questions` package
- Results are calculated on-demand from user answers
- No persistent storage is needed or used
- Each request is independent and self-contained

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Node.js 18+**
3. **Serverless Framework**

```bash
npm install -g serverless
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_PROFILE=default

# Environment
NODE_ENV=development
```

**Note:** No database configuration is needed since this API is completely stateless.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start local development server:
```bash
npm run dev
```

This will start the serverless offline plugin on `http://localhost:3001`

## Testing

The API includes comprehensive test suites to ensure reliability:

### Running Tests Locally

1. **Quick Test Runner** (recommended for beginners):
```bash
node test-runner.js unit        # Run unit tests
node test-runner.js integration # Run integration tests
node test-runner.js all         # Run all tests
node test-runner.js coverage    # Run with coverage report
```

2. **Direct Jest Commands**:
```bash
npm test              # Run all tests
npm run test:unit     # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:coverage # Run with coverage report
npm run test:watch    # Run tests in watch mode
```

### Test Structure

- **Unit Tests**: Test individual Lambda functions in isolation
  - `questions.test.ts` - Tests question retrieval
  - `answers.test.ts` - Tests answer validation
  - `results.test.ts` - Tests personality calculation
  - `history.test.ts` - Tests history endpoint
  - `status.test.ts` - Tests status endpoint

- **Integration Tests**: Test complete API workflow
  - `integration.test.ts` - End-to-end assessment flow

### What Gets Tested

✅ **API Functionality**: All endpoints work correctly
✅ **Input Validation**: Proper error handling for invalid inputs
✅ **Response Format**: Correct JSON structure and status codes
✅ **CORS Headers**: Proper cross-origin headers
✅ **Error Handling**: Appropriate error responses
✅ **Business Logic**: Personality calculation accuracy
✅ **Stateless Behavior**: No persistent state between requests

### Test Coverage

Tests provide coverage for:
- Happy path scenarios
- Error conditions and edge cases
- Input validation and sanitization
- Response format validation
- CORS and security headers
- Complete assessment workflow

## Deployment

### Development Environment

```bash
npm run deploy:dev
```

### Production Environment

```bash
npm run deploy:prod
```

### Manual Deployment

```bash
serverless deploy --stage dev
serverless deploy --stage prod
```

## API Endpoints

After deployment, your API will be available at:
```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}
```

### Examples:

1. **Get Questions**:
```bash
curl -X GET "https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/assessment/questions?userId=test-user&language=en"
```

2. **Submit Answers**:
```bash
curl -X POST "https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/assessment/answers" \
  -H "Content-Type: application/json" \
  -d '{
    "assessmentId": "assessment_test-user_1234567890",
    "answers": [
      {"questionId": "1", "score": 4},
      {"questionId": "2", "score": 3}
    ]
  }'
```

3. **Calculate Results**:
```bash
curl -X POST "https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/assessment/results" \
  -H "Content-Type: application/json" \
  -d '{
    "assessmentId": "assessment_test-user_1234567890",
    "answers": [
      {"questionId": "1", "score": 4},
      {"questionId": "2", "score": 3}
    ],
    "language": "en"
  }'
```

## Data Storage

Since this API is completely stateless, all data processing happens in-memory. If you need to persist assessment data, you can:

1. Store answers and results in your own database
2. Use the assessment IDs to track user sessions
3. Implement your own data persistence layer on the client side

The API provides all the necessary data in responses for you to store as needed.

## Monitoring & Logging

- **CloudWatch Logs**: All Lambda function logs are automatically sent to CloudWatch
- **CloudWatch Metrics**: Monitor function duration, errors, and invocations
- **X-Ray**: Enable AWS X-Ray for distributed tracing

## Cost Optimization

1. **Memory Allocation**: Currently set to 512MB, adjust based on your needs
2. **Timeout**: Set to 30 seconds, reduce if your functions complete faster
3. **Reserved Concurrency**: Set concurrency limits to control costs
4. **API Gateway Caching**: Enable caching for frequently accessed data

## Security

1. **API Gateway**: Configure proper authentication (API keys, Cognito, etc.)
2. **Environment Variables**: Store sensitive data in AWS Systems Manager Parameter Store
3. **VPC**: Deploy Lambda functions in VPC for enhanced security
4. **CORS**: Configure appropriate CORS settings for your frontend

## Troubleshooting

### Common Issues:

1. **Cold Start Performance**: Lambda functions may have cold starts. Consider provisioned concurrency.

2. **MongoDB Connection Timeout**: Ensure your MongoDB instance is accessible from AWS Lambda.

3. **Memory Issues**: Monitor CloudWatch logs for memory-related errors and adjust Lambda memory allocation.

4. **Timeout Errors**: If functions timeout, increase the timeout setting in `serverless.yml`.

### Logs:

```bash
serverless logs -f getQuestions --stage dev
```

## Migration from Vercel

If migrating from the Vercel version:

1. Update your frontend to use the new API Gateway URLs
2. Ensure environment variables are properly configured
3. Test all endpoints thoroughly
4. Update CORS settings to allow your frontend domain
5. Consider implementing proper authentication if needed

## Support

For issues specific to the AWS deployment:
1. Check CloudWatch logs
2. Verify environment variables
3. Test MongoDB connectivity
4. Review AWS Lambda and API Gateway configurations
