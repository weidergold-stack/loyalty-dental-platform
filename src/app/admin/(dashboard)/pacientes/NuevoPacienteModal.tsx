"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { createPatient } from "./actions";

interface TierOption {
  id: string;
  name: string;
}

export function NuevoPacienteModal({
  clinicId,
  tiers,
}: {
  clinicId: string;
  tiers: TierOption[];
}) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [tierId, setTierId] = useState(tiers[0]?.id ?? "");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setBirthDate("");
    setTierId(tiers[0]?.id ?? "");
    setMonthlyAmount("");
    setError(null);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await createPatient({
        clinicId,
        full_name: fullName,
        email,
        phone,
        birth_date: birthDate,
        tier_id: tierId,
        monthly_amount: Number(monthlyAmount) || 0,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      reset();
      setOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
      >
        <Plus className="h-4 w-4" />
        Nuevo paciente
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nuevo paciente</h2>
              <button
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                className="rounded-full p-1 text-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-muted">Nombre completo *</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-muted">Correo electrónico</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">Teléfono</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">Fecha de nacimiento</span>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">Nivel de membresía</span>
                  <select
                    value={tierId}
                    onChange={(e) => setTierId(e.target.value)}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="">Sin nivel</option>
                    {tiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">Monto mensual</span>
                  <input
                    type="number"
                    min="0"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    placeholder="0"
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </label>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isPending || !fullName.trim()}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
