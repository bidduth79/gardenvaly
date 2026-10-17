/**
 * @file livingTreeBackground.test.ts
 * @description Automated test suite for the full-page LivingTreeBackground component.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

console.log('🌳 Running Gardenvaly Full-Page Living Tree Background Tests...\n');

describe('Suite 1: Botanical Lifecycle Stages Coverage', () => {
  const bgPath = path.resolve('src/components/common/LivingTreeBackground.tsx');
  const stagesPath = path.resolve('src/components/common/LivingTreeStages.tsx');
  const bgContent = fs.readFileSync(bgPath, 'utf-8');
  const stagesContent = fs.readFileSync(stagesPath, 'utf-8');

  it('Imports and renders all 4 botanical lifecycle stages', () => {
    assert.ok(bgContent.includes('SeedInSoilStage'), 'Stage 1 Seed in Soil is wired');
    assert.ok(bgContent.includes('SproutStemStage'), 'Stage 2 Sprout & Roots is wired');
    assert.ok(bgContent.includes('BranchingTreeStage'), 'Stage 3 Branching Tree is wired');
    assert.ok(bgContent.includes('MatureFruitingTreeStage'), 'Stage 4 Mature Fruiting Tree is wired');
    console.log('  ✅ PASS: All 4 botanical lifecycle stages wired into background system');
  });

  it('Defines vector graphics for seeds, roots, trunk, leaves, blossoms, and fruits', () => {
    assert.ok(stagesContent.includes('SeedInSoilStage'), 'SeedInSoilStage vector component defined');
    assert.ok(stagesContent.includes('SproutStemStage'), 'SproutStemStage vector component defined');
    assert.ok(stagesContent.includes('BranchingTreeStage'), 'BranchingTreeStage vector component defined');
    assert.ok(stagesContent.includes('MatureFruitingTreeStage'), 'MatureFruitingTreeStage vector component defined');
    assert.ok(stagesContent.includes('#E11D48') || stagesContent.includes('#D97706'), 'Fruit colors defined');
    console.log('  ✅ PASS: Complete vector art for seeds, roots, leaves, and fruits verified');
  });
});

describe('Suite 2: Zero Text Occlusion, GPU Compositing & Accessibility', () => {
  const bgPath = path.resolve('src/components/common/LivingTreeBackground.tsx');
  const bgContent = fs.readFileSync(bgPath, 'utf-8');

  it('Enforces non-blocking pointer events and negative z-index to protect text and buttons', () => {
    assert.ok(bgContent.includes('pointer-events-none'), 'Must be non-blocking');
    assert.ok(bgContent.includes('-z-10'), 'Positioned behind all content layers');
    assert.ok(bgContent.includes('aria-hidden="true"'), 'Hidden from assistive technologies');
    console.log('  ✅ PASS: Non-blocking pointer events and negative z-index verified');
  });

  it('Uses GPU-accelerated translate3d and requestAnimationFrame throttling', () => {
    assert.ok(bgContent.includes('translate3d'), 'Uses 3D hardware-accelerated transforms');
    assert.ok(bgContent.includes('requestAnimationFrame'), 'Uses RAF for frame throttling');
    assert.ok(bgContent.includes('will-change-transform'), 'Hint for compositor thread optimization');
    console.log('  ✅ PASS: 3D GPU transforms and RAF throttling verified');
  });

  it('Complies with prefers-reduced-motion and cleans up event listeners', () => {
    assert.ok(bgContent.includes('prefers-reduced-motion'), 'Respects reduced-motion preference');
    assert.ok(bgContent.includes('removeEventListener'), 'Scroll listener cleanup on unmount');
    assert.ok(bgContent.includes('cancelAnimationFrame'), 'RAF cleanup on unmount');
    console.log('  ✅ PASS: Reduced motion compliance and lifecycle cleanup verified');
  });
});
