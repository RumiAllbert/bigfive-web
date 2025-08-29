#!/usr/bin/env node

/**
 * Complete API testing workflow for Big Five Personality Assessment
 * This demonstrates the full stateless API flow
 */

const BASE_URL = 'http://localhost:3000';

async function completeTest() {
  try {
    console.log('🚀 Complete Big Five API Testing Flow\n');

    // Step 1: Get Questions
    console.log('📋 Step 1: Getting Questions...');
    const questionsResponse = await fetch(`${BASE_URL}/api/assessment/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'demo-user-123',
        language: 'en'
      })
    });

    if (!questionsResponse.ok) {
      throw new Error('Failed to get questions');
    }

    const questionsData = await questionsResponse.json();
    const { assessmentId, questions } = questionsData;

    console.log(`✅ Assessment created: ${assessmentId}`);
    console.log(`📊 Questions loaded: ${questions.length}\n`);

    // Step 2: Simulate user answers (first 10 questions)
    console.log('📝 Step 2: Generating sample answers...');
    const sampleAnswers = questions.slice(0, 10).map(question => ({
      questionId: question.id,
      score: Math.floor(Math.random() * 5) + 1 // Random score 1-5
    }));

    console.log(`🎯 Generated ${sampleAnswers.length} answers\n`);

    // Step 3: Validate answers (optional step)
    console.log('🔍 Step 3: Validating answers...');
    const validationResponse = await fetch(`${BASE_URL}/api/assessment/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentId,
        answers: sampleAnswers
      })
    });

    if (!validationResponse.ok) {
      throw new Error('Failed to validate answers');
    }

    const validationData = await validationResponse.json();
    console.log(`✅ Validation: ${validationData.message}\n`);

    // Step 4: Calculate Results
    console.log('🧮 Step 4: Calculating personality results...');
    const resultsResponse = await fetch(`${BASE_URL}/api/assessment/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentId,
        answers: sampleAnswers,
        language: 'en'
      })
    });

    if (!resultsResponse.ok) {
      throw new Error('Failed to calculate results');
    }

    const resultsData = await resultsResponse.json();

    console.log('🎉 Results calculated successfully!\n');

    // Step 5: Display Results
    console.log('📊 PERSONALITY ASSESSMENT RESULTS:');
    console.log('=' .repeat(50));

    console.log('\n🏆 OVERALL TRAITS:');
    Object.entries(resultsData.results.overall).forEach(([domain, data]) => {
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

    console.log('\n🔍 FACET BREAKDOWN:');
    Object.entries(resultsData.results.facets).forEach(([domain, facets]) => {
      if (Object.keys(facets).length > 0) {
        const domainNames = {
          'O': 'Openness',
          'C': 'Conscientiousness',
          'E': 'Extraversion',
          'A': 'Agreeableness',
          'N': 'Neuroticism'
        };

        console.log(`\n  ${domainNames[domain]}:`);
        Object.entries(facets).forEach(([facet, data]) => {
          const facetNames = {
            'O': {1: 'Imagination', 2: 'Artistic Interests', 3: 'Emotionality', 4: 'Adventurousness', 5: 'Intellect', 6: 'Liberalism'},
            'C': {1: 'Self-Efficacy', 2: 'Orderliness', 3: 'Dutifulness', 4: 'Achievement-Striving', 5: 'Self-Discipline', 6: 'Cautiousness'},
            'E': {1: 'Friendliness', 2: 'Gregariousness', 3: 'Assertiveness', 4: 'Activity Level', 5: 'Excitement-Seeking', 6: 'Cheerfulness'},
            'A': {1: 'Trust', 2: 'Morality', 3: 'Altruism', 4: 'Cooperation', 5: 'Modesty', 6: 'Sympathy'},
            'N': {1: 'Anxiety', 2: 'Anger', 3: 'Depression', 4: 'Self-Consciousness', 5: 'Immoderation', 6: 'Vulnerability'}
          };

          const facetName = facetNames[domain]?.[parseInt(facet)] || `Facet ${facet}`;
          const level = data.result === 'high' ? 'High' : data.result === 'low' ? 'Low' : 'Neutral';

          console.log(`    ${facetName}: ${level} (${data.score}/${data.count * 5})`);
        });
      }
    });

    console.log('\n' + '=' .repeat(50));
    console.log('✅ API testing completed successfully!');
    console.log(`📝 Assessment ID: ${assessmentId}`);
    console.log(`👤 User ID: demo-user-123`);
    console.log(`📊 Questions answered: ${sampleAnswers.length}/120`);
    console.log(`🕒 Generated: ${new Date(resultsData.results.generatedAt).toLocaleString()}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the Next.js server is running: npm run dev');
  }
}

completeTest();
