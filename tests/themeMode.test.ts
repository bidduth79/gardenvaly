/**
 * @file themeMode.test.ts
 * @description Automated test suite for Day & Night mode (Obsidian Forest Green dark theme).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

console.log('🌙 Running Gardenvaly Day & Night Theme Tests...\n');

describe('Suite 1: Theme Context & Persistence', () => {
  it('ThemeContext.tsx manages theme state and local storage persistence', () => {
    const filePath = path.resolve('src/context/ThemeContext.tsx');
    assert.ok(fs.existsSync(filePath), 'ThemeContext.tsx exists');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('gardenvaly-theme'), 'Uses persistent local storage key');
    assert.ok(content.includes("classList.add('dark')"), 'Adds dark class to document root');
    assert.ok(content.includes("classList.remove('dark')"), 'Removes dark class in light mode');
    assert.ok(content.includes('toggleTheme'), 'Exposes toggleTheme handler');

    console.log('  ✅ PASS: ThemeContext manages dark class and localStorage persistence');
  });

  it('App.tsx integrates ThemeProvider at application root', () => {
    const appPath = path.resolve('src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');
    assert.ok(content.includes('<ThemeProvider>'), 'Wraps application tree in ThemeProvider');

    console.log('  ✅ PASS: App.tsx root is wrapped in ThemeProvider');
  });
});

describe('Suite 2: Theme Toggle Controls & Header Integration', () => {
  it('ThemeToggle.tsx provides accessible switch role and botanical icons', () => {
    const togglePath = path.resolve('src/components/common/ThemeToggle.tsx');
    assert.ok(fs.existsSync(togglePath), 'ThemeToggle.tsx exists');
    const content = fs.readFileSync(togglePath, 'utf-8');

    assert.ok(content.includes('role="switch"'), 'Complies with accessible switch role');
    assert.ok(content.includes('aria-checked={isDark}'), 'Reports accurate checked state');
    assert.ok(content.includes('Sun'), 'Renders sun icon for day mode');
    assert.ok(content.includes('Moon'), 'Renders moon icon for night mode');

    console.log('  ✅ PASS: ThemeToggle provides accessible day/night switch controls');
  });

  it('Header.tsx and MobileMenu.tsx embed ThemeToggle for instant user access', () => {
    const headerPath = path.resolve('src/components/layout/Header.tsx');
    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    assert.ok(headerContent.includes('<ThemeToggle'), 'Header integrates ThemeToggle');

    const menuPath = path.resolve('src/components/layout/MobileMenu.tsx');
    const menuContent = fs.readFileSync(menuPath, 'utf-8');
    assert.ok(menuContent.includes('<ThemeToggle'), 'MobileMenu integrates ThemeToggle');

    console.log('  ✅ PASS: Header and MobileMenu both feature theme toggle');
  });
});

describe('Suite 3: Obsidian Forest Green Night Palette', () => {
  it('index.css maps white cards and cream canvas to deep obsidian forest surfaces', () => {
    const cssPath = path.resolve('src/index.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    assert.ok(content.includes('#06120D'), 'Applies #06120D obsidian forest background in night mode');
    assert.ok(content.includes('#0C2018'), 'Maps white surfaces to #0C2018 deep pine green cards');
    assert.ok(content.includes('#1B3B2E'), 'Applies #1B3B2E subtle dark emerald borders');
    assert.ok(content.includes('#F8FAF8'), 'Applies #F8FAF8 crisp white typography for headings');
    assert.ok(content.includes('@custom-variant dark'), 'Defines Tailwind v4 dark variant');

    console.log('  ✅ PASS: Obsidian forest green dark theme palette successfully configured');
  });
});

describe('Suite 4: Architectural Governance & Strict File Constraints', () => {
  it('All theme components strictly adhere to <= 200 lines limit', () => {
    const files = [
      'src/context/ThemeContext.tsx',
      'src/components/common/ThemeToggle.tsx',
      'src/index.css',
      'src/components/layout/Header.tsx',
      'src/components/layout/MobileMenu.tsx',
    ];

    for (const f of files) {
      const fullPath = path.resolve(f);
      assert.ok(fs.existsSync(fullPath), `File exists: ${f}`);
      const lines = fs.readFileSync(fullPath, 'utf-8').split('\n').length;
      assert.ok(lines <= 200, `File ${f} is ${lines} lines, which exceeds max 200 limit`);
    }

    console.log('  ✅ PASS: All theme components strictly obey <= 200 lines rule');
  });
});

describe('Suite 5: Botanical Sprout Tab Favicon & Dynamic Theme Sync', () => {
  it('Favicon assets exist and are linked in index.html', () => {
    const svgPath = path.resolve('public/favicon.svg');
    const lightSvgPath = path.resolve('public/favicon-light.svg');
    const darkSvgPath = path.resolve('public/favicon-dark.svg');
    const icoPath = path.resolve('public/favicon.ico');
    const htmlPath = path.resolve('index.html');

    assert.ok(fs.existsSync(svgPath), 'public/favicon.svg exists');
    assert.ok(fs.existsSync(lightSvgPath), 'public/favicon-light.svg exists');
    assert.ok(fs.existsSync(darkSvgPath), 'public/favicon-dark.svg exists');
    assert.ok(fs.existsSync(icoPath), 'public/favicon.ico exists');

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    assert.ok(htmlContent.includes('/favicon.svg'), 'index.html links to /favicon.svg');
    assert.ok(htmlContent.includes('/favicon.ico'), 'index.html links to /favicon.ico fallback');

    const svgContent = fs.readFileSync(svgPath, 'utf-8');
    assert.ok(svgContent.includes('M5 21h14'), 'SVG favicon contains botanical sprout path');

    console.log('  ✅ PASS: Sprout favicon SVG, light/dark assets, and HTML link verified');
  });
});

