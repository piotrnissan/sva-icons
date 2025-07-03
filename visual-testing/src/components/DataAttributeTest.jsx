import React, { useEffect, useState } from 'react';

/**
 * Data Attribute Testing Component
 * 
 * Demonstrates the new data attribute-based icon injection system in SVA Icons v3.1.1
 * Perfect for SVA Framework integration where CSS classes handle styling
 * and data attributes handle content injection.
 */
function DataAttributeTest() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const initializeIcons = async () => {
            try {
                // Import the auto-registration system
                const { initializeClassBasedIcons } = await import('sva-icons/class-based/auto-register');
                
                // Initialize with data attribute support
                const result = await initializeClassBasedIcons({
                    registerBundles: ['ui-essentials', 'automotive-core', 'navigation'],
                    scanDOM: true,
                    enableObserver: true
                });

                if (result.success) {
                    setStats(result.stats);
                    setIsInitialized(true);
                    console.log('✅ Data attribute icons initialized:', result);
                } else {
                    console.error('❌ Failed to initialize icons:', result.errors);
                }
            } catch (error) {
                console.error('❌ Error importing auto-registration:', error);
            }
        };

        initializeIcons();
    }, []);

    const addDynamicIcon = () => {
        const container = document.getElementById('dynamic-icons');
        const newIcon = document.createElement('span');
        newIcon.className = 'sva-icon sva-icon--m dynamic-icon';
        newIcon.setAttribute('data-sva-icon', 'plus');
        newIcon.style.margin = '0 8px';
        container.appendChild(newIcon);
    };

    return (
        <div className="data-attribute-test">
            <div className="header">
                <h1>Data Attribute Icon Injection Test</h1>
                <div className="status">
                    Status: {isInitialized ? (
                        <span className="success">✅ Initialized</span>
                    ) : (
                        <span className="pending">⏳ Initializing...</span>
                    )}
                </div>
                {stats && (
                    <div className="stats">
                        <p>📊 Stats: {stats.totalRegistered} icons registered</p>
                        <p>📦 From bundles: {stats.fromBundles} | 🔍 From DOM: {stats.fromDOMScan}</p>
                    </div>
                )}
            </div>

            <section className="test-section">
                <h2>1. Basic Data Attribute Icons</h2>
                <p>These icons use <code>data-sva-icon</code> attributes for content injection:</p>
                
                <div className="icon-row">
                    <span className="sva-icon sva-icon--xs" data-sva-icon="plus" title="Plus (XS)"></span>
                    <span className="sva-icon sva-icon--s" data-sva-icon="minus" title="Minus (S)"></span>
                    <span className="sva-icon sva-icon--m" data-sva-icon="settings" title="Settings (M)"></span>
                    <span className="sva-icon sva-icon--l" data-sva-icon="search" title="Search (L)"></span>
                    <span className="sva-icon sva-icon--xl" data-sva-icon="car" title="Car (XL)"></span>
                </div>
            </section>

            <section className="test-section">
                <h2>2. SVA Framework Integration Pattern</h2>
                <p>Clean separation: CSS classes for styling, data attributes for content:</p>
                
                <div className="sva-framework-examples">
                    <button className="sva-button">
                        <span className="sva-icon sva-icon--s" data-sva-icon="plus"></span>
                        Add Item
                    </button>
                    
                    <button className="sva-button sva-button--secondary">
                        <span className="sva-icon sva-icon--s" data-sva-icon="settings"></span>
                        Settings
                    </button>
                    
                    <div className="sva-input-group">
                        <input type="text" placeholder="Search..." className="sva-input" />
                        <span className="sva-icon sva-icon--m input-icon" data-sva-icon="search"></span>
                    </div>
                </div>
            </section>

            <section className="test-section">
                <h2>3. Automotive Icons</h2>
                <p>Automotive-specific icons from the automotive-core bundle:</p>
                
                <div className="icon-row">
                    <span className="sva-icon sva-icon--m" data-sva-icon="car" title="Car"></span>
                    <span className="sva-icon sva-icon--m" data-sva-icon="battery" title="Battery"></span>
                    <span className="sva-icon sva-icon--m" data-sva-icon="charging" title="Charging"></span>
                    <span className="sva-icon sva-icon--m" data-sva-icon="alert" title="Alert"></span>
                    <span className="sva-icon sva-icon--m" data-sva-icon="speed" title="Speed"></span>
                </div>
            </section>

            <section className="test-section">
                <h2>4. Navigation Icons</h2>
                <p>Navigation and directional icons:</p>
                
                <div className="icon-row">
                    <span className="sva-icon sva-icon--m" data-sva-icon="arrow-up" title="Arrow Up"></span>
                    <span className="sva-icon sva-icon--m" data-sva-icon="arrow-down" title="Arrow Down"></span>
                    <span className="sva-icon sva-icon--m" data-sva-icon="arrow-left" title="Arrow Left"></span>
                    <span className="sva-icon sva-icon--m" data-sva-icon="arrow-right" title="Arrow Right"></span>
                    <span className="sva-icon sva-icon--m" data-sva-icon="directions" title="Directions"></span>
                </div>
            </section>

            <section className="test-section">
                <h2>5. Dynamic Content Test</h2>
                <p>Test dynamic content injection with mutation observer:</p>
                
                <div className="dynamic-section">
                    <button onClick={addDynamicIcon} className="add-button">
                        Add Dynamic Icon
                    </button>
                    <div id="dynamic-icons" className="dynamic-icons">
                        {/* Dynamic icons will be added here */}
                    </div>
                </div>
            </section>

            <section className="test-section">
                <h2>6. Mixed Context Test</h2>
                <p>Icons in various HTML contexts:</p>
                
                <div className="mixed-contexts">
                    <p>
                        Text with inline icon <span className="sva-icon sva-icon--s" data-sva-icon="info"></span> in paragraph.
                    </p>
                    
                    <div className="card">
                        <h3>
                            <span className="sva-icon sva-icon--s" data-sva-icon="star"></span>
                            Card Title
                        </h3>
                        <p>Card content with action icon <span className="sva-icon sva-icon--s" data-sva-icon="arrow-right"></span></p>
                    </div>
                    
                    <ul className="icon-list">
                        <li><span className="sva-icon sva-icon--xs" data-sva-icon="check"></span> Completed task</li>
                        <li><span className="sva-icon sva-icon--xs" data-sva-icon="clock"></span> Pending task</li>
                        <li><span className="sva-icon sva-icon--xs" data-sva-icon="cross"></span> Cancelled task</li>
                    </ul>
                </div>
            </section>

            <section className="test-section">
                <h2>7. Code Examples</h2>
                <div className="code-examples">
                    <h3>HTML Pattern:</h3>
                    <pre><code>{`<!-- SVA Framework Pattern -->
<span class="sva-icon sva-icon--s" data-sva-icon="plus"></span>
<span class="sva-icon sva-icon--m" data-sva-icon="settings"></span>

<!-- Custom Classes -->
<i class="my-custom-icon" data-sva-icon="car"></i>`}</code></pre>

                    <h3>JavaScript Initialization:</h3>
                    <pre><code>{`import { initializeClassBasedIcons } from 'sva-icons/class-based/auto-register';

await initializeClassBasedIcons({
    registerBundles: ['ui-essentials', 'automotive-core'],
    scanDOM: true,
    enableObserver: true
});`}</code></pre>
                </div>
            </section>

            <style jsx>{`
                .data-attribute-test {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }

                .status .success { color: #28a745; font-weight: bold; }
                .status .pending { color: #ffc107; font-weight: bold; }

                .stats {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #666;
                }

                .test-section {
                    margin-bottom: 40px;
                    padding: 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background: white;
                }

                .test-section h2 {
                    color: #333;
                    margin-bottom: 10px;
                }

                .test-section p {
                    color: #666;
                    margin-bottom: 20px;
                }

                .icon-row {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .sva-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: #333;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 8px;
                    background: #f8f9fa;
                }

                .sva-icon--xs { width: 16px; height: 16px; }
                .sva-icon--s { width: 20px; height: 20px; }
                .sva-icon--m { width: 24px; height: 24px; }
                .sva-icon--l { width: 32px; height: 32px; }
                .sva-icon--xl { width: 48px; height: 48px; }

                .sva-framework-examples {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    align-items: flex-start;
                }

                .sva-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .sva-button--secondary {
                    background: #6c757d;
                }

                .sva-input-group {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .sva-input {
                    padding: 8px 40px 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }

                .input-icon {
                    position: absolute;
                    right: 8px;
                    background: none;
                    border: none;
                    padding: 0;
                }

                .dynamic-section {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .add-button {
                    padding: 8px 16px;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    align-self: flex-start;
                }

                .dynamic-icons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    min-height: 40px;
                    padding: 12px;
                    border: 2px dashed #ddd;
                    border-radius: 4px;
                }

                .dynamic-icon {
                    animation: fadeIn 0.3s ease-in;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }

                .mixed-contexts {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .card {
                    padding: 16px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background: #f8f9fa;
                }

                .icon-list {
                    list-style: none;
                    padding: 0;
                }

                .icon-list li {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 4px 0;
                }

                .code-examples {
                    background: #f8f9fa;
                    padding: 16px;
                    border-radius: 4px;
                }

                .code-examples h3 {
                    margin-top: 20px;
                    margin-bottom: 8px;
                    color: #333;
                    font-size: 16px;
                }

                .code-examples h3:first-child {
                    margin-top: 0;
                }

                pre {
                    background: #2d3748;
                    color: #e2e8f0;
                    padding: 12px;
                    border-radius: 4px;
                    overflow-x: auto;
                    font-size: 13px;
                    line-height: 1.4;
                }

                code {
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                }
            `}</style>
        </div>
    );
}

export default DataAttributeTest;
