"use client";

import { useState, useTransition } from "react";
import { CreditCard } from "lucide-react";
import { createWompiCheckout } from "./actions";

export function WompiCheckoutButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await createWompiCheckout();
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        window.location.href = result.url;
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
      >
        <CreditCard className="h-4 w-4" />
        {isPending ? "Conectando con Wompi..." : "Pagar membresía"}
      </button>
      {error && <p className="text-center text-xs text-danger">{error}</p>}
    </div>
  );
}
