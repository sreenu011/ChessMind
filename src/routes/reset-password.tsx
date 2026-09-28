import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { authErrorMessage } from "@/lib/auth-errors";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset password — ChessMind" },
      { name: "description", content: "Reset your ChessMind account password via email." },
      { property: "og:title", content: "Reset password — ChessMind" },
      { property: "og:description", content: "Reset your ChessMind account password via email." },
    ],
  }),
  component: ResetPasswordPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="surface-hero flex min-h-[80vh] items-center justify-center px-4 py-16">
      <Card className="animate-rise w-full max-w-md shadow-elevate">
        {sent ? (
          <>
            <CardHeader className="items-center text-center">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="size-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Check your inbox</CardTitle>
              <CardDescription>
                We sent a password reset link to <span className="font-medium text-foreground">{email}</span>. Follow
                the link in that email to choose a new password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Didn't get it? Check your spam folder, or{" "}
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-foreground underline underline-offset-4 hover:text-primary"
                >
                  try again
                </button>
                .
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to sign in
                </Link>
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Reset your password</CardTitle>
              <CardDescription>
                Enter the email you signed up with and we'll send you a reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <Button className="w-full" type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Send reset link
                </Button>
              </form>
              <Button asChild variant="ghost" className="mt-3 w-full">
                <Link to="/login">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to sign in
                </Link>
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
