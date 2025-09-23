#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to review icon categorization and show examples
 * Usage: node scripts/review-categories.js [category-name]
 */

const GENERATED_ICONS_FILE = path.join(__dirname, '../src/data/generated-icons.js');

function loadGeneratedIcons() {
  try {
    const content = fs.readFileSync(GENERATED_ICONS_FILE, 'utf8');
    // Extract the generatedIcons array - handle the export const syntax
    const match = content.match(/export const generatedIcons = (\[[\s\S]*?\]);/);
    if (!match) {
      throw new Error('Could not parse generated icons');
    }
    
    // Create a temporary module to evaluate the array
    const tempModule = `module.exports = ${match[1]};`;
    const tempFile = path.join(__dirname, 'temp-icons.js');
    fs.writeFileSync(tempFile, tempModule);
    
    const icons = require(tempFile);
    fs.unlinkSync(tempFile); // Clean up temp file
    
    return icons;
  } catch (error) {
    console.error('❌ Error loading generated icons:', error.message);
    return [];
  }
}

function reviewCategories() {
  const icons = loadGeneratedIcons();
  const categoryArg = process.argv[2];
  
  if (categoryArg) {
    // Show icons for a specific category
    const categoryIcons = icons.filter(icon => 
      icon.category.toLowerCase().includes(categoryArg.toLowerCase()) ||
      icon.categoryId.includes(categoryArg.toLowerCase())
    );
    
    if (categoryIcons.length === 0) {
      console.log(`❌ No icons found for category: ${categoryArg}`);
      console.log('\nAvailable categories:');
      const categories = [...new Set(icons.map(icon => icon.category))].sort();
      categories.forEach(cat => {
        const count = icons.filter(icon => icon.category === cat).length;
        console.log(`   ${cat} (${count} icons)`);
      });
      return;
    }
    
    console.log(`📂 Icons in category: ${categoryIcons[0].category}`);
    console.log(`🎯 Total: ${categoryIcons.length} icons\n`);
    
    categoryIcons.forEach((icon, index) => {
      console.log(`${index + 1}. ${icon.name} (${icon.filename})`);
    });
    
  } else {
    // Show category overview
    const categoryStats = {};
    icons.forEach(icon => {
      categoryStats[icon.category] = (categoryStats[icon.category] || 0) + 1;
    });
    
    console.log('📊 Category Overview\n');
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} icons`);
      });
    
    console.log('\n💡 Usage:');
    console.log('   node scripts/review-categories.js                    # Show overview');
    console.log('   node scripts/review-categories.js symbols            # Show symbols icons');
    console.log('   node scripts/review-categories.js arrows             # Show arrows icons');
    console.log('   node scripts/review-categories.js content            # Show content icons');
  }
}

// Run the script
if (require.main === module) {
  reviewCategories();
}

module.exports = { reviewCategories };
