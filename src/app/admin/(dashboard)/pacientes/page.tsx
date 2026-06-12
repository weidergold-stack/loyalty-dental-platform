import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAdminData } from "@/lib/data/admin";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { NuevoPacienteModal } from "./NuevoPacienteModal";

const tierBadgeClass: Record<string, string> = {
  Bronce: "border-tier-bronce text-tier-bronce",
  Plata: "border-tier-plata text-tier-plata",
  Oro: "border-tier-oro text-tier-oro",
  Diamante: "border-tier-diamante text-tier-diamante",
};

export const dynamic = "force-dynamic";

export default async function PacientesPage() {
  const { clinicId, patients, tiers } = await getAdminData();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pacientes</h1>
          <p className="text-sm text-muted">
            {patients.length} pacientes en el programa de fidelización
          </p>
        </div>
        <NuevoPacienteModal clinicId={clinicId} tiers={tiers} />
      </div>

      <Card className="p-0">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <Search className="h-4 w-4 text-muted" />
          <input
            placeholder="Buscar paciente..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Paciente</th>
                <th className="px-4 py-3 font-medium">Nivel</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Cashback</th>
                <th className="px-4 py-3 font-medium">Sellos</th>
                <th className="px-4 py-3 font-medium">Salud Oral</th>
                <th className="px-4 py-3 font-medium">Miembro desde</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">
                    <Badge className={tierBadgeClass[p.tier] ?? "text-muted"}>{p.tier}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs",
                        p.status === "active" ? "text-accent" : "text-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          p.status === "active" ? "bg-accent" : "bg-muted"
                        )}
                      />
                      {p.status === "active" ? "Activo" : "Pausado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{formatCurrency(p.cashback)}</td>
                  <td className="px-4 py-3 tabular-nums">{p.stamps}</td>
                  <td className="px-4 py-3 tabular-nums">{p.oralCredits}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(p.since)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
