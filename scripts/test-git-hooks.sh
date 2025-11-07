#!/usr/bin/env bash

###############################################################################
# Git Hooks Test Automation Script
#
# This script automatically tests all git hooks (pre-commit, commit-msg,
# pre-push) by creating a temporary test branch and running 26 test cases.
#
# Test Suites:
#   1. Commit Size Validation (13 tests)
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

# Note: We don't use 'set -e' because tests intentionally trigger failures
# to verify hooks are working correctly

# Determine script directory for reliable module loading
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_LIB_DIR="$SCRIPT_DIR/test-lib"

# Source utilities and test suites
source "$TEST_LIB_DIR/utils.sh"
source "$TEST_LIB_DIR/suite-1-commit-size.sh"
source "$TEST_LIB_DIR/suite-2-commitlint.sh"
source "$TEST_LIB_DIR/suite-3-prepush.sh"
source "$TEST_LIB_DIR/suite-4-speed.sh"
source "$TEST_LIB_DIR/suite-5-bypass.sh"

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

# Trap cleanup on exit
trap cleanup EXIT INT TERM

# Run main function
main "$@"
