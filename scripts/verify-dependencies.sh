#!/bin/bash

# Verify all packages use consistent React versions
echo "🔍 Verifying dependency versions across workspace..."

EXPECTED_REACT="19.2.3"
EXPECTED_REACT_QUERY="5.84.1"

# Check React versions
echo ""
echo "📦 Checking React versions..."
REACT_VERSIONS=$(pnpm list react --depth=0 -r --json | jq -r '.[] | select(.dependencies.react) | "\(.name): \(.dependencies.react.version)"')

if echo "$REACT_VERSIONS" | grep -v "$EXPECTED_REACT" > /dev/null; then
  echo "❌ ERROR: Found inconsistent React versions!"
  echo "$REACT_VERSIONS"
  exit 1
else
  echo "✅ All packages use React $EXPECTED_REACT"
fi

# Check React Query instance
echo ""
echo "📦 Checking React Query instances..."
RQ_INSTANCES=$(find node_modules/.pnpm -name "react-query" -type l 2>/dev/null | xargs readlink | sort -u | wc -l)

if [ "$RQ_INSTANCES" -gt 1 ]; then
  echo "❌ ERROR: Found $RQ_INSTANCES different React Query instances!"
  find node_modules/.pnpm -name "react-query" -type l 2>/dev/null | xargs readlink | sort -u
  exit 1
else
  echo "✅ Single React Query instance across workspace"
fi

echo ""
echo "✅ All dependency versions are consistent!"
