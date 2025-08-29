#!/usr/bin/env node

// Simple test script to debug the results endpoint
const BASE_URL = 'http://localhost:3000';

async function testResults() {
  try {
    console.log('🧪 Testing results calculation...\n');

    // Test with minimal data
    const testData = {
      assessmentId: "debug-test-123",
      answers: [
        {
          questionId: "43c98ce8-a07a-4dc2-80f6-c1b2a2485f06", // First question
          score: 4
        }
      ],
      language: "en"
    };

    console.log('📤 Sending data:', JSON.stringify(testData, null, 2));

    const response = await fetch(`${BASE_URL}/api/assessment/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Success response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testResults();
