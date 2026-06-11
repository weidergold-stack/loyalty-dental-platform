import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max,
  className,
  colorClassName = "bg-accent",
}: {
  value: number;
  max: number;
  className?: string;
  colorClassName?: string;
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("h-2 w-full rounded-full bg-surface-2", className)}>
      <div
        className={cn("h-full rounded-full transition-all", colorClassName)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
