#!/usr/bin/env node

/**
 * Lambda API Testing Suite for Big Five Personality Assessment
 * Tests the deployed AWS Lambda API endpoints
 *
 * Usage: node test-lambda-api.js [base-url]
 * Default: https://k3svg4fxvh.execute-api.us-east-1.amazonaws.com/prod
 */

const BASE_URL = process.argv[2] || 'https://k3svg4fxvh.execute-api.us-east-1.amazonaws.com/prod';

class LambdaAPITester {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      errors: []
    };
    this.testAssessmentId = null;
    this.testQuestions = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      warning: '\x1b[33m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, finalOptions);
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { rawResponse: await response.text() };
      }
      return { response, data };
    } catch (error) {
      return { error: error.message };
    }
  }

  assert(condition, message, testName) {
    this.testResults.total++;
    if (condition) {
      this.testResults.passed++;
      this.log(`✅ PASS: ${testName} - ${message}`, 'success');
      return true;
    } else {
      this.testResults.failed++;
      this.log(`❌ FAIL: ${testName} - ${message}`, 'error');
      return false;
    }
  }

  async testQuestionsEndpoint() {
    this.log('\n📋 Testing /assessment/questions endpoint', 'info');

    // Test 1: GET questions with userId (should return all 120 questions)
    const test1 = await this.makeRequest('/assessment/questions?userId=test-user-lambda');
    this.assert(
      test1.data && test1.data.questions && test1.data.questions.length === 120,
      `Should return 120 questions`,
      'GET Questions with userId'
    );

    // Test 2: POST with userId (should create assessment)
    const test2 = await this.makeRequest('/assessment/questions', {
      method: 'POST',
      body: JSON.stringify({ userId: 'test-user-lambda', language: 'en' })
    });
    this.assert(
      test2.data && test2.data.questions && test2.data.questions.length === 120 && test2.data.assessmentId,
      `Should return 120 questions and assessmentId`,
      'POST Questions with userId'
    );

    // Store data for subsequent tests
    if (test2.data && test2.data.assessmentId) {
      this.testAssessmentId = test2.data.assessmentId;
      this.testQuestions = test2.data.questions;
    }

    // Test 3: GET without required parameters (should return error)
    const test3 = await this.makeRequest('/assessment/questions');
    this.assert(
      test3.data && test3.data.error,
      `Should return error when no parameters provided`,
      'GET Questions without parameters'
    );

    // Test 4: POST without userId (should return error)
    const test4 = await this.makeRequest('/assessment/questions', {
      method: 'POST',
      body: JSON.stringify({ language: 'en' })
    });
    this.assert(
      test4.data && test4.data.error,
      `Should return error when userId is missing`,
      'POST Questions without userId'
    );
  }

  async testAnswersEndpoint() {
    this.log('\n📝 Testing /assessment/answers endpoint', 'info');

    if (!this.testAssessmentId || !this.testQuestions) {
      this.log('⚠️ Skipping answers tests - no valid assessment data', 'warning');
      return;
    }

    // Generate sample answers for first 10 questions
    const sampleAnswers = this.testQuestions.slice(0, 10).map(q => ({
      questionId: q.id,
      score: Math.floor(Math.random() * 5) + 1 // Random score 1-5
    }));

    // Test 1: Valid answers submission
    const test1 = await this.makeRequest('/assessment/answers', {
      method: 'POST',
      body: JSON.stringify({
        assessmentId: this.testAssessmentId,
        answers: sampleAnswers
      })
    });
    this.assert(
      test1.data && test1.data.success === true,
      `Should accept valid answers`,
      'Valid answers submission'
    );

    // Test 2: Missing assessmentId
    const test2 = await this.makeRequest('/assessment/answers', {
      method: 'POST',
      body: JSON.stringify({
        answers: sampleAnswers
      })
    });
    this.assert(
      test2.data && test2.data.error,
      `Should reject without assessmentId`,
      'Missing assessmentId validation'
    );

    // Test 3: Invalid score range
    const invalidAnswers = [{
      questionId: this.testQuestions[0].id,
      score: 10 // Invalid score
    }];
    const test3 = await this.makeRequest('/assessment/answers', {
      method: 'POST',
      body: JSON.stringify({
        assessmentId: this.testAssessmentId,
        answers: invalidAnswers
      })
    });
    this.assert(
      test3.data && test3.data.error,
      `Should reject invalid score range`,
      'Invalid score validation'
    );
  }

  async testResultsEndpoint() {
    this.log('\n📊 Testing /assessment/results endpoint', 'info');

    if (!this.testAssessmentId || !this.testQuestions) {
      this.log('⚠️ Skipping results tests - no valid assessment data', 'warning');
      return;
    }

    // Generate comprehensive answers for all questions
    const allAnswers = this.testQuestions.map(q => ({
      questionId: q.id,
      score: Math.floor(Math.random() * 5) + 1
    }));

    // Test 1: Valid results calculation
    const test1 = await this.makeRequest('/assessment/results', {
      method: 'POST',
      body: JSON.stringify({
        assessmentId: this.testAssessmentId,
        answers: allAnswers
      })
    });
    this.assert(
      test1.data && test1.data.results && test1.data.results.overall,
      `Should calculate personality results`,
      'Valid results calculation'
    );

    // Test 2: Missing assessmentId
    const test2 = await this.makeRequest('/assessment/results', {
      method: 'POST',
      body: JSON.stringify({
        answers: allAnswers
      })
    });
    this.assert(
      test2.data && test2.data.error,
      `Should reject without assessmentId`,
      'Missing assessmentId validation'
    );

    // Test 3: Verify Big Five traits are present
    if (test1.data && test1.data.results && test1.data.results.overall) {
      const traits = ['O', 'C', 'E', 'A', 'N'];
      const hasAllTraits = traits.every(trait => test1.data.results.overall[trait]);
      this.assert(
        hasAllTraits,
        `Should include all Big Five traits (O,C,E,A,N)`,
        'Complete Big Five traits'
      );
    }

    // Test 4: Display results if successful
    if (test1.data && test1.data.results) {
      this.displayResults(test1.data.results);
    }
  }

  async testStatusEndpoint() {
    this.log('\n📈 Testing /assessment/status endpoint', 'info');

    if (!this.testAssessmentId) {
      this.log('⚠️ Skipping status tests - no valid assessment data', 'warning');
      return;
    }

    // Test 1: Valid status check
    const test1 = await this.makeRequest(`/assessment/status?assessmentId=${this.testAssessmentId}`);
    this.assert(
      test1.data && typeof test1.data.answersCount === 'number',
      `Should return status with answers count`,
      'Valid status check'
    );

    // Test 2: Missing assessmentId
    const test2 = await this.makeRequest('/assessment/status');
    this.assert(
      test2.data && test2.data.error,
      `Should reject without assessmentId`,
      'Missing assessmentId validation'
    );
  }

  async testHistoryEndpoint() {
    this.log('\n📚 Testing /assessment/history endpoint', 'info');

    // Test 1: Valid history request
    const test1 = await this.makeRequest('/assessment/history');
    this.assert(
      test1.data && Array.isArray(test1.data.history),
      `Should return history array`,
      'Valid history request'
    );

    // Test 2: History should be retrievable
    if (test1.data && test1.data.history && test1.data.history.length > 0) {
      this.log(`📊 Found ${test1.data.history.length} completed assessments in history`, 'info');
    }
  }

  displayResults(results) {
    this.log('\n🎉 PERSONALITY ASSESSMENT RESULTS:', 'success');
    this.log('=' .repeat(60), 'info');

    if (results.overall) {
      this.log('\n🏆 OVERALL TRAITS:', 'info');
      Object.entries(results.overall).forEach(([domain, data]) => {
        const domainNames = {
          'O': 'Openness',
          'C': 'Conscientiousness',
          'E': 'Extraversion',
          'A': 'Agreeableness',
          'N': 'Neuroticism'
        };

        const level = data.result === 'high' ? '🔥 High' :
                     data.result === 'low' ? '❄️ Low' : '⚖️ Neutral';

        console.log(`  ${domainNames[domain]}: ${level} (${data.score}/${data.count * 5})`);
      });
    }

    this.log('\n' + '=' .repeat(60), 'info');
  }

  async testErrorHandling() {
    this.log('\n🚨 Testing error handling and edge cases', 'info');

    // Test 1: Invalid endpoint
    const test1 = await this.makeRequest('/invalid-endpoint');
    this.assert(
      test1.response?.status === 404 || test1.error,
      `Should handle invalid endpoints`,
      'Invalid endpoint handling'
    );

    // Test 2: Malformed JSON
    const test2 = await this.makeRequest('/assessment/questions', {
      method: 'POST',
      body: '{invalid json',
      headers: { 'Content-Type': 'application/json' }
    });
    this.assert(
      test2.error || test2.response?.status >= 400,
      `Should handle malformed JSON`,
      'Malformed JSON handling'
    );

    // Test 3: Unsupported HTTP method
    const test3 = await this.makeRequest('/assessment/questions', {
      method: 'PUT'
    });
    this.assert(
      test3.response?.status === 405 || test3.error,
      `Should reject unsupported HTTP methods`,
      'HTTP method validation'
    );
  }

  async testPerformance() {
    this.log('\n⚡ Testing API performance', 'info');

    const startTime = Date.now();

    // Test concurrent requests
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(this.makeRequest('/assessment/questions'));
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();
    const avgResponseTime = (endTime - startTime) / results.length;

    this.assert(
      results.every(r => r.data && r.data.questions),
      `All concurrent requests should succeed`,
      'Concurrent requests handling'
    );

    this.log(`📊 Average response time: ${avgResponseTime.toFixed(2)}ms`, 'info');

    // Lambda cold start might affect first request, so we'll be lenient
    this.assert(
      avgResponseTime < 10000, // 10 seconds (accounting for cold starts)
      `Response time should be reasonable (was ${avgResponseTime.toFixed(2)}ms)`,
      'Performance benchmark'
    );
  }

  async runAllTests() {
    this.log('🚀 Starting Lambda API Testing Suite', 'info');
    this.log(`📍 Testing against: ${this.baseURL}`, 'info');
    this.log('=' .repeat(60), 'info');

    const startTime = Date.now();

    try {
      await this.testQuestionsEndpoint();
      await this.testAnswersEndpoint();
      await this.testResultsEndpoint();
      await this.testStatusEndpoint();
      await this.testHistoryEndpoint();
      await this.testErrorHandling();
      await this.testPerformance();

    } catch (error) {
      this.log(`💥 Test suite crashed: ${error.message}`, 'error');
      this.testResults.errors.push(error.message);
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Print results
    this.log('\n' + '=' .repeat(60), 'info');
    this.log('📋 LAMBDA API TEST RESULTS SUMMARY', 'info');
    this.log('=' .repeat(60), 'info');
    this.log(`✅ Passed: ${this.testResults.passed}`, 'success');
    this.log(`❌ Failed: ${this.testResults.failed}`, 'error');
    this.log(`📊 Total:  ${this.testResults.total}`, 'info');
    this.log(`⏱️ Duration: ${duration}s`, 'info');

    const successRate = this.testResults.total > 0 ?
      ((this.testResults.passed / this.testResults.total) * 100).toFixed(1) : '0.0';
    this.log(`📈 Success Rate: ${successRate}%`, 'info');

    if (this.testResults.errors.length > 0) {
      this.log('\n💥 ERRORS ENCOUNTERED:', 'error');
      this.testResults.errors.forEach(error => {
        this.log(`  • ${error}`, 'error');
      });
    }

    // Recommendations
    if (this.testResults.failed === 0) {
      this.log('\n🎉 ALL TESTS PASSED! Your Lambda API is production-ready!', 'success');
    } else if (this.testResults.failed < 3) {
      this.log('\n⚠️ Minor issues found. Review and fix before production.', 'warning');
    } else {
      this.log('\n🚨 Significant issues found. Requires attention before production.', 'error');
    }

    this.log('\n' + '=' .repeat(60), 'info');

    return this.testResults;
  }
}

// CLI runner
async function main() {
  const baseURL = process.argv[2] || 'https://k3svg4fxvh.execute-api.us-east-1.amazonaws.com/prod';
  const tester = new LambdaAPITester(baseURL);

  console.log('🌐 Big Five Personality Assessment - Lambda API Testing Suite');
  console.log(`📍 Testing against: ${baseURL}`);
  console.log('');

  const results = await tester.runAllTests();

  // Exit with appropriate code
  process.exit(results.failed === 0 ? 0 : 1);
}

// Export for use as module
module.exports = LambdaAPITester;

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}
