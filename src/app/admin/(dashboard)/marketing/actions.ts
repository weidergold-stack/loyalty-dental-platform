"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  const { data: memberships, error: membershipsError } = await supabase
    .from("memberships")
    .select("patient_id, status, tier_id")
    .eq("clinic_id", input.clinicId);

  if (membershipsError || !memberships) {
    return { error: "No se pudo cargar la lista de pacientes.", count: 0 };
  }

  let recipients = memberships;
  if (input.audience === "tier" && input.tierId) {
    recipients = recipients.filter((m) => m.tier_id === input.tierId);
  } else if (input.audience === "inactive") {
    recipients = recipients.filter((m) => m.status !== "active");
  }

  if (recipients.length === 0) {
    return { error: "No hay pacientes que coincidan con esta audiencia.", count: 0 };
  }

  const rows = recipients.map((m) => ({
    clinic_id: input.clinicId,
    patient_id: m.patient_id,
    channel: input.channel,
    template: input.template.trim(),
    payload: {},
    status: "pending" as const,
  }));

  const { error: insertError } = await supabase.from("notifications_log").insert(rows);

  if (insertError) {
    return { error: "No se pudo registrar la campaña. Intenta de nuevo.", count: 0 };
  }

  revalidatePath("/admin/marketing");
  return { error: null, count: rows.length };
}
