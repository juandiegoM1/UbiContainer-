#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

npm ci
npm run test:frontend

# These fallbacks allow Jenkins to verify compilation without production credentials.
export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://build.invalid}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-frontend-build-placeholder}"
export NEXT_PUBLIC_MAPBOX_TOKEN="${NEXT_PUBLIC_MAPBOX_TOKEN:-pk.frontend-build-placeholder}"
npm run build
