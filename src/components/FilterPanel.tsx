import { useState, useEffect } from 'react'
import './FilterPanel.css'
import { OWNERSHIP_OPTIONS, PURPOSE_OPTIONS, CATEGORY_OPTIONS } from '../constants/filterOptions'

export interface FilterOptions {
  landUse: Set<string>
  administrativeType: Set<string>
  sourceLayer: Set<string>
  ownership: Set<string>
  purpose: Set<string>
  category: Set<string>
}

interface FilterPanelProps {
  availableLandUses: string[]
  availableAdminTypes: string[]
  availableSourceLayers: string[]
  onFilterChange: (filters: FilterOptions) => void
}

function FilterPanel({ availableLandUses, availableAdminTypes, availableSourceLayers, onFilterChange }: FilterPanelProps) {
  const [selectedLandUses, setSelectedLandUses] = useState<Set<string>>(new Set(availableLandUses))
  const [selectedAdminTypes, setSelectedAdminTypes] = useState<Set<string>>(new Set(availableAdminTypes))
  const [selectedSourceLayers, setSelectedSourceLayers] = useState<Set<string>>(new Set(availableSourceLayers))
  const [selectedOwnerships, setSelectedOwnerships] = useState<Set<string>>(new Set(OWNERSHIP_OPTIONS))
  const [selectedPurposes, setSelectedPurposes] = useState<Set<string>>(new Set(PURPOSE_OPTIONS))
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(CATEGORY_OPTIONS))
  const [isExpanded, setIsExpanded] = useState(false)

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange({
      landUse: selectedLandUses,
      administrativeType: selectedAdminTypes,
      sourceLayer: selectedSourceLayers,
      ownership: selectedOwnerships,
      purpose: selectedPurposes,
      category: selectedCategories
    })
  }, [selectedLandUses, selectedAdminTypes, selectedSourceLayers, selectedOwnerships, selectedPurposes, selectedCategories, onFilterChange])

  const toggleLandUse = (landUse: string) => {
    const newSet = new Set(selectedLandUses)
    if (newSet.has(landUse)) {
      newSet.delete(landUse)
    } else {
      newSet.add(landUse)
    }
    setSelectedLandUses(newSet)
  }

  const toggleAdminType = (adminType: string) => {
    const newSet = new Set(selectedAdminTypes)
    if (newSet.has(adminType)) {
      newSet.delete(adminType)
    } else {
      newSet.add(adminType)
    }
    setSelectedAdminTypes(newSet)
  }

  const selectAllLandUses = () => {
    setSelectedLandUses(new Set(availableLandUses))
  }

  const deselectAllLandUses = () => {
    setSelectedLandUses(new Set())
  }

  const selectAllAdminTypes = () => {
    setSelectedAdminTypes(new Set(availableAdminTypes))
  }

  const deselectAllAdminTypes = () => {
    setSelectedAdminTypes(new Set())
  }

  const toggleSourceLayer = (sourceLayer: string) => {
    const newSet = new Set(selectedSourceLayers)
    if (newSet.has(sourceLayer)) {
      newSet.delete(sourceLayer)
    } else {
      newSet.add(sourceLayer)
    }
    setSelectedSourceLayers(newSet)
  }

  const selectAllSourceLayers = () => {
    setSelectedSourceLayers(new Set(availableSourceLayers))
  }

  const deselectAllSourceLayers = () => {
    setSelectedSourceLayers(new Set())
  }

  const toggleOwnership = (ownership: string) => {
    const newSet = new Set(selectedOwnerships)
    if (newSet.has(ownership)) {
      newSet.delete(ownership)
    } else {
      newSet.add(ownership)
    }
    setSelectedOwnerships(newSet)
  }

  const selectAllOwnerships = () => {
    setSelectedOwnerships(new Set(OWNERSHIP_OPTIONS))
  }

  const deselectAllOwnerships = () => {
    setSelectedOwnerships(new Set())
  }

  const togglePurpose = (purpose: string) => {
    const newSet = new Set(selectedPurposes)
    if (newSet.has(purpose)) {
      newSet.delete(purpose)
    } else {
      newSet.add(purpose)
    }
    setSelectedPurposes(newSet)
  }

  const selectAllPurposes = () => {
    setSelectedPurposes(new Set(PURPOSE_OPTIONS))
  }

  const deselectAllPurposes = () => {
    setSelectedPurposes(new Set())
  }

  const toggleCategory = (category: string) => {
    const newSet = new Set(selectedCategories)
    if (newSet.has(category)) {
      newSet.delete(category)
    } else {
      newSet.add(category)
    }
    setSelectedCategories(newSet)
  }

  const selectAllCategories = () => {
    setSelectedCategories(new Set(CATEGORY_OPTIONS))
  }

  const deselectAllCategories = () => {
    setSelectedCategories(new Set())
  }

  return (
    <div className={`filter-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button 
        className="filter-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle filters"
      >
        <span className="filter-icon">🔍</span>
        <span className="filter-label">Filters</span>
        <span className="expand-icon">{isExpanded ? '▼' : '▲'}</span>
      </button>

      {isExpanded && (
        <div className="filter-content">
          {/* Land Use Filters */}
          {availableLandUses.length > 0 && (
            <div className="filter-section">
              <div className="filter-header">
                <h3>Land Use Category</h3>
                <div className="filter-actions">
                  <button onClick={selectAllLandUses} className="action-btn">All</button>
                  <button onClick={deselectAllLandUses} className="action-btn">None</button>
                </div>
              </div>
              <div className="filter-options">
                {availableLandUses.map((landUse) => (
                  <label key={landUse} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedLandUses.has(landUse)}
                      onChange={() => toggleLandUse(landUse)}
                    />
                    <span className="checkbox-label">{landUse}</span>
                    <span className="checkbox-count">
                      ({selectedLandUses.has(landUse) ? '✓' : ''})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Administrative Type Filters */}
          {availableAdminTypes.length > 0 && (
            <div className="filter-section">
              <div className="filter-header">
                <h3>Administrative Type</h3>
                <div className="filter-actions">
                  <button onClick={selectAllAdminTypes} className="action-btn">All</button>
                  <button onClick={deselectAllAdminTypes} className="action-btn">None</button>
                </div>
              </div>
              <div className="filter-options">
                {availableAdminTypes.map((adminType) => (
                  <label key={adminType} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedAdminTypes.has(adminType)}
                      onChange={() => toggleAdminType(adminType)}
                    />
                    <span className="checkbox-label">{adminType}</span>
                    <span className="checkbox-count">
                      ({selectedAdminTypes.has(adminType) ? '✓' : ''})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Source Layer Filters */}
          {availableSourceLayers.length > 0 && (
            <div className="filter-section">
              <div className="filter-header">
                <h3>Source Layer</h3>
                <div className="filter-actions">
                  <button onClick={selectAllSourceLayers} className="action-btn">All</button>
                  <button onClick={deselectAllSourceLayers} className="action-btn">None</button>
                </div>
              </div>
              <div className="filter-options">
                {availableSourceLayers.map((sourceLayer) => (
                  <label key={sourceLayer} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedSourceLayers.has(sourceLayer)}
                      onChange={() => toggleSourceLayer(sourceLayer)}
                    />
                    <span className="checkbox-label">{sourceLayer}</span>
                    <span className="checkbox-count">
                      ({selectedSourceLayers.has(sourceLayer) ? '✓' : ''})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Ownership Filters */}
          <div className="filter-section">
            <div className="filter-header">
              <h3>Форма власності (Ownership)</h3>
              <div className="filter-actions">
                <button onClick={selectAllOwnerships} className="action-btn">All</button>
                <button onClick={deselectAllOwnerships} className="action-btn">None</button>
              </div>
            </div>
            <div className="filter-options">
              {OWNERSHIP_OPTIONS.map((ownership) => (
                <label key={ownership} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedOwnerships.has(ownership)}
                    onChange={() => toggleOwnership(ownership)}
                  />
                  <span className="checkbox-label">{ownership}</span>
                  <span className="checkbox-count">
                    ({selectedOwnerships.has(ownership) ? '✓' : ''})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Purpose Filters */}
          <div className="filter-section">
            <div className="filter-header">
              <h3>Цільове призначення (Purpose)</h3>
              <div className="filter-actions">
                <button onClick={selectAllPurposes} className="action-btn">All</button>
                <button onClick={deselectAllPurposes} className="action-btn">None</button>
              </div>
            </div>
            <div className="filter-options">
              {PURPOSE_OPTIONS.map((purpose) => (
                <label key={purpose} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedPurposes.has(purpose)}
                    onChange={() => togglePurpose(purpose)}
                  />
                  <span className="checkbox-label">{purpose}</span>
                  <span className="checkbox-count">
                    ({selectedPurposes.has(purpose) ? '✓' : ''})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="filter-section">
            <div className="filter-header">
              <h3>Категорія земель (Category)</h3>
              <div className="filter-actions">
                <button onClick={selectAllCategories} className="action-btn">All</button>
                <button onClick={deselectAllCategories} className="action-btn">None</button>
              </div>
            </div>
            <div className="filter-options">
              {CATEGORY_OPTIONS.map((category) => (
                <label key={category} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <span className="checkbox-label">{category}</span>
                  <span className="checkbox-count">
                    ({selectedCategories.has(category) ? '✓' : ''})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-summary">
            <p>
              Filters: {selectedLandUses.size} land use, {selectedAdminTypes.size} admin, {selectedSourceLayers.size} layers, {selectedOwnerships.size} ownership, {selectedPurposes.size} purpose, {selectedCategories.size} category
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel

