#!/usr/bin/env bash
# One-time Cloudflare Pages setup for headway-nursing.
# Requires: wrangler logged in OR CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID in env.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROJECT="headway-nursing"

echo "==> Build check"
npm ci
npm run build

echo "==> Create Pages project (no-op if it already exists)"
npx wrangler pages project create "$PROJECT" --production-branch=main 2>/dev/null || true

echo "==> Deploy preview"
npx wrangler pages deploy dist --project-name="$PROJECT" --branch=main

echo
echo "Done. Next:"
echo "  1. Cloudflare dashboard → Workers & Pages → $PROJECT → Custom domains"
echo "  2. GitHub repo → Settings → Secrets → add CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID"
echo "  3. Optional: copy PUBLIC_* vars from .env.example into GitHub Actions secrets"
echo "  4. Push to main — .github/workflows/deploy.yml handles future deploys"
