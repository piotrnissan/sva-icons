import React, { useState, useEffect, Suspense } from 'react'
import { iconMap } from './icons/mapping.js'

const IconExplorer = () => {
  const [icons, setIcons] = useState([])
  const [filteredIcons, setFilteredIcons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [iconComponents, setIconComponents] = useState({})

  useEffect(() => {
    // Load icons.json
    fetch('/icons.json')
      .then(response => response.json())
      .then(iconsJson => {
        console.log('Loaded icons:', iconsJson.length, 'icons')
        setIcons(iconsJson)
        setFilteredIcons(iconsJson)
      })
      .catch(error => console.error('Error loading icons:', error))
  }, [])

  useEffect(() => {
    const filtered = icons.filter(icon => 
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (icon.tags && icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    setFilteredIcons(filtered)
  }, [searchTerm, icons])

  const loadIconComponent = async (iconName) => {
    if (iconComponents[iconName]) {
      return iconComponents[iconName]
    }

    const componentName = iconMap[iconName]
    if (!componentName) {
      console.warn(`No component found for icon: ${iconName}`)
      return null
    }

    try {
      const componentModule = await import(`./icons/${componentName}.jsx`)
      const Component = componentModule.default
      setIconComponents(prev => ({ ...prev, [iconName]: Component }))
      return Component
    } catch (error) {
      console.error(`Error loading icon component ${componentName}:`, error)
      return null
    }
  }

  const IconComponent = ({ iconName, size = 24, className = "" }) => {
    const [Component, setComponent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      loadIconComponent(iconName)
        .then(comp => {
          setComponent(() => comp)
          setLoading(false)
        })
    }, [iconName])

    if (loading) {
      return (
        <div className={`icon-loading ${className}`} style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: `${size}px`, 
          height: `${size}px`, 
          background: '#f0f0f0', 
          borderRadius: '4px', 
          fontSize: '12px', 
          color: '#666'
        }}>
          ...
        </div>
      )
    }

    if (!Component) {
      return (
        <div className={`icon-placeholder ${className}`} style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: `${size}px`, 
          height: `${size}px`, 
          background: '#f0f0f0', 
          borderRadius: '4px', 
          fontSize: '12px', 
          color: '#666'
        }}>
          SVG
        </div>
      )
    }

    return <Component size={size} className={className} />
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  return (
    <div className="icon-explorer">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="results-count">
          {filteredIcons.length} of {icons.length} icons
        </div>
      </div>

      <div className="icon-grid">
        {filteredIcons.map((icon, index) => (
          <div 
            key={`${icon.name}-${index}`}
            className="icon-card"
            onClick={() => setSelectedIcon(icon)}
          >
            <div className="icon-preview">
              <IconComponent iconName={icon.name} size={32} />
            </div>
            <div className="icon-name">{icon.name}</div>
            {icon.tags && (
              <div className="icon-tags">
                {icon.tags.slice(0, 2).map((tag, tagIndex) => (
                  <span key={`${tag}-${tagIndex}`} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedIcon && (
        <div className="icon-modal" onClick={() => setSelectedIcon(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedIcon.name}</h3>
              <button onClick={() => setSelectedIcon(null)}>×</button>
            </div>
            
            <div className="icon-preview-large">
              <IconComponent iconName={selectedIcon.name} size={64} />
            </div>

            <div className="code-examples">
              <div className="code-section">
                <h4>React Component</h4>
                <code onClick={() => copyToClipboard(`import { ${iconMap[selectedIcon.name]} } from 'sva-icons/react'\n\n<${iconMap[selectedIcon.name]} />`)}>
                  {`<${iconMap[selectedIcon.name]} />`}
                </code>
              </div>

              <div className="code-section">
                <h4>Web Component</h4>
                <code onClick={() => copyToClipboard(`<sva-icon name="${selectedIcon.name}"></sva-icon>`)}>
                  {`<sva-icon name="${selectedIcon.name}"></sva-icon>`}
                </code>
              </div>

              <div className="code-section">
                <h4>SVG Sprite</h4>
                <code onClick={() => copyToClipboard(`<svg><use href="#${selectedIcon.name}"></use></svg>`)}>
                  {`<svg><use href="#${selectedIcon.name}"></use></svg>`}
                </code>
              </div>
            </div>

            {selectedIcon.tags && (
              <div className="modal-tags">
                <strong>Tags:</strong> {selectedIcon.tags.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default IconExplorer
