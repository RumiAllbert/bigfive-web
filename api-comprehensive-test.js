#!/usr/bin/env node

/**
 * Comprehensive API Testing Suite for Big Five Personality Assessment API
 * Run with: node api-comprehensive-test.js
 */

const fs = require('fs');
const path = require('path');

class APITester {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      errors: []
    };
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
      const data = await response.json();
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
    this.log('\n📋 Testing /api/assessment/questions endpoint', 'info');

    // Test 1: GET with userId (for demo purposes)
    const test1 = await this.makeRequest('/api/assessment/questions?userId=test-user&language=en');
    this.assert(
      test1.data && test1.data.questions && test1.data.questions.length === 120,
      `Should return 120 questions for userId`,
      'GET Questions with userId'
    );

    // Test 2: POST with valid data
    const test2 = await this.makeRequest('/api/assessment/questions', {
      method: 'POST',
      body: JSON.stringify({ userId: 'test-user-post', language: 'en' })
    });
    this.assert(
      test2.data && test2.data.questions && test2.data.questions.length === 120 && test2.data.assessmentId,
      `Should return 120 questions and assessmentId`,
      'POST Questions with valid data'
    );

    // Test 3: POST without userId
    const test3 = await this.makeRequest('/api/assessment/questions', {
      method: 'POST',
      body: JSON.stringify({ language: 'en' })
    });
    this.assert(
      test3.data && test3.data.error === 'userId is required',
      `Should return error for missing userId`,
      'POST Questions without userId'
    );

    // Test 4: GET with assessmentId
    if (test2.data && test2.data.assessmentId) {
      const test4 = await this.makeRequest(`/api/assessment/questions?assessmentId=${test2.data.assessmentId}&language=en`);
      this.assert(
        test4.data && test4.data.questions && test4.data.questions.length === 120,
        `Should return questions for existing assessmentId`,
        'GET Questions with assessmentId'
      );
    }

    // Test 5: Different language
    const test5 = await this.makeRequest('/api/assessment/questions?userId=test-user&language=de');
    this.assert(
      test5.data && test5.data.questions,
      `Should handle different languages`,
      'Questions with different language'
    );

    // Store assessmentId for later tests
    this.testAssessmentId = test2.data?.assessmentId;
    this.testQuestions = test2.data?.questions;
  }

  async testAnswersEndpoint() {
    this.log('\n📝 Testing /api/assessment/answers endpoint', 'info');

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
    const test1 = await this.makeRequest('/api/assessment/answers', {
      method: 'POST',
      body: JSON.stringify({
        assessmentId: this.testAssessmentId,
        answers: sampleAnswers
      })
    });
    this.assert(
      test1.data && test1.data.success === true && test1.data.answersCount === 10,
      `Should accept valid answers`,
      'Valid answers submission'
    );

    // Test 2: Missing assessmentId
    const test2 = await this.makeRequest('/api/assessment/answers', {
      method: 'POST',
      body: JSON.stringify({
        answers: sampleAnswers
      })
    });
    this.assert(
      test2.data && test2.data.error,
      `Should reject without assessmentId`,
      'Missing assessmentId'
    );

    // Test 3: Invalid score range
    const invalidAnswers = [{
      questionId: this.testQuestions[0].id,
      score: 10 // Invalid score
    }];
    const test3 = await this.makeRequest('/api/assessment/answers', {
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

    // Test 4: Empty answers array
    const test4 = await this.makeRequest('/api/assessment/answers', {
      method: 'POST',
      body: JSON.stringify({
        assessmentId: this.testAssessmentId,
        answers: []
      })
    });
    this.assert(
      test4.data && test4.data.success === true,
      `Should accept empty answers array`,
      'Empty answers array'
    );
  }

  async testResultsEndpoint() {
    this.log('\n📊 Testing /api/assessment/results endpoint', 'info');

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
    const test1 = await this.makeRequest('/api/assessment/results', {
      method: 'POST',
      body: JSON.stringify({
        assessmentId: this.testAssessmentId,
        answers: allAnswers,
        language: 'en'
      })
    });
    this.assert(
      test1.data && test1.data.results && test1.data.results.overall,
      `Should calculate personality results`,
      'Valid results calculation'
    );

    // Test 2: Missing assessmentId
    const test2 = await this.makeRequest('/api/assessment/results', {
      method: 'POST',
      body: JSON.stringify({
        answers: allAnswers,
        language: 'en'
      })
    });
    this.assert(
      test2.data && test2.data.error,
      `Should reject without assessmentId`,
      'Missing assessmentId'
    );

    // Test 3: Missing answers
    const test3 = await this.makeRequest('/api/assessment/results', {
      method: 'POST',
      body: JSON.stringify({
        assessmentId: this.testAssessmentId,
        language: 'en'
      })
    });
    this.assert(
      test3.data && test3.data.error,
      `Should reject without answers`,
      'Missing answers'
    );

    // Test 4: Partial answers
    const partialAnswers = allAnswers.slice(0, 60); // Half the questions
    const test4 = await this.makeRequest('/api/assessment/results', {
      method: 'POST',
      body: JSON.stringify({
        assessmentId: this.testAssessmentId,
        answers: partialAnswers,
        language: 'en'
      })
    });
    this.assert(
      test4.data && test4.data.results,
      `Should handle partial answers`,
      'Partial answers handling'
    );

    // Test 5: Verify Big Five traits are present
    if (test1.data && test1.data.results && test1.data.results.overall) {
      const traits = ['O', 'C', 'E', 'A', 'N'];
      const hasAllTraits = traits.every(trait => test1.data.results.overall[trait]);
      this.assert(
        hasAllTraits,
        `Should include all Big Five traits (O,C,E,A,N)`,
        'Complete Big Five traits'
      );
    }
  }

  async testErrorHandling() {
    this.log('\n🚨 Testing error handling and edge cases', 'info');

    // Test 1: Invalid endpoint
    const test1 = await this.makeRequest('/api/nonexistent');
    this.assert(
      test1.error || test1.response?.status === 404,
      `Should handle invalid endpoints gracefully`,
      'Invalid endpoint handling'
    );

    // Test 2: Malformed JSON
    const test2 = await this.makeRequest('/api/assessment/questions', {
      method: 'POST',
      body: '{invalid json',
      headers: { 'Content-Type': 'application/json' }
    });
    this.assert(
      test2.error || test2.data?.error,
      `Should handle malformed JSON`,
      'Malformed JSON handling'
    );

    // Test 3: Unsupported language
    const test3 = await this.makeRequest('/api/assessment/questions', {
      method: 'POST',
      body: JSON.stringify({ userId: 'test', language: 'unsupported' })
    });
    this.assert(
      test3.data && test3.data.questions && test3.data.questions.length > 0,
      `Should fallback gracefully for unsupported languages`,
      'Unsupported language handling'
    );

    // Test 4: Very long userId
    const longUserId = 'a'.repeat(1000);
    const test4 = await this.makeRequest('/api/assessment/questions', {
      method: 'POST',
      body: JSON.stringify({ userId: longUserId })
    });
    this.assert(
      test4.data && test4.data.assessmentId,
      `Should handle long userIds`,
      'Long userId handling'
    );
  }

  async testPerformance() {
    this.log('\n⚡ Testing performance and load', 'info');

    const startTime = Date.now();

    // Test 1: Multiple concurrent requests
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        this.makeRequest('/api/assessment/questions', {
          method: 'POST',
          body: JSON.stringify({ userId: `perf-test-${i}`, language: 'en' })
        })
      );
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();
    const avgResponseTime = (endTime - startTime) / results.length;

    this.assert(
      results.every(r => r.data && r.data.questions),
      `All concurrent requests should succeed`,
      'Concurrent requests handling'
    );

    this.assert(
      avgResponseTime < 5000, // 5 seconds
      `Average response time should be under 5s (was ${avgResponseTime}ms)`,
      'Performance benchmark'
    );

    this.log(`📊 Performance: ${avgResponseTime.toFixed(2)}ms average response time`, 'info');
  }

  async testDataIntegrity() {
    this.log('\n🔍 Testing data integrity and consistency', 'info');

    // Test 1: Same userId should generate different assessmentIds
    const userId = 'integrity-test';
    const test1 = await this.makeRequest('/api/assessment/questions', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    const test2 = await this.makeRequest('/api/assessment/questions', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });

    this.assert(
      test1.data?.assessmentId !== test2.data?.assessmentId,
      `Same userId should generate unique assessmentIds`,
      'Unique assessment ID generation'
    );

    // Test 2: Questions consistency
    this.assert(
      test1.data?.questions?.length === test2.data?.questions?.length,
      `Should return consistent number of questions`,
      'Questions consistency'
    );

    // Test 3: Question structure validation
    if (test1.data?.questions?.[0]) {
      const question = test1.data.questions[0];
      const hasRequiredFields = question.id && question.text && question.choices;
      this.assert(
        hasRequiredFields,
        `Questions should have required fields (id, text, choices)`,
        'Question structure validation'
      );
    }
  }

  async runAllTests() {
    this.log('🚀 Starting Comprehensive API Testing Suite', 'info');
    this.log('=' .repeat(60), 'info');

    const startTime = Date.now();

    try {
      await this.testQuestionsEndpoint();
      await this.testAnswersEndpoint();
      await this.testResultsEndpoint();
      await this.testErrorHandling();
      await this.testPerformance();
      await this.testDataIntegrity();

    } catch (error) {
      this.log(`💥 Test suite crashed: ${error.message}`, 'error');
      this.testResults.errors.push(error.message);
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Print results
    this.log('\n' + '=' .repeat(60), 'info');
    this.log('📋 TEST RESULTS SUMMARY', 'info');
    this.log('=' .repeat(60), 'info');
    this.log(`✅ Passed: ${this.testResults.passed}`, 'success');
    this.log(`❌ Failed: ${this.testResults.failed}`, 'error');
    this.log(`📊 Total:  ${this.testResults.total}`, 'info');
    this.log(`⏱️ Duration: ${duration}s`, 'info');

    const successRate = ((this.testResults.passed / this.testResults.total) * 100).toFixed(1);
    this.log(`📈 Success Rate: ${successRate}%`, 'info');

    if (this.testResults.errors.length > 0) {
      this.log('\n💥 ERRORS ENCOUNTERED:', 'error');
      this.testResults.errors.forEach(error => {
        this.log(`  • ${error}`, 'error');
      });
    }

    // Recommendations
    if (this.testResults.failed === 0) {
      this.log('\n🎉 ALL TESTS PASSED! Your API is production-ready!', 'success');
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
  const baseURL = process.argv[2] || 'http://localhost:3000';
  const tester = new APITester(baseURL);

  console.log('🌐 Big Five Personality Assessment API - Comprehensive Testing Suite');
  console.log(`📍 Testing against: ${baseURL}`);
  console.log('');

  const results = await tester.runAllTests();

  // Exit with appropriate code
  process.exit(results.failed === 0 ? 0 : 1);
}

// Export for use as module
module.exports = APITester;

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}
