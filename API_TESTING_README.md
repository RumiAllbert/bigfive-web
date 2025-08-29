# 🧪 Big Five API Testing Suite

Comprehensive testing suite for the Big Five Personality Assessment API before production deployment.

## 📋 Test Coverage

### ✅ **api-comprehensive-test.js** - Full Test Suite
- **Questions Endpoint** (`/api/assessment/questions`)
  - GET with userId and assessmentId
  - POST with valid/invalid data
  - Different languages support
  - Error handling for missing parameters

- **Answers Endpoint** (`/api/assessment/answers`)
  - Valid answers submission
  - Input validation (assessmentId, score range)
  - Empty answers handling
  - Error responses

- **Results Endpoint** (`/api/assessment/results`)
  - Complete personality calculation
  - Partial answers handling
  - Big Five traits validation
  - Error handling

- **Error Handling & Edge Cases**
  - Invalid endpoints
  - Malformed JSON
  - Unsupported languages
  - Long input validation

- **Performance Testing**
  - Concurrent requests (10 simultaneous)
  - Response time benchmarks
  - Load testing metrics

- **Data Integrity**
  - Unique assessment ID generation
  - Questions consistency
  - Data structure validation

### ✅ **quick-api-test.js** - Manual Testing Helper
- Interactive endpoint testing
- Real-time response viewing
- Error case demonstrations
- Quick validation checks

### ✅ **performance-test.js** - Load Testing
- 50 concurrent requests per endpoint
- Response time analysis
- Success rate metrics
- Performance benchmarks

## 🚀 How to Run Tests

### Prerequisites
```bash
# Ensure your API server is running
cd /web
npm run dev
# Server should be at http://localhost:3000
```

### 1. Comprehensive Test Suite
```bash
# Run all tests (recommended for production)
node api-comprehensive-test.js

# Or run against different URL
node api-comprehensive-test.js http://your-production-url.com
```

**Expected Output:**
```
🚀 Starting Comprehensive API Testing Suite
✅ PASS: GET Questions with userId - Should return 120 questions for userId
✅ PASS: POST Questions with valid data - Should return 120 questions and assessmentId
✅ PASS: POST Questions without userId - Should return error for missing userId
✅ PASS: GET Questions with assessmentId - Should return questions for existing assessmentId
✅ PASS: Questions with different language - Should handle different languages

📋 TEST RESULTS SUMMARY
✅ Passed: 25
❌ Failed: 0
📊 Total:  25
📈 Success Rate: 100.0%

🎉 ALL TESTS PASSED! Your API is production-ready!
```

### 2. Quick Manual Testing
```bash
# Interactive testing with detailed output
node quick-api-test.js
```

**Shows:**
- Real-time API responses
- Success/failure indicators
- Detailed JSON output
- Error case demonstrations

### 3. Performance Testing
```bash
# Load testing with metrics
node performance-test.js
```

**Provides:**
- Response time statistics
- Success rate analysis
- Performance benchmarks
- Load testing recommendations

## 📊 Test Results Interpretation

### ✅ **Success Criteria**
- **100% success rate** on all endpoints
- **Response time < 5 seconds** for all requests
- **All Big Five traits** present in results
- **Proper error handling** for invalid inputs
- **Data consistency** across requests

### ⚠️ **Warning Signs**
- Success rate < 99%
- Average response time > 2 seconds
- Inconsistent data between requests
- Missing error validation

### 🚨 **Critical Issues**
- Success rate < 95%
- Response time > 10 seconds
- Missing core functionality
- Data corruption or inconsistency

## 🔧 Troubleshooting

### Common Issues & Solutions

**1. Server Not Running**
```bash
# Start the server first
cd /web
npm run dev
```

**2. Port Conflicts**
```bash
# Kill existing processes
pkill -f "next dev"
# Or use different port
PORT=3001 npm run dev
```

**3. Network Issues**
```bash
# Test connectivity
curl http://localhost:3000/docs
```

**4. Test Failures**
```bash
# Run specific endpoint tests
curl -X POST http://localhost:3000/api/assessment/questions \
  -H "Content-Type: application/json" \
  -d '{"userId": "test"}'
```

## 📈 Performance Benchmarks

### Expected Performance (Local Development)
- **Questions endpoint**: < 1 second
- **Answers validation**: < 500ms
- **Results calculation**: < 2 seconds
- **Concurrent requests**: 99%+ success rate

### Production Targets
- **Response time**: < 3 seconds
- **Success rate**: > 99.9%
- **Concurrent users**: 100+ simultaneous
- **Uptime**: > 99.9%

## 🎯 Pre-Production Checklist

Before deploying to production, ensure:

- [ ] All comprehensive tests pass (100% success rate)
- [ ] Performance benchmarks meet targets
- [ ] Error handling covers all edge cases
- [ ] Data integrity is maintained
- [ ] API documentation is accessible
- [ ] Load testing with 100+ concurrent users
- [ ] Monitoring and logging are configured

## 📞 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/assessment/questions` | GET | Get questions (demo/testing) |
| `/api/assessment/questions` | POST | Create new assessment |
| `/api/assessment/answers` | POST | Validate user answers |
| `/api/assessment/results` | POST | Calculate personality results |

## 🆘 Support

If tests fail:

1. **Check server logs** in the terminal where `npm run dev` is running
2. **Verify API endpoints** are accessible
3. **Check network connectivity**
4. **Review error messages** for specific issues
5. **Test individual endpoints** manually

## 🚀 Next Steps

After all tests pass:

1. **Deploy to staging environment**
2. **Run tests against staging**
3. **Configure monitoring and alerts**
4. **Set up CI/CD pipeline**
5. **Prepare rollback plan**
6. **Deploy to production**

---

**🎉 Happy Testing! Your API is almost production-ready!**
