# Cadastral Zones Map - Novoyarychivska OTG

A modern React application for visualizing and managing cadastral zones in the Novoyarychivska Territorial Community, Ukraine. Built with Vite, TypeScript, React, and Leaflet.

## Features

- 🗺️ Interactive map centered on Novoyarychivska OTG (49.95°N, 24.30°E)
- 📍 Display existing cadastral zones from GeoJSON data
- ✏️ Draw new polygonal zones directly on the map
- 📊 Real-time display of newly added zones with GeoJSON data
- 💅 Modern, responsive UI with clear visual distinction between existing and new zones

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Leaflet** - Leading open-source JavaScript library for interactive maps
- **React-Leaflet** - React components for Leaflet
- **Leaflet-Draw** - Plugin for drawing and editing vectors on Leaflet maps

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd react_leaflet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage Guide

### Viewing Existing Cadastral Zones

- The map displays three existing cadastral zones in **green** with semi-transparent fill
- Click on any zone to view its details (cadastral number, area, land use)
- Zones are loaded from `src/data.json`

### Drawing New Zones

1. Locate the **drawing control panel** in the top-right corner of the map
2. Click the **polygon icon** to activate the drawing tool
3. Click on the map to place vertices of your polygon
4. Click on the first vertex again (or double-click the last vertex) to complete the polygon
5. The new zone will appear in **blue** on the map
6. Zone details will be added to the **sidebar** on the right

### Managing Drawn Zones

- View newly added zones in the sidebar with timestamps and vertex counts
- Expand the "View GeoJSON" section to see the complete GeoJSON data
- Use the edit controls to modify or delete drawn zones

## Project Structure

```
react_leaflet/
├── src/
│   ├── components/
│   │   └── MapComponent.tsx    # Main map component with Leaflet integration
│   ├── App.tsx                 # Root application component
│   ├── main.tsx                # Application entry point
│   ├── index.css               # Global styles
│   └── data.json               # Mock cadastral zones data
├── index.html                  # HTML template
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## Customization

### Changing Map Center and Zoom

Edit the `center` and `zoom` values in `src/components/MapComponent.tsx`:

```typescript
const center: [number, number] = [49.95, 24.30] // [latitude, longitude]
const zoom = 13
```

### Modifying Cadastral Data

Edit `src/data.json` to add, remove, or modify existing cadastral zones. Follow the GeoJSON FeatureCollection format.

### Styling Zones

Modify the `cadastralStyle` object in `src/components/MapComponent.tsx` to change the appearance of existing zones.

## Known Issues & Notes

- Leaflet marker icons require manual configuration due to bundler issues (already handled in the code)
- The application uses OpenStreetMap tiles which require attribution as per their license
- Drawing complex polygons with many vertices may require zoom adjustment for precision

## License

This project is open-source and available for educational and commercial use.

## Support

For issues, questions, or contributions, please refer to the project repository.

---

**Built with ❤️ for Novoyarychivska OTG**

