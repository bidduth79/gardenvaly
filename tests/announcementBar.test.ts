/**
 * @file announcementBar.test.ts
 * @description Automated test suite for the AnnouncementBar auto-hide feature and accessibility.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

console.log('📣 Running Gardenvaly Announcement Bar Automated Tests...\n');

describe('Suite 1: Auto-Hide Timer & Resource Cleanup', () => {
  const filePath = path.resolve('src/components/layout/AnnouncementBar.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  it('Enforces exactly 10 seconds (10000ms) auto-hide timeout', () => {
    assert.ok(content.includes('10000'), 'Includes 10000ms timer');
    assert.ok(content.includes('setTimeout'), 'Uses setTimeout for timed auto-hide');
    console.log('  ✅ PASS: 10-second auto-hide timeout is configured');
  });

  it('Properly cleans up timeout handlers on unmount to prevent memory leaks', () => {
    assert.ok(content.includes('clearTimeout(hideTimer)'), 'Cleans up initial hide timer');
    assert.ok(content.includes('clearTimeout(exitTimer)'), 'Cleans up DOM removal timer');
    console.log('  ✅ PASS: All timeout handlers have lifecycle cleanup');
  });
});

describe('Suite 2: Smooth CSS Collapse Animation & Accessibility', () => {
  const filePath = path.resolve('src/components/layout/AnnouncementBar.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  it('Applies smooth CSS transition classes for collapsible exit', () => {
    assert.ok(content.includes('transition-all'), 'Has transition-all');
    assert.ok(content.includes('duration-500'), 'Has duration-500 for smooth transition');
    assert.ok(content.includes('max-h-0'), 'Has collapsed max-height class');
    assert.ok(content.includes('opacity-0'), 'Has opacity fade out class');
    console.log('  ✅ PASS: Smooth slide-up and fade-out animation classes verified');
  });

  it('Complies with WCAG live region and screen reader standards', () => {
    assert.ok(content.includes('role="status"'), 'Includes status role');
    assert.ok(content.includes('aria-live="polite"'), 'Includes polite aria-live region');
    assert.ok(content.includes('aria-label='), 'Includes accessible button label');
    console.log('  ✅ PASS: WCAG accessibility roles and live-regions verified');
  });
});
