#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function listAvailableIcons() {
    try {
        console.log('🔍 Scanning for available SVA Icons...\n');
        
        // 1. Check SVG source files
        const svgDir = path.join(projectRoot, 'svg');
        const svgFiles = await fs.readdir(svgDir);
        const svgIcons = svgFiles
            .filter(file => file.endsWith('.svg'))
            .map(file => file.replace('.svg', ''))
            .sort();

        console.log(`📁 SVG Source Files (${svgIcons.length}):`);
        svgIcons.forEach(icon => console.log(`   • ${icon}`));
        console.log('');

        // 2. Check built icon files
        const iconsDist = path.join(projectRoot, 'dist', 'icons', 'esm');
        try {
            const distFiles = await fs.readdir(iconsDist);
            const distIcons = distFiles
                .filter(file => file.endsWith('.js') && !file.includes('index') && !file.includes('.d.ts'))
                .map(file => file.replace('.js', ''))
                .sort();

            console.log(`🔧 Built Icon Files (${distIcons.length}):`);
            distIcons.slice(0, 20).forEach(icon => console.log(`   • ${icon}`));
            if (distIcons.length > 20) {
                console.log(`   ... and ${distIcons.length - 20} more`);
            }
            console.log('');

            // 3. Find missing icons (in dist but not in svg source)
            const missingInSvg = distIcons.filter(icon => !svgIcons.includes(icon));
            if (missingInSvg.length > 0) {
                console.log(`❓ Icons in build but missing from SVG source (${missingInSvg.length}):`);
                missingInSvg.slice(0, 10).forEach(icon => console.log(`   • ${icon}`));
                if (missingInSvg.length > 10) {
                    console.log(`   ... and ${missingInSvg.length - 10} more`);
                }
                console.log('');
            }

            // 4. Generate test page data
            const testIcons = [...new Set([...svgIcons, ...distIcons.slice(0, 50)])].sort();
            
            console.log(`✅ Recommended icons for testing (${testIcons.length}):`);
            console.log('Copy this array to use in your test page:\n');
            
            const iconArray = testIcons.map(icon => `'${icon}'`).join(',\n            ');
            console.log(`const availableIcons = [
            ${iconArray}
        ];\n`);

        } catch (error) {
            console.log('⚠️  Could not read built icons directory');
            console.log('   Run npm run build:icons first\n');
        }

        // 5. Generate HTML snippet
        console.log('📋 HTML Test Snippet:');
        console.log('<div class="icon-test">');
        svgIcons.slice(0, 6).forEach(icon => {
            console.log(`    <i class="sva-icon-${icon}" title="${icon}"></i>`);
        });
        console.log('</div>\n');

        // 6. Instructions
        console.log('🚀 Next Steps:');
        console.log('1. Open tests/class-based-test.html in your browser');
        console.log('2. Check browser console for any loading errors');
        console.log('3. Verify icons are displaying correctly');
        console.log('4. Test different sizes and search functionality');
        console.log('');
        console.log('📝 To view the test page:');
        console.log('   • Start a local server: npm run dev (if available)');
        console.log('   • Or use Live Server extension in VS Code');
        console.log('   • Or open file:// directly in browser');

    } catch (error) {
        console.error('❌ Error scanning icons:', error.message);
        process.exit(1);
    }
}

listAvailableIcons();
