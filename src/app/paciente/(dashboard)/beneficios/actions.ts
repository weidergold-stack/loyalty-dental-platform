"use server";

import crypto from "crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function createWompiCheckout() {
  const supabase = await createClient();

  const { data: patient } = await supabase
    .from("patients")
    .select("id, clinic_id, email")
    .maybeSingle();

  if (!patient) {
    return { error: "Debes iniciar sesión para continuar." };
  }

  const { data: config } = await supabase
    .rpc("get_clinic_wompi_checkout_config")
    .maybeSingle();

  const wompiConfig = config as {
    wompi_enabled: boolean;
    wompi_public_key: string | null;
    wompi_integrity_secret: string | null;
    wompi_environment: string | null;
  } | null;

  if (
    !wompiConfig?.wompi_enabled ||
    !wompiConfig.wompi_public_key ||
    !wompiConfig.wompi_integrity_secret
  ) {
    return { error: "Los pagos en línea no están disponibles para esta clínica." };
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("id, monthly_amount")
    .eq("patient_id", patient.id)
    .maybeSingle();

  const amount = Number(membership?.monthly_amount ?? 0);
  if (!membership || amount <= 0) {
    return { error: "Tu membresía no tiene un monto configurado para pagar." };
  }

  const amountInCents = Math.round(amount * 100);
  const currency = "COP";

  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert({
      clinic_id: patient.clinic_id,
      patient_id: patient.id,
      membership_id: membership.id,
      amount,
      currency,
      status: "pending",
      provider: "wompi",
    })
    .select("id")
    .single();

  if (error || !transaction) {
    return { error: "No se pudo iniciar el pago. Intenta de nuevo." };
  }

  const reference = transaction.id;
  const signatureString = `${reference}${amountInCents}${currency}${wompiConfig.wompi_integrity_secret}`;
  const signature = crypto.createHash("sha256").update(signatureString).digest("hex");

  const checkoutBase =
    wompiConfig.wompi_environment === "production"
      ? "https://checkout.wompi.co/p/"
      : "https://checkout.co.uat.wompi.dev/p/";

  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const redirectUrl = `${protocol}://${headersList.get("host")}/paciente/beneficios?pago=resultado`;

  const params = new URLSearchParams({
    "public-key": wompiConfig.wompi_public_key,
    currency,
    "amount-in-cents": String(amountInCents),
    reference,
    "signature:integrity": signature,
    "redirect-url": redirectUrl,
  });

  if (patient.email) {
    params.set("customer-data:email", patient.email);
  }

  return { url: `${checkoutBase}?${params.toString()}` };
}
