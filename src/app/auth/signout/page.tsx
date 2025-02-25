"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignOutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto rounded-full bg-muted p-3">
            <LogOut className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign Out</h1>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to sign out?
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button onClick={handleSignOut} disabled={isLoading}>
            {isLoading ? "Signing out..." : "Yes, Sign Out"}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
} 