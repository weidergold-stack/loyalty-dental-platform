import { Card, CardTitle } from "@/components/ui/Card";
import { getPatientData } from "@/lib/data/patient";
import { cn } from "@/lib/utils";
import { Stamp } from "lucide-react";
import { RewardsCatalog } from "./RewardsCatalog";

export const dynamic = "force-dynamic";

export default async function RecompensasPage() {
  const data = await getPatientData();
  if (!data) return null;

  const { stampProgram, stampsBalance, rewards } = data;
  const rules = (stampProgram?.rules as { action: string; stamps: number }[]) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">{stampProgram?.name ?? "Programa de sellos"}</h1>
        <p className="text-sm text-muted">
          Acumula sellos en cada visita y canjéalos por recompensas.
        </p>
      </div>

      <Card>
        <CardTitle className="mb-3">Tus sellos</CardTitle>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl border",
                i < stampsBalance
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface-2"
              )}
            >
              <Stamp
                className={cn(
                  "h-5 w-5",
                  i < stampsBalance ? "text-accent" : "text-muted/40"
                )}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">{stampsBalance} sellos acumulados</p>
      </Card>

      <Card>
        <CardTitle className="mb-3">Cómo ganar sellos</CardTitle>
        <div className="flex flex-col gap-2">
          {rules.map((r) => (
            <div key={r.action} className="flex items-center justify-between text-sm">
              <span>{r.action}</span>
              <span className="font-medium text-accent">+{r.stamps} sello{r.stamps > 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      </Card>

      <RewardsCatalog rewards={rewards} stampsBalance={stampsBalance} />
    </div>
  );
}
