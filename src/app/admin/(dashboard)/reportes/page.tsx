import { Card, CardTitle } from "@/components/ui/Card";
import { getAdminData } from "@/lib/data/admin";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReportesPage() {
  const { patients, kpis } = await getAdminData();
  const ranking = [...patients].sort((a, b) => b.cashback - a.cashback);
  const net = kpis.cashbackIssued - kpis.cashbackRedeemed;
  const redemptionRate =
    kpis.cashbackIssued > 0 ? Math.round((kpis.cashbackRedeemed / kpis.cashbackIssued) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Reportes</h1>
        <p className="text-sm text-muted">Retención, recompensas y rentabilidad del programa</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardTitle>Rentabilidad del programa</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(net)}</p>
          <p className="text-xs text-muted">Cashback otorgado vs. redimido (neto)</p>
        </Card>
        <Card>
          <CardTitle>Tasa de redención</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{redemptionRate}%</p>
          <p className="text-xs text-muted">Del cashback otorgado</p>
        </Card>
        <Card>
          <CardTitle>Pacientes activos</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{kpis.activeMembers}</p>
          <p className="text-xs text-muted">Membresías en estado activo</p>
        </Card>
      </div>

      <Card>
        <CardTitle className="mb-3">Ranking de pacientes por cashback acumulado</CardTitle>
        <div className="flex flex-col gap-2">
          {ranking.length === 0 && <p className="text-sm text-muted">Aún no hay pacientes.</p>}
          {ranking.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold">
                  {i + 1}
                </span>
                {p.name}
              </span>
              <span className="font-medium tabular-nums">{formatCurrency(p.cashback)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
