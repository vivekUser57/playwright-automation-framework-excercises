/**
 * Send Slack notifications with test results
 * Usage: node slack-notification.js <status> <channel>
 */

const fs = require('fs');
const https = require('https');

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';

function getTestResults() {
  try {
    const resultsFile = 'test-results/results.json';
    if (fs.existsSync(resultsFile)) {
      return JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
    }
  } catch (e) {
    console.log('Could not read test results');
  }
  return null;
}

function sendSlackNotification(status, channel) {
  const results = getTestResults();
  const stats = results?.stats || {};
  
  const totalTests = stats.expected || 0;
  const passed = stats.expected - (stats.failed || 0);
  const failed = stats.failed || 0;
  const duration = stats.duration || 0;
  const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0;

  let color, statusEmoji, statusText;
  
  if (status === 'success') {
    color = '#36a64f';
    statusEmoji = '✅';
    statusText = 'PASSED';
  } else if (status === 'failure') {
    color = '#dc3545';
    statusEmoji = '❌';
    statusText = 'FAILED';
  } else {
    color = '#ffc107';
    statusEmoji = '⚠️';
    statusText = 'UNSTABLE';
  }

  const payload = {
    channel: channel || '#automation-tests',
    attachments: [
      {
        color: color,
        title: `${statusEmoji} Playwright Tests ${statusText}`,
        title_link: process.env.BUILD_URL || 'http://localhost:8080',
        fields: [
          {
            title: 'Job',
            value: process.env.JOB_NAME || 'All-Regression-Tests',
            short: true
          },
          {
            title: 'Build',
            value: `#${process.env.BUILD_NUMBER || 'N/A'}`,
            short: true
          },
          {
            title: 'Total Tests',
            value: totalTests.toString(),
            short: true
          },
          {
            title: '✓ Passed',
            value: `${passed} (${passRate}%)`,
            short: true
          },
          {
            title: '✗ Failed',
            value: failed.toString(),
            short: true
          },
          {
            title: '⏱️ Duration',
            value: `${(duration / 1000).toFixed(2)}s`,
            short: true
          }
        ],
        actions: [
          {
            type: 'button',
            text: 'View Report',
            url: `${process.env.BUILD_URL || 'http://localhost:8080'}Playwright_20HTML_20Report/`
          },
          {
            type: 'button',
            text: 'View Allure',
            url: `${process.env.BUILD_URL || 'http://localhost:8080'}Allure_20Test_20Report/`
          },
          {
            type: 'button',
            text: 'View Console',
            url: `${process.env.BUILD_URL || 'http://localhost:8080'}console`
          }
        ],
        footer: 'Playwright Automation Suite',
        ts: Math.floor(Date.now() / 1000)
      }
    ]
  };

  // Check if webhook is configured
  if (SLACK_WEBHOOK.includes('YOUR/WEBHOOK')) {
    console.log('⚠️  Slack webhook not configured');
    console.log('Set SLACK_WEBHOOK_URL environment variable to enable Slack notifications');
    return;
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(payload))
    }
  };

  const url = new URL(SLACK_WEBHOOK);
  const req = https.request(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✓ Slack notification sent successfully');
      } else {
        console.log(`⚠️  Slack notification failed: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (e) => {
    console.log(`❌ Slack notification error: ${e.message}`);
  });

  req.write(JSON.stringify(payload));
  req.end();
}

// Main execution
const status = process.argv[2] || 'success';
const channel = process.argv[3] || '#automation-tests';
sendSlackNotification(status, channel);
