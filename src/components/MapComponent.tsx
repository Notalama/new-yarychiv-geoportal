import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import { Feature, Polygon, FeatureCollection } from 'geojson'

// Fix for default markers in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import mapkickData from '../data-mapkick.json'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

export interface FilterOptions {
  landUse: Set<string>
  administrativeType: Set<string>
  sourceLayer: Set<string>
  ownership: Set<string>
  purpose: Set<string>
  category: Set<string>
}

interface MapComponentProps {
  onNewZone: (feature: Feature<Polygon>) => void
  filters: FilterOptions
}

// Component to add Leaflet Draw controls
function DrawControls({ onNewZone }: { onNewZone: (feature: Feature<Polygon>) => void }) {
  const map = useMap()
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null)

  useEffect(() => {
    if (!map) return

    // Create a feature group for drawn items
    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)
    drawnItemsRef.current = drawnItems

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: '#3388ff',
            fillOpacity: 0.4,
          },
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    })

    map.addControl(drawControl)

    // Handle polygon creation
    const handleCreated = (e: L.LeafletEvent) => {
      const event = e as L.DrawEvents.Created
      const layer = event.layer as L.Polygon
      drawnItems.addLayer(layer)

      // Convert to GeoJSON
      const geoJSON = layer.toGeoJSON() as Feature<Polygon>
      onNewZone(geoJSON)
    }

    // Add event listener
    map.on(L.Draw.Event.CREATED, handleCreated)

    // Cleanup
    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated)
      map.removeControl(drawControl)
      map.removeLayer(drawnItems)
    }
  }, [map, onNewZone])

  return null
}

function MapComponent({ onNewZone, filters }: MapComponentProps) {
  const center: [number, number] = [49.95, 24.30]
  const zoom = 13

  // Function to calculate approximate area of a polygon (in square degrees)
  const calculatePolygonArea = (coordinates: number[][][]): number => {
    if (!coordinates || !coordinates[0]) return 0
    
    const ring = coordinates[0]
    let area = 0
    
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i]
      const [x2, y2] = ring[i + 1]
      area += (x2 - x1) * (y2 + y1)
    }
    
    return Math.abs(area / 2)
  }

  // Function to check if polygon is a perfect rectangle (grid tile)
  const isPerfectRectangle = (coordinates: number[][][]): boolean => {
    if (!coordinates || !coordinates[0]) return false
    const ring = coordinates[0]
    
    // Perfect rectangles have exactly 5 points (4 corners + closing point)
    if (ring.length !== 5) return false
    
    // Check if it forms a perfect rectangle by checking if opposite sides are parallel
    const [p1, p2, p3, p4] = ring
    const width1 = Math.abs(p2[0] - p1[0])
    const width2 = Math.abs(p3[0] - p4[0])
    const height1 = Math.abs(p4[1] - p1[1])
    const height2 = Math.abs(p3[1] - p2[1])
    
    // If widths and heights match closely, it's a perfect rectangle
    const tolerance = 0.0001
    return (Math.abs(width1 - width2) < tolerance && Math.abs(height1 - height2) < tolerance)
  }

  // Convert mapkick data to FeatureCollection format and filter out large zones
  const MAX_AREA_THRESHOLD = 0.0005 // Maximum area in square degrees (more aggressive)
  
  const filteredMapkickData = (mapkickData as Feature[]).filter((feature) => {
    if (feature.geometry.type === 'Polygon') {
      const area = calculatePolygonArea(feature.geometry.coordinates)
      const isRect = isPerfectRectangle(feature.geometry.coordinates)
      
      // Filter out if area is too large OR if it's a perfect rectangle with area > very small threshold
      if (area > MAX_AREA_THRESHOLD) return false
      if (isRect && area > 0.00001) return false
      
      return true
    }
    return true
  })

  const mapkickFeatures: FeatureCollection = {
    type: 'FeatureCollection',
    features: filteredMapkickData
  }

  console.log(`Mapkick data: ${(mapkickData as Feature[]).length} features total, ${filteredMapkickData.length} after filtering out large zones`)

  // Apply category/type filters
  const applyFilters = (feature: Feature): boolean => {
    const props = feature.properties
    if (!props) return true

    // Check source layer filter (for mapkick data)
    if ((feature as any).sourceLayer) {
      if (!filters.sourceLayer.has((feature as any).sourceLayer)) {
        return false
      }
    }

    // Check ownership filter
    if (props.ownership) {
      if (!filters.ownership.has(props.ownership)) {
        return false
      }
    }

    // Check purpose filter
    if (props.purpose) {
      if (!filters.purpose.has(props.purpose)) {
        return false
      }
    }

    // Check category filter
    if (props.category) {
      if (!filters.category.has(props.category)) {
        return false
      }
    }

    // Check land use filter (for static cadastral data)
    if (props.land_use) {
      return filters.landUse.has(props.land_use)
    }

    // Check administrative type filter (for mapkick data)
    if (props.TYPE) {
      return filters.administrativeType.has(props.TYPE)
    }

    // If no relevant properties, include by default
    return true
  }

  const filteredMapkickFeatures = mapkickFeatures.features.filter(applyFilters)

  // Combine filtered cadastral data
  const allCadastralZones: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      ...filteredMapkickFeatures
    ]
  }

  console.log(`Total cadastral zones after filters: ${allCadastralZones.features.length}`)

  // Create a unique key for the GeoJSON component based on filters
  // This forces React to re-render the component when filters change
  const filterKey = `${Array.from(filters.landUse).sort().join(',')}-${Array.from(filters.administrativeType).sort().join(',')}-${Array.from(filters.sourceLayer).sort().join(',')}-${Array.from(filters.ownership).sort().join(',')}-${Array.from(filters.purpose).sort().join(',')}-${Array.from(filters.category).sort().join(',')}`

  // Style for existing cadastral zones
  const cadastralStyle = {
    color: '#2ecc71',
    weight: 2,
    fillOpacity: 0.35,
    fillColor: '#27ae60',
  }

  // Add popup to each feature
  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    if (feature.properties) {
      const props = feature.properties
      
      // Handle different data formats (generated vs mapkick data)
      let popupContent = '<div style="font-family: sans-serif;">'
      
      if (props.name) {
        // Format for generated/static data
        popupContent += `
          <h3 style="margin: 0 0 8px 0; font-size: 14px;">${props.name}</h3>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Cadastral №:</strong> ${props.cadastral_number}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Area:</strong> ${props.area_hectares} ha</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Land Use:</strong> ${props.land_use}</p>
        `
      } else if (props.ADMIN_3) {
        // Format for mapkick data (administrative boundaries)
        popupContent += `
          <h3 style="margin: 0 0 8px 0; font-size: 14px;">${props.ADMIN_3}</h3>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Oblast:</strong> ${props.ADMIN_1 || 'N/A'}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>District:</strong> ${props.ADMIN_2 || 'N/A'}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Type:</strong> ${props.TYPE || 'N/A'}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>KOATUU:</strong> ${props.KOATUU_old || 'N/A'}</p>
        `
      } else if (props.ownership || props.purpose || props.category) {
        // Format for mapkick data (cadastral parcels)
        popupContent += `
          <h3 style="margin: 0 0 8px 0; font-size: 14px;">Земельна ділянка</h3>
          ${props.ownership ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Власність:</strong> ${props.ownership}</p>` : ''}
          ${props.category ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Категорія:</strong> ${props.category}</p>` : ''}
          ${props.purpose ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Призначення:</strong> ${props.purpose}</p>` : ''}
          ${props.koatuu ? `<p style="margin: 4px 0; font-size: 12px;"><strong>КОАТУУ:</strong> ${props.koatuu}</p>` : ''}
        `
      } else {
        // Generic fallback
        popupContent += '<p style="margin: 4px 0; font-size: 12px;">Feature data available</p>'
      }
      
      popupContent += '</div>'
      layer.bindPopup(popupContent)
    }
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Display all cadastral zones (static + mapkick data) */}
      <GeoJSON
        key={filterKey}
        data={allCadastralZones}
        style={cadastralStyle}
        onEachFeature={onEachFeature}
      />
      
      {/* Add drawing controls */}
      <DrawControls onNewZone={onNewZone} />
    </MapContainer>
  )
}

export default MapComponent

