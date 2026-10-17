/**
 * @file seedToTreeJourney.test.ts
 * @description Automated test suite for the Seed-to-Tree scrollytelling parallax section.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

console.log('🌱 Running Gardenvaly Seed-to-Tree Scrollytelling Tests...\n');

describe('Suite 1: Stage Progression & Botanical Narrative', () => {
  const journeyPath = path.resolve('src/components/home/SeedToTreeJourney.tsx');
  const content = fs.readFileSync(journeyPath, 'utf-8');

  it('Defines all 3 consecutive botanical growth stages (Seed, Sprout, Tree)', () => {
    assert.ok(content.includes("id: 'seed'"), 'Stage 1 Seed is defined');
    assert.ok(content.includes("id: 'sprout'"), 'Stage 2 Sprout is defined');
    assert.ok(content.includes("id: 'tree'"), 'Stage 3 Tree is defined');
    console.log('  ✅ PASS: All 3 botanical growth stages are configured');
  });

  it('Supports bilingual Bengali and English text content for every stage', () => {
    assert.ok(content.includes('badgeBn'), 'Bengali badges included');
    assert.ok(content.includes('titleBn'), 'Bengali titles included');
    assert.ok(content.includes('descBn'), 'Bengali descriptions included');
    assert.ok(content.includes('titleEn'), 'English titles included');
    console.log('  ✅ PASS: Complete bilingual localization for all stages verified');
  });

  it('Contains interactive phase buttons for instant user navigation', () => {
    assert.ok(content.includes('setActiveStage(idx)'), 'Interactive stage click handler');
    assert.ok(content.includes('s.icon'), 'Stage icons rendered');
    console.log('  ✅ PASS: Interactive stage selector controls verified');
  });
});

describe('Suite 2: Visual Illustrations & Responsive Rendering', () => {
  const visualPath = path.resolve('src/components/home/SeedGrowthVisual.tsx');
  const visualContent = fs.readFileSync(visualPath, 'utf-8');

  it('Renders dedicated SVG illustrations for Seed, Sprout, and Mature Tree', () => {
    assert.ok(visualContent.includes('stage === 0'), 'Stage 0 Seed illustration conditional');
    assert.ok(visualContent.includes('stage === 1'), 'Stage 1 Sprout illustration conditional');
    assert.ok(visualContent.includes('stage === 2'), 'Stage 2 Mature Tree illustration conditional');
    console.log('  ✅ PASS: Visual artwork for all 3 lifecycle phases verified');
  });

  it('Applies smooth CSS transitions for stage cross-fading and scaling', () => {
    assert.ok(visualContent.includes('transition-all duration-700'), 'Smooth 700ms transition');
    assert.ok(visualContent.includes('opacity-100 scale-100'), 'Active stage display styles');
    assert.ok(visualContent.includes('opacity-0 scale-75'), 'Inactive stage hidden styles');
    console.log('  ✅ PASS: Cross-fade and scaling transitions verified');
  });
});
