import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Restaurant POS System",
  description: "A complete restaurant point of sale system",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Restaurant POS</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Complete Restaurant Management Solution
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline your restaurant operations with our all-in-one POS system.
                    Manage orders, reservations, billing, and more.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-lg bg-muted md:h-[450px]">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-4xl font-bold text-muted-foreground">
                      Restaurant POS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Order Management</h3>
                <p className="text-muted-foreground">
                  Easily manage orders, track status, and streamline kitchen operations.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Reservation System</h3>
                <p className="text-muted-foreground">
                  Handle table reservations, manage waitlists, and optimize seating.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Billing & Payments</h3>
                <p className="text-muted-foreground">
                  Process payments, split bills, and manage discounts with ease.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-lg font-bold">
              Restaurant POS
            </Link>
            <p className="text-sm text-muted-foreground">
              A complete restaurant management solution.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Restaurant POS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
