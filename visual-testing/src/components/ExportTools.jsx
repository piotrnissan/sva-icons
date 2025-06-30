import React, { useState } from 'react';
import '../styles/components.css';

/**
 * ExportTools Component
 * 
 * Provides export functionality for selected icons in various formats
 */
function ExportTools({ selectedIcons, iconSize, colorTheme }) {
  const [exportFormat, setExportFormat] = useState('zip');
  const [isExporting, setIsExporting] = useState(false);

  // Export formats configuration
  const exportFormats = [
    { id: 'zip', label: 'SVG Files (ZIP)', description: 'Download SVG files in a ZIP archive' },
    { id: 'sprite', label: 'SVG Sprite', description: 'Single SVG sprite with all icons' },
    { id: 'json', label: 'Icon Data (JSON)', description: 'JSON file with icon metadata' },
    { id: 'html', label: 'HTML Preview', description: 'HTML page with all selected icons' },
    { id: 'css', label: 'CSS Classes', description: 'CSS file with icon classes' },
    { id: 'react', label: 'React Components', description: 'React component code snippets' }
  ];

  // Generate SVG files as a ZIP
  const exportAsZip = async () => {
    try {
      // Dynamic import of JSZip for client-side ZIP creation
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add each selected icon as an SVG file
      selectedIcons.forEach(icon => {
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${icon.svg}`;
        zip.file(`${icon.name}.svg`, svgContent);
      });

      // Generate ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Download the ZIP file
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sva-icons-export-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Failed to export as ZIP:', error);
      alert('Failed to export icons as ZIP. Please try again.');
    }
  };

  // Generate SVG sprite
  const exportAsSprite = () => {
    const spriteContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
${selectedIcons.map(icon => `
  <symbol id="icon-${icon.name}" viewBox="0 0 24 24">
    ${icon.svg.replace(/<svg[^>]*>|<\/svg>/g, '')}
  </symbol>`).join('')}
</svg>`;

    downloadFile(spriteContent, `sva-icons-sprite-${new Date().toISOString().split('T')[0]}.svg`, 'image/svg+xml');
  };

  // Generate JSON data
  const exportAsJson = () => {
    const jsonData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalIcons: selectedIcons.length,
        iconSize: iconSize,
        colorTheme: colorTheme,
        source: 'SVA Icons Visual Testing App'
      },
      icons: selectedIcons.map(icon => ({
        name: icon.name,
        category: icon.category,
        tags: icon.tags || [],
        svg: icon.svg,
        className: `sva-icon-${icon.name}`
      }))
    };

    downloadFile(JSON.stringify(jsonData, null, 2), `sva-icons-data-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  // Generate HTML preview
  const exportAsHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVA Icons Export - ${new Date().toLocaleDateString()}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .icon-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .icon-svg {
            width: 48px;
            height: 48px;
            margin: 0 auto 10px;
            color: ${getThemeColor(colorTheme)};
        }
        .icon-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
        }
        .icon-class {
            font-size: 12px;
            color: #666;
            font-family: monospace;
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: 5px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>SVA Icons Export</h1>
        <p>Exported ${selectedIcons.length} icons on ${new Date().toLocaleDateString()}</p>
        <p>Size: ${iconSize.toUpperCase()} | Theme: ${colorTheme}</p>
    </div>
    <div class="icon-grid">
        ${selectedIcons.map(icon => `
        <div class="icon-card">
            <div class="icon-svg">${icon.svg}</div>
            <div class="icon-name">${icon.name}</div>
            <div class="icon-class">sva-icon-${icon.name}</div>
        </div>
        `).join('')}
    </div>
</body>
</html>`;

    downloadFile(htmlContent, `sva-icons-preview-${new Date().toISOString().split('T')[0]}.html`, 'text/html');
  };

  // Generate CSS classes
  const exportAsCss = () => {
    const cssContent = `/* SVA Icons CSS Classes */
/* Exported on ${new Date().toISOString()} */
/* Total icons: ${selectedIcons.length} */

/* Base icon styles */
.sva-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
}

/* Icon size variations */
.sva-icon--xs { width: 12px; height: 12px; }
.sva-icon--s { width: 16px; height: 16px; }
.sva-icon--m { width: 24px; height: 24px; }
.sva-icon--l { width: 32px; height: 32px; }
.sva-icon--xl { width: 48px; height: 48px; }

/* Individual icon classes */
${selectedIcons.map(icon => `
.sva-icon-${icon.name}::before {
    content: url("data:image/svg+xml,${encodeURIComponent(icon.svg)}");
}`).join('')}

/* Color theme variations */
.sva-icon--primary { color: #007acc; }
.sva-icon--secondary { color: #6c757d; }
.sva-icon--success { color: #28a745; }
.sva-icon--warning { color: #ffc107; }
.sva-icon--error { color: #dc3545; }
.sva-icon--light-gray { color: #9e9e9e; }
`;

    downloadFile(cssContent, `sva-icons-classes-${new Date().toISOString().split('T')[0]}.css`, 'text/css');
  };

  // Generate React components
  const exportAsReact = () => {
    const reactContent = `// SVA Icons React Components
// Exported on ${new Date().toISOString()}
// Total icons: ${selectedIcons.length}

import React from 'react';

${selectedIcons.map(icon => {
  const componentName = toPascalCase(icon.name);
  return `
// ${icon.name} Icon Component
export const ${componentName}Icon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={\`sva-icon sva-icon-${icon.name} \${className}\`}
    {...props}
  >
    ${icon.svg.replace(/<svg[^>]*>|<\/svg>/g, '').trim()}
  </svg>
);
`;
}).join('')}

// Icon registry for dynamic usage
export const iconRegistry = {
${selectedIcons.map(icon => `  '${icon.name}': ${toPascalCase(icon.name)}Icon`).join(',\n')}
};

// Dynamic icon component
export const DynamicIcon = ({ name, ...props }) => {
  const IconComponent = iconRegistry[name];
  if (!IconComponent) {
    console.warn(\`Icon "\${name}" not found in registry\`);
    return null;
  }
  return <IconComponent {...props} />;
};
`;

    downloadFile(reactContent, `sva-icons-react-${new Date().toISOString().split('T')[0]}.jsx`, 'text/javascript');
  };

  // Helper function to download files
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper function to get theme color
  const getThemeColor = (theme) => {
    const colors = {
      'default': '#333',
      'primary': '#007acc',
      'secondary': '#6c757d',
      'success': '#28a745',
      'warning': '#ffc107',
      'error': '#dc3545',
      'inverted': '#ffffff',
      'light-gray': '#9e9e9e'
    };
    return colors[theme] || colors['default'];
  };

  // Helper function to convert to PascalCase
  const toPascalCase = (str) => {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  // Handle export execution
  const handleExport = async () => {
    if (selectedIcons.length === 0) {
      alert('Please select at least one icon to export.');
      return;
    }

    setIsExporting(true);

    try {
      switch (exportFormat) {
        case 'zip':
          await exportAsZip();
          break;
        case 'sprite':
          exportAsSprite();
          break;
        case 'json':
          exportAsJson();
          break;
        case 'html':
          exportAsHtml();
          break;
        case 'css':
          exportAsCss();
          break;
        case 'react':
          exportAsReact();
          break;
        default:
          throw new Error('Unknown export format');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-tools export-tools--sidebar">
      <div className="export-tools__content">
        {/* Export Format Selection */}
        <div className="export-tools__format-selection">
          <label className="export-tools__label">Export Format:</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="export-tools__format-select"
          >
            {exportFormats.map(format => (
              <option key={format.id} value={format.id}>
                {format.label}
              </option>
            ))}
          </select>
          <p className="export-tools__format-description">
            {exportFormats.find(f => f.id === exportFormat)?.description || ''}
          </p>
        </div>

        {/* Export Button */}
        <div className="export-tools__actions">
          <button
            onClick={handleExport}
            disabled={selectedIcons.length === 0 || isExporting}
            className="export-tools__export-btn export-tools__export-btn--sidebar"
          >
            {isExporting ? (
              <>
                <div className="export-tools__spinner"></div>
                Exporting...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Export
              </>
            )}
          </button>
        </div>

        {/* Export Info */}
        <div className="export-tools__info export-tools__info--compact">
          <p><strong>Settings:</strong></p>
          <ul>
            <li>Size: {iconSize.toUpperCase()}</li>
            <li>Theme: {colorTheme}</li>
            <li>Count: {selectedIcons.length}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ExportTools;
