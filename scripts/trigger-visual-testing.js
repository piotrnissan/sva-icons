#!/usr/bin/env node

/**
 * Trigger Visual Testing Rebuild Script
 * 
 * This script is called after npm publish to trigger
 * the visual testing app rebuild on Vercel
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get version
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

console.log('🚀 SVA Icons Post-Publish Hook');
console.log(`📦 Package: ${packageJson.name} v${packageJson.version}`);

// Configuration from environment variables
const config = {
  webhookUrl: process.env.VISUAL_TESTING_WEBHOOK_URL,
  buildHookUrl: process.env.VERCEL_BUILD_HOOK_URL,
  webhookSecret: process.env.VISUAL_TESTING_WEBHOOK_SECRET,
  enableTrigger: process.env.ENABLE_VISUAL_TESTING_TRIGGER !== 'false'
};

/**
 * Trigger the visual testing rebuild
 */
async function triggerRebuild() {
  if (!config.enableTrigger) {
    console.log('⚠️ Visual testing trigger disabled by environment variable');
    return;
  }

  const promises = [];
  
  // Trigger Vercel build hook if available
  if (config.buildHookUrl) {
    console.log('🔄 Triggering Vercel build hook...');
    promises.push(triggerBuildHook());
  } else {
    console.log('⚠️ VERCEL_BUILD_HOOK_URL not set, skipping build hook');
  }
  
  // Trigger webhook endpoint if available
  if (config.webhookUrl) {
    console.log('📢 Triggering webhook endpoint...');
    promises.push(triggerWebhook());
  } else {
    console.log('⚠️ VISUAL_TESTING_WEBHOOK_URL not set, skipping webhook');
  }
  
  if (promises.length === 0) {
    console.log('⚠️ No trigger URLs configured. Set VERCEL_BUILD_HOOK_URL or VISUAL_TESTING_WEBHOOK_URL');
    console.log('💡 Example:');
    console.log('   export VERCEL_BUILD_HOOK_URL="https://api.vercel.com/v1/integrations/deploy/prj_xxx"');
    console.log('   export VISUAL_TESTING_WEBHOOK_URL="https://your-visual-testing.vercel.app/api/webhook"');
    return;
  }
  
  try {
    const results = await Promise.allSettled(promises);
    
    let successCount = 0;
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
        console.log(`✅ Trigger ${index + 1} succeeded:`, result.value);
      } else {
        console.log(`❌ Trigger ${index + 1} failed:`, result.reason);
      }
    });
    
    if (successCount > 0) {
      console.log(`🎉 Successfully triggered ${successCount}/${promises.length} rebuild methods`);
      console.log('⏱️ Visual testing should update within 2-3 minutes');
    } else {
      console.log('❌ All trigger methods failed');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

/**
 * Trigger Vercel build hook
 */
async function triggerBuildHook() {
  const response = await fetch(config.buildHookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reason: `sva-icons v${packageJson.version} published`,
      source: 'npm-postpublish'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Build hook failed: ${response.status} ${response.statusText}`);
  }
  
  return 'Vercel build hook triggered';
}

/**
 * Trigger webhook endpoint
 */
async function triggerWebhook() {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add webhook secret if configured
  if (config.webhookSecret) {
    headers['X-Webhook-Secret'] = config.webhookSecret;
  }
  
  const response = await fetch(config.webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      package: packageJson.name,
      version: packageJson.version,
      source: 'npm-postpublish',
      timestamp: new Date().toISOString()
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Webhook failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const result = await response.json();
  return `Webhook triggered: ${result.message || 'Success'}`;
}

// Run the script
triggerRebuild().catch(error => {
  console.error('❌ Post-publish trigger failed:', error);
  // Don't exit with error code to avoid failing the publish
  console.log('⚠️ Publish succeeded, but visual testing trigger failed');
});
