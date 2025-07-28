import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileX, ArrowLeft } from "lucide-react";
import { WarpBackground } from "@/components/ui/warp-background";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <WarpBackground>
        <div className="z-10 w-full max-w-md">
          <Card className="p-8 text-center space-y-6 bg-background/80 backdrop-blur-sm border-border/50">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-muted">
                <FileX className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">404</h1>
              <h2 className="text-xl font-semibold text-foreground">
                Page Not Found
              </h2>
              <p className="text-muted-foreground">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/builder">Start Building CV</Link>
              </Button>
            </div>
          </Card>
        </div>
      </WarpBackground>
    </div>
  );
}
