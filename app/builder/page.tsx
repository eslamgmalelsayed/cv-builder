import { CVBuilder } from "@/components/cv-builder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Builder - Create Your Professional Resume",
  description:
    "Build your professional, ATS-optimized resume with our AI-powered CV builder. Real-time preview, smart suggestions, and instant PDF export.",
  openGraph: {
    title: "CV Builder - Create Your Professional Resume",
    description:
      "Build your professional, ATS-optimized resume with AI-powered suggestions and real-time preview.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CV Builder Interface",
      },
    ],
  },
};

export default function BuilderPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <CVBuilder />
    </main>
  );
}
