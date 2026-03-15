#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")/.."

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository."
  exit 1
fi

branch="$(git branch --show-current)"

if [ -z "$branch" ]; then
  echo "Could not detect the current branch."
  exit 1
fi

message="${*:-}"

if [ -z "$message" ] && [ -t 0 ]; then
  read -r -p "Commit message (leave empty for auto message): " message
fi

if [ -z "$message" ]; then
  message="chore: sync $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "Repository: $(pwd)"
echo "Branch: $branch"

git add -A

if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  git commit -m "$message"
fi

echo "Pushing to origin/$branch ..."
git push -u origin "$branch"

echo "Sync complete."
