import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  password: z.string().min(1, "Enter your admin password."),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoadingPanel() {
  return (
    <div
      data-testid="status-admin-loading"
      className="min-h-[70vh] flex items-center justify-center px-6 text-sm text-muted-foreground"
    >
      Checking admin access…
    </div>
  );
}

function ConnectionError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-6 text-center">
      <p data-testid="status-admin-connection-error" className="text-sm text-muted-foreground">
        {message}
      </p>
      <button
        type="button"
        data-testid="button-admin-retry"
        onClick={onRetry}
        className="border border-primary/40 px-6 py-3 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        Try again
      </button>
    </section>
  );
}

function AdminLogin({ returnTo }: { returnTo: string }) {
  const { configured, login } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [serverError, setServerError] = useState("");
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  async function handleLogin(values: LoginValues) {
    setServerError("");
    try {
      await login(values.password);
      form.reset();
      setLocation(returnTo);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Sign-in failed. Please try again.",
      );
    }
  }

  return (
    <section className="min-h-[75vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8 border border-border/30 bg-background/40 p-8 md:p-10">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
            Love-Verse
          </p>
          <h1 className="font-serif text-3xl md:text-4xl">Owner sign in</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sign in to add, edit, and manage poems. The collection remains public to read.
          </p>
        </div>

        {!configured ? (
          <p
            data-testid="status-admin-not-configured"
            className="border border-border/30 p-4 text-sm leading-relaxed text-muted-foreground"
          >
            Admin access is not configured yet. In Vercel, set{" "}
            <span className="font-medium text-foreground">ADMIN_PASSWORD</span>{" "}
            (at least 16 characters) and{" "}
            <span className="font-medium text-foreground">SESSION_SECRET</span>{" "}
            (at least 32 characters).
          </p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                      Admin password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="input-admin-password"
                        type="password"
                        autoComplete="current-password"
                        autoFocus
                        className="h-12 rounded-none border-border/40 bg-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError && (
                <p
                  data-testid="status-admin-login-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                data-testid="button-admin-login"
                disabled={form.formState.isSubmitting}
                className="w-full border border-primary/50 px-8 py-4 text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
              >
                {form.formState.isSubmitting ? "Signing in…" : "Unlock admin"}
              </button>
            </form>
          </Form>
        )}

        <Link
          href="/"
          data-testid="link-admin-home"
          className="block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          Return to the collection
        </Link>
      </div>
    </section>
  );
}

function AdminDashboard() {
  const { logout } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");

  async function handleLogout() {
    setError("");
    try {
      await logout();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign out failed.");
      return;
    }
    setLocation("/");
  }

  return (
    <section className="min-h-[75vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl space-y-8 border border-border/30 bg-background/40 p-8 md:p-10 text-center">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
            Private admin
          </p>
          <h1 className="font-serif text-3xl md:text-4xl">You’re signed in</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You can now add, edit, and delete poems. Visitors can still browse the collection.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/add-poem"
            data-testid="link-admin-add-poem"
            className="border border-primary/50 px-8 py-4 text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Add a poem
          </Link>
          <button
            type="button"
            data-testid="button-admin-logout"
            onClick={() => void handleLogout()}
            className="border border-border/40 px-8 py-4 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            Sign out
          </button>
        </div>
        {error && (
          <p data-testid="status-admin-logout-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { authenticated, loading, statusError, refresh } = useAdminAuth();
  const [path] = useLocation();

  if (loading) return <LoadingPanel />;
  if (statusError) {
    return <ConnectionError message={statusError} onRetry={() => void refresh()} />;
  }
  if (!authenticated) return <AdminLogin returnTo={path} />;
  return <>{children}</>;
}

export default function AdminPage() {
  const { authenticated, loading, statusError, refresh } = useAdminAuth();

  if (loading) return <LoadingPanel />;
  if (statusError) {
    return <ConnectionError message={statusError} onRetry={() => void refresh()} />;
  }
  if (authenticated) return <AdminDashboard />;
  return <AdminLogin returnTo="/admin" />;
}