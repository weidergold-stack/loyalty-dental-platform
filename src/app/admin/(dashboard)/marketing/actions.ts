"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  dispatchEmail,
  dispatchWhatsApp,
  dispatchSMS,
  dispatchPushToPatient,
} from "@/lib/notifications";

export type CampaignChannel = "push" | "email" | "sms" | "whatsapp";
export type AudienceType = "all" | "tier" | "inactive";

export interface CampaignInput {
  clinicId: string;
  channel: CampaignChannel;
  template: string;
  audience: AudienceType;
  tierId?: string;
}

export async function sendCampaign(input: CampaignInput) {
  const supabase = await createClient();

  if (!input.template.trim()) {
    return { error: "El mensaje de la campaña no puede estar vacío.", count: 0 };
  }

  const { data: clinicBranding } = await supabase
    .from("clinic_branding")
    .select("display_name")
    .eq("clinic_id", input.clinicId)
    .maybeSingle();
  const clinicName = clinicBranding?.display_name ?? "Tu clínica";

  const { data: memberships, error: membershipsError } = await supabase
    .from("memberships")
    .select("patient_id, status, tier_id, patients(id, email, phone)")
    .eq("clinic_id", input.clinicId);

  if (membershipsError || !memberships) {
    return { error: "No se pudo cargar la lista de pacientes.", count: 0 };
  }

  type RecipientRow = {
    patient_id: string;
    status: string;
    tier_id: string | null;
    patients: { id: string; email: string | null; phone: string | null } | null;
  };
  let recipients = (memberships as unknown) as RecipientRow[];

  if (input.audience === "tier" && input.tierId) {
    recipients = recipients.filter((m) => m.tier_id === input.tierId);
  } else if (input.audience === "inactive") {
    recipients = recipients.filter((m) => m.status !== "active");
  }

  if (recipients.length === 0) {
    return { error: "No hay pacientes que coincidan con esta audiencia.", count: 0 };
  }

  const results = await Promise.allSettled(
    recipients.map(async (m) => {
      const patient = m.patients;
      let status: "sent" | "failed" | "skipped" = "skipped";

      if (input.channel === "email") {
        status = await dispatchEmail(patient?.email, input.template, clinicName);
      } else if (input.channel === "whatsapp") {
        status = await dispatchWhatsApp(patient?.phone, input.template);
      } else if (input.channel === "sms") {
        status = await dispatchSMS(patient?.phone, input.template);
      } else if (input.channel === "push") {
        status = await dispatchPushToPatient(supabase, m.patient_id, input.template);
      }

      return { patient_id: m.patient_id, status };
    })
  );

  const rows = results
    .filter((r): r is PromiseFulfilledResult<{ patient_id: string; status: "sent" | "failed" | "skipped" }> =>
      r.status === "fulfilled"
    )
    .map((r) => ({
      clinic_id: input.clinicId,
      patient_id: r.value.patient_id,
      channel: input.channel,
      template: input.template.trim(),
      payload: {},
      status: r.value.status === "skipped" ? "pending" : r.value.status,
      sent_at:
        r.value.status === "sent" ? new Date().toISOString() : null,
    }));

  if (rows.length > 0) {
    await supabase.from("notifications_log").insert(rows);
  }

  const sent = rows.filter((r) => r.status === "sent").length;
  const skipped = rows.filter((r) => r.status === "pending").length;

  revalidatePath("/admin/marketing");

  const detail =
    skipped > 0
      ? ` (${skipped} sin datos de contacto quedan pendientes)`
      : "";
  return { error: null, count: sent, detail };
}
