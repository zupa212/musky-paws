#!/bin/bash
cd "$(dirname "$0")"

# Ensure we have access to npm/node when running in the background (LaunchAgent)
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  source "$HOME/.nvm/nvm.sh"
fi

echo "🐾 Musky Paws Auto-Starter"
echo "--------------------------"

# Step 1: Kill any existing node/next processes to free up ports
echo "🧹 Killing stuck processes..."
pkill -f "next-dev"
pkill -f "node"

# Step 2: Remove lock files
echo "🔐 Clearing locks..."
rm -f .next/dev/lock
rm -f /Users/xupi/package-lock.json 2>/dev/null

# Step 3: Sync changes (Automatic)
echo "🔄 Syncing with GitHub..."
git pull origin master 2>/dev/null
git push origin master 2>/dev/null

# Step 4: Start the server
echo "🚀 Starting server on http://localhost:3030 ..."
npm run dev
