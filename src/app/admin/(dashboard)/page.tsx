import { StatCard } from "@/components/ui/StatCard";
import { getAdminData } from "@/lib/data/admin";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Users, Wallet, Gift } from "lucide-react";
import { DashboardCharts } from "./_components/DashboardCharts";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { kpis } = await getAdminData();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted">Resumen del programa de fidelización</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Ingresos por membresías"
          value={formatCurrency(kpis.monthlyRevenue)}
          icon={DollarSign}
        />
        <StatCard
          label="Pacientes activos"
          value={kpis.activeMembers.toString()}
          icon={Users}
        />
        <StatCard
          label="Cashback otorgado"
          value={formatCurrency(kpis.cashbackIssued)}
          icon={Gift}
        />
        <StatCard
          label="Cashback redimido"
          value={formatCurrency(kpis.cashbackRedeemed)}
          icon={Wallet}
        />
      </div>

      <DashboardCharts tierDistribution={kpis.tierDistribution} revenueTrend={kpis.revenueTrend} />
    </div>
  );
}
