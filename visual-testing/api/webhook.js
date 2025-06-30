/**
 * Vercel Serverless Function to handle rebuild webhooks
 * This endpoint will be called when sva-icons package is published
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { package: packageName, version, source = 'manual' } = req.body;

    // Log the webhook trigger
    console.log('🔄 Webhook triggered:', {
      package: packageName,
      version,
      source,
      timestamp: new Date().toISOString()
    });

    // Validate the package name
    if (packageName !== 'sva-icons') {
      return res.status(400).json({ 
        error: 'Invalid package name',
        received: packageName,
        expected: 'sva-icons'
      });
    }

    // Optional: Verify webhook secret (for security)
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const providedSecret = req.headers['x-webhook-secret'];
    
    if (webhookSecret && providedSecret !== webhookSecret) {
      console.log('❌ Invalid webhook secret');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // If we have a Vercel build hook URL, trigger it
    const buildHookUrl = process.env.VERCEL_BUILD_HOOK_URL;
    if (buildHookUrl) {
      console.log('🚀 Triggering Vercel rebuild...');
      
      const buildResponse = await fetch(buildHookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: `sva-icons v${version} published`,
          source: source
        })
      });

      if (buildResponse.ok) {
        console.log('✅ Vercel rebuild triggered successfully');
      } else {
        console.log('⚠️ Failed to trigger Vercel rebuild:', buildResponse.status);
      }
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Visual testing rebuild triggered for sva-icons v${version}`,
      package: packageName,
      version,
      source,
      timestamp: new Date().toISOString(),
      buildTriggered: !!buildHookUrl
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
