#!/usr/bin/env bash

###############################################################################
# Test Suite 1: Commit Size Validation (13 tests)
#
# Tests the validate-commit-size.js script to ensure proper enforcement of:
# - File count limits (max 15 files)
# - Total line limits (400 hard, 300 warning)
# - Per-file line limits (200 hard, 150 warning)
# - Exclusion patterns (lock files, docs, scripts, configs)
# - Edge cases (exactly at limits)
# - Warning vs error thresholds
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

  # Test 1.3: Large file (250 lines, max 200)
  test_start "Large file (250 lines, max 200) should be rejected"
  yes "test line" | head -n 250 > large_file.txt
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

  # Test 1.7: Valid commit (10 files, each 30 lines = 300 total)
  test_start "Valid commit (10 files, 30 lines each) should pass"
  for i in {1..10}; do
    yes "test line" | head -n 30 > "valid_file_$i.txt"
    git add "valid_file_$i.txt"
  done
  if git commit -m "test(ci): valid commit" > /dev/null 2>&1; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "Valid commit was rejected"
  fi
  rm -f valid_file_*.txt

  # Test 1.8: Edge case - exactly 15 files (each 20 lines = 300 total)
  test_start "Edge case: exactly 15 files should pass"
  for i in {1..15}; do
    yes "test line" | head -n 20 > "edge_file_$i.txt"
    git add "edge_file_$i.txt"
  done
  if git commit -m "test(ci): edge case 15 files" > /dev/null 2>&1; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "15 files should be allowed"
  fi
  rm -f edge_file_*.txt

  # Test 1.9: Edge case - exactly 200 lines per file (at limit)
  test_start "Edge case: exactly 200 lines should pass"
  yes "test line" | head -n 200 > edge_200.txt
  git add edge_200.txt
  if git commit -m "test(ci): edge case 200 lines" > /dev/null 2>&1; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "200 lines should be allowed"
  fi
  rm -f edge_200.txt

  # Test 1.10: Warning - 150-199 lines per file (non-blocking)
  test_start "Warning: 175 lines per file should pass with warning"
  yes "test line" | head -n 175 > warning_file.txt
  git add warning_file.txt
  if git commit -m "test(ci): warning threshold test" 2>&1 | grep -q "⚠️"; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "Should have shown warning"
  fi
  rm -f warning_file.txt

  # Test 1.11: Error - 201 lines per file (minimal over limit)
  test_start "Error: 201 lines per file should be rejected"
  yes "test line" | head -n 201 > error_file.txt
  git add error_file.txt
  if git commit -m "test(ci): per-file error test" 2>&1 | grep -q "exceed line limit"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f error_file.txt

  # Test 1.12: Warning - 300-400 total lines (non-blocking)
  test_start "Warning: 350 total lines should pass with warning"
  for i in {1..7}; do
    yes "test line" | head -n 50 > "total_warning_$i.txt"
    git add "total_warning_$i.txt"
  done
  if git commit -m "test(ci): total warning test" 2>&1 | grep -q "⚠️.*Total lines approaching"; then
    test_pass
    git reset --soft HEAD~1 2>/dev/null || true
  else
    test_fail "Should have shown total lines warning"
  fi
  rm -f total_warning_*.txt

  # Test 1.13: Error - 400+ total lines (blocking)
  test_start "Error: 450 total lines should be rejected"
  for i in {1..9}; do
    yes "test line" | head -n 50 > "total_error_$i.txt"
    git add "total_error_$i.txt"
  done
  if git commit -m "test(ci): total error test" 2>&1 | grep -q "Total lines exceed limit"; then
    test_pass
  else
    test_fail "Should have been rejected"
  fi
  git reset > /dev/null 2>&1
  rm -f total_error_*.txt
}
