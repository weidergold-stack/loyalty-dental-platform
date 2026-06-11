"use client";

import { useState, useTransition } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { redeemReward } from "./actions";

interface Reward {
  id: string;
  name: string;
  description: string | null;
  stamps_required: number;
}

export function RewardsCatalog({
  rewards,
  stampsBalance,
}: {
  rewards: Reward[];
  stampsBalance: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState<string | null>(null);

  const handleRedeem = (rewardId: string) => {
    setError(null);
    setRedeemed(null);
    setPendingId(rewardId);
    startTransition(async () => {
      const result = await redeemReward(rewardId);
      if (result.error) {
        setError(result.error);
      } else {
        setRedeemed(rewardId);
      }
      setPendingId(null);
    });
  };

  return (
    <div>
      <CardTitle className="mb-3">Catálogo de recompensas</CardTitle>

      {error && (
        <p className="mb-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {error}
        </p>
      )}
      {redeemed && (
        <p className="mb-3 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-accent">
          ¡Canje exitoso! Muestra esto en tu próxima visita para reclamarlo.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {rewards.map((r) => {
          const reached = stampsBalance >= r.stamps_required;
          const loading = isPending && pendingId === r.id;
          return (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted">{r.description}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold">
                  {r.stamps_required} <span className="text-xs text-muted">sellos</span>
                </span>
              </div>
              <ProgressBar
                className="mt-3"
                value={stampsBalance}
                max={r.stamps_required}
                colorClassName={reached ? "bg-accent" : "bg-muted"}
              />
              <button
                disabled={!reached || isPending}
                onClick={() => handleRedeem(r.id)}
                className={cn(
                  "mt-3 w-full rounded-full py-2 text-sm font-semibold transition-colors disabled:opacity-60",
                  reached
                    ? "bg-accent text-accent-foreground"
                    : "cursor-not-allowed bg-surface-2 text-muted"
                )}
              >
                {loading
                  ? "Canjeando..."
                  : reached
                    ? "Canjear"
                    : `Faltan ${r.stamps_required - stampsBalance} sellos`}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
