"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    router.push(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 p-6 rounded-xl border border-border bg-card"
      >
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold">Staff Sign In</h1>
          <p className="text-sm text-muted-foreground">Serene Dental staff dashboard</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
