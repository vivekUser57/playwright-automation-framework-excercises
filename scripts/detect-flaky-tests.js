/**
 * Detect flaky tests - tests that fail inconsistently
 * Analyzes build history to identify unreliable tests
 */

const fs = require('fs');
const path = require('path');

function detectFlakyTests() {
  const resultsFile = 'test-results/results.json';
  const historyFile = 'test-history.json';
  
  if (!fs.existsSync(resultsFile)) {
    console.log('❌ Test results not found');
    return;
  }

  const currentResults = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  
  // Load historical data
  let history = [];
  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
  }

  // Extract current test results
  const testResults = {};
  if (currentResults.suites) {
    currentResults.suites.forEach(suite => {
      suite.tests?.forEach(test => {
        const testKey = `${suite.title}::${test.title}`;
        testResults[testKey] = test.status === 'passed' ? 'pass' : 'fail';
      });
    });
  }

  // Add current results to history (keep last 30 runs)
  history.push({
    date: new Date().toISOString(),
    buildNumber: process.env.BUILD_NUMBER || 'local',
    results: testResults
  });

  if (history.length > 30) {
    history = history.slice(-30);
  }

  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

  // Analyze for flaky tests (failed in some runs but passed in others)
  const flakyTests = {};
  const minRunsForAnalysis = Math.min(10, history.length);

  if (history.length >= minRunsForAnalysis) {
    Object.keys(testResults).forEach(testKey => {
      let passCount = 0;
      let failCount = 0;

      history.slice(-minRunsForAnalysis).forEach(run => {
        if (run.results[testKey] === 'pass') passCount++;
        else failCount++;
      });

      // Test is flaky if it failed in some runs but passed in others
      if (passCount > 0 && failCount > 0) {
        const flakinessPercentage = ((failCount / minRunsForAnalysis) * 100).toFixed(1);
        flakyTests[testKey] = {
          passCount,
          failCount,
          flakinessPercentage,
          lastStatus: testResults[testKey],
          runs: minRunsForAnalysis
        };
      }
    });
  }

  const flakyTestsFile = 'flaky-tests.json';
  fs.writeFileSync(flakyTestsFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    flakyTestsFound: Object.keys(flakyTests).length,
    flakyTests: flakyTests,
    analysisWindow: minRunsForAnalysis,
    threshold: 'At least 1 pass and 1 fail in last 10 runs'
  }, null, 2));

  console.log('\n🔍 Flaky Test Detection Results');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  if (Object.keys(flakyTests).length === 0) {
    console.log('✓ No flaky tests detected');
  } else {
    console.log(`⚠️  ${Object.keys(flakyTests).length} flaky test(s) detected:`);
    Object.entries(flakyTests).forEach(([testKey, data]) => {
      console.log(`\n  ${testKey}`);
      console.log(`    Pass: ${data.passCount}/${data.runs}, Fail: ${data.failCount}/${data.runs}`);
      console.log(`    Flakiness: ${data.flakinessPercentage}%`);
      console.log(`    Last Status: ${data.lastStatus === 'pass' ? '✓' : '✗'}`);
    });
  }

  console.log(`\nDetailed report saved to: ${flakyTestsFile}`);
}

detectFlakyTests();
