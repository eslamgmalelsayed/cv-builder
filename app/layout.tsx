import type React from "react"
import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Free ATS-Compliant CV Builder | Professional Resume Maker Online",
  description:
    "Create professional, ATS-optimized resumes with our free CV builder. AI-powered suggestions, drag-and-drop sections, and instant PDF export. Build your perfect resume in minutes.",
  keywords: [
    "CV builder",
    "resume builder",
    "ATS compliant resume",
    "professional resume maker",
    "free CV creator",
    "resume template",
    "job application",
    "career tools",
    "AI resume builder",
    "online resume maker",
    "resume generator",
    "CV template",
    "job search tools",
    "professional CV",
    "resume optimization",
    "Arabic CV builder",
    "RTL resume builder",
  ],
  authors: [{ name: "CV Builder Team" }],
  creator: "CV Builder",
  publisher: "CV Builder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cv-builder.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free ATS-Compliant CV Builder | Professional Resume Maker",
    description:
      "Create professional, ATS-optimized resumes with AI-powered suggestions. Free online CV builder with drag-and-drop sections and instant PDF export.",
    url: "https://cv-builder.vercel.app",
    siteName: "CV Builder",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CV Builder - Create Professional ATS-Compliant Resumes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS-Compliant CV Builder | Professional Resume Maker",
    description:
      "Create professional, ATS-optimized resumes with AI-powered suggestions. Free online CV builder with instant PDF export.",
    images: ["/og-image.jpg"],
    creator: "@cvbuilder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Preload Cairo font for better performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap"
          as="style"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CV Builder",
              description:
                "Free ATS-compliant CV builder with AI-powered suggestions for creating professional resumes",
              url: "https://cv-builder.vercel.app",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "ATS-compliant resume templates",
                "AI-powered content suggestions",
                "Drag and drop section reordering",
                "Real-time preview",
                "PDF export",
                "Professional formatting",
                "Keyword optimization",
                "Multiple sections support",
                "RTL language support",
                "Customizable themes",
                "Arabic language support",
              ],
              screenshot: "https://cv-builder.vercel.app/screenshot.jpg",
              softwareVersion: "1.0",
              author: {
                "@type": "Organization",
                name: "CV Builder Team",
              },
            }),
          }}
        />

        {/* FAQ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is this CV builder really free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, our CV builder is completely free to use. You can create, edit, and download your resume without any charges or hidden fees.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are the resumes ATS-compliant?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, all our resume templates are designed to be ATS (Applicant Tracking System) compliant, ensuring your resume passes through automated screening systems.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does it support RTL languages?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, our CV builder supports both LTR (Left-to-Right) and RTL (Right-to-Left) text directions, making it suitable for Arabic, Hebrew, and other RTL languages.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I customize the theme colors?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can choose from multiple theme colors including blue, green, purple, red, orange, pink, indigo, teal, gray, and black to personalize your resume.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} ${cairo.variable}`}>{children}</body>
    </html>
  )
}
