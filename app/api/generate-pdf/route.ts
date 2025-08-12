import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { html, fileName } = await request.json();

    // Ensure absolute origins for assets referenced in the HTML (fonts, images, css)
    const origin =
      request.nextUrl?.origin ||
      request.headers.get("origin") ||
      "https://cvifi.netlify.app";
    const htmlWithBase = html?.includes("<base ")
      ? html
      : html?.replace("<head>", `<head><base href="${origin}/">`);

    // Detect serverless environment (Vercel/Netlify/AWS)
    const isServerless = !!(
      process.env.VERCEL ||
      process.env.NETLIFY ||
      process.env.AWS_EXECUTION_ENV ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NODE_ENV === "production"
    );

    // Prefer a remote Chrome service on serverless to avoid local binary issues
    const browserlessToken = process.env.BROWSERLESS_TOKEN;
    const browserlessHttpUrl = process.env.BROWSERLESS_HTTP_URL; // e.g. https://chrome.browserless.io/pdf?token=XXXX

    if (isServerless && (browserlessToken || browserlessHttpUrl)) {
      const endpoint =
        browserlessHttpUrl ||
        `https://chrome.browserless.io/pdf?token=${browserlessToken}`;
      const payload = {
        html: htmlWithBase,
        options: {
          format: "A4",
          printBackground: true,
          margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" },
          preferCSSPageSize: true,
          displayHeaderFooter: false,
        },
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Remote PDF render failed (${res.status}): ${text}`);
      }

      const arrayBuf = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${
            fileName || "CV.pdf"
          }"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Fallbacks: Local dev (puppeteer) or serverless with @sparticuz/chromium if available
    if (isServerless) {
      const { default: chromium } = await import("@sparticuz/chromium");
      const { default: puppeteerCore } = await import("puppeteer-core");

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

      const browser = await puppeteerCore.launch({
        args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });

      try {
        const page = await browser.newPage();
        await page.setContent(htmlWithBase, { waitUntil: "load" });
        const pdf = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" },
          displayHeaderFooter: false,
          preferCSSPageSize: true,
          tagged: false,
          outline: false,
        });
        return new NextResponse(pdf as BlobPart, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${
              fileName || "CV.pdf"
            }"`,
          },
        });
      } finally {
        try {
          await browser.close();
        } catch {}
      }
    } else {
      const { default: puppeteer } = await import("puppeteer");
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
      try {
        const page = await browser.newPage();
        await page.setContent(htmlWithBase, { waitUntil: "networkidle0" });
        const pdf = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" },
          displayHeaderFooter: false,
          preferCSSPageSize: true,
          tagged: false,
          outline: false,
        });
        return new NextResponse(pdf as BlobPart, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${
              fileName || "CV.pdf"
            }"`,
          },
        });
      } finally {
        try {
          await browser.close();
        } catch {}
      }
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        message,
        environment: {
          NETLIFY: !!process.env.NETLIFY,
          VERCEL: !!process.env.VERCEL,
          NODE_ENV: process.env.NODE_ENV,
          usedRemote: !!(
            process.env.BROWSERLESS_TOKEN || process.env.BROWSERLESS_HTTP_URL
          ),
        },
      },
      { status: 500 }
    );
  }
}
