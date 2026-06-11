import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPatientData } from "@/lib/data/patient";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Check, Lock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { WompiCheckoutButton } from "./WompiCheckoutButton";

const tierColor: Record<string, string> = {
  Bronce: "var(--color-tier-bronce)",
  Plata: "var(--color-tier-plata)",
  Oro: "var(--color-tier-oro)",
  Diamante: "var(--color-tier-diamante)",
};

export const dynamic = "force-dynamic";

export default async function BeneficiosPage({
  searchParams,
}: {
  searchParams: Promise<{ pago?: string }>;
}) {
  const data = await getPatientData();
  if (!data) return null;

  const { tiers, currentTierIndex, tier, cashbackHistory, membership, wompiEnabled } = data;
  const { pago } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Tus beneficios</h1>
        <p className="text-sm text-muted">
          Nivel actual: <span className="text-foreground font-medium">{tier?.name ?? "—"}</span>{" "}
          · {tier?.cashback_percent ?? 0}% cashback
        </p>
      </div>

      {pago === "resultado" && (
        <Card className="border-2 border-accent">
          <p className="text-sm">
            Estamos confirmando tu pago con Wompi. Si fue aprobado, verás reflejado el cambio en
            unos segundos.
          </p>
        </Card>
      )}

      {wompiEnabled && membership && Number(membership.monthly_amount) > 0 && (
        <Card>
          <CardTitle className="mb-1">Membresía</CardTitle>
          <p className="mb-3 text-sm text-muted">
            Paga tu membresía mensual de forma segura con Wompi.
          </p>
          <p className="mb-4 text-lg font-semibold">
            {formatCurrency(Number(membership.monthly_amount))}{" "}
            <span className="text-sm font-normal text-muted">/ mes</span>
          </p>
          <WompiCheckoutButton />
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {tiers.map((t, i) => {
          const unlocked = currentTierIndex >= 0 && i <= currentTierIndex;
          const active = i === currentTierIndex;
          const benefits = (t.benefits as string[]) ?? [];
          return (
            <Card
              key={t.id}
              className={cn(
                "border-2",
                active ? "border-accent" : "border-border",
                !unlocked && "opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: tierColor[t.name] }}
                  />
                  <p className="font-semibold">{t.name}</p>
                  {active && <Badge className="border-accent text-accent">Nivel actual</Badge>}
                </div>
                <p className="text-sm text-muted">{t.min_months}+ meses</p>
              </div>
              <ul className="mt-3 flex flex-col gap-1.5">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm">
                    {unlocked ? (
                      <Check className="h-4 w-4 shrink-0 text-accent" />
                    ) : (
                      <Lock className="h-4 w-4 shrink-0 text-muted" />
                    )}
                    <span className={!unlocked ? "text-muted" : ""}>{b}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <div>
        <CardTitle className="mb-3">Historial de cashback</CardTitle>
        <div className="flex flex-col gap-2">
          {cashbackHistory.length === 0 && (
            <p className="text-sm text-muted">Aún no tienes movimientos de cashback.</p>
          )}
          {cashbackHistory.map((m) => (
            <Card key={m.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-surface-2 p-2">
                  {m.type === "earned" ? (
                    <ArrowUpRight className="h-4 w-4 text-accent" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-danger" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{m.description}</p>
                  <p className="text-xs text-muted">{formatDate(m.created_at)}</p>
                </div>
              </div>
              <p
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  m.type === "earned" ? "text-accent" : "text-danger"
                )}
              >
                {m.type === "earned" ? "+" : "-"}
                {formatCurrency(Math.abs(Number(m.amount)))}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
