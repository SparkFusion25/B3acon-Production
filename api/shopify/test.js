// Simple test endpoint for Shopify parameters
export default function handler(req, res) {
  console.log('🧪 Test endpoint called');
  console.log('Method:', req.method);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({
    success: true,
    method: req.method,
    query: req.query,
    body: req.body,
    message: 'Test endpoint working'
  });
}