import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

/**
 * Generate PDF from HTML string using Puppeteer
 * Works in both local development and serverless environments (Vercel, AWS Lambda)
 */
export const generatePDFFromHTML = async (html) => {
  let browser;
  
  try {
    // Detect if we're in a serverless/production environment
    const isProduction = process.env.NODE_ENV === "production"
    
    if (isProduction) {
      // Use serverless Chrome for production (Vercel/AWS)
      const chromium = await import('@sparticuz/chromium');
      
      browser = await puppeteerCore.launch({
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: chromium.default.headless,
      });
    } else {
      // Use regular puppeteer for local development
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });
    }

    const page = await browser.newPage();
    
    // Disable timeout for slow systems
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);
    
    // Set content
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
