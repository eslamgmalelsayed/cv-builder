import Link from "next/link";
import { ArrowRight, Sparkles, Zap, FileText, Brain } from "lucide-react";
import type { Metadata } from "next";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { RetroGrid } from "@/components/ui/retro-grid";

export const metadata: Metadata = {
  title: "Free ATS-Compliant CV Builder",
  description:
    "Create professional, ATS-optimized resumes with our free CV builder. AI-powered suggestions, drag-and-drop sections, and instant PDF export. Build your perfect resume in minutes.",
  openGraph: {
    title: "Free ATS-Compliant CV Builder | Professional Resume Maker",
    description:
      "Create professional, ATS-optimized resumes with AI-powered suggestions. Free online CV builder with drag-and-drop sections and instant PDF export.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CV Builder - Create Professional ATS-Compliant Resumes",
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <RetroGrid className="absolute inset-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Builder
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-300 dark:to-white">
                Build Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Resume in Minutes
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create professional, ATS-optimized resumes with AI-powered
              suggestions, real-time autocompletion, and comprehensive ATS
              scoring.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                100% Free
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                ATS-Compliant
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                AI-Powered
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                Instant PDF
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Link href="/builder">
                <ShimmerButton
                  className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none"
                  shimmerColor="#ffffff"
                  shimmerDuration="2s"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    Start Building Your CV
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </ShimmerButton>
              </Link>
            </div>

            {/* Trust Indicators */}
            <p className="text-sm text-muted-foreground">
              Join thousands of job seekers who have successfully landed
              interviews
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our intelligent CV builder combines cutting-edge AI with proven
              ATS optimization to help you create resumes that get noticed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative p-8 bg-background rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  AI Autocompletion
                </h3>
                <p className="text-muted-foreground">
                  Smart suggestions appear as you type, helping you craft
                  compelling content with context-aware AI recommendations.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="group relative p-8 bg-background rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ATS Optimization</h3>
                <p className="text-muted-foreground">
                  Get detailed ATS scores and improvement suggestions to ensure
                  your resume passes through automated screening systems.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="group relative p-8 bg-background rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Smart Chat Assistant
                </h3>
                <p className="text-muted-foreground">
                  Get personalized career advice and CV improvement tips from
                  our AI assistant trained on industry best practices.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Our CV Builder?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Real-time AI Assistance
                    </h3>
                    <p className="text-muted-foreground">
                      Get instant suggestions and improvements as you build your
                      resume, powered by advanced language models.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">ATS Score Analysis</h3>
                    <p className="text-muted-foreground">
                      Understand exactly how your resume performs against ATS
                      systems with detailed scoring and recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Professional Export</h3>
                    <p className="text-muted-foreground">
                      Generate polished PDF resumes that maintain formatting and
                      look great across all devices and platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 border">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-blue-200 to-blue-300 rounded animate-pulse" />
                  <div
                    className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <div
                    className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                  <div className="mt-6 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      85%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ATS Compatibility Score
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully created
            professional resumes with our AI-powered builder.
          </p>

          <Link href="/builder">
            <ShimmerButton
              className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none"
              shimmerColor="#ffffff"
              shimmerDuration="2s"
            >
              <span className="flex items-center gap-2 font-semibold">
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </span>
            </ShimmerButton>
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            No registration required • Free forever • Professional results
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; 2024 CV Builder. Built with ❤️ for job seekers worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}
