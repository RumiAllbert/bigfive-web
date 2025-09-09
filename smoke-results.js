#!/usr/bin/env node

// Simple smoke test that runs the compiled Lambda results handler
// and prints the presence of average and percentage fields.

const { handler } = require('./dist/lambda/results.js');

async function main() {
  const mockAnswers = [];
  // Create a small set of answers covering different domains
  // We'll fetch questions from the questions package to obtain real IDs
  const { getItems } = require('@bigfive-org/questions');
  const questions = getItems('en');
  // Use first 20 questions for speed
  for (let i = 0; i < 20; i++) {
    const q = questions[i];
    mockAnswers.push({ questionId: q.id, score: (i % 5) + 1 });
  }

  const event = {
    httpMethod: 'POST',
    path: '/assessment/results',
    body: JSON.stringify({
      assessmentId: 'smoke-assessment-1',
      answers: mockAnswers,
      language: 'en'
    })
  };

  const resp = await handler(event);
  if (resp.statusCode !== 200) {
    console.error('Smoke test failed:', resp.statusCode, resp.body);
    process.exit(1);
  }
  const body = JSON.parse(resp.body);
  const overall = body.results.overall || {};
  const sampleDomain = Object.keys(overall)[0];
  const sample = overall[sampleDomain];
  console.log('Sample domain:', sampleDomain);
  console.log('Result fields:', Object.keys(sample));
  if (typeof sample.average === 'number' && typeof sample.percentage === 'number') {
    console.log('✅ average and percentage present');
    process.exit(0);
  } else {
    console.error('❌ average/percentage missing');
    process.exit(2);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

