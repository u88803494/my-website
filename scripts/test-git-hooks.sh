#!/usr/bin/env bash

###############################################################################
# Git Hooks Test Automation Script
#
# This script automatically tests all git hooks (pre-commit, commit-msg,
# pre-push) by creating a temporary test branch and running 22 test cases.
#
# Test Suites:
#   1. Commit Size Validation (9 tests)
#   2. Commitlint Validation (7 tests)
#   3. Pre-push Validation (3 tests)
#   4. Pre-commit Speed (1 test)
#   5. Bypass Mechanisms (2 tests)
#
# Usage:
#   ./scripts/test-git-hooks.sh
#
# Exit codes:
#   0 - All tests passed
#   1 - One or more tests failed
###############################################################################

set -e  # Exit on error (but we'll handle errors in tests)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Current state tracking
ORIGINAL_BRANCH=""
TEST_BRANCH="test-git-hooks-$(date +%s)"
STASH_NAME="test-git-hooks-stash-$(date +%s)"
HAD_STASH=false

###############################################################################
# Utility Functions
###############################################################################

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

test_start() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  echo -e "\n${CYAN}Test $TOTAL_TESTS:${NC} $1"
}

test_pass() {
  PASSED_TESTS=$((PASSED_TESTS + 1))
  echo -e "${GREEN}✅ PASS${NC}"
}

test_fail() {
  FAILED_TESTS=$((FAILED_TESTS + 1))
  echo -e "${RED}❌ FAIL${NC}: $1"
}

###############################################################################
# Setup & Teardown
###############################################################################

setup() {
  log_info "Setting up test environment..."

  # Check if we're in git repo
  if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    log_error "Not in a git repository"
    exit 1
  fi

  # Save current branch
  ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  log_info "Current branch: $ORIGINAL_BRANCH"

  # Stash any uncommitted changes
  if ! git diff --quiet || ! git diff --cached --quiet; then
    log_warning "Stashing uncommitted changes..."
    git stash push -u -m "$STASH_NAME" > /dev/null 2>&1
    HAD_STASH=true
  fi

  # Create and checkout test branch
  log_info "Creating test branch: $TEST_BRANCH"
  git checkout -b "$TEST_BRANCH" > /dev/null 2>&1

  log_success "Test environment ready"
}

cleanup() {
  log_info "Cleaning up test environment..."

  # Reset any staged/unstaged changes
  git reset --hard > /dev/null 2>&1
  git clean -fd > /dev/null 2>&1

  # Return to original branch
  git checkout "$ORIGINAL_BRANCH" > /dev/null 2>&1 || true

  # Delete test branch
  git branch -D "$TEST_BRANCH" > /dev/null 2>&1 || true

  # Restore stashed changes if any
  if [ "$HAD_STASH" = true ]; then
    if git stash list | grep -q "$STASH_NAME"; then
      log_info "Restoring stashed changes..."
      git stash pop > /dev/null 2>&1
    fi
  fi

  log_success "Cleanup complete"
}

# Set up trap for cleanup
trap cleanup EXIT INT TERM

###############################################################################
# Test Suite 1: Commit Size Validation (9 tests)
###############################################################################

test_suite_1() {
  echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}"
  echo -e "${YELLOW}  Suite 1: Commit Size Validation${NC}"
  echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"

  # Test 1.1: Lock file should be excluded
  test_start "Lock file (9590 lines) should be excluded"
  echo "# Mock lock file" > pnpm-lock.yaml
  yes "mock line" | head -n 9590 >> pnpm-lock.yaml
  git add pnpm-lock.yaml
  if git commit -m "test(ci): add lock file" 2>&1 | grep -q "Skipping (excluded)"; then
    test_pass
  else
    test_fail "Lock file was not excluded"
  fi
  git reset --soft HEAD~1 2>/dev/null || true
  rm -f pnpm-lock.yaml

  # Test 1.2: Too many files (20 files, max 15)
  test_start "Too many files (20 files, max 15) should be rejected"
  for i in {1..20}; do
    echo "test" > "test_file_$i.txt"
    git add "test_file_$i.txt"
  done
  if git commit -m "test(ci): too many files" 2>&1 | grep -q "Too many files"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f test_file_*.txt

  # Test 1.3: Large file (600 lines, max 500)
  test_start "Large file (600 lines, max 500) should be rejected"
  yes "test line" | head -n 600 > large_file.txt
  git add large_file.txt
  if git commit -m "test(ci): large file" 2>&1 | grep -q "exceed line limit"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f large_file.txt

  # Test 1.4: Root README.md should be excluded
  test_start "Root README.md should be excluded"
  echo "# Test" > README.md
  git add README.md
  if git commit -m "test(docs): update readme" 2>&1 | grep -q "Skipping (excluded)"; then
    test_pass
  else
    test_fail "README.md was not excluded"
  fi
  git reset --soft HEAD~1 2>/dev/null || true
  git restore README.md 2>/dev/null || true

  # Test 1.5: Script file should be excluded
  test_start "Script file should be excluded"
  echo "console.log('test')" > scripts/test-script.js
  git add scripts/test-script.js
  if git commit -m "test(ci): add script" 2>&1 | grep -q "Skipping (excluded)"; then
    test_pass
  else
    test_fail "Script was not excluded"
  fi
  git reset --soft HEAD~1 2>/dev/null || true
  rm -f scripts/test-script.js

  # Test 1.6: Config file should be excluded
  test_start "Config file should be excluded"
  echo "export default {}" > test.config.ts
  git add test.config.ts
  if git commit -m "test(ci): add config" 2>&1 | grep -q "Skipping (excluded)"; then
    test_pass
  else
    test_fail "Config file was not excluded"
  fi
  git reset --soft HEAD~1 2>/dev/null || true
  rm -f test.config.ts

  # Test 1.7: Valid commit (10 files, each 100 lines)
  test_start "Valid commit (10 files, 100 lines each) should pass"
  for i in {1..10}; do
    yes "test line" | head -n 100 > "valid_file_$i.txt"
    git add "valid_file_$i.txt"
  done
  if git commit -m "test(ci): valid commit" > /dev/null 2>&1; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "Valid commit was rejected"
  fi
  rm -f valid_file_*.txt

  # Test 1.8: Edge case - exactly 15 files
  test_start "Edge case: exactly 15 files should pass"
  for i in {1..15}; do
    echo "test" > "edge_file_$i.txt"
    git add "edge_file_$i.txt"
  done
  if git commit -m "test(ci): edge case 15 files" > /dev/null 2>&1; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "15 files should be allowed"
  fi
  rm -f edge_file_*.txt

  # Test 1.9: Edge case - exactly 500 lines
  test_start "Edge case: exactly 500 lines should pass"
  yes "test line" | head -n 500 > edge_500.txt
  git add edge_500.txt
  if git commit -m "test(ci): edge case 500 lines" > /dev/null 2>&1; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "500 lines should be allowed"
  fi
  rm -f edge_500.txt
}

###############################################################################
# Test Suite 2: Commitlint Validation (7 tests)
###############################################################################

test_suite_2() {
  echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}"
  echo -e "${YELLOW}  Suite 2: Commitlint Validation${NC}"
  echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"

  # Test 2.1: Missing type
  test_start "Missing type should be rejected"
  echo "test" > test.txt
  git add test.txt
  if git commit -m "add new feature" 2>&1 | grep -qi "type.*not.*empty\|subject.*not.*match"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f test.txt

  # Test 2.2: Invalid type
  test_start "Invalid type should be rejected"
  echo "test" > test.txt
  git add test.txt
  if git commit -m "invalid: add feature" 2>&1 | grep -qi "type.*must.*one.*of"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f test.txt

  # Test 2.3: Missing scope
  test_start "Missing scope should be rejected"
  echo "test" > test.txt
  git add test.txt
  if git commit -m "feat: add feature" 2>&1 | grep -qi "scope.*empty\|scope.*must.*provided"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f test.txt

  # Test 2.4: Invalid scope
  test_start "Invalid scope should be rejected"
  echo "test" > test.txt
  git add test.txt
  if git commit -m "feat(invalid-scope): add feature" 2>&1 | grep -qi "scope.*must.*one.*of"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f test.txt

  # Test 2.5: Subject too long (>72 characters)
  test_start "Subject too long (>72 chars) should be rejected"
  echo "test" > test.txt
  git add test.txt
  LONG_SUBJECT="This is a very long subject line that definitely exceeds seventy-two characters limit"
  if git commit -m "feat(ci): $LONG_SUBJECT" 2>&1 | grep -qi "subject.*exceed\|subject.*long"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f test.txt

  # Test 2.6: Subject ends with period
  test_start "Subject ending with period should be rejected"
  echo "test" > test.txt
  git add test.txt
  if git commit -m "feat(ci): Add new feature." 2>&1 | grep -qi "subject.*not.*end"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f test.txt

  # Test 2.7: Valid commit message
  test_start "Valid commit message should pass"
  echo "test" > test.txt
  git add test.txt
  if git commit -m "feat(ci): Add new feature" > /dev/null 2>&1; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "Valid commit was rejected"
  fi
  rm -f test.txt
}

###############################################################################
# Test Suite 3: Pre-push Validation (3 tests)
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

###############################################################################
# Test Suite 4: Pre-commit Speed (1 test)
###############################################################################

test_suite_4() {
  echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}"
  echo -e "${YELLOW}  Suite 4: Pre-commit Speed${NC}"
  echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"

  # Test 4.1: Pre-commit should complete in < 5 seconds
  test_start "Pre-commit should complete in < 5 seconds"
  echo "test" > test.txt
  git add test.txt

  START=$(date +%s)
  git commit -m "test(ci): Speed test" > /dev/null 2>&1
  END=$(date +%s)

  DURATION=$((END - START))

  if [ $DURATION -lt 5 ]; then
    test_pass
    echo "  Duration: ${DURATION}s"
  else
    test_fail "Pre-commit took ${DURATION}s (target: < 5s)"
  fi

  git reset --soft HEAD~1 2>/dev/null || true
  rm -f test.txt
}

###############################################################################
# Test Suite 5: Bypass Mechanisms (2 tests)
###############################################################################

test_suite_5() {
  echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}"
  echo -e "${YELLOW}  Suite 5: Bypass Mechanisms${NC}"
  echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"

  # Test 5.1: --no-verify should bypass commit hooks
  test_start "--no-verify should bypass pre-commit and commit-msg hooks"
  for i in {1..20}; do
    echo "test" > "bypass_test_$i.txt"
    git add "bypass_test_$i.txt"
  done

  if git commit --no-verify -m "invalid message without type" > /dev/null 2>&1; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "--no-verify didn't work"
  fi
  rm -f bypass_test_*.txt

  # Test 5.2: SKIP=validate-commit-size should bypass size check
  test_start "SKIP=validate-commit-size should bypass size validation"
  for i in {1..20}; do
    echo "test" > "skip_test_$i.txt"
    git add "skip_test_$i.txt"
  done

  if SKIP=validate-commit-size git commit -m "test(ci): Skip size check" > /dev/null 2>&1; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "SKIP didn't work"
  fi
  rm -f skip_test_*.txt
}

###############################################################################
# Report Generation
###############################################################################

print_summary() {
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}           TEST SUMMARY${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""
  echo "  Total Tests:   $TOTAL_TESTS"
  echo -e "  Passed:        ${GREEN}$PASSED_TESTS${NC}"
  echo -e "  Failed:        ${RED}$FAILED_TESTS${NC}"

  if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS * 100) / $TOTAL_TESTS}")
    echo "  Pass Rate:     ${PASS_RATE}%"
  fi

  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""

  if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo ""
    return 0
  else
    echo -e "${RED}❌ Some tests failed${NC}"
    echo ""
    return 1
  fi
}

###############################################################################
# Main Execution
###############################################################################

main() {
  echo ""
  echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║       Git Hooks Automated Test Suite                 ║${NC}"
  echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
  echo ""

  setup

  test_suite_1  # Commit Size Validation (9 tests)
  test_suite_2  # Commitlint Validation (7 tests)
  test_suite_3  # Pre-push Validation (3 tests)
  test_suite_4  # Pre-commit Speed (1 test)
  test_suite_5  # Bypass Mechanisms (2 tests)

  print_summary
}

# Run the test suite
main "$@"
