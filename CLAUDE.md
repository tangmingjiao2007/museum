# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3-based museum exhibition system focusing on the digital display of Chinese anti-Japanese war history. The project integrates Amap (高德地图) API to provide interactive historical map functionality with data visualization capabilities.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version
- `npm run preview` - Preview production build locally

## Key Architecture

### Technology Stack
- **Frontend**: Vue 3 with Composition API (`<script setup>`)
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS
- **Map Services**: Amap API (高德地图)
- **Data Visualization**: ECharts, D3.js, Chart.js
- **3D Models**: Google Model Viewer

### Critical Configuration Files
- `src/config/amap.js` - Amap API configuration including authentication and plugin settings
- `vite.config.js` - Vite build configuration with path aliases (`@/` points to `src/`)
- `src/utils/resourcePath.js` - Utility for handling public resource paths and JSON loading

### Data Architecture
The application uses both `src/data/` and `public/data/` directories:
- **Historical Data**: `warData.js` contains 14-year anti-Japanese war timeline events
- **Geographic Data**: `china.json` provides geographic boundary data
- **Provincial Data**: Multiple `provinceWarHistory*.json` files contain detailed provincial war histories
- **Control Data**: `control_data.json` manages map interaction states

### Component Architecture
Components follow a functional organization:
- **Map Components**: `EChartsInteractiveChinaMap.vue` (primary interactive map), `WarBattleDataViz.vue`
- **Exhibition Components**: `ExhibitList.vue`, `WarExhibit.vue`, `WarExhibitDetail.vue`
- **Data Visualization**: `WarDataVisualization.vue`, `BattleStatistics.vue`
- **Specialized Exhibits**: `WarWeapons.vue`, `WarDailyItems.vue`, `WarArchitecture.vue`

### Routing Structure
The application uses Vue Router with dynamic imports:
- Main routes: `/` (home), `/exhibit`, `/war-exhibit`, `/war-data`
- Detail routes: `/war-detail/:id`, `/province/:id`, `/province/name/:name`
- Map routes: `/interactive-china-map`, `/war-map` (both point to EChartsInteractiveChinaMap)

## Amap Integration Requirements

### API Key Setup
The application requires a valid Amap API key configured in `src/config/amap.js`:
```javascript
export const AMAP_CONFIG = {
  key: 'YOUR_AMAP_KEY_HERE' // Must be replaced with actual key
}
```

### Amap Features
- Dynamic map loading with `loadAmapAPI()` function
- Static map URL generation with `generateStaticMapUrl()`
- Plugin-based architecture supporting Scale, OverView, ToolBar, MapType, Marker, InfoWindow
- Multiple map styles: normal, fresh, grey, graffiti, macaron, blue, darkblue, light

### Resource Management
- Use `getPublicResourcePath()` for consistent path handling
- Use `loadJsonResource()` for async JSON loading with error handling
- Public assets should be placed in `public/` directory and accessed with absolute paths

## Data Format Standards

### Historical Events
Timeline events in `warData.js` follow this structure:
```javascript
{
  id: number,
  date: 'YYYY-MM-DD',
  year: number,
  title: string,
  description: string,
  location: string,
  importance: 'critical' | 'major' | 'minor',
  category: 'invasion' | 'resistance' | 'strategic',
  casualties: string,
  significance: string,
  relatedArtifacts: string[],
  image: string // path in public/images/
}
```

### Map Data
Provincial war history data includes geographic coordinates, battle information, and temporal data for interactive map rendering.

## Development Notes

### Map Component Development
- The main map component uses ECharts for China map visualization
- Supports year-based filtering and province-level interaction
- Integrates with Amap for detailed location views
- Uses floating decorative elements for historical ambiance

### Asset Organization
- Images belong in `public/images/`
- Data files can be in either `src/data/` (for imports) or `public/data/` ( for fetch requests)
- Component-specific styles should use Tailwind CSS classes

### Performance Considerations
- Large JSON files are loaded asynchronously using `loadJsonResource()`
- Map components implement lazy loading and proper cleanup
- Vite configuration optimizes chunk splitting for production builds