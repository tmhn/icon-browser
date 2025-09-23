#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to generate a JavaScript array of icon names from the /public/icons/line directory
 * with automatic categorization based on predefined rules
 * Usage: node scripts/generate-icon-list.js
 */

const ICONS_DIR = path.join(__dirname, '../public/icons/line');
const OUTPUT_FILE = path.join(__dirname, '../src/data/generated-icons.js');
const CATEGORIES_FILE = path.join(__dirname, '../src/constants/categories.ts');
const CATEGORY_RULES_FILE = path.join(__dirname, '../src/constants/category-rules.ts');

// Hardcoded category rules (extracted from category-rules.ts)
const categoryRules = {
  "user-interface": {
    keywords: [
      "button","toggle","switch","checkbox","radio","tab","menu","kebab","dots","ellipsis",
      "grid","layout","cursor","resize","drag","handle","modal","tooltip","sidebar","navbar"
    ],
    exclude: [],
    alsoTags: ["ui","ux","interface"]
  },
  "office": {
    keywords: [
      "briefcase","binder","paperclip","staple","stamp","notebook","calendar","clipboard",
      "printer","fax","envelope","mail","letter","meeting","presentation","whiteboard"
    ],
    exclude: []
  },
  "content": {
    keywords: [
      "text","font","type","bold","italic","underline","align","list","bullet","numbered",
      "quote","blockquote","link","attachment","document","doc","file","folder","copy",
      "paste","cut","edit","pen","pencil","paragraph","heading"
    ],
    exclude: []
  },
  "tech": {
    keywords: [
      "code","terminal","console","bug","git","branch","commit","merge","server","api",
      "cloud","kubernetes","docker","chip","cpu","gpu","database","db","wifi","router",
      "satellite","antenna"
    ],
    exclude: []
  },
  "profile": {
    keywords: [
      "user","person","profile","avatar","id","badge","name","account","settings",
      "team","group","followers","following"
    ],
    exclude: []
  },
  "audio-video": {
    keywords: [
      "play","pause","stop","record","rewind","forward","volume","mute","audio",
      "headphones","music","equalizer","image","gallery","photo","camera","film",
      "video","webcam","mic","microphone","speaker"
    ],
    exclude: []
  },
  "shopping": {
    keywords: [
      "shop","store","cart","basket","bag","credit-card","card","money","cash","coin",
      "coins","bank","receipt","discount","tag","barcode","checkout","pos"
    ],
    exclude: []
  },
  "objects": {
    keywords: [
      "gift","box","cube","dice","key","lightbulb","lamp","magnet","trophy","medal","flag",
      "globe","anchor","scissors","ruler","paint","brush","dropper","bucket","pin","safety-pin"
    ],
    exclude: []
  },
  "nature": {
    keywords: [
      "tree","leaf","flower","plant","paw","dog","cat","bird","fish","bee","butterfly",
      "mountain","wave","sun","moon","cloud","rain","snow","umbrella"
    ],
    exclude: [],
    alsoTags: ["outdoors","wildlife"]
  },
  "image": {
    keywords: [
      "image","gallery","photo","camera","frames","crop","exposure","filter","rotate",
      "panorama"
    ],
    exclude: []
  },
  "design-development": {
    keywords: [
      "palette","color","swatch","ruler","grid","compass","vector","bezier","guides",
      "code","brackets","</>","component","layout","cursor","inspector"
    ],
    exclude: []
  },
  "travel": {
    keywords: [
      "plane","flight","airport","passport","luggage","suitcase","ticket","train","tram",
      "bus","car","taxi","ferry","ship","bike","bicycle","scooter","map","route","gps"
    ],
    exclude: []
  },
  "homegoods": {
    keywords: [
      "sofa","couch","bed","lamp","chair","table","wardrobe","drawer","shelf","toaster",
      "kettle","fridge","oven","microwave","washing-machine","dryer","vacuum"
    ],
    exclude: []
  },
  "food-drink": {
    keywords: [
      "coffee","cup","mug","latte","espresso","tea","teapot","kettle","croissant","baguette",
      "burger","pizza","fries","chips","sushi","noodles","ramen","rice","cookie","cake",
      "wine","beer","cocktail","bar","bottle","fork","knife","spoon"
    ],
    exclude: []
  },
  "buildings-places": {
    keywords: [
      "home","house","building","office","skyscraper","factory","warehouse","bank","store",
      "hospital","school","university","castle","monument","bridge","landmark","map-pin","marker"
    ],
    exclude: []
  },
  "rewards": {
    keywords: [
      "trophy","medal","award","star","ribbon","crown","badge","laurel","achievement","level","rank"
    ],
    exclude: []
  },
  "activities": {
    keywords: [
      "run","walk","hike","swim","cycle","bike","scooter","ski","yoga","game","chess","dice",
      "controller","paint","draw","write","cook","camp","fish"
    ],
    exclude: []
  },
  "health-science": {
    keywords: [
      "heart","pulse","activity","health","hospital","ambulance","bandage","pill","capsule","syringe",
      "stethoscope","medkit","first-aid","dna","flask","beaker","microscope","telescope","magnet","atom"
    ],
    exclude: []
  },
  "business": {
    keywords: [
      "briefcase","chart","graph","analytics","report","presentation","target","bullseye","goal",
      "handshake","contract","invoice","balance","bank","office"
    ],
    exclude: []
  },
  "arrows": {
    keywords: [
      "arrow","chevron","caret","triangle","expand","collapse","sort","swap","shuffle","up","down","left","right"
    ],
    exclude: []
  },
  "symbols": {
    keywords: [
      "plus","minus","check","x","close","cross","alert","warning","info","question","asterisk",
      "hash","at","percent","copyright","trademark","registered","infinity","pi"
    ],
    exclude: []
  }
};

// Hardcoded categories (extracted from categories.ts)
const categories = [
  { name: "User Interface", id: "user-interface", order: 1 },
  { name: "Office", id: "office", order: 2 },
  { name: "Content", id: "content", order: 3 },
  { name: "Tech", id: "tech", order: 4 },
  { name: "Profile", id: "profile", order: 5 },
  { name: "Audio Video", id: "audio-video", order: 6 },
  { name: "Shopping", id: "shopping", order: 7 },
  { name: "Objects", id: "objects", order: 8 },
  { name: "Nature", id: "nature", order: 9 },
  { name: "Image", id: "image", order: 10 },
  { name: "Design / Development", id: "design-development", order: 11 },
  { name: "Travel", id: "travel", order: 12 },
  { name: "Homegoods", id: "homegoods", order: 13 },
  { name: "Food & Drink", id: "food-drink", order: 14 },
  { name: "Buildings & Places", id: "buildings-places", order: 15 },
  { name: "Rewards", id: "rewards", order: 16 },
  { name: "Activities", id: "activities", order: 17 },
  { name: "Health & Science", id: "health-science", order: 18 },
  { name: "Business", id: "business", order: 19 },
  { name: "Arrows", id: "arrows", order: 20 },
  { name: "Symbols", id: "symbols", order: 21 }
];

// Categorize an icon based on its name and rules
function categorizeIcon(iconName, categoryRules) {
  const name = iconName.toLowerCase();
  
  // Score each category based on keyword matches
  const categoryScores = {};
  
  for (const [categoryId, rules] of Object.entries(categoryRules)) {
    let score = 0;
    
    // Check keywords
    for (const keyword of rules.keywords || []) {
      if (name.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    
    // Check excludes (negative scoring)
    for (const exclude of rules.exclude || []) {
      if (name.includes(exclude.toLowerCase())) {
        score -= 2; // Heavy penalty for excluded terms
      }
    }
    
    if (score > 0) {
      categoryScores[categoryId] = score;
    }
  }
  
  // Return the category with the highest score
  if (Object.keys(categoryScores).length === 0) {
    return 'symbols'; // Default fallback category
  }
  
  return Object.keys(categoryScores).reduce((a, b) => 
    categoryScores[a] > categoryScores[b] ? a : b
  );
}

function generateIconList() {
  try {
    // Check if the icons directory exists
    if (!fs.existsSync(ICONS_DIR)) {
      console.error(`❌ Icons directory not found: ${ICONS_DIR}`);
      process.exit(1);
    }

    // Use hardcoded category rules and categories
    console.log('📋 Using hardcoded category rules and categories');

    // Read all files in the directory
    const files = fs.readdirSync(ICONS_DIR);
    
    // Filter for SVG files and extract names with categorization
    const iconNames = files
      .filter(file => file.endsWith('.svg'))
      .map(file => {
        // Remove .svg extension and convert to a clean name
        const name = file.replace('.svg', '');
        const categoryId = categorizeIcon(name, categoryRules);
        const category = categories.find(cat => cat.id === categoryId);
        
        return {
          id: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          filename: file,
          name: name,
          // Convert filename to a more readable format
          displayName: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          // Create a slug for URLs/IDs
          slug: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          format: 'svg',
          category: category ? category.name : 'Symbols',
          categoryId: categoryId,
          filePath: `/icons/line/${file}`,
          tags: [],
          synonyms: [],
          description: `${name.replace(/-/g, ' ')} icon`
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // Generate category statistics
    const categoryStats = {};
    iconNames.forEach(icon => {
      const catName = icon.category;
      categoryStats[catName] = (categoryStats[catName] || 0) + 1;
    });

    // Generate the JavaScript content
    const jsContent = `// Auto-generated icon list from /public/icons/line directory
// Generated on: ${new Date().toISOString()}
// Total icons: ${iconNames.length}
// Categories: ${Object.keys(categoryStats).length}

export const generatedIcons = ${JSON.stringify(iconNames, null, 2)};

// Helper functions
export const getIconByName = (name) => {
  return generatedIcons.find(icon => icon.name === name);
};

export const getIconsByCategory = (category) => {
  return generatedIcons.filter(icon => icon.category === category);
};

export const getIconsByCategoryId = (categoryId) => {
  return generatedIcons.filter(icon => icon.categoryId === categoryId);
};

export const searchIcons = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return generatedIcons.filter(icon => 
    icon.name.toLowerCase().includes(lowercaseQuery) ||
    icon.displayName.toLowerCase().includes(lowercaseQuery) ||
    icon.category.toLowerCase().includes(lowercaseQuery) ||
    icon.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Available categories with counts
export const categories = ${JSON.stringify(Object.entries(categoryStats).map(([name, count]) => ({
  name,
  count,
  id: name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
})).sort((a, b) => b.count - a.count), null, 2)};

// Export icon names as a simple array for easy use
export const iconNames = generatedIcons.map(icon => icon.name);

// Export display names
export const iconDisplayNames = generatedIcons.map(icon => icon.displayName);

// Category statistics
export const categoryStatistics = ${JSON.stringify(categoryStats, null, 2)};
`;

    // Write the file
    fs.writeFileSync(OUTPUT_FILE, jsContent, 'utf8');
    
    console.log('✅ Icon list generated successfully!');
    console.log(`📁 Source directory: ${ICONS_DIR}`);
    console.log(`📄 Output file: ${OUTPUT_FILE}`);
    console.log(`🎯 Total icons: ${iconNames.length}`);
    console.log(`📂 Categories: ${Object.keys(categoryStats).length}`);
    
    console.log('\n📊 Category breakdown:');
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} icons`);
      });

    console.log('\n🚀 Usage examples:');
    console.log('   import { generatedIcons, getIconByName, searchIcons } from "@/data/generated-icons";');
    console.log('   import { iconNames, categories, categoryStatistics } from "@/data/generated-icons";');

  } catch (error) {
    console.error('❌ Error generating icon list:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateIconList();
}

module.exports = { generateIconList };
