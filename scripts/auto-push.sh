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

  if git diff --cached --quiet; then
    echo "[$timestamp] No changes to commit."
    exit 0
  fi

  commit_message="chore: auto-sync $(date '+%Y-%m-%d %H:%M:%S')"
  git commit -m "$commit_message"
  git push -u origin "$branch"

  echo "[$timestamp] Auto-push success on branch '$branch'."
} >>"$LOG_FILE" 2>&1
