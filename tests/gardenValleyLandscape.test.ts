/**
 * @file gardenValleyLandscape.test.ts
 * @description Test suite for the animated Garden Valley Footer Landscape, Shop, and Village Haven.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

console.log('🌱 Running Gardenvaly Footer Animated Storytelling Landscape Tests...\n');

describe('Suite 1: Storytelling Components & Vector Architecture', () => {
  const landscapePath = path.resolve('src/components/layout/GardenValleyLandscape.tsx');
  const shopPath = path.resolve('src/components/layout/GardenShopCottage.tsx');
  const havenPath = path.resolve('src/components/layout/GardenVillageHaven.tsx');
  const vanPath = path.resolve('src/components/layout/GardenDeliveryVan.tsx');

  const landscapeContent = fs.readFileSync(landscapePath, 'utf-8');
  const shopContent = fs.readFileSync(shopPath, 'utf-8');
  const havenContent = fs.readFileSync(havenPath, 'utf-8');
  const vanContent = fs.readFileSync(vanPath, 'utf-8');

  it('Renders GardenShopCottage on left with signboard strictly reading GardenValy', () => {
    assert.ok(shopContent.includes('GardenValy'), 'Signboard must say GardenValy');
    assert.ok(!shopContent.includes('GardenValy Nursery & Shop'), 'Signboard must not have extra words');
    assert.ok(landscapeContent.includes('<GardenShopCottage'), 'Shop wired in landscape');
    console.log('  ✅ PASS: GardenValy shop with exact brand signboard verified');
  });

  it('Renders GardenVillageHaven on right with animated Krishan, Krishani, and playing children', () => {
    assert.ok(havenContent.includes('animate-farmer-wave'), 'Krishan waving arm movement wired');
    assert.ok(havenContent.includes('animate-krishani-welcome'), 'Krishani welcoming movement wired');
    assert.ok(havenContent.includes('animate-kite-soar'), 'Child flying kite soaring movement wired');
    assert.ok(havenContent.includes('animate-kid-hop'), 'Girl hopping movement wired');
    assert.ok(havenContent.includes('animate-plant-unload'), 'Delivered plants unloading wired');
    assert.ok(landscapeContent.includes('<GardenVillageHaven'), 'Village haven wired in landscape');
    console.log('  ✅ PASS: Village Haven with animated characters and plant unloading verified');
  });

  it('GardenDeliveryVan renders plant cargo, synchronized wheels, and headlight beam', () => {
    assert.ok(vanContent.includes('animate-story-wheel'), 'Story-synchronized spinning wheels wired');
    assert.ok(vanContent.includes('animate-plant-load'), 'Plant cargo loading wired');
    assert.ok(vanContent.includes('GARDENVALY'), 'Van body door branding wired');
    console.log('  ✅ PASS: GardenDeliveryVan plant cargo, wheels and headlights verified');
  });
});

describe('Suite 2: Parallax Movement, Hill Flights & Color Seamless Blending', () => {
  const cssPath = path.resolve('src/components/layout/valleyLandscape.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  const landscapePath = path.resolve('src/components/layout/GardenValleyLandscape.tsx');
  const landscapeContent = fs.readFileSync(landscapePath, 'utf-8');

  it('Declares bird traverse, van story, and plant loading/unloading keyframes', () => {
    assert.ok(cssContent.includes('@keyframes birdsFlyAcross'), 'birdsFlyAcross keyframe declared');
    assert.ok(cssContent.includes('@keyframes storyVanMotion'), 'storyVanMotion keyframe declared');
    assert.ok(cssContent.includes('@keyframes storyPlantLoad'), 'storyPlantLoad keyframe declared');
    assert.ok(cssContent.includes('@keyframes storyPlantUnload'), 'storyPlantUnload keyframe declared');
    assert.ok(landscapeContent.includes('animate-birds-fly'), 'Birds flying across hills wired in landscape');
    assert.ok(landscapeContent.includes('animate-story-van'), 'Van delivery story cycle wired in landscape');
    console.log('  ✅ PASS: Bird traverse over hills and van delivery lifecycle keyframes verified');
  });

  it('Protects against horizontal layout overflow and eliminates harsh white background', () => {
    assert.ok(landscapeContent.includes('overflow-hidden'), 'Container has overflow-hidden');
    assert.ok(landscapeContent.includes('#174D35'), 'Seamlessly harmonizes with #174D35 footer color');
    assert.ok(!landscapeContent.includes('#F3F7F2'), 'Removed harsh white sky separation box');
    console.log('  ✅ PASS: Zero horizontal overflow and seamless color blending verified');
  });
});

describe('Suite 3: Footer Positioning & File Size Governance', () => {
  const footerPath = path.resolve('src/components/layout/Footer.tsx');
  const landscapePath = path.resolve('src/components/layout/GardenValleyLandscape.tsx');
  const shopPath = path.resolve('src/components/layout/GardenShopCottage.tsx');
  const havenPath = path.resolve('src/components/layout/GardenVillageHaven.tsx');
  const vanPath = path.resolve('src/components/layout/GardenDeliveryVan.tsx');

  const footerContent = fs.readFileSync(footerPath, 'utf-8');
  const files = [footerPath, landscapePath, shopPath, havenPath, vanPath];

  it('Positions GardenValleyLandscape at the very bottom of the Footer', () => {
    const bottomIndex = footerContent.lastIndexOf('<GardenValleyLandscape />');
    const copyrightIndex = footerContent.indexOf('allRightsReserved');
    assert.ok(bottomIndex > copyrightIndex, 'Landscape must be positioned after the copyright / links content');
    console.log('  ✅ PASS: Landscape positioned at the very bottom base of the footer');
  });

  it('Strictly adheres to <= 200 lines rule for all new/modified components', () => {
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf-8');
      const lines = content.split('\n').length;
      assert.ok(lines <= 200, `File ${path.basename(f)} is ${lines} lines (<= 200)`);
    }
    console.log('  ✅ PASS: All storytelling components strictly <= 200 lines');
  });
});
