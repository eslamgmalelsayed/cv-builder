import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { html, fileName } = await request.json();

    // Resolve absolute origin for loading /_next assets referenced in the HTML (fonts, etc.)
    const origin =
      request.nextUrl?.origin ||
      request.headers.get("origin") ||
      "https://cvifi.netlify.app";
    const htmlWithBase = html.includes("<base ")
      ? html
      : html.replace("<head>", `<head><base href="${origin}/">`);

    // Always use puppeteer-core and @sparticuz/chromium for serverless (Vercel/Netlify)
    let browser: any;
    try {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });

      const page = await (browser as any).newPage();

      // Ensure consistent rendering for print
      if (page.emulateMediaType) {
        await page.emulateMediaType("screen");
      }

      // Reduce external network chatter that can fail on serverless (fonts/images)
      if (page.setRequestInterception) {
        await page.setRequestInterception(true);
        page.on("request", (req: any) => {
          const type = req.resourceType?.() || "";
          if (type === "font" || type === "image" || type === "media") {
            return req.abort?.();
          }
          return req.continue?.();
        });
      }

      // Set the content (avoid waiting for all fonts to load indefinitely)
      await page.setContent(htmlWithBase, {
        waitUntil: "load",
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

      // Return PDF as response
      return new NextResponse(pdf, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${
            fileName || "CV.pdf"
          }"`,
        },
      });
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch {}
      }
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    const message =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate PDF", message },
      { status: 500 }
    );
  }
}
