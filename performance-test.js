#!/usr/bin/env node

/**
 * API Performance Testing
 * Run with: node performance-test.js
 */

const BASE_URL = 'http://localhost:3000';

async function makeRequest(endpoint, options = {}) {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    const duration = Date.now() - start;
    return { success: response.ok, duration, data };
  } catch (error) {
    const duration = Date.now() - start;
    return { success: false, duration, error: error.message };
  }
}

async function runPerformanceTest(testName, endpoint, options = {}, iterations = 100) {
  console.log(`\n⚡ Running ${testName} (${iterations} iterations)`);
  console.log('=' .repeat(50));

  const results = [];

  // Warm up
  console.log('🔥 Warming up...');
  for (let i = 0; i < 5; i++) {
    await makeRequest(endpoint, options);
  }

  // Run test
  console.log(`🏃 Running ${iterations} requests...`);
  for (let i = 0; i < iterations; i++) {
    const result = await makeRequest(endpoint, options);
    results.push(result);

    if ((i + 1) % 20 === 0) {
      process.stdout.write(`  Progress: ${i + 1}/${iterations}\r`);
    }
  }
  console.log('');

  // Analyze results
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  const durations = results.map(r => r.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const p95Duration = durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)];

  console.log(`✅ Successful: ${successful.length}/${iterations}`);
  console.log(`❌ Failed: ${failed.length}/${iterations}`);
  console.log(`📊 Average Response Time: ${avgDuration.toFixed(2)}ms`);
  console.log(`⚡ Fastest: ${minDuration}ms`);
  console.log(`🐌 Slowest: ${maxDuration}ms`);
  console.log(`📈 95th Percentile: ${p95Duration}ms`);

  if (failed.length > 0) {
    console.log(`💥 Sample errors:`);
    failed.slice(0, 3).forEach((f, i) => {
      console.log(`  ${i + 1}. ${f.error}`);
    });
  }

  return {
    testName,
    total: iterations,
    successful: successful.length,
    failed: failed.length,
    avgDuration,
    minDuration,
    maxDuration,
    p95Duration
  };
}

async function runLoadTest() {
  console.log('🚀 Big Five API - Performance Test Suite');
  console.log('=' .repeat(60));

  const results = [];

  // Test 1: Questions endpoint (GET)
  const result1 = await runPerformanceTest(
    'Questions GET',
    '/api/assessment/questions?userId=perf-test&language=en',
    {},
    50
  );
  results.push(result1);

  // Test 2: Questions endpoint (POST)
  const result2 = await runPerformanceTest(
    'Questions POST',
    '/api/assessment/questions',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'perf-test-post', language: 'en' })
    },
    50
  );
  results.push(result2);

  // Test 3: Answers endpoint (with sample data)
  console.log('\n📝 Preparing sample data for answers test...');
  const questionsResponse = await makeRequest('/api/assessment/questions?userId=perf-sample&language=en');

  if (questionsResponse.success && questionsResponse.data.questions) {
    const sampleAnswers = questionsResponse.data.questions.slice(0, 10).map(q => ({
      questionId: q.id,
      score: Math.floor(Math.random() * 5) + 1
    }));

    const result3 = await runPerformanceTest(
      'Answers Validation',
      '/api/assessment/answers',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: questionsResponse.data.assessmentId,
          answers: sampleAnswers
        })
      },
      30
    );
    results.push(result3);
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📋 PERFORMANCE TEST SUMMARY');
  console.log('=' .repeat(60));

  results.forEach(result => {
    const successRate = ((result.successful / result.total) * 100).toFixed(1);
    console.log(`${result.testName.padEnd(15)} | ${successRate}% success | ${result.avgDuration.toFixed(0)}ms avg`);
  });

  // Overall assessment
  const totalRequests = results.reduce((sum, r) => sum + r.total, 0);
  const totalSuccessful = results.reduce((sum, r) => sum + r.successful, 0);
  const overallSuccessRate = ((totalSuccessful / totalRequests) * 100).toFixed(1);
  const avgResponseTime = (results.reduce((sum, r) => sum + r.avgDuration, 0) / results.length).toFixed(0);

  console.log('=' .repeat(60));
  console.log(`🎯 Overall Success Rate: ${overallSuccessRate}%`);
  console.log(`⏱️ Average Response Time: ${avgResponseTime}ms`);
  console.log(`📊 Total Requests: ${totalRequests}`);

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (parseFloat(overallSuccessRate) >= 99) {
    console.log('✅ Excellent! API is performing well under load.');
  } else if (parseFloat(overallSuccessRate) >= 95) {
    console.log('⚠️ Good performance, but consider investigating failed requests.');
  } else {
    console.log('🚨 Performance issues detected. Review error logs and optimize.');
  }

  if (parseFloat(avgResponseTime) < 500) {
    console.log('✅ Response times are excellent.');
  } else if (parseFloat(avgResponseTime) < 2000) {
    console.log('⚠️ Response times are acceptable but could be improved.');
  } else {
    console.log('🚨 Response times are too slow. Consider optimization.');
  }
}

// Run performance tests
runLoadTest().catch(error => {
  console.error('💥 Performance test failed:', error);
  process.exit(1);
});
