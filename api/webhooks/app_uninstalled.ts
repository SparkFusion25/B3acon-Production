import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';

function verifyWebhook(data: string, signature: string): boolean {
  const calculated = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(data, 'utf8')
    .digest('base64');
  
  return calculated === signature;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-shopify-hmac-sha256'] as string;
    const body = JSON.stringify(req.body);

    if (!verifyWebhook(body, signature)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { domain, id } = req.body;
    
    // Log app uninstallation
    console.log(`B3ACON app uninstalled from store: ${domain} (ID: ${id})`);
    
    // Here you would typically:
    // 1. Remove store data from your database
    // 2. Cancel any active subscriptions
    // 3. Send notification to your team
    // 4. Update analytics

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}