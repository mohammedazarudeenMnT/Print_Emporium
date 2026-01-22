import puppeteer from 'puppeteer';

/**
 * Generate PDF from HTML string using Puppeteer
 */
export const generatePDFFromHTML = async (html) => {
  let browser;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--font-render-hinting=none',
      ],
    });

    const page = await browser.newPage();
    
    // Disable timeout for slow systems (0 means no timeout)
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);
    
    // Set content - using networkidle2 is less strict than networkidle0
    // and usually sufficient for invoices/emails.
    await page.setContent(html, {
      waitUntil: 'networkidle2',
      timeout: 0,
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
