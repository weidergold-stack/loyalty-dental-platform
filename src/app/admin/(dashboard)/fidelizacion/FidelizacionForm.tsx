"use client";

import { useState, useTransition } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  saveFidelizacionConfig,
  type OralRuleInput,
  type RewardInput,
  type StampRuleInput,
  type TierInput,
} from "./actions";

const tabs = ["Niveles y Cashback", "Programa de Sellos", "Saldo de Salud Oral"] as const;
type Tab = (typeof tabs)[number];

const tierBadgeClass: Record<string, string> = {
  Bronce: "border-tier-bronce text-tier-bronce",
  Plata: "border-tier-plata text-tier-plata",
  Oro: "border-tier-oro text-tier-oro",
  Diamante: "border-tier-diamante text-tier-diamante",
};

const tierColor: Record<string, string> = {
  Bronce: "var(--color-tier-bronce)",
  Plata: "var(--color-tier-plata)",
  Oro: "var(--color-tier-oro)",
  Diamante: "var(--color-tier-diamante)",
};

interface DbTier {
  id: string;
  name: string;
  min_months: number;
  cashback_percent: number;
  benefits: string[];
}

interface DbStampProgram {
  id: string;
  name: string;
  rules: StampRuleInput[];
}

interface DbReward {
  id: string;
  name: string;
  description: string;
  stamps_required: number;
}

interface DbOralRule {
  id: string;
  action: string;
  credits_awarded: number;
  active: boolean;
}

export function FidelizacionForm({
  clinicId,
  tiers: initialTiers,
  stampProgram,
  rewards: initialRewards,
  oralRules: initialOralRules,
}: {
  clinicId: string;
  tiers: DbTier[];
  stampProgram: DbStampProgram | null;
  rewards: DbReward[];
  oralRules: DbOralRule[];
}) {
  const [tab, setTab] = useState<Tab>("Niveles y Cashback");
  const [tiers, setTiers] = useState<TierInput[]>(initialTiers);
  const [stampRules, setStampRules] = useState<StampRuleInput[]>(stampProgram?.rules ?? []);
  const [rewards, setRewards] = useState<RewardInput[]>(initialRewards);
  const [deletedRewardIds, setDeletedRewardIds] = useState<string[]>([]);
  const [oralRules, setOralRules] = useState<OralRuleInput[]>(initialOralRules);
  const [deletedOralRuleIds, setDeletedOralRuleIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveFidelizacionConfig({
        tiers,
        stampProgramId: stampProgram?.id ?? null,
        stampProgramName: stampProgram?.name ?? "Programa de sellos",
        stampRules,
        rewards,
        deletedRewardIds,
        oralRules,
        deletedOralRuleIds,
        programId: stampProgram?.id ?? null,
        clinicId,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Configuración de Fidelización</h1>
        <p className="text-sm text-muted">
          Define niveles, cashback, sellos y reglas de salud oral del programa.
        </p>
      </div>

      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              tab === t
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Niveles y Cashback" && (
        <div className="flex flex-col gap-4">
          {tiers.map((tier, i) => (
            <Card key={tier.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted" />
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: tierColor[tier.name] }}
                  />
                  <Badge className={tierBadgeClass[tier.name] ?? "text-muted"}>{tier.name}</Badge>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">Antigüedad mínima (meses)</span>
                  <input
                    type="number"
                    value={tier.min_months}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setTiers((prev) =>
                        prev.map((t, idx) => (idx === i ? { ...t, min_months: v } : t))
                      );
                    }}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">% Cashback</span>
                  <input
                    type="number"
                    value={tier.cashback_percent}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setTiers((prev) =>
                        prev.map((t, idx) => (idx === i ? { ...t, cashback_percent: v } : t))
                      );
                    }}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </label>
              </div>

              <div className="mt-4">
                <span className="text-xs text-muted">Beneficios</span>
                <div className="mt-2 flex flex-col gap-2">
                  {tier.benefits.map((b, bi) => (
                    <div key={bi} className="flex items-center gap-2">
                      <input
                        value={b}
                        onChange={(e) => {
                          const v = e.target.value;
                          setTiers((prev) =>
                            prev.map((t, idx) =>
                              idx === i
                                ? {
                                    ...t,
                                    benefits: t.benefits.map((ben, bidx) =>
                                      bidx === bi ? v : ben
                                    ),
                                  }
                                : t
                            )
                          );
                        }}
                        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                      />
                      <button
                        className="text-muted hover:text-danger"
                        onClick={() =>
                          setTiers((prev) =>
                            prev.map((t, idx) =>
                              idx === i
                                ? { ...t, benefits: t.benefits.filter((_, bidx) => bidx !== bi) }
                                : t
                            )
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setTiers((prev) =>
                        prev.map((t, idx) =>
                          idx === i ? { ...t, benefits: [...t.benefits, "Nuevo beneficio"] } : t
                        )
                      )
                    }
                    className="flex items-center gap-1.5 self-start text-xs font-medium text-accent"
                  >
                    <Plus className="h-3.5 w-3.5" /> Agregar beneficio
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Programa de Sellos" && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardTitle className="mb-3">Reglas de acumulación — {stampProgram?.name ?? "Programa de sellos"}</CardTitle>
            <div className="flex flex-col gap-2">
              {stampRules.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={r.action}
                    onChange={(e) =>
                      setStampRules((prev) =>
                        prev.map((x, idx) => (idx === i ? { ...x, action: e.target.value } : x))
                      )
                    }
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    type="number"
                    value={r.stamps}
                    onChange={(e) =>
                      setStampRules((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, stamps: Number(e.target.value) } : x
                        )
                      )
                    }
                    className="w-24 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <span className="text-xs text-muted">sellos</span>
                  <button
                    className="text-muted hover:text-danger"
                    onClick={() => setStampRules((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setStampRules((prev) => [...prev, { action: "Nueva acción", stamps: 1 }])}
                className="flex items-center gap-1.5 self-start text-xs font-medium text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar regla
              </button>
            </div>
          </Card>

          <Card>
            <CardTitle className="mb-3">Catálogo de recompensas</CardTitle>
            <div className="flex flex-col gap-2">
              {rewards.map((r, i) => (
                <div key={r.id} className="grid grid-cols-[1fr_1fr_100px_40px] items-center gap-2">
                  <input
                    value={r.name}
                    onChange={(e) =>
                      setRewards((prev) =>
                        prev.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x))
                      )
                    }
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    value={r.description}
                    onChange={(e) =>
                      setRewards((prev) =>
                        prev.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x))
                      )
                    }
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    type="number"
                    value={r.stamps_required}
                    onChange={(e) =>
                      setRewards((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, stamps_required: Number(e.target.value) } : x
                        )
                      )
                    }
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <button
                    className="flex justify-center text-muted hover:text-danger"
                    onClick={() => {
                      setRewards((prev) => prev.filter((_, idx) => idx !== i));
                      if (!r.id.startsWith("new-")) {
                        setDeletedRewardIds((prev) => [...prev, r.id]);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setRewards((prev) => [
                    ...prev,
                    { id: `new-${Date.now()}`, name: "Nueva recompensa", description: "", stamps_required: 5 },
                  ])
                }
                className="flex items-center gap-1.5 self-start text-xs font-medium text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar recompensa
              </button>
            </div>
          </Card>
        </div>
      )}

      {tab === "Saldo de Salud Oral" && (
        <div className="flex flex-col gap-4">
          <Card className="bg-gradient-to-br from-[#0f3d2e] to-surface">
            <p className="text-sm">
              Define cuántos créditos preventivos gana un paciente por cumplir acciones de
              autocuidado (controles puntuales, higienes, revisiones anuales).
            </p>
          </Card>
          <Card>
            <CardTitle className="mb-3">Reglas de acumulación</CardTitle>
            <div className="flex flex-col gap-2">
              {oralRules.map((r, i) => (
                <div key={r.id} className="grid grid-cols-[1fr_120px_100px_40px] items-center gap-2">
                  <input
                    value={r.action}
                    onChange={(e) =>
                      setOralRules((prev) =>
                        prev.map((x, idx) => (idx === i ? { ...x, action: e.target.value } : x))
                      )
                    }
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    type="number"
                    value={r.credits_awarded}
                    onChange={(e) =>
                      setOralRules((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, credits_awarded: Number(e.target.value) } : x
                        )
                      )
                    }
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <label className="flex items-center justify-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={r.active}
                      onChange={(e) =>
                        setOralRules((prev) =>
                          prev.map((x, idx) => (idx === i ? { ...x, active: e.target.checked } : x))
                        )
                      }
                    />
                    Activa
                  </label>
                  <button
                    className="flex justify-center text-muted hover:text-danger"
                    onClick={() => {
                      setOralRules((prev) => prev.filter((_, idx) => idx !== i));
                      if (!r.id.startsWith("new-")) {
                        setDeletedOralRuleIds((prev) => [...prev, r.id]);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setOralRules((prev) => [
                    ...prev,
                    {
                      id: `new-${Date.now()}`,
                      action: "nueva_accion",
                      credits_awarded: 10,
                      active: true,
                    },
                  ])
                }
                className="flex items-center gap-1.5 self-start text-xs font-medium text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar regla
              </button>
            </div>
          </Card>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-sm text-accent">Cambios guardados</span>}
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
