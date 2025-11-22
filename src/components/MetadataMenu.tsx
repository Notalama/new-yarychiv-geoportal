import './MetadataMenu.css'

interface MetadataItem {
  id: string
  title: string
  icon: string
}

const metadataItems: MetadataItem[] = [
  {
    id: 'geo-dataset',
    title: 'Базовий набір геопросторових даних',
    icon: '🗄️'
  },
  {
    id: 'water-cadastre',
    title: 'Державний водний кадастр',
    icon: '💧'
  },
  {
    id: 'land-valuation',
    title: 'Нормативна грошова оцінка земель',
    icon: '💰'
  },
  {
    id: 'cadastral-map',
    title: 'Публічна кадастрова карта',
    icon: '🗺️'
  },
  {
    id: 'geodetic-network',
    title: 'Державна геодезична мережа',
    icon: '📐'
  },
  {
    id: 'ecology',
    title: 'Екологія',
    icon: '♻️'
  },
  {
    id: 'land-cadastre',
    title: 'Земельний кадастр',
    icon: '🗺️'
  },
  {
    id: 'investments',
    title: 'Інвестиційні пропозиції',
    icon: '💵'
  },
  {
    id: 'urban-cadastre',
    title: 'Містобудівний кадастр',
    icon: '🏢'
  },
  {
    id: 'otg-monitoring',
    title: 'Моніторинг ресурсів ОТГ',
    icon: '🌐'
  },
  {
    id: 'education',
    title: 'Освіта',
    icon: '📚'
  },
  {
    id: 'topographic',
    title: 'Топографо-геодезичні матеріали',
    icon: '🗺️'
  }
]

interface MetadataMenuProps {
  onShowMap: () => void
}

function MetadataMenu({ onShowMap }: MetadataMenuProps) {
  const handleShowOnMap = (itemId: string) => {
    console.log('Show on map:', itemId)
    onShowMap()
  }

  const handleShowCatalog = (itemId: string) => {
    console.log('Show catalog:', itemId)
  }

  return (
    <div className="metadata-menu">
      <div className="metadata-header">
        <button className="nav-button active" onClick={onShowMap}>НА КАРТУ</button>
        <button className="nav-button outline">КАТАЛОГ МЕТАДАНИХ</button>
      </div>

      <div className="metadata-grid">
        {metadataItems.map((item) => (
          <div key={item.id} className="metadata-card">
            <div className="metadata-icon">{item.icon}</div>
            <h3 className="metadata-title">{item.title}</h3>
            <div className="metadata-actions">
              <button 
                className="btn-primary" 
                onClick={() => handleShowOnMap(item.id)}
              >
                На карту
              </button>
              <button 
                className="btn-outline" 
                onClick={() => handleShowCatalog(item.id)}
              >
                Каталог наборів
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MetadataMenu

