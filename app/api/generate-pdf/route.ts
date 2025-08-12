import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { html, fileName } = await request.json();

    // Detect serverless environment more broadly
    const isServerless = !!(
      process.env.VERCEL ||
      process.env.NETLIFY ||
      process.env.AWS_EXECUTION_ENV ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
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

    if (isServerless) {
      // For serverless environments, prefer a remote Chrome (Browserless) if configured
      const { default: puppeteerCore } = await import("puppeteer-core");
      const wsEndpoint =
        process.env.BROWSERLESS_WS_URL ||
        process.env.PUPPETEER_WS_ENDPOINT ||
        process.env.CHROME_WS_ENDPOINT ||
        "";

      if (wsEndpoint) {
        console.log("Connecting to remote Chrome via WS endpoint");
        browser = await puppeteerCore.connect({
          browserWSEndpoint: wsEndpoint,
        });
      } else {
        console.log(
          "Serverless detected, using @sparticuz/chromium local binary"
        );
        const { default: chromium } = await import("@sparticuz/chromium");
        const executablePath = await chromium.executablePath();
        const args = [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--single-process",
          "--no-zygote",
        ];
        browser = await puppeteerCore.launch({
          args,
          defaultViewport: chromium.defaultViewport,
          executablePath,
          headless: chromium.headless,
        });
      }
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
        hints: {
          usedRemoteWS: !!(
            process.env.BROWSERLESS_WS_URL ||
            process.env.PUPPETEER_WS_ENDPOINT ||
            process.env.CHROME_WS_ENDPOINT
          ),
        },
      },
      { status: 500 }
    );
  }
}
