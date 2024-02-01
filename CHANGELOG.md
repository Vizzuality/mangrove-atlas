# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## v0.1.0

<!-- Unreleased

### Added


### Changed


### Fixed


### Removed -->

Unreleased

### Added
- New animated widget to have access to widgets deck


### Changed

- New params to URL. Layer and widget id stored in URL independently
- Custom language selector
- New (fixed) navigation bar for app tool
- Restyle of the whole interface
- Widgets deck added
- Planet layers separate from the rest of contextual layers
- New legend with functionality for layers
- Edit function for custom areas removed
- New cursor to map for interactive layers

### Fixed


### Removed
- Print report
- Highlighted places


Released 25/09/2023

### Added

- Blog post tags


### Changed

- Access to Blog (news) moved from main menu to sidebar
- Access to different tools simplified (menu, language, blog and user guide)

### Fixed

- Blurry images in blog section

### Removed

- Link to subsections in Global Mangrove Alliance

Released 23/08/2023

### Added

- Blog content and images

 # test
    - Expand / collapse widgets interactivity
    - Menu categories interactivity
    - Drawing tool flow

### Changed
- Gobal Tidal Wetland Change layer
- Categories added to url with router instead of recoil
- Google Analytics tag
- Max Zoom level in planet Imagery contextual layers
- Blog post modal height


### Fixed
 - IUCN Ecoregion tooltip position
 - Duplicated layers for extent and restoration


### Removed


Released 26/07/2023

### Added
- React query
- Radix UI
- Playwright for testing
- Tests
- Species by country widget
- Species distribution widget
- Protection layer
- Potential benefit to fisheries widget (restoration)
- Driver of change widget
- New language selector
- Restoration sites widget and filters
- National Dashboard widget
- Mangrove fisheries widget
- Contextual layers 
    - selector
    - Allen coral atlas
    - Global tidal wetland change
    - Tidal flats
- Flood protection widget
- Data application guide added to widgets
- Blog - Communications section
- User guide

### Changed

- Migration from create react app to Next 13
- Migration to TS
- Migration fom styled components to Tailwind
- Migration from redux to Recoil
- Protection widget
- Restoration sites layer
- Satellite basemap selector
- Mangrove alerts
    - Alerts frequency layer improvement
    - New chart added
    - New layer for locations monitored added

### Fixed

- Bug in biomass widget
- Bug in alerts layer
- Bug in info links for some widgets

### Removed
- Sagas
- Storybook
