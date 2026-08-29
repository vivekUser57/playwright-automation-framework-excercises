/**
 * Collect and analyze performance metrics from test results
 * Tracks slowest tests, average times, and performance trends
 */

const fs = require('fs');
const path = require('path');

function collectMetrics() {
  const resultsFile = 'test-results/results.json';
  
  if (!fs.existsSync(resultsFile)) {
    console.log('❌ Test results file not found');
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  const metricsFile = 'performance-metrics.json';
  
  let metrics = {
    timestamp: new Date().toISOString(),
    buildNumber: process.env.BUILD_NUMBER || 'local',
    jobName: process.env.JOB_NAME || 'local-run',
    suites: [],
    summary: {}
  };

  // Collect metrics per suite
  if (results.suites) {
    results.suites.forEach(suite => {
      const suiteMetrics = {
        name: suite.title,
        totalTests: suite.tests?.length || 0,
        passedTests: suite.tests?.filter(t => t.status === 'passed').length || 0,
        failedTests: suite.tests?.filter(t => t.status === 'failed').length || 0,
        duration: suite.duration || 0,
        durationSeconds: (suite.duration || 0) / 1000,
        tests: []
      };

      // Collect per-test metrics
      if (suite.tests) {
        suite.tests.forEach(test => {
          suiteMetrics.tests.push({
            name: test.title,
            status: test.status,
            duration: test.duration || 0,
            durationSeconds: (test.duration || 0) / 1000,
            retries: test.retries || 0
          });
        });

        // Sort by duration to find slowest
        suiteMetrics.tests.sort((a, b) => b.duration - a.duration);
      }

      metrics.suites.push(suiteMetrics);
    });
  }

  // Calculate summary
  const totalDuration = metrics.suites.reduce((sum, s) => sum + s.duration, 0);
  const totalTests = metrics.suites.reduce((sum, s) => sum + s.totalTests, 0);
  const totalPassed = metrics.suites.reduce((sum, s) => sum + s.passedTests, 0);
  const totalFailed = metrics.suites.reduce((sum, s) => sum + s.failedTests, 0);

  metrics.summary = {
    totalSuites: metrics.suites.length,
    totalTests: totalTests,
    totalPassed: totalPassed,
    totalFailed: totalFailed,
    passRate: totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : 0,
    totalDuration: totalDuration,
    totalDurationSeconds: (totalDuration / 1000).toFixed(2),
    averageTestTime: totalTests > 0 ? ((totalDuration / totalTests) / 1000).toFixed(2) : 0
  };

  // Find slowest tests across all suites
  const allTests = [];
  metrics.suites.forEach(suite => {
    suite.tests.forEach(test => {
      allTests.push({
        suite: suite.name,
        ...test
      });
    });
  });
  
  allTests.sort((a, b) => b.duration - a.duration);
  metrics.slowestTests = allTests.slice(0, 10);

  // Write metrics to file
  fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));
  
  console.log('\n✓ Performance Metrics Collected');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Total Duration: ${metrics.summary.totalDurationSeconds}s`);
  console.log(`Average Test Time: ${metrics.summary.averageTestTime}s`);
  console.log(`Pass Rate: ${metrics.summary.passRate}%`);
  console.log(`\nSlowest 5 Tests:`);
  metrics.slowestTests.slice(0, 5).forEach((test, i) => {
    console.log(`  ${i + 1}. [${test.suite}] ${test.name}: ${test.durationSeconds.toFixed(2)}s`);
  });
  console.log(`\nMetrics saved to: ${metricsFile}`);
}

collectMetrics();
