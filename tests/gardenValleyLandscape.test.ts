/**
 * @file gardenValleyLandscape.test.ts
 * @description Test suite for the animated Garden Valley Footer Landscape, Shop, Village Haven, Footer Policy Bar placement, and Floating WhatsApp auto-hide.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const landscapePath = path.resolve(process.cwd(), 'src/components/layout/GardenValleyLandscape.tsx');
const shopPath = path.resolve(process.cwd(), 'src/components/layout/GardenShopCottage.tsx');
const villagePath = path.resolve(process.cwd(), 'src/components/layout/GardenVillageHaven.tsx');
const vanPath = path.resolve(process.cwd(), 'src/components/layout/GardenDeliveryVan.tsx');
const cssPath = path.resolve(process.cwd(), 'src/components/layout/valleyLandscape.css');
const footerPath = path.resolve(process.cwd(), 'src/components/layout/Footer.tsx');
const whatsappPath = path.resolve(process.cwd(), 'src/components/common/FloatingWhatsAppWidget.tsx');

describe('Garden Valley Storytelling Footer Landscape', () => {
  it('verifies all landscape component files exist', () => {
    assert.equal(fs.existsSync(landscapePath), true, 'GardenValleyLandscape.tsx should exist');
    assert.equal(fs.existsSync(shopPath), true, 'GardenShopCottage.tsx should exist');
    assert.equal(fs.existsSync(villagePath), true, 'GardenVillageHaven.tsx should exist');
    assert.equal(fs.existsSync(vanPath), true, 'GardenDeliveryVan.tsx should exist');
    assert.equal(fs.existsSync(cssPath), true, 'valleyLandscape.css should exist');
  });

  it('matches upper footer #174D35 seamlessly in both Day and Night Mode gradients and removes top slogan banner', () => {
    const content = fs.readFileSync(landscapePath, 'utf-8');
    assert.ok(
      content.includes('linear-gradient(180deg, #174D35 0%, #14442F 32%'),
      'Night Mode sky gradient must start at #174D35 to blend seamlessly with the upper footer'
    );
    assert.ok(
      !content.includes('গার্ডেনভ্যালি থেকে চারাগাছ পৌঁছে যাচ্ছে বাংলার শ্যামল আঙিনায়'),
      'Top floating slogan pill over the sun should be removed'
    );
  });

  it('includes night stars, fireflies, day flower bushes, wooden lampposts, and directional signboard', () => {
    const content = fs.readFileSync(landscapePath, 'utf-8');
    assert.ok(content.includes('id="night-stars"'), 'Should render twinkling stars in Night Mode');
    assert.ok(content.includes('id="night-fireflies"'), 'Should render glowing fireflies in Night Mode');
    assert.ok(content.includes('id="day-flower-bushes"'), 'Should render blooming flower bushes in Day Mode');
    assert.ok(content.includes('id="wooden-signboard"'), 'Should render a wooden directional signboard');
    assert.ok(content.includes('id="wooden-lamppost-1"'), 'Should render roadside wooden lampposts');
  });

  it('isolates SVG positioning transforms from CSS keyframe animations so children and kites stay grounded', () => {
    const villageContent = fs.readFileSync(villagePath, 'utf-8');
    assert.ok(
      villageContent.includes('<g id="child-girl" transform="translate(328, 138)">') &&
        villageContent.includes('<g className="animate-kid-hop">'),
      'Child girl should have an outer SVG position group and an inner animate-kid-hop group so she never jumps to (0,0)'
    );
    assert.ok(
      villageContent.includes('<g transform="translate(40, -45)">') &&
        villageContent.includes('<g className="animate-kite-soar">'),
      'Kite should have an outer SVG position group and an inner animate-kite-soar group'
    );
  });

  it('loads plant parcels smoothly from the shop into the van and loops the van forward without reversing', () => {
    const vanContent = fs.readFileSync(vanPath, 'utf-8');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    assert.ok(
      vanContent.includes('<g id="van-cargo" transform="translate(18, -4)">') &&
        vanContent.includes('<g className="animate-plant-load">'),
      'Van cargo should isolate its SVG translate(18, -4) from the inner animate-plant-load group'
    );

    assert.ok(
      cssContent.includes('94.1%, 99.8%') && cssContent.includes('opacity: 0;'),
      'Van motion keyframes must hide the van (opacity: 0) while resetting offscreen to the left'
    );
  });

  it('places the Copyright, Privacy Policy, Terms of Service, and Admin Portal bar below GardenValleyLandscape in Footer.tsx', () => {
    const footerContent = fs.readFileSync(footerPath, 'utf-8');
    const landscapeIdx = footerContent.indexOf('<GardenValleyLandscape />');
    const privacyIdx = footerContent.indexOf("setActivePolicy('privacy')");
    const adminIdx = footerContent.indexOf("navigate('/admin')");

    assert.ok(landscapeIdx !== -1, 'Footer should include <GardenValleyLandscape />');
    assert.ok(
      privacyIdx > landscapeIdx && adminIdx > landscapeIdx,
      'Privacy Policy, Terms of Service, and Admin Portal bar must be rendered BELOW <GardenValleyLandscape />'
    );
  });

  it('automatically hides the FloatingWhatsAppWidget when the footer (#contact) enters the viewport', () => {
    const whatsappContent = fs.readFileSync(whatsappPath, 'utf-8');
    assert.ok(
      whatsappContent.includes("document.getElementById('contact')") &&
        whatsappContent.includes('IntersectionObserver') &&
        whatsappContent.includes('pointer-events-none'),
      'FloatingWhatsAppWidget should observe #contact and hide when footer is visible'
    );
  });
});
