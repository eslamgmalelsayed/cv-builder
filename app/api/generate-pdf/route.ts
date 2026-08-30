import { NextRequest, NextResponse } from "next/server";
import { buildCVDocument, type CVTemplateData } from "@/lib/cv-template";

export const runtime = "nodejs";
export const maxDuration = 60;

interface PDFRequestBody {
  cvData: CVTemplateData;
  fileName?: string;
  sectionOrder?: string[];
  visibleSections?: Record<string, boolean>;
  sectionNames?: Record<string, string>;
  language?: "en" | "ar";
  direction?: "ltr" | "rtl";
  themeColor?: string;
  /** Legacy: pre-rendered HTML. Still honored for backward compatibility. */
  html?: string;
}

// Puppeteer pins one Chrome build; a locally-installed browser may have a
// different version, leaving the default executablePath pointing at a missing
// binary. Fall back to whatever Chrome build exists in the cache.
function resolveLocalChrome(
  puppeteer: typeof import("puppeteer")
): string | undefined {
  try {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");

    const preferred = puppeteer.executablePath();
    if (preferred && fs.existsSync(preferred)) return preferred;

    const cacheRoot = path.join(
      process.env.PUPPETEER_CACHE_DIR ||
        path.join(require("os").homedir(), ".cache", "puppeteer"),
      "chrome"
    );
    if (!fs.existsSync(cacheRoot)) return undefined;

    for (const build of fs.readdirSync(cacheRoot)) {
      for (const sub of ["chrome-win64", "chrome-linux64", "chrome-mac-x64"]) {
        const exe = build.startsWith("win")
          ? path.join(cacheRoot, build, sub, "chrome.exe")
          : path.join(cacheRoot, build, sub, "chrome");
        if (fs.existsSync(exe)) return exe;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

// HTTP header values are Latin-1 only, but CV names (e.g. Arabic) are not.
// Provide an ASCII-safe fallback plus an RFC 5987 UTF-8 encoded filename.
function contentDisposition(fileName: string): string {
  const asciiFallback =
    fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "'") || "CV.pdf";
  const encoded = encodeURIComponent(fileName);
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

const PDF_OPTIONS = {
  format: "A4" as const,
  printBackground: true,
  margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
  displayHeaderFooter: false,
  preferCSSPageSize: true,
};

export async function POST(request: NextRequest) {
  let body: PDFRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Build a clean, self-contained document from JSON (deterministic + faithful).
  // Falls back to any legacy pre-rendered HTML for backward compatibility.
  let html: string;
  if (body.cvData) {
    html = buildCVDocument(body.cvData, {
      sectionOrder: body.sectionOrder,
      visibleSections: body.visibleSections,
      sectionNames: body.sectionNames,
      language: body.language,
      direction: body.direction,
      themeColor: body.themeColor,
    });
  } else if (body.html) {
    html = body.html;
  } else {
    return NextResponse.json(
      { error: "Missing cvData in request body" },
      { status: 400 }
    );
  }

  const fileName = body.fileName || "CV.pdf";

  // Debug aid (non-production only): ?format=html returns the exact document
  // the PDF is rendered from, so the template can be inspected in a browser.
  if (
    process.env.NODE_ENV !== "production" &&
    request.nextUrl.searchParams.get("format") === "html"
  ) {
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const isServerless = !!(
    process.env.VERCEL ||
    process.env.NETLIFY ||
    process.env.AWS_EXECUTION_ENV ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NODE_ENV === "production"
  );

  let browser: import("puppeteer-core").Browser | import("puppeteer").Browser | null =
    null;

  try {
    if (isServerless) {
      // @sparticuz/chromium ships a Lambda/Netlify-compatible Chromium that
      // bundles the shared libraries the old chrome-aws-lambda build lacked
      // (libnss3.so etc.). Note executablePath() is an async function here.
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteerCore = (await import("puppeteer-core")).default;
      browser = await puppeteerCore.launch({
        args: [...chromium.args, "--disable-dev-shm-usage"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      const { default: puppeteer } = await import("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        executablePath: resolveLocalChrome(puppeteer),
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
    }

    const page = await browser.newPage();
    // domcontentloaded is enough: the document is self-contained. Fonts load
    // from Google Fonts; give them a brief, bounded window so text metrics
    // settle without hanging the whole request on the network.
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    try {
      await page.evaluateHandle("document.fonts.ready");
    } catch {
      // Fonts API unavailable in some builds — fall back silently.
    }

    const pdf = await page.pdf(PDF_OPTIONS);

    return new NextResponse(pdf as BlobPart, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": contentDisposition(fileName),
        "Cache-Control": "no-store",
      },
    });
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
        },
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}
