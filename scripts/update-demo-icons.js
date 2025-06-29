// update-demo-icons.js: Update the demo with real icon registry
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

console.log('🔄 Updating demo with real icon registry...');

// Read the icons registry
const iconsJsonPath = path.join(projectRoot, 'icons.json');
if (!fs.existsSync(iconsJsonPath)) {
    console.error('❌ icons.json not found. Run the Figma export processor first.');
    process.exit(1);
}

const iconsData = JSON.parse(fs.readFileSync(iconsJsonPath, 'utf8'));
const iconRegistry = iconsData.icons;
const iconNames = Object.keys(iconRegistry);

console.log(`📊 Found ${iconNames.length} icons in registry`);

// Create a simplified registry for the demo (just the icon names with their SVG content)
const demoRegistry = {};
iconNames.forEach(iconName => {
    // Extract just the path content for the demo
    const svgContent = iconRegistry[iconName];
    
    // Try to extract just the path content from the full SVG
    const pathMatch = svgContent.match(/<path[^>]*d="([^"]*)"[^>]*>/);
    if (pathMatch) {
        demoRegistry[iconName] = `<svg viewBox="0 0 24 24"><path d="${pathMatch[1]}" fill="currentColor"/></svg>`;
    } else {
        // If we can't extract the path, use the full SVG but clean it up
        demoRegistry[iconName] = svgContent
            .replace(/width="[^"]*"/, '')
            .replace(/height="[^"]*"/, '')
            .replace(/fill="[^"]*"/g, 'fill="currentColor"')
            .replace(/xmlns="[^"]*"/, '');
    }
});

// Read the current demo file
const demoPath = path.join(projectRoot, 'demo-class-based.html');
let demoContent = fs.readFileSync(demoPath, 'utf8');

// Find the iconRegistry object in the demo and replace it
const registryStart = demoContent.indexOf('const iconRegistry = {');
const registryEnd = demoContent.indexOf('};', registryStart) + 2;

if (registryStart === -1 || registryEnd === -1) {
    console.error('❌ Could not find iconRegistry in demo file');
    process.exit(1);
}

// Create the new registry string
const newRegistryString = `const iconRegistry = ${JSON.stringify(demoRegistry, null, 4)};`;

// Replace the old registry with the new one
const updatedContent = demoContent.substring(0, registryStart) + 
                      newRegistryString + 
                      demoContent.substring(registryEnd);

// Write the updated demo file
fs.writeFileSync(demoPath, updatedContent);

console.log(`✅ Updated demo with ${iconNames.length} real icons`);
console.log(`📁 Updated: ${demoPath}`);

// Also update the available icons list for the demo
const availableIconsStart = updatedContent.indexOf('const availableIcons = [');
const availableIconsEnd = updatedContent.indexOf('];', availableIconsStart) + 2;

if (availableIconsStart !== -1 && availableIconsEnd !== -1) {
    // Create a list of some common icons for the demo
    const commonIcons = iconNames.filter(name => 
        ['alert', 'check', 'error', 'info', 'car', 'battery', 'star', 'gear', 'download', 'circle', 'arrow', 'menu', 'close', 'plus', 'minus'].some(keyword => 
            name.includes(keyword)
        )
    ).slice(0, 20);
    
    const newAvailableIconsString = `const availableIcons = ${JSON.stringify(commonIcons, null, 4)};`;
    
    const finalContent = updatedContent.substring(0, availableIconsStart) + 
                        newAvailableIconsString + 
                        updatedContent.substring(availableIconsEnd);
    
    fs.writeFileSync(demoPath, finalContent);
    console.log(`📝 Updated availableIcons list with ${commonIcons.length} common icons`);
}

console.log('🎉 Demo update completed successfully!');
