import { Card } from "./Card";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp = true,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <div className="rounded-lg bg-surface-2 p-1.5">
          <Icon className="h-4 w-4 text-accent" />
        </div>
      </div>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      {trend && (
        <p
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trendUp ? "text-accent" : "text-danger"
          )}
        >
          {trendUp ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {trend}
        </p>
      )}
    </Card>
  );
}
