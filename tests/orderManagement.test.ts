/**
 * @file orderManagement.test.ts
 * @description Comprehensive automated test suite for Gardenvaly Order Management System.
 */

import { db } from '../server/db/database';
import {
  isValidTransition,
  ORDER_STATUS_REGISTRY,
  ALLOWED_STATUS_TRANSITIONS,
} from '../server/utils/orderLifecycle';

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

console.log('\n🌿 Running Gardenvaly Order Management Automated Tests...\n');

// 1. Order Status Lifecycle Registry
console.log('--- Suite 1: Status Lifecycle & Transition Matrix ---');
assert(
  Object.keys(ORDER_STATUS_REGISTRY).length === 10,
  'All 10 order statuses are registered',
  `Expected 10 statuses, found ${Object.keys(ORDER_STATUS_REGISTRY).length}`
);

assert(
  isValidTransition('pending', 'confirmed').allowed === true,
  'Pending can transition to Confirmed'
);

assert(
  isValidTransition('pending', 'delivered').allowed === false,
  'Invalid transition: Pending cannot jump directly to Delivered'
);

assert(
  isValidTransition('cancelled', 'delivered').allowed === false,
  'Invalid transition: Cancelled cannot transition to Delivered'
);

assert(
  isValidTransition('shipped', 'delivered').allowed === true,
  'Shipped can transition to Delivered'
);

assert(
  isValidTransition('delivered', 'return_requested').allowed === true,
  'Delivered can transition to Return Requested'
);

// 2. Order Creation & Stock Handling
console.log('\n--- Suite 2: Order Persistence & Inventory Protection ---');
const products = db.getProducts();
const testProduct = products[0];
const initialStock = testProduct.stockQuantity;

const newOrder = db.createOrder({
  customer: {
    fullName: 'Test Customer Nursery',
    mobileNumber: '01700000000',
    division: 'Dhaka',
    district: 'Dhaka',
    addressDetail: 'Test Address 123',
  },
  items: [
    {
      productId: testProduct.id,
      productName: testProduct.nameEn,
      quantity: 2,
      unitPrice: testProduct.price,
      lineSubtotal: testProduct.price * 2,
    },
  ],
  subtotal: testProduct.price * 2,
  deliveryCharge: 60,
  totalAmount: testProduct.price * 2 + 60,
  deliveryMethod: 'home-delivery',
  paymentMethod: 'cash-on-delivery',
});

assert(Boolean(newOrder.id && newOrder.orderNumber), 'Valid order persists with unique orderNumber');
assert(newOrder.status === 'pending', 'Newly placed order defaults to pending');
assert(newOrder.paymentStatus === 'unpaid', 'COD order defaults to unpaid');
assert(
  testProduct.stockQuantity === initialStock - 2,
  'Product stock is properly decremented on order creation'
);

// 3. COD Reconciliation
console.log('\n--- Suite 3: Cash-on-Delivery (COD) Reconciliation ---');
assert(
  newOrder.codExpectedAmount === newOrder.totalAmount,
  'Expected COD amount matches order total'
);
assert(
  newOrder.codStatus === 'awaiting_collection',
  'Initial COD status is awaiting_collection'
);

// Partial collection
const partialCod = db.recordCodCollection(newOrder.id, {
  collectedAmount: 100,
  collectedByStaff: 'Delivery Agent',
});
assert(partialCod.success === true, 'Partial COD collection recorded');
assert(
  partialCod.order?.codStatus === 'partially_collected',
  'Status marked as partially_collected'
);
assert(
  partialCod.order?.paymentStatus === 'unpaid',
  'Payment status remains unpaid until full collection'
);

// Full collection
const fullCod = db.recordCodCollection(newOrder.id, {
  collectedAmount: newOrder.totalAmount,
  collectedByStaff: 'Delivery Agent',
});
assert(fullCod.order?.codStatus === 'collected', 'Status marked as collected');
assert(fullCod.order?.paymentStatus === 'paid', 'Payment status marked as paid upon full collection');

// 4. Cancellation & Double Restoration Prevention
console.log('\n--- Suite 4: Stock Cancellation & Double Restoration Prevention ---');
const stockBeforeCancel = testProduct.stockQuantity;
const cancelResult1 = db.updateOrderStatus(newOrder.id, 'cancelled', 'Customer requested cancellation');
assert(cancelResult1.success === true, 'Order status updated to cancelled');
assert(
  testProduct.stockQuantity === stockBeforeCancel + 2,
  'Stock safely restored on cancellation'
);

// Attempt duplicate cancellation / state update to ensure stock is NOT restored twice
const stockAfterFirstCancel = testProduct.stockQuantity;
db.updateOrderStatus(newOrder.id, 'cancelled', 'Duplicate cancel call');
assert(
  testProduct.stockQuantity === stockAfterFirstCancel,
  'Stock is NOT restored twice on repeated cancel calls'
);

// 5. Audit Trail Verification
console.log('\n--- Suite 5: Audit Trail Verification ---');
const fetchedOrder = db.getOrderById(newOrder.id);
assert(
  Array.isArray(fetchedOrder?.auditTrail) && (fetchedOrder?.auditTrail.length || 0) >= 3,
  'Audit trail contains records for creation, COD collection, and cancellation'
);

// 6. Bilingual Labels
console.log('\n--- Suite 6: Bilingual Label Integrity ---');
assert(
  ORDER_STATUS_REGISTRY.pending.labelBn === 'নতুন অর্ডার' &&
    ORDER_STATUS_REGISTRY.delivered.labelBn === 'পণ্য পৌঁছে দেওয়া হয়েছে' &&
    ORDER_STATUS_REGISTRY.cancelled.labelBn === 'অর্ডার বাতিল',
  'Bengali and English labels are rendered accurately'
);

console.log(`\n========================================`);
console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
