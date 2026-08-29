/**
 * Print formatted test summary for console
 */

const fs = require('fs');

function printTestSummary() {
  const resultsFile = 'test-results/results.json';
  const metricsFile = 'performance-metrics.json';
  const flakyFile = 'flaky-tests.json';
  const trendsFile = 'test-trends.json';

  if (!fs.existsSync(resultsFile)) {
    console.log('No test results found');
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  let metrics = null;
  let flakyTests = null;
  let trends = null;

  if (fs.existsSync(metricsFile)) {
    metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf-8'));
  }

  if (fs.existsSync(flakyFile)) {
    flakyTests = JSON.parse(fs.readFileSync(flakyFile, 'utf-8'));
  }

  if (fs.existsSync(trendsFile)) {
    trends = JSON.parse(fs.readFileSync(trendsFile, 'utf-8'));
  }

  const stats = results.stats || {};
  const totalTests = stats.expected || 0;
  const passed = stats.expected - (stats.failed || 0);
  const failed = stats.failed || 0;
  const duration = stats.duration || 0;
  const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0;

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    📊 TEST EXECUTION SUMMARY                     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Main status
  console.log('  Overall Status: ' + (failed === 0 ? '\x1b[32m✅ ALL PASSED\x1b[0m' : `\x1b[31m❌ ${failed} FAILED\x1b[0m`));
  console.log('\n  ┌─ Test Results ─────────────────────────────────────┐');
  console.log(`  │  Total Tests:        ${totalTests}`);
  console.log(`  │  \x1b[32m✓ Passed:           ${passed} (${passRate}%)\x1b[0m`);
  if (failed > 0) console.log(`  │  \x1b[31m✗ Failed:           ${failed}\x1b[0m`);
  console.log(`  │  ⏱️  Duration:        ${(duration / 1000).toFixed(2)}s`);
  console.log('  └────────────────────────────────────────────────────┘\n');

  // Suite breakdown
  if (results.suites && results.suites.length > 0) {
    console.log('  ┌─ Suite Breakdown ──────────────────────────────────┐');
    results.suites.forEach(suite => {
      const suitePassed = suite.tests?.filter(t => t.status === 'passed').length || 0;
      const suiteFailed = suite.tests?.filter(t => t.status === 'failed').length || 0;
      const suiteTotal = suite.tests?.length || 0;
      const suiteTime = (suite.duration || 0) / 1000;
      const suitePassRate = suiteTotal > 0 ? ((suitePassed / suiteTotal) * 100).toFixed(0) : 0;

      const icon = suiteFailed === 0 ? '✓' : '✗';
      console.log(`  │  ${icon} ${suite.title}`);
      console.log(`  │     ${suitePassed}/${suiteTotal} passed (${suitePassRate}%) - ${suiteTime.toFixed(2)}s`);
    });
    console.log('  └────────────────────────────────────────────────────┘\n');
  }

  // Performance metrics
  if (metrics && metrics.slowestTests && metrics.slowestTests.length > 0) {
    console.log('  ┌─ Slowest Tests ────────────────────────────────────┐');
    metrics.slowestTests.slice(0, 3).forEach((test, i) => {
      console.log(`  │  ${i + 1}. ${test.name}`);
      console.log(`  │     ${test.durationSeconds.toFixed(2)}s`);
    });
    console.log('  └────────────────────────────────────────────────────┘\n');
  }

  // Flaky tests
  if (flakyTests && Object.keys(flakyTests.flakyTests).length > 0) {
    console.log('  ┌─ Flaky Tests Detected ────────────────────────────┐');
    Object.keys(flakyTests.flakyTests).slice(0, 3).forEach(testKey => {
      const test = flakyTests.flakyTests[testKey];
      console.log(`  │  ⚠️  ${testKey}`);
      console.log(`  │     Flakiness: ${test.flakinessPercentage}%`);
    });
    console.log('  └────────────────────────────────────────────────────┘\n');
  }

  // Trends
  if (trends && trends.summary) {
    console.log('  ┌─ Trend (Last 7 Days) ──────────────────────────────┐');
    console.log(`  │  Pass Rate: ${trends.summary.total7Day.averagePassRate}%`);
    console.log(`  │  Trend: ${trends.summary.total7Day.trend}`);
    console.log('  └────────────────────────────────────────────────────┘\n');
  }

  console.log('╔════════════════════════════════════════════════════════════════╗\n');
}

printTestSummary();
