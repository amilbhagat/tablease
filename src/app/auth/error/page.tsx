import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Authentication Error | Restaurant POS",
  description: "An error occurred during authentication",
};

interface SearchParams {
  error?: string;
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Await searchParams to fix the error
  const params = await Promise.resolve(searchParams);
  const error = params?.error || "An unknown error occurred";
  
  let errorMessage = "An error occurred during authentication.";
  
  // Map error codes to user-friendly messages
  switch (error) {
    case "CredentialsSignin":
      errorMessage = "Invalid email or password. Please try again.";
      break;
    case "OAuthAccountNotLinked":
      errorMessage = "This account is already linked to another provider.";
      break;
    case "EmailSignin":
      errorMessage = "The email could not be sent. Please try again.";
      break;
    case "SessionRequired":
      errorMessage = "You must be signed in to access this page.";
      break;
    case "AccessDenied":
      errorMessage = "You do not have permission to access this resource.";
      break;
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto rounded-full bg-destructive/15 p-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 