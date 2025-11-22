import { useState, useMemo, useCallback } from 'react'
import MapComponent, { FilterOptions } from './components/MapComponent'
import FilterPanel from './components/FilterPanel'
import { Feature, Polygon, FeatureCollection } from 'geojson'
import cadastralData from './data.json'
import mapkickData from './data-large-mapkick.json'
import { OWNERSHIP_OPTIONS, PURPOSE_OPTIONS, CATEGORY_OPTIONS } from './constants/filterOptions'
import MetadataMenu from './components/MetadataMenu'

interface NewZone {
  id: string
  geometry: Feature<Polygon>
  timestamp: string
}

function App() {
  const [newZones, setNewZones] = useState<NewZone[]>([])
  const [showCatalog, setShowCatalog] = useState(false)
  // Extract unique land uses, administrative types, and source layers from data
  const { availableLandUses, availableAdminTypes, availableSourceLayers } = useMemo(() => {
    const landUsesSet = new Set<string>()
    const adminTypesSet = new Set<string>()
    const sourceLayersSet = new Set<string>()

    // Get land uses from static cadastral data
    const staticFeatures = (cadastralData as FeatureCollection).features
    staticFeatures.forEach((feature) => {
      if (feature.properties?.land_use) {
        landUsesSet.add(feature.properties.land_use)
      }
    })

    // Get administrative types and source layers from mapkick data
    const mapkickFeatures = mapkickData as any[]
    mapkickFeatures.forEach((feature) => {
      if (feature.properties?.TYPE) {
        adminTypesSet.add(feature.properties.TYPE)
      }
      if (feature.sourceLayer && feature.sourceLayer !== 'index_data') {
        sourceLayersSet.add(feature.sourceLayer)
      }
    })

    return {
      availableLandUses: Array.from(landUsesSet).sort(),
      availableAdminTypes: Array.from(adminTypesSet).sort(),
      availableSourceLayers: Array.from(sourceLayersSet).sort()
    }
  }, [])

  // Initialize filters with all options selected
  const [filters, setFilters] = useState<FilterOptions>({
    landUse: new Set(availableLandUses),
    administrativeType: new Set(availableAdminTypes),
    sourceLayer: new Set(availableSourceLayers),
    ownership: new Set(OWNERSHIP_OPTIONS),
    purpose: new Set(PURPOSE_OPTIONS),
    category: new Set(CATEGORY_OPTIONS)
  })

  // Update filters when available options change
  useMemo(() => {
    setFilters({
      landUse: new Set(availableLandUses),
      administrativeType: new Set(availableAdminTypes),
      sourceLayer: new Set(availableSourceLayers),
      ownership: new Set(OWNERSHIP_OPTIONS),
      purpose: new Set(PURPOSE_OPTIONS),
      category: new Set(CATEGORY_OPTIONS)
    })
  }, [availableLandUses, availableAdminTypes, availableSourceLayers])

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters)
  }, [])

  const handleNewZone = (feature: Feature<Polygon>) => {
    const newZone: NewZone = {
      id: `zone-${Date.now()}`,
      geometry: feature,
      timestamp: new Date().toLocaleString(),
    }
    setNewZones((prev) => [...prev, newZone])
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="app-header-content">
            <h1>Cadastral Zones - Novoyarychivska OTG</h1>
            <p>View existing cadastral zones and draw new polygonal areas</p>
          </div>
          <button 
            onClick={() => setShowCatalog(!showCatalog)}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              borderRadius: '25px',
              border: '2px solid white',
              backgroundColor: 'white',
              color: '#2c3e50',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {showCatalog ? 'НА КАРТУ' : 'КАТАЛОГ МЕТАДАНИХ'}
          </button>
        </div>
      </header>
      
      <div className="content-wrapper">
      {showCatalog ? (
          <MetadataMenu onShowMap={() => setShowCatalog(false)} />
        ) : (
          <>
        <div className="map-container">
          <FilterPanel
            availableLandUses={availableLandUses}
            availableAdminTypes={availableAdminTypes}
            availableSourceLayers={availableSourceLayers}
            onFilterChange={handleFilterChange}
          />
          <MapComponent onNewZone={handleNewZone} filters={filters} />
        </div>
        
        <aside className="sidebar">
          <h2>Нові зони ({newZones.length})</h2>
          
          {newZones.length === 0 ? (
            <div className="empty-state">
              Немає нових додань. Використовуйте інструмент для малювання полігону на карті, щоб додати нові земельні ділянки.
            </div>
          ) : (
            <div className="zone-list">
              {newZones.map((zone) => (
                <div key={zone.id} className="zone-item">
                  <h3>Zone #{zone.id}</h3>
                  <p><strong>Added:</strong> {zone.timestamp}</p>
                  <p><strong>Vertices:</strong> {zone.geometry.geometry.coordinates[0].length}</p>
                  <details>
                    <summary style={{ cursor: 'pointer', marginTop: '0.5rem', fontWeight: '500' }}>
                      View GeoJSON
                    </summary>
                    <pre>{JSON.stringify(zone.geometry, null, 2)}</pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </aside>
        </>
        )}
      </div>
    </div>
  )
}

export default App

