const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedCount = 0;

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    // Replace Tailwind purple classes with primary
    newContent = newContent.replace(/bg-purple-[1-9]00(\/[0-9]{1,3})?/g, (match) => {
      return match.replace(/bg-purple-[1-9]00/, 'bg-primary');
    });
    
    newContent = newContent.replace(/text-purple-[1-9]00(\/[0-9]{1,3})?/g, (match) => {
      return match.replace(/text-purple-[1-9]00/, 'text-primary');
    });
    
    newContent = newContent.replace(/border-purple-[1-9]00(\/[0-9]{1,3})?/g, (match) => {
      return match.replace(/border-purple-[1-9]00/, 'border-primary');
    });

    newContent = newContent.replace(/ring-purple-[1-9]00(\/[0-9]{1,3})?/g, (match) => {
      return match.replace(/ring-purple-[1-9]00/, 'ring-primary');
    });

    // Hex codes mapping (old purple to new primary)
    newContent = newContent.replace(/#8b5cf6/gi, 'var(--accent-primary)'); // Purple 500
    newContent = newContent.replace(/#a78bfa/gi, 'var(--accent-primary)'); // Purple 400
    newContent = newContent.replace(/#7c3aed/gi, 'var(--accent-primary)'); // Purple 600

    // glass-card and glass-card-hover
    // The class 'glass-card' is now just styled as a normal card in index.css, so it's fine.
    // 'glass-card-hover' might still exist. Let's leave them if they don't cause visual bugs.

    // bg-white/[opacity] in cards
    newContent = newContent.replace(/bg-white\/?\[?(0\.[0-9]+|[0-9]{1,2}%|0)\]?/g, 'bg-card');
    
    // border-white/[opacity]
    newContent = newContent.replace(/border-white\/?\[?(0\.[0-9]+|[0-9]{1,2}%|0)\]?/g, 'border-border');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated: ${filePath.replace(srcDir, '')}`);
      modifiedCount++;
    }
  }
});

console.log(`\nComplete! Modified ${modifiedCount} files.`);
