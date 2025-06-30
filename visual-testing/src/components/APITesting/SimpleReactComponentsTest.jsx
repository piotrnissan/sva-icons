import React, { useState, useEffect } from 'react';

/**
 * Simple React Components API Test
 * Just tests if React component icons can display using SVG data
 */
const SimpleReactComponentsTest = ({ selectedIcons }) => {
  const [ReactComponents, setReactComponents] = useState({});
  const [testStatus, setTestStatus] = useState('loading');
  const [iconRegistry, setIconRegistry] = useState(null);

  useEffect(() => {
    const loadIconDataAndCreateComponents = async () => {
      try {
        setTestStatus('loading');
        console.log('🔄 Loading icon data for React components...');

        // Load the icon registry
        const iconsBrowserModule = await import('../../../../src/icons-browser.js');
        const icons = iconsBrowserModule.iconRegistry;
        
        if (!icons) {
          throw new Error('No icons found');
        }

        setIconRegistry(icons);
        console.log(`✅ Loaded ${Object.keys(icons).length} icons for React components`);

        // Create React components from SVG data
        const reactComponents = {};
        
        for (const icon of selectedIcons.slice(0, 10)) { // Limit to first 10 for performance
          try {
            const iconFunction = icons[icon.name];
            if (iconFunction) {
              const svgString = iconFunction();
              
              // Create a React component that renders the SVG
              const ReactComponent = ({ size = 32, color = '#333', className, style, ...props }) => {
                const processedSvg = svgString
                  .replace(/width="[^"]*"/g, `width="${size}"`)
                  .replace(/height="[^"]*"/g, `height="${size}"`)
                  .replace(/fill="[^"]*"/g, `fill="${color}"`)
                  .replace(/<path(?![^>]*fill=)/g, `<path fill="${color}"`);
                
                console.log(`🎯 Rendering React component for ${icon.name}:`, processedSvg.substring(0, 100));
                
                return (
                  <div
                    className={className}
                    style={{ 
                      display: 'inline-block', 
                      width: size + 'px',
                      height: size + 'px',
                      lineHeight: 0,
                      border: '1px solid #ddd', // Debug border
                      ...style 
                    }}
                    dangerouslySetInnerHTML={{ __html: processedSvg }}
                    {...props}
                  />
                );
              };
              
              ReactComponent.displayName = icon.name
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('');
              
              reactComponents[icon.name] = ReactComponent;
              console.log(`✅ Created React component for: ${icon.name}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to create React component for ${icon.name}:`, error.message);
          }
        }

        setReactComponents(reactComponents);
        setTestStatus('ready');
        console.log(`✅ Created ${Object.keys(reactComponents).length} React components`);

      } catch (error) {
        console.warn('⚠️ Failed to load React components:', error);
        setTestStatus('error');
      }
    };

    if (selectedIcons.length > 0) {
      loadIconDataAndCreateComponents();
    }
  }, [selectedIcons]);

  return (
    <div className="simple-react-components-test">
      <div className="test-header">
        <h3>⚛️ React Components API Test</h3>
        <p>Simple test to see if React component icons render (dynamically created from SVG data)</p>
        
        <div className={`status ${testStatus}`}>
          {testStatus === 'loading' && '🔄 Creating React Components from SVG data...'}
          {testStatus === 'ready' && `✅ ${Object.keys(ReactComponents).length} React Components Created`}
          {testStatus === 'error' && '❌ Components Failed to create'}
        </div>
      </div>

      {testStatus === 'ready' && Object.keys(ReactComponents).length > 0 && (
        <div className="icon-test-grid">
          <h4>Testing {Object.keys(ReactComponents).length} React components:</h4>
          <div className="icons-grid">
            {Object.entries(ReactComponents).map(([iconName, IconComponent]) => (
              <div key={iconName} className="icon-test-item">
                {/* This is the actual test - does the React components API work? */}
                <IconComponent size={32} color="#333" />
                <span className="icon-name">{iconName}</span>
              </div>
            ))}
          </div>
          
          <div className="usage-example">
            <h5>React Usage:</h5>
            <code>{`import ${selectedIcons[0]?.name?.replace(/[^a-zA-Z0-9]/g, '')}Icon from 'sva-icons/react/${selectedIcons[0]?.name}';
<${selectedIcons[0]?.name?.replace(/[^a-zA-Z0-9]/g, '')}Icon size={24} color="#333" />`}</code>
          </div>
        </div>
      )}

      {testStatus === 'ready' && Object.keys(ReactComponents).length === 0 && (
        <div className="no-components">
          No React components could be loaded. Check if the dist/react directory contains the built components.
        </div>
      )}

      {selectedIcons.length === 0 && (
        <div className="no-icons">
          Please select some icons from the Visual Grid to test the React components API.
        </div>
      )}

      <style jsx>{`
        .simple-react-components-test {
          padding: 20px;
        }

        .test-header h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .test-header p {
          margin: 0 0 15px 0;
          color: #666;
        }

        .status {
          padding: 10px 15px;
          border-radius: 6px;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .status.loading {
          background: #fff3cd;
          color: #856404;
        }

        .status.ready {
          background: #d4edda;
          color: #155724;
        }

        .status.error {
          background: #f8d7da;
          color: #721c24;
        }

        .icon-test-grid h4 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .icons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .icon-test-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
        }

        .icon-test-item > :first-child {
          margin-bottom: 10px;
        }

        .icon-name {
          font-size: 12px;
          color: #666;
          text-align: center;
          word-break: break-word;
        }

        .usage-example {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .usage-example h5 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .usage-example code {
          display: block;
          padding: 10px;
          background: #f1f3f4;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          white-space: pre-line;
        }

        .no-icons,
        .no-components {
          padding: 20px;
          text-align: center;
          color: #666;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
      `}</style>
    </div>
  );
};

export default SimpleReactComponentsTest;
