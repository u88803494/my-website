# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Time Tracker Weekly Statistics** - New dedicated Weekly Stats tab with card-based layout showing time distribution by activity type
- **Tracking Start Date Display** - Added tracking start time information in statistics summary (shows date of first record)
- **Improved Statistics Cards** - Enhanced visual design for statistics display with better spacing and organization

### Changed

- **Simplified Statistics Interface** - Removed daily average calculations to focus on weekly and total statistics
- **Tab Structure Reorganization** - Renamed "Detailed" statistics to "All Stats" for better clarity
- **Weekly Statistics Layout** - Migrated from list format to card-based display for better visual hierarchy

### Removed

- **Daily Average Utilities** - Removed unused daily average calculation functions and related display logic
- **Redundant Statistical Displays** - Cleaned up redundant daily average displays from statistics interface

### Technical Improvements

- Consistent commit message formatting following conventional commits standard
- Modular component architecture with separated concerns
- Enhanced TypeScript type safety for statistics calculations
- Better error handling and empty state management

## Previous Versions

For changes prior to this version, please refer to the git commit history.
