import crypto from 'crypto';

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits[0] === '1') return '+' + digits;
  if (phone.trim().startsWith('+')) return phone.trim().replace(/\s/g, '');
  return '+' + digits;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid phone number (at least 10 digits).' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const timestamp = Date.now();
  const secret = process.env.RESEND_API_KEY || 'promedic-otp-secret';
  const hmac = crypto.createHmac('sha256', secret).update(otp + ':' + timestamp).digest('hex');
  const token = Buffer.from(JSON.stringify({ hmac, timestamp })).toString('base64');

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhone) {
    console.error('Twilio env vars not configured');
    return res.status(500).json({ error: 'SMS service is not configured. Please contact support.' });
  }

  const toPhone = formatPhone(phone);

  try {
    const twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: toPhone,
          From: fromPhone,
          Body: `Your Promedic verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`,
        }),
      }
    );

    if (!twilioRes.ok) {
      const errData = await twilioRes.json().catch(() => ({}));
      console.error('Twilio error:', errData);
      return res.status(400).json({
        error: 'Could not send SMS to that number. Please check the number and try again.',
      });
    }

    return res.status(200).json({ token });
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({ error: 'Failed to send verification code. Please try again.' });
  }
}
