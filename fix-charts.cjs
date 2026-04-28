const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(pagesDir, (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Task 2: Fix Chart Heights
    // Find flex-1 min-h-0 wrapper around ResponsiveContainer
    content = content.replace(/<div className="flex-1 min-h-0">\s*<ResponsiveContainer/g, '<div className="w-full h-[250px] min-h-[200px] flex-1 mt-4">\n              <ResponsiveContainer');

    // Also replace glass-card widget wrapper if it matches the standard pattern
    // from: <div className="glass-card h-full flex flex-col overflow-hidden p-[...]">
    // or similar standard wrappers.
    content = content.replace(/<div className="glass-card h-full flex flex-col overflow-hidden p-[a-z0-9-]+">/g, 
      '<div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col w-full h-full overflow-hidden hover:shadow-md transition-shadow group">');

    // Replace the old drag handle:
    // <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
    //   <GripHorizontal size={16} className="text-muted-foreground/30" />
    // </div>
    const oldDragHandleRegex = /<div className="drag-handle absolute top-2 left-1\/2 -translate-x-1\/2 opacity-0 group-hover:opacity-100 transition-opacity">\s*<GripHorizontal size=\{16\} className="text-muted-foreground\/30" \/>\s*<\/div>/g;
    
    // The new one has GripHorizontalIcon, but let's just use GripHorizontal since it's already imported.
    const newDragHandle = `<div className="drag-handle h-6 w-full cursor-grab active:cursor-grabbing flex items-center justify-center bg-transparent group-hover:bg-muted/30 transition-colors shrink-0">
              <GripHorizontal className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
            </div>
            <div className="px-6 pb-6 flex-1 flex flex-col overflow-y-auto">`;

    if (oldDragHandleRegex.test(content)) {
       content = content.replace(oldDragHandleRegex, newDragHandle);
       
       // Now we need to close the extra div added by the new drag handle at the end of the widget.
       // The old widget structure was:
       // <div className="glass-card ...">
       //   <div className="drag-handle ..."> ... </div>
       //   ... content ...
       // </div>
       // We replaced the drag-handle with the new handle + OPENING the padded area: <div className="px-6 ...">
       // So right before the closing </div> of the widget (which is followed by </div> for the grid item), we need an extra </div>.
       // This is tricky with regex. Let's do it manually on the files instead to be safe, or just do it via exact replacement.
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated charts in: ${path.basename(filePath)}`);
    }
  }
});
