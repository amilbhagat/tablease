import { Metadata } from "next";
import { SignInForm } from "@/components/auth/signin-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | Restaurant POS",
  description: "Sign in to your Restaurant POS account",
};

interface SearchParams {
  registered?: string;
  callbackUrl?: string;
  error?: string;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Await searchParams to fix the error
  const params = await Promise.resolve(searchParams);
  const isNewlyRegistered = params?.registered === "true";

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center text-sm font-medium text-muted-foreground md:left-8 md:top-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {isNewlyRegistered && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/50 dark:text-green-300">
            Account created successfully. Please sign in.
          </div>
        )}
        <SignInForm />
      </div>
    </div>
  );
} 