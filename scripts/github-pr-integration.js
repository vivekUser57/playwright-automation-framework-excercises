/**
 * GitHub PR Integration - Post test results as PR comments
 * Usage: node github-pr-integration.js <pr-number>
 * 
 * Set environment variables:
 * - GITHUB_TOKEN: GitHub personal access token
 * - GITHUB_REPOSITORY: owner/repo format
 */

const https = require('https');
const fs = require('fs');

function postPRComment(prNumber) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;

  if (!token || !repo) {
    console.log('⚠️  GitHub integration skipped - GITHUB_TOKEN or GITHUB_REPOSITORY not set');
    return;
  }

  const resultsFile = 'test-results/results.json';
  if (!fs.existsSync(resultsFile)) {
    console.log('No test results to post');
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  const stats = results.stats || {};
  
  const totalTests = stats.expected || 0;
  const passed = stats.expected - (stats.failed || 0);
  const failed = stats.failed || 0;
  const duration = stats.duration || 0;
  const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0;

  const statusIcon = failed === 0 ? '✅' : '❌';
  const statusText = failed === 0 ? 'PASSED' : 'FAILED';

  const body = `## ${statusIcon} Playwright Test Results: ${statusText}

All 26 regression tests have been executed on this PR.

### Test Summary
- **Total Tests**: ${totalTests}
- **✓ Passed**: ${passed} (${passRate}%)
- **✗ Failed**: ${failed}
- **⏱️ Duration**: ${(duration / 1000).toFixed(2)}s

### Test Breakdown
| Suite | Passed | Failed | Duration |
|-------|--------|--------|----------|`;

  if (results.suites) {
    results.suites.forEach(suite => {
      const suitePassed = suite.tests?.filter(t => t.status === 'passed').length || 0;
      const suiteFailed = suite.tests?.filter(t => t.status === 'failed').length || 0;
      const suiteTime = ((suite.duration || 0) / 1000).toFixed(2);
      body += `\n| ${suite.title} | ${suitePassed} | ${suiteFailed} | ${suiteTime}s |`;
    });
  }

  body += `\n\n### Links
- [📊 Full Report](${process.env.BUILD_URL}Playwright_20HTML_20Report/)
- [📈 Allure Report](${process.env.BUILD_URL}Allure_20Test_20Report/)
- [📋 Build Console](${process.env.BUILD_URL}console)

_Last run: ${new Date().toISOString()}_`;

  // Post comment to GitHub
  const [owner, repo_name] = repo.split('/');
  const url = `/repos/${repo}/issues/${prNumber}/comments`;

  const options = {
    hostname: 'api.github.com',
    path: url,
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Playwright-CI'
    }
  };

  const payload = JSON.stringify({ body });

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 201) {
        console.log('✓ PR comment posted successfully');
      } else {
        console.log(`⚠️  Failed to post PR comment: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (e) => {
    console.log(`❌ GitHub PR error: ${e.message}`);
  });

  req.write(payload);
  req.end();
}

// Main
const prNumber = process.argv[2] || process.env.PR_NUMBER;
if (prNumber) {
  postPRComment(prNumber);
} else {
  console.log('No PR number provided - skipping GitHub integration');
}
