#!/bin/bash
cd "$(dirname "$0")"
echo "🐾 Musky Paws Sync Tool"
echo "-----------------------"
echo "🚀 Pushing changes to GitHub..."
git push origin master
echo "-----------------------"
echo "✅ Done! Press any key to close."
read -n 1
