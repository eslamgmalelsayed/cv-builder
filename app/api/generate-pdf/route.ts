import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";

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

    // Decide environment: use @sparticuz/chromium + puppeteer-core on Netlify/serverless, otherwise fallback to puppeteer
    const isServerless =
      !!process.env.NETLIFY || !!process.env.AWS_EXECUTION_ENV;

    let browser: any;
    try {
      if (isServerless) {
        const { default: chromium } = await import("@sparticuz/chromium");
        const { default: puppeteerCore } = await import("puppeteer-core");
        const attemptedPaths: string[] = [];
        let executablePath = "";
        const fallbacks = [
          "/var/task/node_modules/@sparticuz/chromium/bin/chromium",
          "/var/task/.netlify/functions/node_modules/@sparticuz/chromium/bin/chromium",
          "/var/task/.netlify/functions-internal/node_modules/@sparticuz/chromium/bin/chromium",
        ];
        for (const p of fallbacks) {
          attemptedPaths.push(p);
          try {
            if (fs.existsSync(p)) {
              executablePath = p;
              break;
            }
          } catch (err) {
            attemptedPaths.push(`Error checking ${p}: ${err}`);
          }
        }
        if (!executablePath) {
          throw new Error(
            `No Chromium binary found. Attempted: ${attemptedPaths.join(", ")}`
          );
        }
        browser = await puppeteerCore.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath,
          headless: chromium.headless,
        });
      } else {
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
