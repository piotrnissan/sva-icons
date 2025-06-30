import React, { useState, useEffect } from 'react';

/**
 * Simple Web Components API Test
 * Tests if web component icons can display with proper icon data
 */
const SimpleWebComponentsTest = ({ selectedIcons }) => {
  const [systemStatus, setSystemStatus] = useState('loading');
  const [iconRegistry, setIconRegistry] = useState(null);
  const [renderedCount, setRenderedCount] = useState(0);

  useEffect(() => {
    const initializeWebComponents = async () => {
      try {
        setSystemStatus('loading');
        console.log('🔄 Loading web components...');

        // Step 1: Load icon data first
        const iconsBrowserModule = await import('../../../../src/icons-browser.js');
        const icons = iconsBrowserModule.iconRegistry;
        
        if (!icons) {
          throw new Error('No icons found');
        }

        setIconRegistry(icons);
        console.log(`✅ Loaded ${Object.keys(icons).length} icons`);

        // Step 2: Load web component and patch it with icon data
        await import('../../../../web-components/sva-icon.js');
        
        // Step 3: Patch the web component to use our icon data
        await patchWebComponentWithIconData(icons);
        
        setSystemStatus('ready');
        console.log('✅ Web components ready with icon data');

        // Auto-inject after a short delay
        setTimeout(() => {
          updateIconCount();
        }, 500);

      } catch (error) {
        console.warn('⚠️ Failed to load web components:', error);
        setSystemStatus('error');
      }
    };

    initializeWebComponents();
  }, []);

  // Patch the web component fetchSvg method to use our icon data
  const patchWebComponentWithIconData = async (icons) => {
    // Wait for the component to be defined
    await customElements.whenDefined('sva-icon');
    
    // Get the class and patch its prototype
    const SvaIconClass = customElements.get('sva-icon');
    
    // Override the fetchSvg method to use our icon data
    const originalFetchSvg = SvaIconClass.prototype.fetchSvg;
    SvaIconClass.prototype.fetchSvg = async function(name) {
      const iconFunction = icons[name];
      if (iconFunction) {
        try {
          // The icon registry exports functions that return SVG strings
          const svgString = iconFunction();
          console.log(`✅ Got SVG for ${name}:`, svgString.substring(0, 100) + '...');
          return svgString;
        } catch (error) {
          console.warn(`⚠️ Failed to get SVG for ${name}:`, error);
          return null;
        }
      }
      console.warn(`⚠️ Icon not found in registry: ${name}`);
      return null;
    };
    
    console.log('✅ Patched web component fetchSvg method');
  };

  // Count rendered web components
  const updateIconCount = () => {
    const webComponents = document.querySelectorAll('sva-icon');
    let renderedCount = 0;
    
    webComponents.forEach(component => {
      if (component.shadowRoot && component.shadowRoot.innerHTML) {
        const content = component.shadowRoot.innerHTML;
        if (!content.includes('Icon not found') && 
            !content.includes('Icon name missing') &&
            content.includes('<svg')) {
          renderedCount++;
        }
      }
    });
    
    setRenderedCount(renderedCount);
    console.log(`✅ Found ${renderedCount} rendered web components out of ${webComponents.length} total`);
  };

  // Manual refresh function
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setTimeout(updateIconCount, 100);
  };

  // Re-update when selectedIcons change
  useEffect(() => {
    if (systemStatus === 'ready' && selectedIcons.length > 0) {
      setTimeout(updateIconCount, 500);
    }
  }, [selectedIcons, systemStatus]);

  return (
    <div className="simple-web-components-test">
      <div className="test-header">
        <h3>🌐 Web Components API Test</h3>
        <p>Simple test to see if web component icons render</p>
        
        <div className={`status ${systemStatus}`}>
          {systemStatus === 'loading' && '🔄 Loading Web Components...'}
          {systemStatus === 'ready' && `✅ Components Loaded - ${renderedCount} icons rendered`}
          {systemStatus === 'error' && '❌ Components Failed to load'}
        </div>

        {systemStatus === 'ready' && (
          <div className="controls">
            <button onClick={handleRefresh} className="refresh-btn">
              🔄 Refresh Status
            </button>
            <span className="icon-count">
              {renderedCount} of {selectedIcons.length} icons rendered
            </span>
          </div>
        )}
      </div>

      {systemStatus === 'ready' && selectedIcons.length > 0 && (
        <div className="icon-test-grid">
          <h4>Testing {selectedIcons.length} icons with web components:</h4>
          <div className="icons-grid">
            {selectedIcons.map(icon => (
              <div key={icon.name} className="icon-test-item">
                {/* This is the actual test - does the web components API work? */}
                <sva-icon name={icon.name} size="32"></sva-icon>
                <span className="icon-name">{icon.name}</span>
              </div>
            ))}
          </div>
          
          <div className="usage-example">
            <h5>HTML Usage:</h5>
            <code>{`<sva-icon name="${selectedIcons[0]?.name}" size="24"></sva-icon>`}</code>
          </div>
        </div>
      )}

      {selectedIcons.length === 0 && (
        <div className="no-icons">
          Please select some icons from the Visual Grid to test the web components API.
        </div>
      )}

      <style jsx>{`
        .simple-web-components-test {
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

        .controls {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 10px;
        }

        .refresh-btn {
          padding: 8px 16px;
          background: #007acc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .refresh-btn:hover {
          background: #005a9e;
        }

        .icon-count {
          font-size: 14px;
          color: #666;
          font-weight: 500;
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

        .icon-test-item sva-icon {
          margin-bottom: 10px;
          color: #333;
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
        }

        .no-icons {
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

export default SimpleWebComponentsTest;
