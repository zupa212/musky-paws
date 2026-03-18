#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

PLIST_NAME="com.muskypaws.dev.plist"
SRC_PLIST="$PWD/$PLIST_NAME"
DST_DIR="$HOME/Library/LaunchAgents"
DST_PLIST="$DST_DIR/$PLIST_NAME"

mkdir -p "$DST_DIR"
cp "$SRC_PLIST" "$DST_PLIST"
chmod 644 "$DST_PLIST"
chmod +x "$PWD/Start-Musky-Paws.command"

# Remove any existing instance
launchctl bootout "gui/$(id -u)/com.muskypaws.dev" >/dev/null 2>&1 || true

# Load the new instance
launchctl bootstrap "gui/$(id -u)" "$DST_PLIST"
launchctl enable "gui/$(id -u)/com.muskypaws.dev"
launchctl kickstart -k "gui/$(id -u)/com.muskypaws.dev"

echo "✅ Ο Server του Musky Paws τρέχει πλέον αυτόματα στο παρασκήνιο!"
echo "📍 Διεύθυνση: http://localhost:3030"
echo ""
echo "Μπορείτε να κλείσετε αυτό το παράθυρο και το site θα συνεχίσει να λειτουργεί."
echo "Πατήστε οποιοδήποτε πλήκτρο για έξοδο..."
read -n 1
