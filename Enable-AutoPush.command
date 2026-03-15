#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

PLIST_NAME="com.muskypaws.autopush.plist"
SRC_PLIST="$PWD/$PLIST_NAME"
DST_DIR="$HOME/Library/LaunchAgents"
DST_PLIST="$DST_DIR/$PLIST_NAME"

mkdir -p "$DST_DIR"
cp "$SRC_PLIST" "$DST_PLIST"
chmod 644 "$DST_PLIST"
chmod +x "$PWD/scripts/auto-push.sh"

if [ -z "$(git config --local --get user.name || true)" ]; then
  git config --local user.name "$(id -un)"
fi

if [ -z "$(git config --local --get user.email || true)" ]; then
  git config --local user.email "$(id -un)@local"
fi

launchctl bootout "gui/$(id -u)/com.muskypaws.autopush" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$DST_PLIST"
launchctl enable "gui/$(id -u)/com.muskypaws.autopush"
launchctl kickstart -k "gui/$(id -u)/com.muskypaws.autopush"

echo "Auto-push enabled. It runs every 3 minutes."
echo "Logs:"
echo "  /tmp/musky-paws-autopush.log"
echo "  /tmp/musky-paws-autopush-launchd-out.log"
echo "  /tmp/musky-paws-autopush-launchd-err.log"
echo ""
echo "Press any key to close."
read -n 1
