/**
 * @file seedToTreeJourney.test.ts
 * @description Automated test suite for the Seed-to-Tree Sticky Scrollytelling section.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

console.log('🌱 Running Gardenvaly Seed-to-Tree Sticky Scrollytelling Tests...\n');

describe('Suite 1: 4-Stage Sticky Scrollytelling Progression & Botanical Narrative', () => {
  const journeyPath = path.resolve('src/components/home/SeedToTreeJourney.tsx');
  const content = fs.readFileSync(journeyPath, 'utf-8');

  it('Defines all 4 consecutive botanical growth stages (Seed, Sprout, Bloom, Fruiting Tree)', () => {
    assert.ok(content.includes("id: 'seed'"), 'Stage 1 Seed (খাঁটি) is defined');
    assert.ok(content.includes("id: 'sprout'"), 'Stage 2 Sprout (কচি) is defined');
    assert.ok(content.includes("id: 'bloom'"), 'Stage 3 Bloom (ফুল) is defined');
    assert.ok(content.includes("id: 'tree'"), 'Stage 4 Fruiting Tree (ফল গাছ) is defined');
    console.log('  ✅ PASS: All 4 botanical growth stages are configured');
  });

  it('Uses clean button labels (খাঁটি, কচি, ফুল, ফল গাছ) with no trailing comma on ফুল', () => {
    assert.ok(content.includes("labelBn: 'খাঁটি'"), 'Stage 1 button label is খাঁটি');
    assert.ok(content.includes("labelBn: 'কচি'"), 'Stage 2 button label is কচি');
    assert.ok(content.includes("labelBn: 'ফুল'"), 'Stage 3 button label is ফুল without comma');
    assert.ok(content.includes("labelBn: 'ফল গাছ'"), 'Stage 4 button label is ফল গাছ');
    assert.ok(!content.includes('ফুল,'), 'No trailing comma after ফুল');
    console.log('  ✅ PASS: Clean button labels verified without comma typo');
  });

  it('Supports bilingual Bengali and English text content for every stage', () => {
    assert.ok(content.includes('badgeBn'), 'Bengali badges included');
    assert.ok(content.includes('titleBn'), 'Bengali titles included');
    assert.ok(content.includes('descBn'), 'Bengali descriptions included');
    assert.ok(content.includes('titleEn'), 'English titles included');
    console.log('  ✅ PASS: Complete bilingual localization for all stages verified');
  });

  it('Implements Sticky Scrollytelling pinning and wheel/touch step locking', () => {
    assert.ok(content.includes('sticky top-16'), 'Uses sticky viewport pinning');
    assert.ok(content.includes('handleWheel'), 'Intercepts wheel events to step through stages');
    assert.ok(content.includes('setActiveStage(idx)'), 'Interactive stage click handler');
    assert.ok(content.includes('s.icon'), 'Stage icons rendered');
    console.log('  ✅ PASS: Sticky Scrollytelling and interactive controls verified');
  });
});

describe('Suite 2: Visual Illustrations & Responsive Rendering', () => {
  const visualPath = path.resolve('src/components/home/SeedGrowthVisual.tsx');
  const visualContent = fs.readFileSync(visualPath, 'utf-8');

  it('Renders dedicated SVG illustrations for Seed (0), Sprout (1), Bloom (2), and Fruiting Tree (3)', () => {
    assert.ok(visualContent.includes('stage === 0'), 'Stage 0 Seed illustration conditional');
    assert.ok(visualContent.includes('stage === 1'), 'Stage 1 Sprout illustration conditional');
    assert.ok(visualContent.includes('stage === 2'), 'Stage 2 Blooming Tree illustration conditional');
    assert.ok(visualContent.includes('stage === 3'), 'Stage 3 Mature Fruiting Tree illustration conditional');
    console.log('  ✅ PASS: Visual artwork for all 4 lifecycle phases verified');
  });

  it('Applies smooth CSS transitions for stage cross-fading and scaling', () => {
    assert.ok(visualContent.includes('transition-all duration-700'), 'Smooth 700ms transition');
    assert.ok(visualContent.includes('opacity-100 scale-100'), 'Active stage display styles');
    assert.ok(visualContent.includes('opacity-0 scale-75'), 'Inactive stage hidden styles');
    console.log('  ✅ PASS: Cross-fade and scaling transitions verified');
  });
});
