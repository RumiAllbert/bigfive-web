#!/usr/bin/env node

/**
 * Test Runner - Local Testing Helper for Lambda Functions
 * Run with: node test-runner.js [unit|integration|all]
 */

const { execSync } = require('child_process');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(colors.blue, `🚀 ${description}...`);
    const result = execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log(colors.green, `✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    log(colors.red, `❌ ${description} failed`);
    console.error(error.message);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'unit';

  log(colors.cyan, '🧪 Big Five API - Lambda Test Runner');
  log(colors.cyan, '=' .repeat(50));

  // Ensure dependencies are installed
  if (!runCommand('npm install', 'Installing dependencies')) {
    process.exit(1);
  }

  // Build TypeScript
  if (!runCommand('npx tsc --project tsconfig-lambda.json', 'Building TypeScript')) {
    process.exit(1);
  }

  // Run tests based on type
  let testCommand;
  let testDescription;

  switch (testType) {
    case 'unit':
      testCommand = 'npx jest test/lambda/*.test.ts --verbose';
      testDescription = 'Running unit tests';
      break;
    case 'integration':
      testCommand = 'npx jest test/lambda/integration.test.ts --verbose';
      testDescription = 'Running integration tests';
      break;
    case 'coverage':
      testCommand = 'npx jest test/lambda/ --coverage';
      testDescription = 'Running tests with coverage';
      break;
    case 'all':
      testCommand = 'npx jest test/lambda/ --verbose';
      testDescription = 'Running all tests';
      break;
    default:
      log(colors.red, '❌ Invalid test type. Use: unit, integration, coverage, or all');
      log(colors.yellow, 'Usage: node test-runner.js [unit|integration|coverage|all]');
      process.exit(1);
  }

  if (runCommand(testCommand, testDescription)) {
    log(colors.green, '\n🎉 All tests passed successfully!');
    log(colors.cyan, '📊 Test Summary:');
    console.log('   • Unit tests cover individual Lambda functions');
    console.log('   • Integration tests verify complete API workflow');
    console.log('   • Coverage reports show test completeness');
  } else {
    log(colors.red, '\n💥 Some tests failed. Please check the output above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
