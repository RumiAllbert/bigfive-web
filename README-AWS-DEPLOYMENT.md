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

2. **Test your changes** (recommended):
```bash
node test-runner.js all
```

3. Start local development server:
```bash
npm run dev
```

This will start the serverless offline plugin on `http://localhost:3001`

### Development Workflow

1. **Make changes** to Lambda functions in `src/lambda/`
2. **Run tests** to ensure functionality: `node test-runner.js all`
3. **Start local server** for manual testing: `npm run dev`
4. **Test API endpoints** using the examples below
5. **Deploy when ready**: `./deploy.sh --stage dev`

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
npx jest test/lambda/ --verbose              # Run all tests
npx jest test/lambda/*.test.ts --verbose     # Run unit tests only
npx jest test/lambda/integration.test.ts --verbose # Run integration tests only
npx jest test/lambda/ --coverage             # Run with coverage report
npx jest test/lambda/ --watch                 # Run tests in watch mode
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

### Test Results

When you run the tests, you should see:
- **43 tests passing** across 6 test suites
- **Questions API**: 10 tests (GET/POST, validation, language fallback)
- **Answers API**: 12 tests (validation, error handling, score validation)
- **Results API**: 8 tests (calculation, Big Five domains, error handling)
- **History API**: 4 tests (stateless behavior)
- **Status API**: 5 tests (assessment status, user extraction)
- **Integration**: 3 tests (complete workflow, CORS, error handling)

All tests should pass with no failures before deploying to AWS.

## Deployment

### Quick Deployment (Recommended)

```bash
# Deploy to development environment
./deploy.sh --stage dev

# Deploy to production environment
./deploy.sh --stage prod
```

### Manual Deployment

```bash
# Using Serverless Framework directly
serverless deploy --stage dev
serverless deploy --stage prod

# Or using npm scripts (if package-lambda.json is used)
npm run deploy:dev
npm run deploy:prod
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
      {"questionId": "43c98ce8-a07a-4dc2-80f6-c1b2a2485f06", "score": 4},
      {"questionId": "d50a597f-632b-4f7b-89e6-6d85b50fd1c9", "score": 3},
      {"questionId": "888dd864-7449-4e96-8d5c-7a439603ea91", "score": 5}
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
      {"questionId": "43c98ce8-a07a-4dc2-80f6-c1b2a2485f06", "score": 4},
      {"questionId": "d50a597f-632b-4f7b-89e6-6d85b50fd1c9", "score": 3},
      {"questionId": "888dd864-7449-4e96-8d5c-7a439603ea91", "score": 5}
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

2. **Memory Issues**: Monitor CloudWatch logs for memory-related errors and adjust Lambda memory allocation.

3. **Timeout Errors**: If functions timeout, increase the timeout setting in `serverless.yml`.

4. **Test Failures**: Run `node test-runner.js all` locally to verify everything works before deploying.

5. **API Gateway Errors**: Check CloudWatch logs for API Gateway specific errors and ensure proper IAM permissions.

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
3. Run local tests: `node test-runner.js all`
4. Review AWS Lambda and API Gateway configurations
5. Check API Gateway logs for request/response details
