import { TierName } from "@/lib/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { QrCode } from "lucide-react";

const tierGradients: Record<TierName, string> = {
  Bronce: "from-[#a9683f] via-[#c9885f] to-[#7a4e2f]",
  Plata: "from-[#9aa3b5] via-[#e2e8f0] to-[#6b7488]",
  Oro: "from-[#b9892a] via-[#f0c14b] to-[#8a661c]",
  Diamante: "from-[#3b5b87] via-[#9fdcff] to-[#274266]",
};

const tierEmoji: Record<TierName, string> = {
  Bronce: "🥉",
  Plata: "🥈",
  Oro: "🥇",
  Diamante: "💎",
};

export function DigitalCard({
  patientName,
  tier,
  memberSince,
  cashbackBalance,
  stampsBalance,
  stampsTarget,
  status,
  clinicName,
}: {
  patientName: string;
  tier: TierName;
  memberSince: string;
  cashbackBalance: number;
  stampsBalance: number;
  stampsTarget: number;
  status: "active" | "paused" | "cancelled";
  clinicName: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg",
        tierGradients[tier]
      )}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-black/10 blur-xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/70">{clinicName}</p>
          <p className="mt-1 text-lg font-semibold">{patientName}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-sm font-medium backdrop-blur">
          <span>{tierEmoji[tier]}</span>
          <span>{tier}</span>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-white/70">Cashback disponible</p>
          <p className="text-xl font-semibold tabular-nums">{formatCurrency(cashbackBalance)}</p>
        </div>
        <div>
          <p className="text-xs text-white/70">Sellos</p>
          <p className="text-xl font-semibold tabular-nums">
            {stampsBalance}/{stampsTarget}
          </p>
        </div>
      </div>

      <div className="relative mt-6 flex items-end justify-between">
        <div>
          <p className="text-xs text-white/70">Miembro desde</p>
          <p className="text-sm font-medium">{formatDate(memberSince)}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                status === "active" ? "bg-emerald-300" : "bg-amber-300"
              )}
            />
            {status === "active" ? "Membresía activa" : "Membresía pausada"}
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/90 text-background">
          <QrCode className="h-10 w-10" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
