import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

/**
 * Generate PDF from HTML string using Puppeteer
 * Works in serverless environments (Vercel, AWS Lambda, etc.)
 */
export const generatePDFFromHTML = async (html) => {
  let browser;
  
  try {
    // Launch browser with serverless-compatible Chrome
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

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
