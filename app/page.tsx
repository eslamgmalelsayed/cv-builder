"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  FileText,
  Brain,
  Check,
} from "lucide-react";
import { useLanguage } from "@/components/shared-header";
import { useContent } from "@/hooks/use-content";
import { SharedFooter } from "@/components/ui/shared-footer";

export default function Home() {
  const { currentLanguage } = useLanguage();
  const content = useContent();
  const isRTL = currentLanguage === "ar";

  const badges = [
    content.home.features.badges.free,
    content.home.features.badges.atsCompliant,
    content.home.features.badges.aiPowered,
    content.home.features.badges.instantPdf,
  ];

  const featureIcons = [Brain, Zap, FileText];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle themed background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.12) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Copy — start-aligned (left in LTR, right in RTL); on the right in RTL */}
            <div
              className={`flex flex-col items-start text-start ${
                isRTL ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                {content.home.hero.badge}
              </div>

              <h1
                className={`mt-6 font-bold tracking-tight text-foreground ${
                  isRTL
                    ? "text-3xl leading-snug sm:text-4xl md:text-5xl"
                    : "text-4xl leading-[1.1] md:text-5xl lg:text-6xl"
                }`}
              >
                {content.home.hero.title}
                <span className="mt-1 block text-primary">
                  {content.home.hero.subtitle}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {content.home.hero.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/builder"
                  prefetch
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                >
                  {content.home.hero.primaryButton}
                  <ArrowRight
                    className={`h-5 w-5 transition-transform group-hover:translate-x-0.5 ${
                      isRTL ? "rotate-180 group-hover:-translate-x-0.5" : ""
                    }`}
                  />
                </Link>
              </div>

              {/* Feature badges — stacked on mobile, wrapping row on sm+ */}
              <div className="mt-8 flex flex-col items-start gap-2.5 sm:!flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className="flex !flex-row items-center gap-1.5 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 text-primary" />
                    {badge}
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm text-muted-foreground">
                {content.home.hero.trustIndicator}
              </p>
            </div>

            {/* Resume sheet mock — echoes the CV template */}
            <div
              className={`relative hidden lg:block ${
                isRTL ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
              <ResumeMock isRTL={isRTL} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              {content.home.features.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {content.home.features.subtitle}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {content.home.features.items
              .slice(0, 3)
              .map(
                (
                  feature: { title: string; description: string },
                  index: number
                ) => {
                  const Icon = featureIcons[index] ?? FileText;
                  return (
                    <div
                      key={index}
                      className="group rounded-2xl border bg-background p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                    >
                      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border bg-primary px-8 py-16 text-center text-primary-foreground">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl font-bold md:text-4xl">
                {content.home.cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
                {content.home.cta.description}
              </p>
              <Link
                href="/builder"
                prefetch
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-7 py-3.5 text-base font-semibold text-primary shadow-sm transition-transform hover:scale-[1.02]"
              >
                {content.home.cta.button}
                <ArrowRight
                  className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

/** Decorative CV sheet that mirrors the real template's layout and accent. */
function ResumeMock({ isRTL }: { isRTL: boolean }) {
  const align = isRTL ? "items-end" : "items-start";
  const Bar = ({ w, c = "bg-gray-200" }: { w: string; c?: string }) => (
    <div className={`h-2 rounded-full ${c}`} style={{ width: w }} />
  );
  const Section = ({ children }: { children: React.ReactNode }) => (
    <div className={`flex flex-col gap-2 ${align}`}>{children}</div>
  );

  return (
    <div className="relative mx-auto w-full max-w-md rotate-1 rounded-xl border border-gray-200 bg-white p-7 shadow-xl transition-transform hover:rotate-0">
      <div className={`flex flex-col gap-2 ${align} border-b-2 border-primary pb-4`}>
        <div className="h-4 w-40 rounded bg-primary/90" />
        <Bar w="7rem" c="bg-gray-300" />
        <div className={`mt-1 flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Bar w="4rem" />
          <Bar w="3rem" />
          <Bar w="3.5rem" />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {[0, 1].map((s) => (
          <Section key={s}>
            <div className="h-2.5 w-28 rounded bg-primary/70" />
            <Bar w="100%" />
            <Bar w="92%" />
            <Bar w="80%" />
          </Section>
        ))}
        <Section>
          <div className="h-2.5 w-24 rounded bg-primary/70" />
          <div className={`flex flex-wrap gap-1.5 ${isRTL ? "justify-end" : ""}`}>
            {["3rem", "4rem", "2.5rem", "3.5rem", "3rem"].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded-full bg-primary/10"
                style={{ width: w }}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
