# Changelog

## 2026-11-12

### Added
- Separated the page structure, styling, and simulation logic into dedicated files.
- Added Training, Standard, and Expert difficulty settings.
- Added a randomized optional side objective for each mission.
- Added mission achievements and a detailed final debrief.
- Added locally saved personal-best score and completed-mission count.
- Added keyboard-focus styling and a live announcement region for mission updates.
- Added a GitHub Actions workflow for JavaScript syntax and required-asset checks.
- Added a web app manifest and a service worker that caches core assets for offline revisits.
- Added a live online/offline connection indicator.

### Improved
- Corrected safe HTML escaping for the commander callsign and decision log.
- Prevented the final report from recording the same mission more than once.
- Expanded project documentation and clarified the educational simulation scope.
