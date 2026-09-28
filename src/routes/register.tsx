import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, Mail, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { authErrorMessage } from "@/lib/auth-errors";
import { StaticAuthChessVisual } from "@/components/dashboard-3d/static-chess-fallback";

export const Route = createFileRoute("/register")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create account — ChessMind" },
      { name: "description", content: "Create a free ChessMind account and start rated play." },
      { property: "og:title", content: "Create account — ChessMind" },
      { property: "og:description", content: "Create a free ChessMind account and start playing." },
    ],
  }),
  component: RegisterPage,
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

type Errors = Partial<Record<"username" | "email" | "password" | "confirm", string>>;

function RegisterPage() {
  const { register, loginWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const submittingRef = useRef(false);

  useEffect(() => {
    if (!loading && user && !submittingRef.current) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next: Errors = {};
    if (!form.username.trim()) next.username = "Username is required.";
    else if (form.username.trim().length < 3 || form.username.trim().length > 24)
      next.username = "Username must be between 3 and 24 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await register(form.username.trim(), form.email, form.password);
      toast.success("Account created. Welcome to ChessMind!");
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(authErrorMessage(error));
      submittingRef.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSignIn = async () => {
    submittingRef.current = true;
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome to ChessMind!");
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(authErrorMessage(error));
      submittingRef.current = false;
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6 lg:px-8 min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full my-auto">
        {/* LEFT COLUMN: Decorative Lightweight Chess Visual (Desktop only) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden lg:block lg:col-span-6 w-full"
        >
          <StaticAuthChessVisual />
        </motion.div>

        {/* RIGHT COLUMN: Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          <Card className="border-amber-600/30 bg-card/95 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-amber-400" />
            <CardHeader className="space-y-3 pb-3 pt-6 px-6">
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  aria-label="ChessMind Home"
                  className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg group"
                >
                  <img
                    src="/logo.png"
                    alt="ChessMind"
                    className="h-12 w-12 object-contain rounded-xl shadow-md transition-transform group-hover:scale-105"
                  />
                  <span className="font-display text-xl font-bold tracking-tight text-foreground">ChessMind</span>
                </Link>
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-500 font-mono">
                  <Sparkles className="size-3.5" /> Midnight Chess Club
                </div>
              </div>
              <div className="pt-1">
                <CardTitle className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Create Account
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 mt-1">
                  Join ChessMind and start your rating journey
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-5 pt-0">
              {/* GOOGLE SIGN-IN BUTTON AT TOP OF FORM */}
              <Button
                type="button"
                variant="outline"
                onClick={onGoogleSignIn}
                disabled={googleSubmitting || submitting}
                aria-label="Continue with Google"
                className="w-full h-10 border-slate-300 dark:border-amber-600/40 bg-slate-100/90 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm text-sm"
              >
                {googleSubmitting ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon className="size-4" />}
                <span>Continue with Google</span>
              </Button>

              {/* DIVIDER */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300 dark:border-amber-900/40" />
                </div>
                <div className="relative bg-card px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Or register with email
                </div>
              </div>

              <form className="space-y-3" onSubmit={onSubmit} noValidate>
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 size-4 text-slate-500 dark:text-amber-500/70 pointer-events-none" />
                    <Input
                      id="username"
                      placeholder="knightrider"
                      value={form.username}
                      onChange={set("username")}
                      className="pl-9 h-9.5 bg-slate-100/90 dark:bg-slate-950/80 border-slate-300 dark:border-amber-900/40 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500 font-medium"
                    />
                  </div>
                  {errors.username && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.username}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 size-4 text-slate-500 dark:text-amber-500/70 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set("email")}
                      className="pl-9 h-9.5 bg-slate-100/90 dark:bg-slate-950/80 border-slate-300 dark:border-amber-900/40 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500 font-medium"
                    />
                  </div>
                  {errors.email && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 size-4 text-slate-500 dark:text-amber-500/70 pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={set("password")}
                      className="pl-9 h-9.5 bg-slate-100/90 dark:bg-slate-950/80 border-slate-300 dark:border-amber-900/40 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500 font-medium"
                    />
                  </div>
                  {errors.password && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.password}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirm" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 size-4 text-slate-500 dark:text-amber-500/70 pointer-events-none" />
                    <Input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={form.confirm}
                      onChange={set("confirm")}
                      className="pl-9 h-9.5 bg-slate-100/90 dark:bg-slate-950/80 border-slate-300 dark:border-amber-900/40 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500 font-medium"
                    />
                  </div>
                  {errors.confirm && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.confirm}</p>}
                </div>

                <Button
                  className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold h-10 text-sm tracking-wide shadow-md cursor-pointer transition-all mt-1"
                  type="submit"
                  disabled={submitting || googleSubmitting}
                >
                  {submitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : "CREATE ACCOUNT →"}
                </Button>

                <div className="pt-1.5 text-center text-xs text-slate-400 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link to="/login" className="font-bold text-amber-500 hover:text-amber-400 hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
