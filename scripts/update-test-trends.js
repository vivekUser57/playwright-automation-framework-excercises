/**
 * Track test trends over time (last 7, 14, 30 days)
 * Generates trend data for dashboard visualization
 */

const fs = require('fs');
const path = require('path');

function updateTestTrends() {
  const resultsFile = 'test-results/results.json';
  const trendsFile = 'test-trends.json';
  
  if (!fs.existsSync(resultsFile)) {
    console.log('❌ Test results not found');
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  
  // Load existing trends
  let trends = {
    data: []
  };

  if (fs.existsSync(trendsFile)) {
    trends = JSON.parse(fs.readFileSync(trendsFile, 'utf-8'));
  }

  // Calculate current stats
  const stats = results.stats || {};
  const totalTests = stats.expected || 0;
  const passed = stats.expected - (stats.failed || 0);
  const failed = stats.failed || 0;
  const duration = stats.duration || 0;
  const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0;

  // Add today's data
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateKey = today.toISOString().split('T')[0];

  // Remove duplicate entry for today if exists
  trends.data = trends.data.filter(d => d.date !== dateKey);

  // Add new entry
  trends.data.push({
    date: dateKey,
    dateTime: new Date().toISOString(),
    buildNumber: process.env.BUILD_NUMBER || 'local',
    totalTests: totalTests,
    passed: passed,
    failed: failed,
    passRate: parseFloat(passRate),
    duration: duration,
    durationSeconds: (duration / 1000).toFixed(2)
  });

  // Keep only last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  trends.data = trends.data.filter(d => new Date(d.date) >= thirtyDaysAgo);

  // Calculate trend statistics
  const sevenDayData = trends.data.slice(-7);
  const fourteenDayData = trends.data.slice(-14);
  const thirtyDayData = trends.data;

  trends.summary = {
    lastUpdated: new Date().toISOString(),
    total7Day: {
      averagePassRate: sevenDayData.length > 0 
        ? (sevenDayData.reduce((sum, d) => sum + d.passRate, 0) / sevenDayData.length).toFixed(2)
        : 0,
      trend: calculateTrend(sevenDayData)
    },
    total14Day: {
      averagePassRate: fourteenDayData.length > 0
        ? (fourteenDayData.reduce((sum, d) => sum + d.passRate, 0) / fourteenDayData.length).toFixed(2)
        : 0,
      trend: calculateTrend(fourteenDayData)
    },
    total30Day: {
      averagePassRate: thirtyDayData.length > 0
        ? (thirtyDayData.reduce((sum, d) => sum + d.passRate, 0) / thirtyDayData.length).toFixed(2)
        : 0,
      trend: calculateTrend(thirtyDayData)
    }
  };

  fs.writeFileSync(trendsFile, JSON.stringify(trends, null, 2));

  console.log('\n📈 Test Trend Analysis');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\nLast 7 Days:`);
  console.log(`  Average Pass Rate: ${trends.summary.total7Day.averagePassRate}%`);
  console.log(`  Trend: ${trends.summary.total7Day.trend}`);
  console.log(`\nLast 14 Days:`);
  console.log(`  Average Pass Rate: ${trends.summary.total14Day.averagePassRate}%`);
  console.log(`  Trend: ${trends.summary.total14Day.trend}`);
  console.log(`\nLast 30 Days:`);
  console.log(`  Average Pass Rate: ${trends.summary.total30Day.averagePassRate}%`);
  console.log(`  Trend: ${trends.summary.total30Day.trend}`);
  console.log(`\nTrend data saved to: ${trendsFile}`);
}

function calculateTrend(data) {
  if (data.length < 2) return '→ Stable';
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const avgFirst = firstHalf.reduce((sum, d) => sum + d.passRate, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, d) => sum + d.passRate, 0) / secondHalf.length;
  
  const diff = avgSecond - avgFirst;
  const threshold = 2; // 2% threshold

  if (diff > threshold) return '↑ Improving';
  if (diff < -threshold) return '↓ Declining';
  return '→ Stable';
}

updateTestTrends();
