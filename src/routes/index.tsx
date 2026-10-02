import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/auth" }); },
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
