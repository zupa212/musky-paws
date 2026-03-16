#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")/.."

LOG_FILE="/tmp/musky-paws-autopush.log"
timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

{
  echo "[$timestamp] Auto-push tick started."

  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[$timestamp] Not a git repository. Skipping."
    exit 0
  fi

  branch="$(git branch --show-current || true)"
  if [ -z "$branch" ]; then
    echo "[$timestamp] Could not detect branch. Skipping."
    exit 0
  fi

  name="$(git config --get user.name || true)"
  email="$(git config --get user.email || true)"
  if [ -z "$name" ] || [ -z "$email" ]; then
    echo "[$timestamp] Missing git user.name/user.email. Set them once and retry."
    exit 0
  fi

  git add -A

  if ! git diff --cached --quiet; then
    commit_message="chore: auto-sync $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$commit_message"
    echo "[$timestamp] New commit created."
  fi

  # Always try to push if we are ahead of origin
  if [ -n "$(git status -sb | grep 'ahead')" ] || [ -n "$(git diff origin/"$branch".."$branch")" ]; then
    echo "[$timestamp] Pushing changes to origin '$branch'..."
    if git push -u origin "$branch"; then
      echo "[$timestamp] Auto-push success."
    else
      echo "[$timestamp] Auto-push failed (possibly credentials or network)."
    fi
  else
    echo "[$timestamp] Everything up to date. No push needed."
  fi
} >>"$LOG_FILE" 2>&1
