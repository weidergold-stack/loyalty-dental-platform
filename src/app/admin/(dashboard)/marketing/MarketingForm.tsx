"use client";

import { useMemo, useState, useTransition } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import { Megaphone, Mail, MessageCircle, Smartphone, Send } from "lucide-react";
import { sendCampaign, type AudienceType, type CampaignChannel } from "./actions";

const channels: { value: CampaignChannel; label: string; icon: typeof Mail }[] = [
  { value: "push", label: "Push notifications", icon: Smartphone },
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "SMS", icon: MessageCircle },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

const suggestedTemplates = [
  "Te faltan 2 días para subir a Oro",
  "Has acumulado $50.000 en cashback",
  "Tienes una higiene preventiva disponible",
  "Te faltan 2 sellos para tu próxima recompensa",
  "Promoción exclusiva para miembros Diamante",
];

interface PatientOption {
  id: string;
  tierId: string | null;
  status: string;
}

interface TierOption {
  id: string;
  name: string;
}

interface CampaignGroup {
  channel: string;
  template: string;
  created_at: string;
  total: number;
  sent: number;
  pending: number;
  failed: number;
}

const channelLabel: Record<string, string> = {
  push: "Push",
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
};

export function MarketingForm({
  clinicId,
  patients,
  tiers,
  recentCampaigns,
}: {
  clinicId: string;
  patients: PatientOption[];
  tiers: TierOption[];
  recentCampaigns: CampaignGroup[];
}) {
  const [channel, setChannel] = useState<CampaignChannel>("push");
  const [audience, setAudience] = useState<AudienceType>("all");
  const [tierId, setTierId] = useState(tiers[0]?.id ?? "");
  const [template, setTemplate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const audienceCount = useMemo(() => {
    if (audience === "tier") return patients.filter((p) => p.tierId === tierId).length;
    if (audience === "inactive") return patients.filter((p) => p.status !== "active").length;
    return patients.length;
  }, [patients, audience, tierId]);

  const handleSend = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await sendCampaign({
        clinicId,
        channel,
        template,
        audience,
        tierId: audience === "tier" ? tierId : undefined,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(`Campaña registrada para ${result.count} paciente${result.count === 1 ? "" : "s"}.`);
      setTemplate("");
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Marketing</h1>
        <p className="text-sm text-muted">
          Crea campañas segmentadas por nivel, antigüedad o comportamiento.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((c) => (
          <button
            key={c.value}
            onClick={() => setChannel(c.value)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-colors",
              channel === c.value
                ? "border-accent bg-surface"
                : "border-border bg-surface hover:border-accent/50"
            )}
          >
            <div className="rounded-xl bg-surface-2 p-2.5">
              <c.icon className="h-5 w-5 text-accent" />
            </div>
            <p className="font-medium">{c.label}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardTitle className="mb-3 flex items-center gap-2">
          <Send className="h-4 w-4" /> Nueva campaña
        </CardTitle>

        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Audiencia</span>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as AudienceType)}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="all">Todos los pacientes</option>
                <option value="tier">Por nivel de membresía</option>
                <option value="inactive">Pacientes inactivos / pausados</option>
              </select>
            </label>

            {audience === "tier" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-muted">Nivel</span>
                <select
                  value={tierId}
                  onChange={(e) => setTierId(e.target.value)}
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                >
                  {tiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <p className="text-xs text-muted">
            Esta campaña llegará a <strong className="text-foreground">{audienceCount}</strong> paciente
            {audienceCount === 1 ? "" : "s"}.
          </p>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Mensaje</span>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={3}
              placeholder="Escribe el mensaje de la campaña..."
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>

          <div>
            <p className="mb-2 text-xs text-muted">Plantillas sugeridas</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTemplates.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:border-accent hover:text-foreground"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-accent">{success}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={isPending || !template.trim() || audienceCount === 0}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isPending ? "Enviando..." : "Enviar campaña"}
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-3 flex items-center gap-2">
          <Megaphone className="h-4 w-4" /> Campañas recientes
        </CardTitle>
        {recentCampaigns.length === 0 ? (
          <p className="text-sm text-muted">Todavía no has enviado ninguna campaña.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">Canal</th>
                  <th className="px-4 py-3 font-medium">Mensaje</th>
                  <th className="px-4 py-3 font-medium">Destinatarios</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((c, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Badge>{channelLabel[c.channel] ?? c.channel}</Badge>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">{c.template}</td>
                    <td className="px-4 py-3 tabular-nums">{c.total}</td>
                    <td className="px-4 py-3 text-muted">
                      {c.sent > 0 && `${c.sent} enviados`}
                      {c.sent > 0 && (c.pending > 0 || c.failed > 0) && ", "}
                      {c.pending > 0 && `${c.pending} pendientes`}
                      {c.pending > 0 && c.failed > 0 && ", "}
                      {c.failed > 0 && `${c.failed} fallidos`}
                    </td>
                    <td className="px-4 py-3 text-muted">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
