const twilio = require('twilio');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const { to, body } = req.body;

  try {
    const message = await client.messages.create({
      body: body,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: to
    });
    
    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};