import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Flower2, LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "./BrandMark";

export function AuthPanel() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const displayName = String(form.get("displayName") ?? "");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { display_name: displayName } },
      });
      setLoading(false);
      if (error) return setMessage(error.message);
      if (!data.session) return setMessage("Check your email to confirm your account, then come back to sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMessage(error.message);
    }
    window.sessionStorage.setItem("youskin-welcome", "true");
    await navigate({ to: "/dashboard" });
  }

  async function handleGoogle() {
    setLoading(true);
    setMessage("");
    window.sessionStorage.setItem("youskin-welcome", "true");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setLoading(false);
      setMessage(result.error.message);
      return;
    }
    if (!result.redirected) await navigate({ to: "/dashboard" });
  }

  return (
    <section className="auth-panel">
      <div className="auth-panel-inner">
        <BrandMark />
        <div className="auth-heading">
          <span className="eyebrow"><Flower2 /> Personalized skincare</span>
          <h1>{mode === "signin" ? "Welcome back, beautiful" : "Begin your skin journey"}</h1>
          <p>{mode === "signin" ? "Your skin's most radiant chapter starts here." : "Create your personal space for thoughtful skin care."}</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="field-label">Your name<Input name="displayName" placeholder="How should we greet you?" required /></label>
          )}
          <label className="field-label">Email address<Input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
          <label className="field-label">Password
            <span className="password-field"><Input name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} required />
              <Button type="button" variant="ghost" size="icon" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff /> : <Eye />}</Button>
            </span>
          </label>
          {message && <p className="auth-message">{message}</p>}
          <Button className="w-full" size="lg" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" /> : null}{mode === "signin" ? "Sign in to YouSkin" : "Create my account"}</Button>
        </form>
        <div className="auth-divider"><span>or continue with</span></div>
        <Button variant="outline" size="lg" className="w-full" onClick={handleGoogle} disabled={loading}><span className="google-mark">G</span>Google</Button>
        <p className="auth-switch">{mode === "signin" ? "New to YouSkin?" : "Already have an account?"} <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }}>{mode === "signin" ? "Create an account" : "Sign in"}</button></p>
      </div>
    </section>
  );
}
