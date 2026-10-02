import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    throw redirect({ to: data.user ? "/dashboard" : "/auth" });
  },
  head: () => ({ meta: [
    { title: "YouSkin — Personal AI Skincare" },
    { name: "description", content: "Understand your skin and discover a thoughtful skincare routine made for you." },
    { property: "og:title", content: "YouSkin — Personal AI Skincare" },
    { property: "og:description", content: "Understand your skin and discover a thoughtful skincare routine made for you." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => null,
});
