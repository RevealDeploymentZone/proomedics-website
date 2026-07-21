export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, medication, other_medication, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const selectedMed = medication === 'Other' ? (other_medication || 'Other') : (medication || 'Not specified');

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #0a5c5c, #0d8080); padding: 20px; border-radius: 6px 6px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Contact Form Enquiry</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 5px 0 0;">Promedic Website</p>
      </div>
      <div style="padding: 25px; background: #fff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; color: #666; width: 35%;"><strong>Name</strong></td>
            <td style="padding: 10px 0; color: #333;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; color: #666;"><strong>Email</strong></td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0d8080;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; color: #666;"><strong>Phone</strong></td>
            <td style="padding: 10px 0; color: #333;">${phone || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; color: #666;"><strong>Medication</strong></td>
            <td style="padding: 10px 0; color: #333; font-weight: bold;">${selectedMed}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; vertical-align: top;"><strong>Message</strong></td>
            <td style="padding: 10px 0; color: #333;">${message.replace(/\n/g, '<br>')}</td>
          </tr>
        </table>
      </div>
      <div style="padding: 15px 25px; background: #f9f9f9; border-radius: 0 0 6px 6px; text-align: center;">
        <p style="color: #999; font-size: 13px; margin: 0;">Promedic &mdash; Licensed US Online Pharmacy &mdash; www.proomedic.com</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Promedic Contact <noreply@proomedic.com>',
        to: ['promedic.rx@gmail.com'],
        reply_to: email,
        subject: `New Enquiry: ${selectedMed} — ${name}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Resend error:', errorData);
      return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
