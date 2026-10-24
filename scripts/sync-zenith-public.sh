#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ZENITH="${ZENITH_GROWTH_ROOT:-$HOME/Downloads/zenithgrowth}"

if [[ ! -d "$ZENITH/public/main" ]]; then
  echo "Missing $ZENITH/public/main — set ZENITH_GROWTH_ROOT" >&2
  exit 1
fi

rsync -a --delete "$ZENITH/public/main/" "$ROOT/public/main/"
mkdir -p "$ROOT/public/photos"
if [[ -d "$ZENITH/storage/app/public/photos" ]]; then
  rsync -a "$ZENITH/storage/app/public/photos/" "$ROOT/public/photos/"
fi
echo "Synced public/main and public/photos from $ZENITH"
