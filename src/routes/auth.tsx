import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/youskin/AuthPanel";
import { Petals } from "@/components/youskin/Petals";
import portrait from "@/assets/youskin-portrait.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in — YouSkin" },
    { name: "description", content: "Sign in to your personal YouSkin skincare assistant." },
    { property: "og:title", content: "Sign in — YouSkin" },
    { property: "og:description", content: "Your personal AI skincare assistant." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  return <main className="auth-page"><Petals /><AuthPanel /><aside className="auth-visual"><img src={portrait} alt="Woman with luminous skin beside cherry blossoms" width={1024} height={1280} /><div className="auth-visual-copy"><p>Rooted in science.<br /><em>Made for your skin.</em></p><span>Personalized rituals · Thoughtful results</span></div></aside></main>;
}
