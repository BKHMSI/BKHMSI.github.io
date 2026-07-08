#!/usr/bin/env bash
#
# Build the site and deploy it to GitHub Pages.
#
# bkhmsi.github.io is served from the docs/ folder, so `npm run build`
# outputs there directly (see vite.config.ts). This script builds, commits
# the result, and pushes to the current branch.
#
# Usage:
#   ./deploy.sh                 # commit with a default timestamped message
#   ./deploy.sh "my message"    # commit with a custom message
#
set -euo pipefail

# Run from the repo root (the directory this script lives in).
cd "$(dirname "$0")"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
COMMIT_MSG="${1:-Deploy site $(date '+%Y-%m-%d %H:%M:%S')}"

echo "==> Building site (output -> docs/)..."
npm run build

echo "==> Staging changes..."
git add -A

if git diff --cached --quiet; then
  echo "==> Nothing to deploy — working tree is clean."
  exit 0
fi

echo "==> Committing: ${COMMIT_MSG}"
git commit -m "${COMMIT_MSG}"

echo "==> Pushing to origin/${BRANCH}..."
git push origin "${BRANCH}"

echo "==> Done. The site will update shortly at https://bkhmsi.github.io"
