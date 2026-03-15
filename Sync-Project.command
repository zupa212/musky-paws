#!/bin/bash
cd "$(dirname "$0")"
echo "🐾 Musky Paws Sync Tool"
echo "-----------------------"
./scripts/git-sync.sh "$@"
echo "-----------------------"
echo "✅ Done! Press any key to close."
read -n 1
