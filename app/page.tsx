"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Zap, FileText, Brain } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { WarpBackground } from "@/components/ui/warp-background";
import { useLanguage } from "@/components/shared-header";
import { getTranslations, type AppTranslations } from "@/lib/content";
import { SharedFooter } from "@/components/ui/shared-footer";

export default function Home() {
  const { currentLanguage } = useLanguage();
  const [content, setContent] = useState<AppTranslations>(
    getTranslations("ar")
  );

  useEffect(() => {
    setContent(getTranslations(currentLanguage));
  }, [currentLanguage]);

  return (
    <div
      className={`min-h-screen bg-background`}
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <WarpBackground
          className="absolute inset-0 border-none p-0"
          perspective={200}
          beamsPerSide={5}
          beamSize={3}
          beamDelayMax={2}
          beamDelayMin={0.5}
          beamDuration={4}
        >
          <div />
        </WarpBackground>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="space-y-8 flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {content.home.hero.badge}
            </div>

            {/* Main Heading */}
            <h1
              className={`font-bold tracking-tight ${
                currentLanguage === "ar"
                  ? "hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
                  : "text-4xl md:text-6xl lg:text-7xl"
              } ${currentLanguage === "ar" ? "leading-normal" : ""}`}
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-300 dark:to-white">
                {content.home.hero.title}
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {content.home.hero.subtitle}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-muted-foreground max-w-3xl mx-auto leading-relaxed ${
                currentLanguage === "ar"
                  ? "hero-subtitle text-lg sm:text-xl md:text-xl"
                  : "text-xl md:text-2xl"
              }`}
            >
              {content.home.hero.description}
            </p>

            {/* Features Grid */}
            <div className="grid gap-4 max-w-2xl mx-auto text-sm grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center">
              <div className="flex items-center gap-2 text-muted-foreground justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {content.home.features.badges.free}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                {content.home.features.badges.atsCompliant}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground justify-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                {content.home.features.badges.aiPowered}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                {content.home.features.badges.instantPdf}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 flex justify-center">
              <Link href="/builder">
                <ShimmerButton
                  className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none"
                  shimmerColor="#ffffff"
                  shimmerDuration="2s"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    {content.home.hero.primaryButton}
                    <ArrowRight
                      className={`w-5 h-5 ${
                        currentLanguage === "ar" ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </ShimmerButton>
              </Link>
            </div>

            {/* Trust Indicators */}
            <p className="text-sm text-muted-foreground">
              {content.home.hero.trustIndicator}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className={`font-bold mb-4 text-center ${
                currentLanguage === "ar"
                  ? "text-2xl sm:text-3xl md:text-4xl"
                  : "text-3xl md:text-4xl"
              }`}
            >
              {content.home.features.title}
            </h2>
            <p
              className={`text-muted-foreground max-w-2xl mx-auto text-center ${
                currentLanguage === "ar" ? "text-lg sm:text-xl" : "text-xl"
              }`}
            >
              {content.home.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.home.features.items
              .slice(0, 3)
              .map(
                (
                  feature: { title: string; description: string },
                  index: number
                ) => {
                  const icons = [Brain, Zap, FileText];
                  const colors = ["blue", "green", "purple"];
                  const Icon = icons[index];
                  const color = colors[index];

                  return (
                    <div
                      key={index}
                      className="group relative p-8 bg-background rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 text-center"
                    >
                      <div className="mb-6">
                        <div className="w-12 h-12 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                          <Icon
                            className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`}
                          />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-center">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-center">
                          {feature.description}
                        </p>
                      </div>
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-${color}-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
                      />
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <h2
              className={`font-bold mb-6 text-center ${
                currentLanguage === "ar"
                  ? "text-2xl sm:text-3xl md:text-4xl"
                  : "text-3xl md:text-4xl"
              }`}
            >
              {content.home.cta.title}
            </h2>
            <p
              className={`text-muted-foreground mb-8 max-w-2xl mx-auto text-center ${
                currentLanguage === "ar" ? "text-lg sm:text-xl" : "text-xl"
              }`}
            >
              {content.home.cta.description}
            </p>

            <div className="flex justify-center">
              <Link href="/jobs">
                <ShimmerButton
                  className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none"
                  shimmerColor="#ffffff"
                  shimmerDuration="2s"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    {content.home.cta.button}
                    <ArrowRight
                      className={`w-5 h-5 ${
                        currentLanguage === "ar" ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </ShimmerButton>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              {content.home.cta.disclaimer}
            </p>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
