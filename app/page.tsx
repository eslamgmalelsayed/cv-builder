"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Zap, FileText, Brain } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { WarpBackground } from "@/components/ui/warp-background";
import { Header } from "@/components/ui/header";
import { homePageContent, type HomePageContent } from "@/lib/content";

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [content, setContent] = useState<HomePageContent>(homePageContent.en);

  useEffect(() => {
    // Check for saved language preference
    const savedLang = localStorage.getItem("preferred-language") || "en";
    setCurrentLanguage(savedLang);
    setContent(homePageContent[savedLang] || homePageContent.en);
  }, []);

  const handleLanguageChange = (language: { code: string }) => {
    setCurrentLanguage(language.code);
    setContent(homePageContent[language.code] || homePageContent.en);
  };
  return (
    <div
      className={`min-h-screen bg-background ${
        currentLanguage === "ar" ? "rtl" : "ltr"
      }`}
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        showLanguageSwitcher={true}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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

        <div
          className={`relative z-10 container mx-auto px-4 py-20 ${
            currentLanguage === "ar" ? "text-center" : "text-center"
          }`}
        >
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {content.hero.badge}
            </div>

            {/* Main Heading */}
            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight ${
                currentLanguage === "ar" ? "leading-normal" : ""
              }`}
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-300 dark:to-white">
                {content.hero.title}
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {content.hero.subtitle}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed ${
                currentLanguage === "ar" ? "text-center" : ""
              }`}
            >
              {content.hero.description}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {content.features.badges.free}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                {content.features.badges.atsCompliant}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                {content.features.badges.aiPowered}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                {content.features.badges.instantPdf}
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
                    {content.hero.primaryButton}
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
              {content.hero.trustIndicator}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {content.features.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.features.items.slice(0, 3).map((feature, index) => {
              const icons = [Brain, Zap, FileText];
              const colors = ["blue", "green", "purple"];
              const Icon = icons[index];
              const color = colors[index];

              return (
                <div
                  key={index}
                  className="group relative p-8 bg-background rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="mb-6">
                    <div
                      className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg flex items-center justify-center mb-4`}
                    >
                      <Icon
                        className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`}
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-${color}-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {content.cta.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {content.cta.description}
            </p>

            <div className="flex justify-center">
              <Link href="/builder">
                <ShimmerButton
                  className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none"
                  shimmerColor="#ffffff"
                  shimmerDuration="2s"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    {content.cta.button}
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
              {content.cta.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">{content.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
