import { useEffect, useState } from "react";
import { Flower2, Sparkles } from "lucide-react";
import { Petals } from "./Petals";

export function BloomIntro({ welcome = false }: { welcome?: boolean }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="bloom-overlay" role="status" aria-live="polite">
      <Petals dense />
      <div className="bloom-center">
        <div className="bloom-halo" />
        <Flower2 className="bloom-flower" strokeWidth={1} />
        <Sparkles className="bloom-spark bloom-spark-one" />
        <Sparkles className="bloom-spark bloom-spark-two" />
      </div>
      <div className="bloom-copy">
        <h2>{welcome ? "Welcome to YouSkin 🌸" : "Your glow is blooming"}</h2>
        <p>Your personal AI skincare assistant</p>
      </div>
    </div>
  );
}
