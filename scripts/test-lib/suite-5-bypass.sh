#!/usr/bin/env bash

###############################################################################
# Test Suite 5: Bypass Mechanisms (2 tests)
#
# Tests the bypass mechanisms to ensure proper functioning of:
# - --no-verify flag
# - SKIP environment variable
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
