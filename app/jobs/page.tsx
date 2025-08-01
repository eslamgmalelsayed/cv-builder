"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Search,
  MapPin,
  Briefcase,
  Clock,
  Star,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WarpBackground } from "@/components/ui/warp-background";
import { Header } from "@/components/ui/header";
import Link from "next/link";
import Image from "next/image";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  featured: boolean;
  description: string;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    posted: "2 days ago",
    featured: true,
    description:
      "We are looking for a Senior Frontend Developer to join our dynamic team...",
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$80k - $110k",
    posted: "1 week ago",
    featured: false,
    description:
      "Join our creative team as a UI/UX Designer and help shape the future...",
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Remote",
    type: "Contract",
    salary: "$90k - $130k",
    posted: "3 days ago",
    featured: true,
    description:
      "Exciting opportunity for a Data Scientist to work with cutting-edge...",
  },
];

export default function JobsFinderPage() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("preferred-language") || "en";
    setCurrentLanguage(savedLang);
  }, []);

  const handleLanguageChange = (language: { code: string }) => {
    setCurrentLanguage(language.code);
  };

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      job.location.toLowerCase().includes(location.toLowerCase())
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        showLanguageSwitcher={true}
      />

      {/* Page Header */}
      <section className="pt-20 pb-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Job Finder</h1>
            <p className="text-lg text-muted-foreground">
              Discover your next career opportunity with our AI-powered job
              matching platform
            </p>
          </div>
        </div>
      </section>

      {/* Hero Section with Coming Soon */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <WarpBackground
          className="absolute inset-0 border-none p-0"
          perspective={200}
          beamsPerSide={3}
          beamSize={2}
          beamDelayMax={1.5}
          beamDelayMin={0.3}
          beamDuration={3}
        >
          <div />
        </WarpBackground>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="space-y-8">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              Coming Soon
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-300 dark:to-white">
                  Find Your Dream
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Job Opportunity
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover thousands of job opportunities from top companies
                worldwide. Our AI-powered job finder will match you with the
                perfect positions based on your CV.
              </p>
            </div>

            {/* Search Preview (Disabled) */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl border opacity-60">
                  <div className="flex-1">
                    <Input
                      placeholder="Job title or keywords"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/50 dark:bg-black/50"
                      disabled
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-white/50 dark:bg-black/50"
                      disabled
                    />
                  </div>
                  <Button disabled className="px-8">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                  <div className="text-center text-white">
                    <Bell className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Feature Coming Soon!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              <div className="text-center p-6 bg-white/5 dark:bg-black/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Search</h3>
                <p className="text-sm text-muted-foreground">
                  Smart job matching based on your CV and preferences
                </p>
              </div>

              <div className="text-center p-6 bg-white/5 dark:bg-black/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Top Companies</h3>
                <p className="text-sm text-muted-foreground">
                  Access to positions from leading employers worldwide
                </p>
              </div>

              <div className="text-center p-6 bg-white/5 dark:bg-black/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Job Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when new positions match your criteria
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <div className="inline-flex items-center gap-4 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl p-6 border">
                <Bell className="w-8 h-8 text-blue-500" />
                <div className="text-left">
                  <h4 className="font-semibold">Get Notified When We Launch</h4>
                  <p className="text-sm text-muted-foreground">
                    Be the first to know when our job finder goes live
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Notify Me
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Jobs Section (Preview) */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Preview: What's Coming
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Here's a sneak peek at the job opportunities you'll be able to
              explore
            </p>
          </div>

          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="relative overflow-hidden opacity-60"
              >
                {job.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.posted}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline">{job.type}</Badge>
                      <Badge variant="outline" className="text-green-600">
                        {job.salary}
                      </Badge>
                    </div>
                    <Button disabled variant="outline">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Bell className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Coming Soon</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; 2025 CVIFI. Built with ❤️ for job seekers worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}
