#!/bin/bash
cd "$(dirname "$0")"

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

# Step 3: Start the server
echo "🚀 Starting server on http://localhost:3010 ..."
npm run dev
