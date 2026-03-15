#!/bin/bash
set -euo pipefail

PLIST_NAME="com.muskypaws.autopush.plist"
AGENT_ID="gui/$(id -u)/com.muskypaws.autopush"
DST_PLIST="$HOME/Library/LaunchAgents/$PLIST_NAME"

launchctl bootout "$AGENT_ID" >/dev/null 2>&1 || true
launchctl disable "$AGENT_ID" >/dev/null 2>&1 || true
rm -f "$DST_PLIST"

echo "Auto-push disabled."
echo ""
echo "Press any key to close."
read -n 1
