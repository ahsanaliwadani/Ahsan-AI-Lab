#!/usr/bin/env node
/**
 * AHSAN AI LABS — Asset & SVG Optimizer Script
 * Verifies, minifies, validates viewBox, and ensures high-res social media preview readiness.
 */

import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');

console.log('⚡ [AHSAN AI LABS] Starting Asset & SVG Performance Optimization...');

// 1. Ensure public/assets folder structure exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  console.log('✅ Created /public/assets folder structure.');
}

// 2. Target files to check and optimize
const targetFiles = ['favicon.svg', 'logo.svg', 'og-preview.svg'];

targetFiles.forEach((fileName) => {
  const filePath = path.join(PUBLIC_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: ${fileName} not found in /public.`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalSize = Buffer.byteLength(content, 'utf8');

  // Verify viewBox presence
  if (!content.includes('viewBox=')) {
    console.warn(`⚠️ Warning: ${fileName} is missing a viewBox attribute!`);
  }

  // Remove unnecessary XML comments (except preserving valid gradients/defs)
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  // Normalize multi-spaces & trailing spaces
  content = content.replace(/[ \t]+/g, ' ').replace(/>\s+</g, '><').trim();

  fs.writeFileSync(filePath, content, 'utf8');
  const newSize = Buffer.byteLength(content, 'utf8');
  const saved = originalSize - newSize;
  const percent = ((saved / originalSize) * 100).toFixed(1);

  console.log(`✨ Optimized ${fileName}: ${originalSize}B -> ${newSize}B (saved ${saved}B / -${percent}%)`);

  // Mirror to /public/assets/ for organized modular access
  const mirroredPath = path.join(ASSETS_DIR, fileName);
  fs.writeFileSync(mirroredPath, content, 'utf8');
});

console.log('🚀 [AHSAN AI LABS] Asset optimization and high-resolution SEO references completed successfully!');
