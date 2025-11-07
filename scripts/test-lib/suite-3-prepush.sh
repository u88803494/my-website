#!/usr/bin/env bash

###############################################################################
# Test Suite 3: Pre-push Validation (3 tests)
#
# Tests the pre-push hooks to ensure proper enforcement of:
# - TypeScript type checking
# - ESLint validation
# - Valid code acceptance
###############################################################################

test_suite_3() {
  echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}"
  echo -e "${YELLOW}  Suite 3: Pre-push Validation${NC}"
  echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"

  log_warning "Note: Pre-push tests simulate hooks without actual push"

  # Test 3.1: Type error should block
  test_start "TypeScript type error should block push"
  mkdir -p apps/my-website/src/test
  cat > apps/my-website/src/test/type-error.ts << 'EOF'
const num: string = 123; // Type error
EOF
  git add apps/my-website/src/test/type-error.ts
  git commit -m "test(ci): Type error test" > /dev/null 2>&1

  # Run type check (simulating pre-push hook)
  if ! pnpm run check-types > /dev/null 2>&1; then
    test_pass
  else
    test_fail "Type error was not caught"
  fi

  git reset --soft HEAD~1 2>/dev/null || true
  rm -rf apps/my-website/src/test

  # Test 3.2: ESLint error should block
  test_start "ESLint error should block push"
  mkdir -p apps/my-website/src/test
  cat > apps/my-website/src/test/lint-error.ts << 'EOF'
console.log("test"); // ESLint warning (treated as error)
EOF
  git add apps/my-website/src/test/lint-error.ts
  git commit -m "test(ci): Lint error test" > /dev/null 2>&1

  # Run lint (simulating pre-push hook)
  if ! pnpm run lint > /dev/null 2>&1; then
    test_pass
  else
    test_fail "Lint error was not caught"
  fi

  git reset --soft HEAD~1 2>/dev/null || true
  rm -rf apps/my-website/src/test

  # Test 3.3: Valid code should pass
  test_start "Valid code should pass pre-push checks"
  mkdir -p apps/my-website/src/test
  cat > apps/my-website/src/test/valid.ts << 'EOF'
export const valid = "This is valid TypeScript";
EOF
  git add apps/my-website/src/test/valid.ts
  git commit -m "test(ci): Valid code test" > /dev/null 2>&1

  # Run checks (simulating pre-push hook)
  if pnpm run check-types > /dev/null 2>&1; then
    test_pass
  else
    test_fail "Valid code was rejected"
  fi

  git reset --soft HEAD~1 2>/dev/null || true
  rm -rf apps/my-website/src/test
}
