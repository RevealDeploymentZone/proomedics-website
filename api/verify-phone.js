import crypto from 'crypto';

const OTP_TTL_MS = 10 * 60 * 1000;

function verifyToken(otp, token, secret) {
  try {
    const { hmac, timestamp } = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (Date.now() - timestamp > OTP_TTL_MS) {
      return { valid: false, reason: 'Code has expired. Please request a new one.' };
    }
    const expected = crypto.createHmac('sha256', secret).update(otp + ':' + timestamp).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expected, 'hex'))) {
      return { valid: false, reason: 'Incorrect code. Please try again.' };
    }
    return { valid: true };
  } catch (e) {
    return { valid: false, reason: 'Invalid verification session. Please go back and try again.' };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { otp, token } = req.body;

  if (!otp || !token) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const secret = process.env.RESEND_API_KEY || 'promedic-otp-secret';
  const result = verifyToken(otp, token, secret);

  if (!result.valid) {
    return res.status(400).json({ error: result.reason });
  }

  return res.status(200).json({ success: true });
}
