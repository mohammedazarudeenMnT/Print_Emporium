import { Order } from "./order-api";
import { GeneralSettings } from "./settings-api";

export interface InvoiceData {
  order: Order;
  settings: GeneralSettings;
}

export const generateInvoicePDF = async (data: InvoiceData) => {
  const { order, settings } = data;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Failed to open print window. Please allow popups.");
  }

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${order.orderNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @page {
          size: A4;
          margin: 15mm;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 0;
          background: white;
          color: oklch(0.2716 0.0081 121.83); /* --base-800 / --foreground */
          line-height: 1.5;
        }
        
        .invoice-container {
          max-width: 100%;
          margin: 0 auto;
          background: white;
          padding: 20px;
        }
        
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 20px;
          border-bottom: 2px solid oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
          margin-bottom: 25px;
          page-break-after: avoid;
        }
        
        .company-info {
          flex: 1;
          max-width: 50%;
        }
        
        .company-logo {
          max-width: 150px;
          max-height: 60px;
          margin-bottom: 12px;
          display: block;
        }
        
        .company-name {
          font-size: 20px;
          font-weight: bold;
          color: oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
          margin-bottom: 6px;
          line-height: 1.2;
        }
        
        .company-details {
          font-size: 11px;
          line-height: 1.5;
          color: oklch(0.4446 0.0103 123.53); /* --base-600 / --muted-foreground */
        }
        
        .invoice-title {
          text-align: right;
          max-width: 45%;
        }
        
        .invoice-title h1 {
          font-size: 28px;
          color: oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
          margin-bottom: 8px;
          line-height: 1;
        }
        
        .invoice-meta {
          font-size: 11px;
          color: oklch(0.4446 0.0103 123.53); /* --base-600 / --muted-foreground */
          line-height: 1.6;
        }
        
        .invoice-meta div {
          margin-bottom: 4px;
        }
        
        .invoice-meta strong {
          color: oklch(0.2716 0.0081 121.83); /* --base-800 / --foreground */
          min-width: 100px;
          display: inline-block;
          font-weight: 600;
        }
        
        .info-section {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        
        .info-box {
          flex: 1;
          padding: 15px;
          background: oklch(0.9862 0.0054 117.92); /* --base-50 / --background */
          border-radius: 6px;
          border: 1px solid oklch(0.9249 0.0076 119.33); /* --base-200 / --border */
        }
        
        .info-box h3 {
          font-size: 11px;
          color: oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        
        .info-box p {
          font-size: 11px;
          line-height: 1.5;
          color: oklch(0.2716 0.0081 121.83); /* --base-800 / --foreground */
        }
        
        .info-box p strong {
          font-weight: 600;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
          border: 1px solid oklch(0.9249 0.0076 119.33); /* --base-200 / --border */
          page-break-inside: auto;
        }
        
        .items-table thead {
          background: oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
          color: white;
        }
        
        .items-table th {
          padding: 10px 8px;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .items-table td {
          padding: 10px 8px;
          border-bottom: 1px solid oklch(0.9249 0.0076 119.33); /* --base-200 / --border */
          font-size: 11px;
          vertical-align: top;
        }
        
        .items-table tbody tr {
          page-break-inside: avoid;
        }
        
        .items-table tbody tr:last-child td {
          border-bottom: none;
        }
        
        .item-name {
          font-weight: 700;
          color: oklch(0.2716 0.0081 121.83); /* --base-800 / --foreground */
          margin-bottom: 3px;
          font-size: 11px;
        }
        
        .item-details {
          font-size: 9px;
          color: oklch(0.4446 0.0103 123.53); /* --base-600 / --muted-foreground */
          margin-top: 2px;
        }
        
        .item-config {
          font-size: 9px;
          color: oklch(0.5533 0.0105 122.51); /* --base-500 */
          margin-top: 2px;
          line-height: 1.3;
        }
        
        .pricing-breakdown {
          font-size: 9px;
          color: oklch(0.4446 0.0103 123.53); /* --base-600 / --muted-foreground */
          margin-top: 5px;
          padding: 6px;
          background: oklch(0.9862 0.0054 117.92); /* --base-50 / --background */
          border-radius: 3px;
          border-left: 2px solid oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
        }
        
        .pricing-breakdown-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
          line-height: 1.4;
        }
        
        .pricing-breakdown-row:last-child {
          margin-bottom: 0;
          padding-top: 3px;
          margin-top: 2px;
          border-top: 1px solid oklch(0.9249 0.0076 119.33); /* --base-200 / --border */
          font-weight: 700;
          color: oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
        }
        
        .text-right {
          text-align: right;
        }
        
        .text-center {
          text-align: center;
        }
        
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        
        .totals-box {
          width: 300px;
          background: oklch(0.9862 0.0054 117.92); /* --base-50 / --background */
          padding: 15px;
          border-radius: 6px;
          border: 1px solid oklch(0.9249 0.0076 119.33); /* --base-200 / --border */
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 12px;
          color: oklch(0.2716 0.0081 121.83); /* --base-800 / --foreground */
        }
        
        .total-row.subtotal {
          border-bottom: 1px solid oklch(0.9249 0.0076 119.33); /* --base-200 / --border */
          padding-bottom: 10px;
        }
        
        .total-row.grand-total {
          border-top: 2px solid oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
          padding-top: 12px;
          margin-top: 8px;
          font-size: 16px;
          font-weight: 700;
          color: oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
        }
        
        .total-row span:first-child {
          font-weight: 600;
        }
        
        .total-row span:last-child {
          font-weight: 700;
        }
        
        .footer-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid oklch(0.9249 0.0076 119.33); /* --base-200 / --border */
          page-break-inside: avoid;
        }
        
        .terms {
          margin-bottom: 15px;
          padding: 12px;
          background: oklch(0.9862 0.0054 117.92); /* --base-50 / --background */
          border-radius: 4px;
          border-left: 3px solid oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
        }
        
        .terms h4 {
          font-size: 10px;
          color: oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
          margin-bottom: 6px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .terms p {
          font-size: 9px;
          color: oklch(0.4446 0.0103 123.53); /* --base-600 / --muted-foreground */
          line-height: 1.5;
        }
        
        .footer-note {
          text-align: center;
          font-size: 9px;
          color: oklch(0.5533 0.0105 122.51); /* --base-500 */
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid oklch(0.9249 0.0076 119.33); /* --base-200 / --border */
        }
        
        .status-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        .status-paid {
          background: oklch(0.9374 0.0335 254.31 / 0.3); /* --primary-100 with opacity */
          color: oklch(0.4255 0.2728 264.01); /* --primary-800 */
          border: 1px solid oklch(0.3487 0.2011 263.98 / 0.4); /* --primary-900 with opacity */
        }
        
        .status-pending {
          background: oklch(0.9753 0.0131 253.38); /* --primary-50 */
          color: oklch(0.7116 0.1666 253.4); /* --primary-400 */
          border: 1px solid oklch(0.813 0.1059 250.62 / 0.4); /* --primary-300 with opacity */
        }
        
        .scheduled-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 9px;
          font-weight: 700;
          background: oklch(0.9374 0.0335 254.31 / 0.3); /* --primary-100 with opacity */
          color: oklch(0.3487 0.2011 263.98); /* --primary-900 / --primary */
          border: 1px solid oklch(0.3487 0.2011 263.98 / 0.4); /* --primary-900 with opacity */
          margin-left: 8px;
        }
        
        @media print {
          body {
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .invoice-container {
            padding: 0;
            max-width: 100%;
          }
          
          .items-table thead {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .no-break {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
          <div class="company-info">
            ${settings.companyLogo ? `<img src="${settings.companyLogo}" alt="${settings.companyName}" class="company-logo" />` : `<div class="company-name">${settings.companyName}</div>`}
            <div class="company-details">
              ${settings.companyAddress}<br/>
              Phone: ${settings.companyPhone}<br/>
              Email: ${settings.companyEmail}<br/>
              ${settings.gstNumber ? `GST: ${settings.gstNumber}` : ''}
            </div>
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <div class="invoice-meta">
              <div><strong>Invoice No:</strong> ${order.orderNumber}</div>
              <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
              <div><strong>Payment Status:</strong> <span class="status-badge ${order.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}">${order.paymentStatus.toUpperCase()}</span></div>
              ${order.deliveryInfo?.scheduleDelivery && order.estimatedDelivery ? `<div><strong>Scheduled:</strong> <span class="scheduled-badge">${new Date(order.estimatedDelivery).toLocaleDateString()}</span></div>` : ''}
            </div>
          </div>
        </div>
        
        <!-- Customer & Delivery Info -->
        <div class="info-section">
          <div class="info-box">
            <h3>Bill To</h3>
            <p>
              <strong>${order.deliveryInfo?.fullName || 'N/A'}</strong><br/>
              ${order.deliveryInfo?.email || ''}<br/>
              ${order.deliveryInfo?.phone || ''}
            </p>
          </div>
          <div class="info-box">
            <h3>Deliver To</h3>
            <p>
              ${order.deliveryInfo?.address || ''}<br/>
              ${order.deliveryInfo?.city || ''}, ${order.deliveryInfo?.state || ''}<br/>
              ${order.deliveryInfo?.pincode || ''}
            </p>
          </div>
        </div>
        
        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 55%;">Item Description</th>
              <th class="text-center" style="width: 10%;">Pages</th>
              <th class="text-center" style="width: 10%;">Copies</th>
              <th class="text-right" style="width: 25%;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <div class="item-name">${item.serviceName}</div>
                  <div class="item-details">${item.fileName} (${item.pageCount} pages)</div>
                  <div class="item-config">
                    ${item.configuration.printType} • ${item.configuration.paperSize} • 
                    ${item.configuration.paperType} • ${item.configuration.gsm}GSM • 
                    ${item.configuration.printSide}
                    ${item.configuration.bindingOption && item.configuration.bindingOption !== 'none' ? ` • ${item.configuration.bindingOption}` : ''}
                  </div>
                  <div class="pricing-breakdown">
                    <div class="pricing-breakdown-row">
                      <span>Base Price:</span>
                      <span>₹${item.pricing.basePricePerPage.toFixed(2)}/page</span>
                    </div>
                    ${item.pricing.printTypePrice > 0 ? `
                      <div class="pricing-breakdown-row">
                        <span>Print Type (${item.configuration.printType}):</span>
                        <span>+₹${item.pricing.printTypePrice.toFixed(2)}/page</span>
                      </div>
                    ` : ''}
                    ${item.pricing.paperSizePrice > 0 ? `
                      <div class="pricing-breakdown-row">
                        <span>Paper Size (${item.configuration.paperSize}):</span>
                        <span>+₹${item.pricing.paperSizePrice.toFixed(2)}/page</span>
                      </div>
                    ` : ''}
                    ${item.pricing.paperTypePrice > 0 ? `
                      <div class="pricing-breakdown-row">
                        <span>Paper Type (${item.configuration.paperType}):</span>
                        <span>+₹${item.pricing.paperTypePrice.toFixed(2)}/page</span>
                      </div>
                    ` : ''}
                    ${item.pricing.gsmPrice > 0 ? `
                      <div class="pricing-breakdown-row">
                        <span>GSM (${item.configuration.gsm}):</span>
                        <span>+₹${item.pricing.gsmPrice.toFixed(2)}/page</span>
                      </div>
                    ` : ''}
                    ${item.pricing.printSidePrice > 0 ? `
                      <div class="pricing-breakdown-row">
                        <span>Print Side (${item.configuration.printSide}):</span>
                        <span>+₹${item.pricing.printSidePrice.toFixed(2)}/page</span>
                      </div>
                    ` : ''}
                    ${item.pricing.bindingPrice > 0 ? `
                      <div class="pricing-breakdown-row">
                        <span>Binding (${item.configuration.bindingOption}):</span>
                        <span>+₹${item.pricing.bindingPrice.toFixed(2)}</span>
                      </div>
                    ` : ''}
                    <div class="pricing-breakdown-row">
                      <span>Price per Page:</span>
                      <span>₹${item.pricing.pricePerPage.toFixed(2)}</span>
                    </div>
                  </div>
                </td>
                <td class="text-center">${item.pageCount}</td>
                <td class="text-center">${item.configuration.copies}</td>
                <td class="text-right">
                  <div style="font-weight: 700; font-size: 12px; color: oklch(0.3487 0.2011 263.98);">₹${item.pricing.subtotal.toFixed(2)}</div>
                  <div style="font-size: 9px; color: oklch(0.4446 0.0103 123.53); margin-top: 2px;">
                    ${item.pageCount} × ${item.configuration.copies} × ₹${item.pricing.pricePerPage.toFixed(2)}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Totals -->
        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row subtotal">
              <span>Subtotal:</span>
              <span>₹${order.pricing.subtotal.toFixed(2)}</span>
            </div>
            ${order.pricing.deliveryCharge > 0 ? `
              <div class="total-row">
                <span>Delivery Charge:</span>
                <span>₹${order.pricing.deliveryCharge.toFixed(2)}</span>
              </div>
            ` : ''}
            ${order.pricing.tax > 0 ? `
              <div class="total-row">
                <span>Tax:</span>
                <span>₹${order.pricing.tax.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row grand-total">
              <span>Total Amount:</span>
              <span>₹${order.pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer-section">
          ${settings.termsAndConditions ? `
            <div class="terms">
              <h4>Terms & Conditions</h4>
              <p>${settings.termsAndConditions}</p>
            </div>
          ` : ''}
          
          <div class="footer-note">
            ${settings.footerNote || `Thank you for your business!`}
          </div>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
};
