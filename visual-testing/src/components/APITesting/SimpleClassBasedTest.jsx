import React, { useState, useEffect } from 'react';

/**
 * Simple Class-Based API Test
 * Tests if class-based icons can display with proper SVG injection
 */
const SimpleClassBasedTest = ({ selectedIcons }) => {
  const [systemStatus, setSystemStatus] = useState('loading');
  const [iconRegistry, setIconRegistry] = useState(null);
  const [injectedCount, setInjectedCount] = useState(0);

  useEffect(() => {
    const initializeClassBasedSystem = async () => {
      try {
        setSystemStatus('loading');
        console.log('🔄 Loading class-based system...');

        // Step 1: Load CSS
        const loadCSS = () => {
          return new Promise((resolve, reject) => {
            const existingLink = document.querySelector('link[href*="sva-icons-class-based"]');
            if (existingLink) {
              console.log('✅ CSS already loaded');
              resolve();
              return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/sva-icons-class-based.css';
            link.onload = () => {
              console.log('✅ CSS loaded');
              resolve();
            };
            link.onerror = () => reject(new Error('CSS failed to load'));
            document.head.appendChild(link);
          });
        };

        await loadCSS();

        // Step 2: Load real icon data
        const iconsBrowserModule = await import('../../../../src/icons-browser.js');
        const icons = iconsBrowserModule.iconRegistry;
        
        if (!icons) {
          throw new Error('No icons found');
        }

        setIconRegistry(icons);
        console.log(`✅ Loaded ${Object.keys(icons).length} icons`);

        // Step 3: Set up manual SVG injection
        setSystemStatus('ready');
        
        // Manually inject SVGs after a short delay to let DOM update
        setTimeout(() => {
          injectSVGsManually(icons);
        }, 100);

      } catch (error) {
        console.error('❌ Failed to initialize:', error);
        setSystemStatus('error');
      }
    };

    initializeClassBasedSystem();
  }, []);

  // Manual SVG injection function
  const injectSVGsManually = (icons) => {
    const iconElements = document.querySelectorAll('[class*="sva-icon-"]:not([data-injected])');
    let injected = 0;

    iconElements.forEach(element => {
      // Extract icon name from class
      const classList = Array.from(element.classList);
      const iconClass = classList.find(cls => cls.startsWith('sva-icon-') && !cls.includes('size') && !cls.includes('color'));
      
      if (iconClass) {
        const iconName = iconClass.replace('sva-icon-', '');
        const iconFunction = icons[iconName];
        
        if (iconFunction) {
          try {
            const svgContent = iconFunction();
            element.innerHTML = svgContent;
            element.setAttribute('data-injected', 'true');
            injected++;
            console.log(`✅ Injected ${iconName}`);
          } catch (error) {
            console.warn(`⚠️ Failed to inject ${iconName}:`, error);
          }
        } else {
          console.warn(`⚠️ Icon not found: ${iconName}`);
        }
      }
    });

    setInjectedCount(injected);
    console.log(`✅ Injected ${injected} icons manually`);
  };

  // Re-inject when selectedIcons change
  useEffect(() => {
    if (systemStatus === 'ready' && iconRegistry && selectedIcons.length > 0) {
      setTimeout(() => {
        injectSVGsManually(iconRegistry);
      }, 100);
    }
  }, [selectedIcons, systemStatus, iconRegistry]);

  return (
    <div className="simple-class-based-test">
      <div className="test-header">
        <h3>🎯 Class-Based API Test</h3>
        <p>Simple test to see if class-based icons render</p>
        
        <div className={`status ${systemStatus}`}>
          {systemStatus === 'loading' && '🔄 Loading system...'}
          {systemStatus === 'ready' && `✅ Ready - ${injectedCount} icons injected`}
          {systemStatus === 'error' && '❌ System failed to load'}
        </div>
      </div>

      {systemStatus === 'ready' && selectedIcons.length > 0 && (
        <div className="icon-test-grid">
          <div className="grid-header">
            <h4>Testing {selectedIcons.length} icons with class-based API:</h4>
            <button 
              onClick={() => injectSVGsManually(iconRegistry)}
              className="refresh-button"
            >
              🔄 Re-inject Icons
            </button>
          </div>
          <div className="icons-grid">
            {selectedIcons.map(icon => (
              <div key={icon.name} className="icon-test-item">
                {/* This is the actual test - does the class-based API work? */}
                <div className={`sva-icon-${icon.name}`} title={icon.name}></div>
                <span className="icon-name">{icon.name}</span>
              </div>
            ))}
          </div>
          
          <div className="usage-example">
            <h5>HTML Usage:</h5>
            <code>{`<div class="sva-icon-${selectedIcons[0]?.name}"></div>`}</code>
          </div>
        </div>
      )}

      {selectedIcons.length === 0 && (
        <div className="no-icons">
          Please select some icons from the Visual Grid to test the class-based API.
        </div>
      )}

      <style jsx>{`
        .simple-class-based-test {
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

        .grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .grid-header h4 {
          margin: 0;
        }

        .refresh-button {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .refresh-button:hover {
          background: #0056b3;
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

        .icon-test-item > [class^="sva-icon-"] {
          width: 32px;
          height: 32px;
          margin-bottom: 10px;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-test-item > [class^="sva-icon-"] svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
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

export default SimpleClassBasedTest;
