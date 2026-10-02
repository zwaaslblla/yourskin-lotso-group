import { Flower2 } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="YouSkin">
      <span className="brand-mark"><Flower2 strokeWidth={1.5} /></span>
      <span className={compact ? "font-display text-xl" : "font-display text-2xl"}>YouSkin</span>
    </div>
  );
}
