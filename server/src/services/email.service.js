import nodemailer from "nodemailer";
import { getEmailConfig } from "../config/sendmail.js";
import GeneralSettings from "../models/GeneralSettings.js";

/**
 * Send order confirmation email with invoice attachment
 */
export const sendOrderConfirmationEmail = async (order, invoicePDFBuffer) => {
  try {
    // Get email configuration
    const emailConfig = await getEmailConfig();
    const transporter = nodemailer.createTransport(emailConfig);

    // Get company settings
    const settings = await GeneralSettings.findOne({ settingsId: "global" });
    const companyName = settings?.companyName || "The Print Emporium";
    const companyEmail = settings?.companyEmail || emailConfig.from;

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f8f9fb;
          }
          .container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0, 33, 160, 0.08);
          }
          .header {
            background: linear-gradient(135deg, #0021a0 0%, #0033cc 100%);
            color: white;
            padding: 48px 32px;
            text-align: left;
          }
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 6px;
            letter-spacing: -0.5px;
            line-height: 1.2;
          }
          .header p {
            font-size: 15px;
            opacity: 0.95;
            font-weight: 400;
          }
          .content {
            padding: 40px 32px;
          }
          .greeting {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 16px;
            color: #1a1a1a;
          }
          .intro-text {
            font-size: 15px;
            color: #4a4a4a;
            margin-bottom: 32px;
            line-height: 1.7;
          }
          .order-section {
            margin: 32px 0;
          }
          .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: #0021a0;
            letter-spacing: 0.8px;
            margin-bottom: 18px;
          }
          .order-details {
            background: linear-gradient(135deg, #f8f9fb 0%, #eef2ff 100%);
            border-left: 4px solid #0021a0;
            padding: 22px;
            margin-bottom: 20px;
            border-radius: 6px;
          }
          .order-number {
            font-size: 22px;
            font-weight: 700;
            color: #0021a0;
            margin-bottom: 16px;
            letter-spacing: -0.3px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
            border-bottom: 1px solid rgba(0, 33, 160, 0.1);
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #666;
          }
          .detail-value {
            color: #1a1a1a;
            text-align: right;
            font-weight: 500;
          }
          .status-badge {
            display: inline-block;
            background: #e8f5e9;
            color: #2e7d32;
            padding: 4px 10px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .total-section {
            background: linear-gradient(135deg, #f8f9fb 0%, #eef2ff 100%);
            border: 1px solid rgba(0, 33, 160, 0.1);
            padding: 28px 24px;
            margin: 32px 0;
            text-align: center;
            border-radius: 6px;
          }
          .total-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .total-amount {
            font-size: 36px;
            font-weight: 700;
            color: #0021a0;
            letter-spacing: -0.5px;
          }
          .items-container {
            margin: 32px 0;
          }
          .item {
            padding: 16px 0;
            border-bottom: 1px solid #e8ecf1;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-name {
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 6px;
            font-size: 15px;
          }
          .item-specs {
            font-size: 13px;
            color: #666;
            line-height: 1.6;
          }
          .address-block {
            background: linear-gradient(135deg, #f8f9fb 0%, #eef2ff 100%);
            padding: 22px;
            margin: 32px 0;
            border-radius: 6px;
            border: 1px solid rgba(0, 33, 160, 0.1);
          }
          .address-block h3 {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: #0021a0;
            letter-spacing: 0.8px;
            margin-bottom: 14px;
          }
          .address-text {
            font-size: 14px;
            color: #1a1a1a;
            line-height: 1.8;
          }
          .next-steps {
            margin: 32px 0;
            font-size: 14px;
            color: #1a1a1a;
          }
          .next-steps h3 {
            color: #0021a0;
            font-weight: 700;
            margin-bottom: 14px;
            font-size: 14px;
          }
          .next-steps ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .next-steps li {
            padding: 8px 0;
            margin: 0;
            padding-left: 24px;
            position: relative;
            color: #4a4a4a;
          }
          .next-steps li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #0021a0;
            font-weight: 700;
            font-size: 18px;
            line-height: 1;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #0021a0 0%, #0033cc 100%);
            color: #fff;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            margin: 28px 0;
            border-radius: 6px;
            letter-spacing: 0.3px;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 33, 160, 0.15);
          }
          .cta-button:hover {
            background: linear-gradient(135deg, #001a80 0%, #0028a3 100%);
          }
          .support-text {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e8ecf1;
            font-size: 13px;
            color: #666;
            line-height: 1.8;
          }
          .support-text strong {
            color: #1a1a1a;
            font-weight: 600;
          }
          .footer {
            background: #f8f9fb;
            padding: 32px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e8ecf1;
          }
          .footer-link {
            color: #0021a0;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed</h1>
            <p>Your print order is being prepared</p>
          </div>
          
          <div class="content">
            <p class="greeting">Dear ${
              order.deliveryInfo?.fullName || "Valued Customer"
            },</p>
            
            <p class="intro-text">
              Thank you for your order. Your print job has been successfully confirmed and payment received. We're now preparing your materials with our standard quality assurance process. You'll receive regular updates as your order progresses through production.
            </p>
            
            <div class="order-section">
              <div class="section-title">Order Details</div>
              <div class="order-details">
                <div class="order-number">${order.orderNumber}</div>
                <div class="detail-row">
                  <span class="detail-label">Order Date</span>
                  <span class="detail-value">${new Date(
                    order.createdAt
                  ).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Status</span>
                  <span class="detail-value"><span class="status-badge">Confirmed</span></span>
                </div>
                ${
                  order.deliveryInfo?.scheduleDelivery &&
                  order.estimatedDelivery
                    ? `
                  <div class="detail-row">
                    <span class="detail-label">Scheduled Delivery</span>
                    <span class="detail-value">${new Date(
                      order.estimatedDelivery
                    ).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
            
            <div class="total-section">
              <div class="total-label">Order Total</div>
              <div class="total-amount">₹${order.pricing.total.toFixed(2)}</div>
            </div>
            
            <div class="order-section">
              <div class="section-title">Order Items (${
                order.items.length
              })</div>
              <div class="items-container">
                ${order.items
                  .map(
                    (item) => `
                  <div class="item">
                    <div class="item-name">${item.serviceName}</div>
                    <div class="item-specs">
                      ${item.fileName} (${item.pageCount} pages)<br/>
                      ${item.configuration.copies} ${
                      item.configuration.copies > 1 ? "copies" : "copy"
                    } • ${item.configuration.printType} • ${
                      item.configuration.paperSize
                    } • ${item.configuration.paperType}
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            
            <div class="address-block">
              <h3>Delivery Address</h3>
              <div class="address-text">
                ${order.deliveryInfo?.address}<br/>
                ${order.deliveryInfo?.city}, ${order.deliveryInfo?.state} – ${
      order.deliveryInfo?.pincode
    }<br/>
                <br/>
                <strong>Contact:</strong> ${order.deliveryInfo?.phone}
              </div>
            </div>
            
            <div class="next-steps">
              <h3>What Happens Next</h3>
              <ul>
                <li>Quality review and file verification</li>
                <li>Production scheduling and printing</li>
                <li>Final inspection and packaging</li>
                <li>Dispatch to your delivery address</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${
                process.env.FRONTEND_URL
              }/dashboard/orders" class="cta-button">
                Track Your Order
              </a>
            </div>
            
            <div class="support-text">
              <strong>Need assistance?</strong> Our support team is available to help.<br/>
              <strong>Email:</strong> ${companyEmail}<br/>
              ${
                settings?.companyPhone
                  ? `<strong>Phone:</strong> ${settings.companyPhone}`
                  : ""
              }
            </div>
          </div>
          
          <div class="footer">
            <p>${
              settings?.footerNote ||
              `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`
            }</p>
            <p style="margin-top: 12px;">
              <a href="${
                process.env.FRONTEND_URL
              }" class="footer-link">Visit Our Website</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email with invoice attachment
    const mailOptions = {
      from: `"${companyName}" <${companyEmail}>`,
      to: order.deliveryInfo?.email,
      subject: `Order Confirmation – ${order.orderNumber}`,
      html: emailHTML,
      attachments: [
        {
          filename: `Invoice-${order.orderNumber}.pdf`,
          content: invoicePDFBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Order confirmation email sent to ${order.deliveryInfo?.email}:`,
      info.messageId
    );

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    throw error;
  }
};
