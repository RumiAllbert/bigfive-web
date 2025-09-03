# bigfive-web

Prod: https://bigfive-test.com

Website for five factor model of personality based on work from [IPIP-NEO-PI](https://github.com/kholia/IPIP-NEO-PI).

Tests and evaluation is gathered from [ipip.ori.org](http://ipip.ori.org).

See it live @ [bigfive-test.com](https://bigfive-test.com)

## 🚀 **New: AWS Serverless Deployment**

This project now includes a **production-ready AWS Lambda deployment** for serverless API hosting:

- ✅ **43 comprehensive tests** - All passing
- ✅ **Zero server management** - AWS handles scaling and infrastructure
- ✅ **Stateless architecture** - Perfect for serverless
- ✅ **Sub-second cold starts** - Optimized for performance
- ✅ **Production deployment scripts** - Ready to deploy

```bash
# Deploy to AWS Lambda + API Gateway
git checkout aws-serverless
./deploy.sh --stage prod
```

📖 **[AWS Deployment Guide](README-AWS-DEPLOYMENT.md)** - Complete setup and deployment instructions.

## API Documentation

This project includes a comprehensive **stateless API** for Big Five personality assessments. The API provides:

- ✅ **120 personality questions** in 20+ languages
- ✅ **Real-time scoring** of Big Five traits (O, C, E, A, N)
- ✅ **Facet analysis** for detailed personality insights
- ✅ **Stateless design** - you manage all data storage
- ✅ **RESTful endpoints** with JSON responses
- ✅ **AWS Lambda ready** - Deploy serverless with one command

### Quick API Setup

#### Option 1: Local Development
```bash
# Start the server
cd web && npm run dev

# Get questions
curl -X POST http://localhost:3000/api/assessment/questions \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'
```

#### Option 2: AWS Serverless (Production)
```bash
# Deploy to AWS and get your API endpoint
git checkout aws-serverless
./deploy.sh --stage prod

# Use your AWS API Gateway URL
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/assessment/questions \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'
```

### API Documentation

📖 **[Complete API Documentation](API_DOCUMENTATION.md)** - Everything you need to integrate the Big Five assessment API into your application.

📖 **[AWS Serverless Deployment Guide](README-AWS-DEPLOYMENT.md)** - Production deployment with Lambda and API Gateway.

The documentation includes:
- Detailed endpoint specifications
- Request/response examples
- Code samples in JavaScript, Python, and cURL
- Database schema recommendations
- Production deployment guidelines
- Testing instructions
- AWS Lambda optimization tips

### API Endpoints

- `POST /api/assessment/questions` - Get personality questions
- `POST /api/assessment/answers` - Validate user answers
- `POST /api/assessment/results` - Calculate personality results
- `GET /api/assessment/status` - Check assessment info
- `GET /api/assessment/history` - User assessment history

## Testing

The project includes comprehensive testing suites for both local development and AWS Lambda:

### Local API Testing
```bash
# Run comprehensive API tests
node api-comprehensive-test.js

# Run quick manual tests
node quick-api-test.js

# Run performance tests
node performance-test.js
```

### AWS Lambda Testing
```bash
# Switch to serverless branch
git checkout aws-serverless

# Run all Lambda function tests (43 tests)
node test-runner.js all

# Run unit tests only
node test-runner.js unit

# Run integration tests
node test-runner.js integration

# Run with coverage report
node test-runner.js coverage
```

See [API_TESTING_README.md](API_TESTING_README.md) for detailed testing instructions.

See [README-AWS-DEPLOYMENT.md](README-AWS-DEPLOYMENT.md) for Lambda-specific testing details.

## Development

### Web Application Development

```bash
# Install dependencies
npm install

# Start development server
cd web && npm run dev

# View API documentation
open http://localhost:3000/docs
```

### AWS Lambda Development

```bash
# Switch to serverless branch
git checkout aws-serverless

# Install dependencies
npm install

# Run tests before development
node test-runner.js all

# Start local Lambda development server
npm run dev

# Test Lambda functions locally
curl -X POST http://localhost:3001/assessment/questions \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user"}'

# Deploy to AWS
./deploy.sh --stage dev
```

### Development Workflow

1. **Choose your deployment target:**
   - Web app: `master` branch for Next.js deployment
   - Serverless API: `aws-serverless` branch for AWS Lambda

2. **Test your changes:**
   - Web: Use existing test scripts
   - Lambda: Run `node test-runner.js all` before deployment

3. **Deploy:**
   - Web: Deploy to Vercel/Netlify
   - Lambda: Run `./deploy.sh --stage prod`

## 🚀 Deployment Options

Choose the deployment method that best fits your needs:

### Option 1: Full Web Application (Recommended for complete sites)
- **Branch**: `master`
- **Technology**: Next.js + React
- **Hosting**: Vercel, Netlify, or any Node.js hosting
- **Features**: Complete website with UI, API, and documentation
- **Best for**: Public websites, marketing sites, complete applications

### Option 2: Serverless API Only (Recommended for API integration)
- **Branch**: `aws-serverless`
- **Technology**: AWS Lambda + API Gateway
- **Hosting**: Amazon Web Services
- **Features**: Pure API with 43 tests, zero server management
- **Best for**: API integrations, microservices, production APIs
- **Cost**: Pay only for usage (very low cost)

### Quick Start by Use Case

#### For Web Developers:
```bash
# Full web application
npm install
cd web && npm run dev
```

#### For API Developers:
```bash
# Serverless API
git checkout aws-serverless
node test-runner.js all  # Verify everything works
./deploy.sh --stage prod
```

### Comparison

| Feature | Web Application | Serverless API |
|---------|----------------|----------------|
| **Setup Time** | 5-10 minutes | 2-3 minutes |
| **Testing** | Basic API tests | 43 comprehensive tests |
| **Scalability** | Limited by hosting | Unlimited AWS scaling |
| **Cost** | Fixed hosting cost | Pay per request |
| **Maintenance** | Server management | Zero maintenance |
| **Cold Starts** | None | ~100-500ms |
| **Best For** | Complete websites | API integrations |

## Help wanted

If you want to help by translating the items to other languages look [here](https://b5.translations.alheimsins.net/).

## License

[MIT](LICENSE)
