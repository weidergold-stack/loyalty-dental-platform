import { DigitalCard } from "@/components/DigitalCard";
import { WalletButtons } from "@/components/WalletButtons";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getPatientData } from "@/lib/data/patient";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Sparkles, Megaphone } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PatientHome() {
  const data = await getPatientData();
  if (!data) return null;

  const {
    patient,
    membership,
    tier,
    monthsActive,
    nextTier,
    cashbackBalance,
    stampsBalance,
    oralHealthBalance,
    branding,
  } = data;

  const stampsTarget = data.rewards[0]?.stamps_required ?? 8;

  return (
    <div className="flex flex-col gap-5">
      <DigitalCard
        patientName={patient.full_name}
        tier={(tier?.name ?? "Bronce") as "Bronce" | "Plata" | "Oro" | "Diamante"}
        memberSince={membership?.start_date ?? patient.created_at}
        cashbackBalance={cashbackBalance}
        stampsBalance={stampsBalance}
        stampsTarget={stampsTarget}
        status={(membership?.status as "active" | "paused" | "cancelled") ?? "paused"}
        clinicName={branding?.display_name ?? "Clínica Sonrisa+"}
      />

      <WalletButtons
        appleEnabled={Boolean(
          process.env.APPLE_SIGNER_CERT_BASE64 &&
            process.env.APPLE_SIGNER_KEY_BASE64 &&
            process.env.APPLE_WWDR_CERT_BASE64 &&
            process.env.APPLE_PASS_TYPE_IDENTIFIER &&
            process.env.APPLE_TEAM_IDENTIFIER
        )}
        googleEnabled={Boolean(
          process.env.GOOGLE_WALLET_CREDENTIALS_JSON && process.env.GOOGLE_WALLET_ISSUER_ID
        )}
      />

      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>Saldo de Salud Oral</CardTitle>
          <span className="text-sm font-semibold text-accent">
            {oralHealthBalance} créditos
          </span>
        </div>
        {nextTier ? (
          <>
            <p className="mt-3 text-sm text-foreground">
              Te faltan <span className="font-semibold">{nextTier.monthsRemaining} meses</span> para
              subir a <span className="font-semibold">{nextTier.tier.name}</span>
            </p>
            <ProgressBar
              className="mt-2"
              value={monthsActive}
              max={nextTier.tier.min_months}
            />
          </>
        ) : (
          <p className="mt-3 text-sm text-foreground">
            ¡Felicidades! Estás en el nivel máximo.
          </p>
        )}
      </Card>

      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-surface-2 p-2.5">
            <Calendar className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium">Próxima cita</p>
            <p className="text-xs text-muted">15 jun, 10:00 AM · Higiene dental</p>
          </div>
        </div>
        <Link
          href="#"
          className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"
        >
          Agendar
        </Link>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-start gap-2">
          <div className="rounded-xl bg-surface-2 p-2.5">
            <Megaphone className="h-5 w-5 text-accent" />
          </div>
          <p className="text-sm font-medium">Promociones para ti</p>
          <p className="text-xs text-muted">2 promociones exclusivas activas</p>
        </Card>
        <Card className="flex flex-col items-start gap-2">
          <div className="rounded-xl bg-surface-2 p-2.5">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <p className="text-sm font-medium">Cashback acumulado</p>
          <p className="text-xs text-muted">{formatCurrency(cashbackBalance)} disponibles</p>
        </Card>
      </div>
    </div>
  );
}
