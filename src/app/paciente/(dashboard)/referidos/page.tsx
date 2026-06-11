import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPatientData } from "@/lib/data/patient";
import { formatDate } from "@/lib/utils";
import { Users, Copy, Share2, Gift } from "lucide-react";

const statusLabel: Record<string, { label: string; className: string }> = {
  completed: { label: "Completado", className: "border-accent text-accent" },
  registered: { label: "Registrado", className: "border-tier-oro text-tier-oro" },
  pending: { label: "Pendiente", className: "text-muted" },
};

export const dynamic = "force-dynamic";

export default async function ReferidosPage() {
  const data = await getPatientData();
  if (!data) return null;

  const { digitalCard, referrals, patient } = data;
  const code =
    digitalCard?.qr_code ?? `${patient.full_name.split(" ")[0].toUpperCase()}-2026`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Refiere y gana</h1>
        <p className="text-sm text-muted">
          Comparte tu código y ambos reciben recompensas cuando tu amigo agende su primera cita.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-[#0f3d2e] to-surface">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-accent/15 p-3">
            <Gift className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium">Recompensa por referido</p>
            <p className="text-xs text-muted">$20.000 cashback + 2 sellos para ti y tu amigo</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-2">Tu código</CardTitle>
        <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-surface-2 px-4 py-3">
          <span className="font-mono text-lg font-semibold tracking-widest">{code}</span>
          <button className="rounded-full bg-surface p-2 text-muted hover:text-foreground">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-2.5 text-sm font-semibold text-accent-foreground">
          <Share2 className="h-4 w-4" />
          Compartir por WhatsApp
        </button>
      </Card>

      <div>
        <CardTitle className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" /> Tus referidos
        </CardTitle>
        <div className="flex flex-col gap-2">
          {referrals.length === 0 && (
            <p className="text-sm text-muted">
              Aún no tienes referidos. ¡Comparte tu código para empezar a ganar!
            </p>
          )}
          {referrals.map((r) => (
            <Card key={r.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">
                  {(r.referred as { full_name: string } | null)?.full_name ?? "—"}
                </p>
                {r.created_at && <p className="text-xs text-muted">{formatDate(r.created_at)}</p>}
              </div>
              <Badge className={statusLabel[r.status]?.className ?? "text-muted"}>
                {statusLabel[r.status]?.label ?? r.status}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
