# bigfive-web

Prod: https://bigfive-test.com

Website for five factor model of personality based on work from [IPIP-NEO-PI](https://github.com/kholia/IPIP-NEO-PI).

Tests and evaluation is gathered from [ipip.ori.org](http://ipip.ori.org).

See it live @ [bigfive-test.com](https://bigfive-test.com)

## API Documentation

This project includes a comprehensive **stateless API** for Big Five personality assessments. The API provides:

- ✅ **120 personality questions** in 20+ languages
- ✅ **Real-time scoring** of Big Five traits (O, C, E, A, N)
- ✅ **Facet analysis** for detailed personality insights
- ✅ **Stateless design** - you manage all data storage
- ✅ **RESTful endpoints** with JSON responses

### Quick API Setup

```bash
# Start the server
cd web && npm run dev

# Get questions
curl -X POST http://localhost:3000/api/assessment/questions \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'
```

### API Documentation

📖 **[Complete API Documentation](API_DOCUMENTATION.md)** - Everything you need to integrate the Big Five assessment API into your application.

The documentation includes:
- Detailed endpoint specifications
- Request/response examples
- Code samples in JavaScript, Python, and cURL
- Database schema recommendations
- Production deployment guidelines
- Testing instructions

### API Endpoints

- `POST /api/assessment/questions` - Get personality questions
- `POST /api/assessment/answers` - Validate user answers
- `POST /api/assessment/results` - Calculate personality results
- `GET /api/assessment/status` - Check assessment info
- `GET /api/assessment/history` - User assessment history

## Testing

The project includes comprehensive testing suites:

```bash
# Run comprehensive API tests
node api-comprehensive-test.js

# Run quick manual tests
node quick-api-test.js

# Run performance tests
node performance-test.js
```

See [API_TESTING_README.md](API_TESTING_README.md) for detailed testing instructions.

## Development

```bash
# Install dependencies
npm install

# Start development server
cd web && npm run dev

# View API documentation
open http://localhost:3000/docs
```

## Help wanted

If you want to help by translating the items to other languages look [here](https://b5.translations.alheimsins.net/).

## License

[MIT](LICENSE)
