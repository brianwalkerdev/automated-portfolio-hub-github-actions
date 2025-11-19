#!/usr/bin/env node

/**
 * Build Script for Portfolio Hub
 * Creates a dist folder with all static files ready for deployment
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BUILD_DIR = 'dist';
const SOURCE_FILES = [
  'index.html',
  'projects.json',
  '.nojekyll',
  'CNAME'
];
const SOURCE_DIRS = [
  'assets'
];

// Clean build directory
console.log('🧹 Cleaning build directory...');
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true });
}
fs.mkdirSync(BUILD_DIR);

// Copy files
console.log('📄 Copying files...');
SOURCE_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(BUILD_DIR, file));
    console.log(`  ✓ ${file}`);
  }
});

// Copy directories recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('📁 Copying directories...');
SOURCE_DIRS.forEach(dir => {
  if (fs.existsSync(dir)) {
    copyDir(dir, path.join(BUILD_DIR, dir));
    console.log(`  ✓ ${dir}/`);
  }
});

console.log('✅ Build complete! Files are in the dist/ directory');
console.log('📦 Deploy the dist/ folder to any static hosting service');
