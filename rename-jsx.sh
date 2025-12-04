#!/bin/bash

echo "🔍 Scanning for .js files with JSX syntax..."

# Step 1: Rename .js files with JSX to .jsx
find src -name "*.js" -exec grep -l "<[A-Za-z]" {} \; | while read file; do
  newfile="${file%.js}.jsx"
  echo "Renaming $file -> $newfile"
  mv "$file" "$newfile"
done

echo "✅ Renaming complete."

# Step 2: Update imports (replace .js with .jsx)
echo "🔧 Updating imports..."
find src -type f \( -name "*.js" -o -name "*.jsx" \) | while read file; do
  sed -i '' 's/\.js'\''/.jsx'\''/g; s/\.js"/.jsx"/g' "$file"
done

echo "🎉 All done! Files renamed and imports fixed."

# execute this by
# chmod +x rename-jsx.sh
# ./rename-jsx.sh