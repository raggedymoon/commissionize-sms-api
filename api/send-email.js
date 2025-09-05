const { Resend } = require('resend');

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

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { to, subject, html, message } = req.body;

    const data = await resend.emails.send({
      from: 'Commissionize <noreply@commissionize.com>',
      to: to,
      subject: subject || 'Message from Commissionize',
      html: html || `<p>${message}</p>`
    });
    
    res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};