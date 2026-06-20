"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const tierColors: Record<string, string> = {
  Bronce: "#c9885f",
  Plata: "#c0c6d4",
  Oro: "#f0c14b",
  Diamante: "#7dd3fc",
};

export function DashboardCharts({
  tierDistribution,
  revenueTrend,
}: {
  tierDistribution: { tier: string; count: number }[];
  revenueTrend: { month: string; revenue: number }[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardTitle className="mb-4">Evolución de ingresos por membresías</CardTitle>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={revenueTrend}>
            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#232938" />
            <XAxis dataKey="month" stroke="#8b94a7" fontSize={12} />
            <YAxis
              stroke="#8b94a7"
              fontSize={12}
              tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                background: "#12161f",
                border: "1px solid #232938",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(v) => formatCurrency(Number(v))}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#34d399"
              fill="url(#revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardTitle className="mb-4">Distribución por nivel</CardTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={tierDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232938" />
            <XAxis dataKey="tier" stroke="#8b94a7" fontSize={12} />
            <YAxis stroke="#8b94a7" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "#12161f",
                border: "1px solid #232938",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {tierDistribution.map((entry) => (
                <Cell key={entry.tier} fill={tierColors[entry.tier]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
