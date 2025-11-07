#!/usr/bin/env bash

###############################################################################
# Test Suite 2: Commitlint Validation (7 tests)
#
# Tests the commitlint configuration to ensure proper enforcement of:
# - Required commit message format (type, scope, subject)
# - Valid types (feat, fix, docs, etc.)
# - Valid scopes (my-website, shared, ci, etc.)
# - Subject length limits (max 72 characters)
# - Subject formatting rules (no period at end, sentence-case)
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
