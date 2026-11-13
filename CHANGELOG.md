# Changelog

## 2026-11-13

### Added
- Added NASA's 2026 lunar South Pole preview image and a research library linking DONKI, RadLab, OSDR, Moon Trek, and Mars Trek with clear scope/limitations.\n- Added a short commander-training stage before pre-flight authorization and launch; the briefing does not consume a mission day.
- Added a NASA 2026 lunar South Pole illumination reference in training, with clear separation between sourced environmental context and illustrative gameplay values.

### Added
- Reworked the core storyline into a focused three-day lunar survival mission.
- Added three connected challenges: power and oxygen, solar storm protection, and water and food supplies.
- Added a live command task bar with four mission objectives.
- Added crew communication comic panels before daily decisions and between mission days.
- Added NOVA, a science-focused companion that gives hints without choosing for the player.
- Added XP rewards, lifetime XP tracking, and hidden achievement challenges for strong resource margins.
- Expanded the final report with the three-day decision log and reward summary.

### Improved
- Corrected mission reporting when a critical reserve ends the expedition early.
- Reset task-bar status when replaying and aligned progress with completed daily decisions.
- Added lifetime XP to the mission telemetry panel and removed outdated five-day copy.
- Updated mission briefing, duration labels, and project documentation to match the three-day experience.
- Kept task objectives pending until the mission is launched.
- Corrected lifetime XP display after a mission is completed.

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
