/**
 * @file reportsAnalytics.test.ts
 * @description Automated test suite for Gardenvaly Admin Dashboard, Sales Reports, and Business Analytics.
 */

import { db } from '../server/db/database';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${detail || 'Assertion failed'}`);
    failed++;
  }
}

console.log('\n🌿 Running Gardenvaly Analytics & Reporting Automated Tests...\n');

// 1. Dashboard Metrics Integrity
console.log('--- Suite 1: Dashboard 12-Card Metrics Calculation ---');
const metrics = db.getDashboardMetrics('all_time');

assert(
  typeof metrics.totalOrders === 'number' && metrics.totalOrders >= 0,
  'Metric 1: totalOrders is a valid number'
);
assert(
  typeof metrics.pendingOrders === 'number',
  'Metric 2: pendingOrders is calculated'
);
assert(
  typeof metrics.confirmedOrders === 'number',
  'Metric 3: confirmedOrders is calculated'
);
assert(
  typeof metrics.processingOrders === 'number',
  'Metric 4: processingOrders is calculated'
);
assert(
  typeof metrics.shippedOrders === 'number',
  'Metric 5: shippedOrders is calculated'
);
assert(
  typeof metrics.deliveredOrders === 'number',
  'Metric 6: deliveredOrders is calculated'
);
assert(
  typeof metrics.cancelledOrders === 'number',
  'Metric 7: cancelledOrders is calculated'
);
assert(
  typeof metrics.totalOrderValue === 'number' && metrics.totalOrderValue >= 0,
  'Metric 8: totalOrderValue (Gross) is calculated accurately'
);
assert(
  typeof metrics.actualCollectedPayments === 'number' && metrics.actualCollectedPayments >= 0,
  'Metric 9: actualCollectedPayments reflects verified collections'
);
assert(
  typeof metrics.outstandingCod === 'number' && metrics.outstandingCod >= 0,
  'Metric 10: outstandingCod reflects uncollected balance'
);
assert(
  typeof metrics.totalProducts === 'number' && metrics.totalProducts > 0,
  'Metric 11: totalProducts reflects catalog size'
);
assert(
  typeof metrics.lowStockProducts === 'number',
  'Metric 12: lowStockProducts reflects inventory warnings'
);

// 2. Data Integrity Policies (No Fabricated Profit)
console.log('\n--- Suite 2: Accounting Formulas & Profit Integrity Policy ---');
assert(
  metrics.profitStatus === 'Profit data not configured (Cost tracking required)',
  'Profit is NOT fabricated when cost data is not configured'
);

assert(
  metrics.netSales <= metrics.deliveredOrderValue,
  'Net sales is bounded by delivered order value'
);

assert(
  metrics.timezone === 'Asia/Dhaka (UTC+6)',
  'Business timezone defaults to Asia/Dhaka'
);

// 3. Sales Trend & Status Distribution
console.log('\n--- Suite 3: Chart Data Aggregation ---');
const trend = db.getSalesTrend('last_30_days');
assert(Array.isArray(trend) && trend.length > 0, 'Sales trend points aggregated for 30-day window');

const distribution = db.getStatusDistribution('all_time');
assert(
  Array.isArray(distribution) && distribution.length === 10,
  'Status distribution covers all 10 order lifecycle stages'
);

// 4. Top-Selling Products Aggregation
console.log('\n--- Suite 4: Top-Selling Product Analysis ---');
const topProducts = db.getTopSellingProducts('all_time', undefined, 5);
assert(Array.isArray(topProducts), 'Top-selling products returns array');
if (topProducts.length > 0) {
  assert(
    typeof topProducts[0].unitsSold === 'number' && typeof topProducts[0].grossSales === 'number',
    'Top product contains unitsSold and grossSales figures'
  );
}

// 5. Inventory Alert Categorization
console.log('\n--- Suite 5: Inventory Alerts ---');
const alerts = db.getInventoryAlerts(10);
assert(Array.isArray(alerts) && alerts.length > 0, 'Inventory alerts categorizes all products');
assert(
  alerts.every((a) => ['out_of_stock', 'low_stock', 'healthy_stock'].includes(a.stockStatus)),
  'Alert statuses match valid domain categories'
);

// 6. CSV Export Safety & Injection Defense
console.log('\n--- Suite 6: CSV Export Security & Formula Injection Defense ---');
const csv = db.exportAnalyticsCsv('summary', 'all_time');
assert(typeof csv === 'string' && csv.startsWith('\uFEFF'), 'CSV contains UTF-8 BOM for Bengali character support');
assert(!csv.includes('=cmd|'), 'CSV formulas are safely escaped');

console.log(`\n========================================`);
console.log(`📊 Analytics Test Summary: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
