#!/usr/bin/env bash

###############################################################################
# Test Suite 4: Pre-commit Speed (1 test)
#
# Tests the pre-commit hook performance to ensure:
# - Pre-commit hooks complete in < 5 seconds
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
