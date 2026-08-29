/**
 * Generate rich HTML console report with test results
 * Shows color-coded results, timings, and metrics
 */

const fs = require('fs');
const path = require('path');

function generateRichReport() {
  const resultsFile = 'test-results/results.json';
  
  if (!fs.existsSync(resultsFile)) {
    console.log('❌ Test results file not found');
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                  📊 PLAYWRIGHT TEST REPORT');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n');

  // Summary
  const stats = results.stats || {};
  const totalTests = stats.expected || 0;
  const passed = stats.expected - (stats.failed || 0);
  const failed = stats.failed || 0;
  const skipped = stats.skipped || 0;
  const duration = stats.duration || 0;

  const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0;

  console.log('\x1b[1m🎯 OVERALL SUMMARY\x1b[0m');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`  Total Tests:     ${totalTests}`);
  console.log(`  \x1b[32m✓ Passed:       ${passed} (${passRate}%)\x1b[0m`);
  if (failed > 0) console.log(`  \x1b[31m✗ Failed:       ${failed}\x1b[0m`);
  if (skipped > 0) console.log(`  \x1b[33m⊘ Skipped:      ${skipped}\x1b[0m`);
  console.log(`  ⏱️  Duration:     ${(duration / 1000).toFixed(2)}s`);
  console.log('\n');

  // Results by suite
  if (results.suites) {
    console.log('\x1b[1m📁 RESULTS BY SUITE\x1b[0m');
    console.log('─────────────────────────────────────────────────────────────');
    
    results.suites.forEach(suite => {
      const suitePassed = suite.tests?.filter(t => t.status === 'passed').length || 0;
      const suiteFailed = suite.tests?.filter(t => t.status === 'failed').length || 0;
      const suiteTotal = suite.tests?.length || 0;
      const suiteTime = (suite.duration || 0) / 1000;

      let icon = suitePassed === suiteTotal ? '✅' : '⚠️ ';
      let color = suitePassed === suiteTotal ? '\x1b[32m' : '\x1b[33m';

      console.log(`  ${icon} \x1b[1m${suite.title}\x1b[0m`);
      console.log(`     ${color}${suitePassed}/${suiteTotal} passed\x1b[0m${suiteFailed > 0 ? ` \x1b[31m(${suiteFailed} failed)\x1b[0m` : ''} - ${suiteTime.toFixed(2)}s`);

      // Individual tests
      if (suite.tests && suite.tests.length <= 5) {
        suite.tests.forEach(test => {
          const testTime = (test.duration || 0) / 1000;
          const statusIcon = test.status === 'passed' ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
          console.log(`       ${statusIcon} ${test.title} (${testTime.toFixed(2)}s)`);
        });
      }
    });
    console.log('\n');
  }

  // Performance metrics
  console.log('\x1b[1m⚡ PERFORMANCE METRICS\x1b[0m');
  console.log('─────────────────────────────────────────────────────────────');
  
  if (results.suites) {
    const suiteTimings = results.suites
      .map(s => ({ name: s.title, time: (s.duration || 0) / 1000 }))
      .sort((a, b) => b.time - a.time);

    console.log('  Slowest Suites:');
    suiteTimings.slice(0, 3).forEach((s, i) => {
      console.log(`    ${i + 1}. ${s.name}: ${s.time.toFixed(2)}s`);
    });
  }

  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  
  // Status indicator
  if (failed === 0) {
    console.log('\x1b[32m\x1b[1m✅ ALL TESTS PASSED!\x1b[0m');
  } else {
    console.log(`\x1b[31m\x1b[1m❌ ${failed} TEST(S) FAILED\x1b[0m`);
  }
  
  console.log('═══════════════════════════════════════════════════════════════\n');
}

generateRichReport();
