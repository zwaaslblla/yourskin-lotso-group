import { cn } from "@/lib/utils";

const petals = Array.from({ length: 14 }, (_, index) => index);

export function Petals({ dense = false }: { dense?: boolean }) {
  const shown = dense ? petals : petals.slice(0, 8);
  return (
    <div className="petal-field" aria-hidden="true">
      {shown.map((petal) => <i key={petal} className={cn("petal", `petal-${petal + 1}`)} />)}
    </div>
  );
}
