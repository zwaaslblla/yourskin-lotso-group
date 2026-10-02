import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, ChevronRight, Droplets, History, Leaf, LogOut, ScanFace, ShieldCheck, Sparkles, Upload, WandSparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/youskin/BrandMark";
import { BloomIntro } from "@/components/youskin/BloomIntro";
import { Petals } from "@/components/youskin/Petals";
import portrait from "@/assets/youskin-portrait.jpg";

type Analysis = { id: string; hydration: number; texture: number; sensitivity: number; summary: string; created_at: string };

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "My Skin Dashboard — YouSkin" },
    { name: "description", content: "Upload a photo, review your skin analysis, and explore personalized skincare recommendations." },
    { property: "og:title", content: "My Skin Dashboard — YouSkin" },
    { property: "og:description", content: "Your personal skin analysis and skincare recommendations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>();
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<Analysis[]>([]);
  const [welcomeIntro] = useState(() => typeof window !== "undefined" && window.sessionStorage.getItem("youskin-welcome") === "true");
  const [activeAnalysis, setActiveAnalysis] = useState<Analysis>({ id: "demo", hydration: 72, texture: 84, sensitivity: 38, summary: "Your skin looks balanced and resilient, with a little room for extra hydration and barrier support.", created_at: new Date().toISOString() });
  const name = String(user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? "Beautiful").split(" ")[0];

  useEffect(() => {
    const isWelcome = window.sessionStorage.getItem("youskin-welcome") === "true";
    if (isWelcome) window.sessionStorage.removeItem("youskin-welcome");
    supabase.from("skin_analyses").select("id,hydration,texture,sensitivity,summary,created_at").order("created_at", { ascending: false }).limit(6).then(({ data }) => { if (data) setHistory(data); });
  }, []);

  const today = useMemo(() => new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()), []);

  function selectPhoto(file?: File) {
    if (!file) return;
    const next = URL.createObjectURL(file);
    setPreview((current) => { if (current) URL.revokeObjectURL(current); return next; });
  }

  async function analyze() {
    if (!preview) return inputRef.current?.click();
    setAnalyzing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1800));
    const result = { hydration: 78, texture: 86, sensitivity: 32, summary: "Your skin appears well-balanced with strong texture. Focus on gentle hydration and daily antioxidant protection to preserve your natural glow." };
    const { data } = await supabase.from("skin_analyses").insert({ user_id: user.id, ...result, recommendations: ["Ceramide cleanser", "Vitamin C serum", "Barrier moisturizer", "SPF 50"] }).select("id,hydration,texture,sensitivity,summary,created_at").single();
    if (data) { setActiveAnalysis(data); setHistory((items) => [data, ...items].slice(0, 6)); }
    setAnalyzing(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  return <main className="dashboard-page">
    <BloomIntro welcome={welcomeIntro} />
    <Petals />
    <header className="dashboard-header"><BrandMark compact /><nav><Button variant="ghost" size="sm" aria-label="Analysis history"><History /> History</Button><Button variant="ghost" size="icon" aria-label="Sign out" onClick={signOut}><LogOut /></Button></nav></header>
    <div className="dashboard-shell">
      <section className="dashboard-welcome"><div><span className="eyebrow"><Sparkles /> {today}</span><h1>Good morning, {name}.</h1><p>Let's listen to what your skin needs today.</p></div><div className="daily-note"><Leaf /><span><strong>Daily note</strong>Hydration is your skin's quiet superpower.</span></div></section>
      <section className="dashboard-grid">
        <article className="upload-card">
          <div className="section-heading"><span>01</span><div><h2>Meet your skin</h2><p>Upload a clear, makeup-free photo in natural light.</p></div></div>
          <Button className="photo-drop" variant="ghost" type="button" onClick={() => inputRef.current?.click()} aria-label="Upload face photo">
            <img src={preview ?? portrait} alt={preview ? "Your selected face photo" : "Example face photo"} width={1024} height={1280} />
            <span className="photo-overlay"><Camera />{preview ? "Change photo" : "Upload your photo"}</span>
          </Button>
          <input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectPhoto(event.target.files?.[0])} />
          <div className="privacy-note"><ShieldCheck /><span><strong>Your photo stays private</strong>Used only for your analysis and never shared.</span></div>
          <Button size="lg" className="w-full" onClick={analyze} disabled={analyzing}>{analyzing ? <><WandSparkles className="animate-pulse" /> Reading your skin...</> : preview ? <><ScanFace /> Analyze my skin</> : <><Upload /> Choose a face photo</>}</Button>
        </article>
        <div className="result-column">
          <article className="results-card">
            <div className="section-heading"><span>02</span><div><h2>Your skin, understood</h2><p>A gentle snapshot of your skin today.</p></div></div>
            <div className="score-grid"><SkinScore icon={<Droplets />} label="Hydration" value={activeAnalysis.hydration} tone="rose" /><SkinScore icon={<Sparkles />} label="Texture" value={activeAnalysis.texture} tone="green" /><SkinScore icon={<Leaf />} label="Sensitivity" value={activeAnalysis.sensitivity} tone="gold" /></div>
            <div className="analysis-summary"><Sparkles /><p>{activeAnalysis.summary}</p></div>
          </article>
          <article className="routine-card">
            <div className="section-heading"><span>03</span><div><h2>Your recommended ritual</h2><p>Simple, supportive steps chosen for you.</p></div></div>
            <div className="routine-list"><Routine time="AM" title="Brighten & protect" items="Vitamin C serum · Barrier moisturizer · SPF 50" /><Routine time="PM" title="Cleanse & replenish" items="Ceramide cleanser · Peptide serum · Night cream" /></div>
          </article>
        </div>
      </section>
      <section className="history-band"><div className="section-heading"><span>04</span><div><h2>Your glow journey</h2><p>Small rituals, visible progress.</p></div></div><div className="history-list">{history.length ? history.slice(0, 3).map((item) => <div className="history-item" key={item.id}><span>{new Date(item.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><strong>{item.hydration}% hydration</strong><ChevronRight /></div>) : <div className="history-empty">Your first analysis will begin your story here.</div>}</div></section>
    </div>
  </main>;
}

function SkinScore({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) {
  return <div className={`skin-score score-${tone}`}><div>{icon}<span>{label}</span></div><strong>{value}<small>%</small></strong><span className="score-track"><i style={{ width: `${value}%` }} /></span></div>;
}
function Routine({ time, title, items }: { time: string; title: string; items: string }) {
  return <div className="routine-row"><span>{time}</span><div><strong>{title}</strong><p>{items}</p></div><ChevronRight /></div>;
}
