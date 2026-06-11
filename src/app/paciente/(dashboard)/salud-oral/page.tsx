import { Card, CardTitle } from "@/components/ui/Card";
import { getPatientData } from "@/lib/data/patient";
import { formatDate } from "@/lib/utils";
import { HeartPulse, ShieldCheck, Plus } from "lucide-react";

const actionLabels: Record<string, string> = {
  control_puntual: "Control periódico puntual",
  higiene: "Higiene completada en su fecha",
  revision_anual: "Revisión anual completa",
};

export const dynamic = "force-dynamic";

export default async function SaludOralPage() {
  const data = await getPatientData();
  if (!data) return null;

  const { oralHealthBalance, oralHealthRules, oralHealthHistory } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Saldo de Salud Oral</h1>
        <p className="text-sm text-muted">
          Gana créditos por cuidar tu salud oral preventivamente.
        </p>
      </div>

      <Card className="flex items-center gap-4 bg-gradient-to-br from-[#0f3d2e] to-surface">
        <div className="rounded-2xl bg-accent/15 p-3">
          <HeartPulse className="h-7 w-7 text-accent" />
        </div>
        <div>
          <p className="text-xs text-muted">Saldo disponible</p>
          <p className="text-2xl font-semibold tabular-nums">
            {oralHealthBalance} <span className="text-base font-normal text-muted">créditos</span>
          </p>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Cómo ganar créditos
        </CardTitle>
        <div className="flex flex-col gap-2">
          {oralHealthRules.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm">
              <span>{actionLabels[r.action] ?? r.action}</span>
              <span className="font-medium text-accent">+{r.credits_awarded} créditos</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-3">¿Cómo usarlos?</CardTitle>
        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-start gap-2">
            <Plus className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            Descuentos en tratamientos preventivos (limpiezas, flúor, sellantes)
          </li>
          <li className="flex items-start gap-2">
            <Plus className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            Canje por kits de higiene
          </li>
          <li className="flex items-start gap-2">
            <Plus className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            Conversión parcial a cashback (según reglas de la clínica)
          </li>
        </ul>
      </Card>

      <div>
        <CardTitle className="mb-3">Historial</CardTitle>
        <div className="flex flex-col gap-2">
          {oralHealthHistory.length === 0 && (
            <p className="text-sm text-muted">Aún no tienes movimientos.</p>
          )}
          {oralHealthHistory.map((h) => (
            <Card key={h.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{h.reason}</p>
                <p className="text-xs text-muted">{formatDate(h.created_at)}</p>
              </div>
              <p className="text-sm font-semibold text-accent tabular-nums">
                {h.amount > 0 ? "+" : ""}
                {h.amount}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
