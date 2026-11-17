#!/usr/bin/env bash
# Example: protect the `production` branch with the GitHub CLI (needs admin rights on the repo).
# Usage: ./protect-production-branch.sh owner/repo
# Check names must match the job names in .github/workflows/ci.yml; adjust after the first PR run.
set -euo pipefail
REPO="${1:?usage: $0 owner/repo}"
gh api -X PUT "repos/${REPO}/branches/production/protection" --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["verify", "audit", "docker (api)", "docker (web)"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "require_code_owner_reviews": true,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
echo "Branch protection applied to ${REPO}:production"
