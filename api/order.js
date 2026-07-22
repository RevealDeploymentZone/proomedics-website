function buildOrderEmailHtml(order, ref) {
  const items = (order.items || []).map(item =>
    `<tr>
      <td style="padding:8px 0;color:#333;">${item.name}</td>
      <td style="padding:8px 0;color:#333;text-align:center;">x${item.qty}</td>
      <td style="padding:8px 0;color:#333;text-align:right;">$${(item.price * item.qty).toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#2E6A6A,#4A8B8B);padding:24px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;">New Order Received</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;">Promedic Online Pharmacy &mdash; Ref: ${ref}</p>
      </div>

      <div style="padding:28px;background:#fff;">
        <div style="background:#E8F4F4;border-left:4px solid #4A8B8B;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
          <p style="margin:0;font-size:15px;color:#2E6A6A;font-weight:bold;">ACTION REQUIRED</p>
          <p style="margin:8px 0 0;font-size:14px;color:#2C3E50;">A new order has been placed. Please contact the customer within 24 hours to confirm payment and shipping.</p>
        </div>

        <h2 style="color:#2E6A6A;font-size:16px;margin:0 0 12px;">Customer Details</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:8px 0;color:#666;width:35%;"><strong>Name</strong></td>
            <td style="padding:8px 0;color:#333;">${order.firstName} ${order.lastName}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:8px 0;color:#666;"><strong>Email</strong></td>
            <td style="padding:8px 0;"><a href="mailto:${order.email}" style="color:#4A8B8B;">${order.email}</a></td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:8px 0;color:#666;"><strong>Phone</strong></td>
            <td style="padding:8px 0;color:#333;">${order.phone}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:8px 0;color:#666;"><strong>Address</strong></td>
            <td style="padding:8px 0;color:#333;">${order.address}, ${order.city}, ${order.state} ${order.zip}, ${order.country}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:8px 0;color:#666;"><strong>Payment</strong></td>
            <td style="padding:8px 0;color:#333;font-weight:bold;">${order.payment}</td>
          </tr>
          ${order.notes ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top;"><strong>Notes</strong></td><td style="padding:8px 0;color:#333;">${order.notes}</td></tr>` : ''}
        </table>

        <h2 style="color:#2E6A6A;font-size:16px;margin:0 0 12px;">Items Ordered</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
          <thead>
            <tr style="background:#E8F4F4;">
              <th style="padding:8px;text-align:left;color:#2E6A6A;">Item</th>
              <th style="padding:8px;text-align:center;color:#2E6A6A;">Qty</th>
              <th style="padding:8px;text-align:right;color:#2E6A6A;">Price</th>
            </tr>
          </thead>
          <tbody>${items}</tbody>
          <tfoot>
            <tr style="border-top:1px solid #e0e0e0;">
              <td colspan="2" style="padding:8px 0;color:#666;text-align:right;">Subtotal</td>
              <td style="padding:8px 0;color:#333;text-align:right;">$${order.subtotal}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 0;color:#666;text-align:right;">Shipping</td>
              <td style="padding:8px 0;color:#333;text-align:right;">$${order.shipping}</td>
            </tr>
            <tr style="background:#E8F4F4;">
              <td colspan="2" style="padding:10px 8px;color:#2E6A6A;font-weight:bold;text-align:right;">Total</td>
              <td style="padding:10px 8px;color:#2E6A6A;font-weight:bold;text-align:right;">$${order.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="padding:14px 28px;background:#f9f9f9;text-align:center;">
        <p style="color:#999;font-size:12px;margin:0;">Promedic &mdash; Licensed US Online Pharmacy &mdash; www.proomedic.com</p>
      </div>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const order = req.body;

  if (!order || !order.email || !order.items || order.items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  const ref = 'PMC-' + Date.now().toString(36).toUpperCase();
  const emailHtml = buildOrderEmailHtml(order, ref);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Promedic Orders <noreply@proomedic.com>',
        to: ['promedic.rx@gmail.com'],
        reply_to: order.email,
        subject: `New Order ${ref} — ${order.firstName} ${order.lastName} — $${order.total}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Resend error:', errData);
      return res.status(500).json({ error: 'Failed to place order. Please try again.' });
    }

    return res.status(200).json({ success: true, ref });
  } catch (err) {
    console.error('Order error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
