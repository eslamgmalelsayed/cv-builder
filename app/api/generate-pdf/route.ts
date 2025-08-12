import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { html, fileName } = await request.json();

    // Check if running on serverless environment (Netlify, Vercel, etc.)
    const isServerless = !!(
      process.env.NETLIFY ||
      process.env.VERCEL ||
      process.env.AWS_EXECUTION_ENV ||
      process.env.NODE_ENV === "production"
    );

    console.log("Environment check:", {
      NETLIFY: !!process.env.NETLIFY,
      VERCEL: !!process.env.VERCEL,
      AWS_EXECUTION_ENV: !!process.env.AWS_EXECUTION_ENV,
      NODE_ENV: process.env.NODE_ENV,
      isServerless,
    });

    let browser: any;

    // Always use @sparticuz/chromium for serverless environments
    if (isServerless) {
      console.log("Using @sparticuz/chromium for serverless environment");
      const { default: chromium } = await import("@sparticuz/chromium");
      const { default: puppeteerCore } = await import("puppeteer-core");

      const executablePath = await chromium.executablePath();
      console.log("Chromium executable path:", executablePath);

      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
    } else {
      console.log("Using regular puppeteer for local development");
      const { default: puppeteer } = await import("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
    }

    const page = await browser.newPage();

    // Set the content
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "8mm",
        right: "8mm",
        bottom: "8mm",
        left: "8mm",
      },
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      tagged: false,
      outline: false,
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(pdf as BlobPart, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName || "CV.pdf"}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        message: errorMessage,
        environment: {
          NETLIFY: !!process.env.NETLIFY,
          VERCEL: !!process.env.VERCEL,
          NODE_ENV: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    );
  }
}
