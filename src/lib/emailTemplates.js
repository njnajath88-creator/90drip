/**
 * Generate 90DRIP HTML Email Template for Order Confirmation
 */
export function getOrderConfirmationHtml(order) {
  const items = Array.isArray(order.cartItems) && order.cartItems.length > 0
    ? order.cartItems
    : [];

  const itemsHtml = items.map((item) => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${item.image || 'https://90drip.com/images/jersey_product1.png'}" alt="${item.name}" width="48" height="58" style="object-fit: cover; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;" />
          <div>
            <div style="font-weight: 800; color: #0f172a; font-size: 14px;">${item.name}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
              Size: <strong style="color: #2563eb;">${item.size || 'M'}</strong> ${item.customName ? `· Name: ${item.customName}` : ''} ${item.customNumber ? `(#${item.customNumber})` : ''}
            </div>
          </div>
        </div>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: 700; color: #0f172a; font-size: 14px;">
        x${item.quantity || 1}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 900; color: #0f172a; font-size: 14px;">
        ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
      </td>
    </tr>
  `).join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed - 90DRIP</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
            <!-- HEADER BANNER -->
            <tr>
              <td style="background-color: #0f172a; padding: 30px 24px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: 0.1em; margin: 0 0 6px; text-transform: uppercase;">
                  90DRIP
                </h1>
                <p style="color: #94a3b8; font-size: 13px; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                  Retro Streetwear & Vintage Jerseys
                </p>
              </td>
            </tr>

            <!-- SUCCESS BADGE BANNER -->
            <tr>
              <td style="background-color: #f0fdf4; padding: 16px 24px; border-bottom: 1px solid #bbf7d0; text-align: center;">
                <span style="color: #16a34a; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;">
                  ✓ Order Confirmed · ID #${order.id}
                </span>
              </td>
            </tr>

            <!-- CONTENT BODY -->
            <tr>
              <td style="padding: 28px 24px;">
                <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px;">
                  Hey ${order.customer || 'Customer'},
                </h2>
                <p style="font-size: 14px; color: #475569; margin: 0 0 20px; line-height: 1.5;">
                  Thank you for securing your drip! We've received your order and our packing team is preparing your vintage jersey for shipment.
                </p>

                <!-- ITEMS TABLE -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #f8fafc;">
                      <th style="padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; border-bottom: 1.5px solid #e2e8f0;">Item Details</th>
                      <th style="padding: 10px 16px; text-align: center; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; border-bottom: 1.5px solid #e2e8f0;">Qty</th>
                      <th style="padding: 10px 16px; text-align: right; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; border-bottom: 1.5px solid #e2e8f0;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml || `<tr><td colSpan="3" style="padding:16px; text-align:center; color:#64748b;">${order.items || 'Custom Order'}</td></tr>`}
                  </tbody>
                </table>

                <!-- TOTAL BREAKDOWN -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                  <tr>
                    <td style="font-size: 13px; color: #64748b; font-weight: 600; padding: 4px 0;">Payment Method</td>
                    <td style="font-size: 13px; color: #0f172a; font-weight: 800; text-align: right; text-transform: uppercase; padding: 4px 0;">${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid'}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #64748b; font-weight: 600; padding: 4px 0;">Delivery Express Fee</td>
                    <td style="font-size: 13px; color: #16a34a; font-weight: 800; text-align: right; padding: 4px 0;">FREE</td>
                  </tr>
                  <tr>
                    <td style="font-size: 16px; color: #0f172a; font-weight: 900; padding-top: 10px; border-top: 1px solid #e2e8f0;">Grand Total</td>
                    <td style="font-size: 18px; color: #2563eb; font-weight: 900; text-align: right; padding-top: 10px; border-top: 1px solid #e2e8f0;">₹${(order.total || 0).toLocaleString()}</td>
                  </tr>
                </table>

                <!-- SHIPPING ADDRESS -->
                <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                  <h3 style="font-size: 12px; font-weight: 900; color: #64748b; text-transform: uppercase; margin: 0 0 6px; letter-spacing: 0.04em;">
                    Shipping Address
                  </h3>
                  <div style="font-size: 13px; color: #0f172a; font-weight: 700; line-height: 1.4;">
                    ${order.address || 'Address provided during checkout'}
                  </div>
                  ${order.phone ? `<div style="font-size: 12px; color: #64748b; margin-top: 4px;">Phone: ${order.phone}</div>` : ''}
                </div>

                <!-- CTA BUTTON -->
                <div style="text-align: center; margin-top: 10px;">
                  <a href="https://90drip.com/orders" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 900; padding: 14px 28px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.05em;">
                    View Order Details →
                  </a>
                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0 0 6px; font-weight: 600;">
                  Need help with your order? Reply directly to this email or contact support.
                </p>
                <p style="font-size: 11px; color: #cbd5e1; margin: 0; font-weight: 700; text-transform: uppercase;">
                  © 90DRIP Streetwear · All Rights Reserved
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Generate 90DRIP HTML Email Template for Shipping Status Update
 */
export function getShippingStatusHtml(order, trackingDetails = {}) {
  const trackingNumber = trackingDetails.trackingNumber || `TRK-${order.id}`;
  const courierName = trackingDetails.courierName || "Express Courier";
  const trackingUrl = trackingDetails.trackingUrl || "https://90drip.com/orders";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Shipped! - 90DRIP</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
            <!-- HEADER BANNER -->
            <tr>
              <td style="background-color: #0f172a; padding: 30px 24px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: 0.1em; margin: 0 0 6px; text-transform: uppercase;">
                  90DRIP
                </h1>
                <p style="color: #94a3b8; font-size: 13px; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                  Retro Streetwear & Vintage Jerseys
                </p>
              </td>
            </tr>

            <!-- SHIPPED BANNER -->
            <tr>
              <td style="background-color: #eff6ff; padding: 16px 24px; border-bottom: 1px solid #bfdbfe; text-align: center;">
                <span style="color: #1d4ed8; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;">
                  🚚 Good News! Order #${order.id} Has Shipped
                </span>
              </td>
            </tr>

            <!-- CONTENT BODY -->
            <tr>
              <td style="padding: 28px 24px;">
                <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px;">
                  Hey ${order.customer || 'Customer'},
                </h2>
                <p style="font-size: 14px; color: #475569; margin: 0 0 24px; line-height: 1.5;">
                  Your package has been dispatched from our warehouse and is on its way to your delivery address!
                </p>

                <!-- TRACKING BOX -->
                <div style="background-color: #f8fafc; border: 1.5px solid #2563eb; padding: 20px; border-radius: 14px; margin-bottom: 24px;">
                  <div style="font-size: 11px; font-weight: 900; color: #2563eb; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">
                    Shipment Tracking Info
                  </div>
                  <div style="font-size: 14px; color: #0f172a; font-weight: 800; margin-bottom: 4px;">
                    Courier Partner: <span style="font-weight: 700; color: #475569;">${courierName}</span>
                  </div>
                  <div style="font-size: 14px; color: #0f172a; font-weight: 800; margin-bottom: 16px;">
                    Tracking ID: <span style="font-family: monospace; font-size: 15px; color: #0f172a; background: #ffffff; padding: 2px 6px; border-radius: 6px; border: 1px solid #cbd5e1;">${trackingNumber}</span>
                  </div>

                  <a href="${trackingUrl}" style="display: block; width: 100%; text-align: center; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 900; padding: 12px 0; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.04em;">
                    Track Package Live →
                  </a>
                </div>

                <!-- ITEMS SUMMARY -->
                <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                  <div style="font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">
                    Package Contents:
                  </div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a;">
                    ${order.items || '90DRIP Vintage Jersey'}
                  </div>
                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0 0 6px; font-weight: 600;">
                  Questions about your delivery? Reach out to 90DRIP Customer Support anytime.
                </p>
                <p style="font-size: 11px; color: #cbd5e1; margin: 0; font-weight: 700; text-transform: uppercase;">
                  © 90DRIP Streetwear · All Rights Reserved
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
