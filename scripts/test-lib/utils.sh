#!/usr/bin/env bash

###############################################################################
# Shared Utilities for Git Hooks Testing
#
# This file contains:
# - Color definitions
# - Shared state variables
# - Log and test tracking functions
# - Setup and cleanup functions
###############################################################################

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
# Log Functions
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
