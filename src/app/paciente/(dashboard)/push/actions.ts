"use server";

import { createClient } from "@/lib/supabase/server";

export async function savePushSubscription(subscription: object) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: patient } = await supabase
    .from("patients")
    .select("id, clinic_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!patient) return { error: "Paciente no encontrado" };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      clinic_id: patient.clinic_id,
      patient_id: patient.id,
      subscription,
    },
    { onConflict: "patient_id,subscription", ignoreDuplicates: true }
  );

  return error ? { error: error.message } : { error: null };
}

export async function removePushSubscription(endpoint: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: patient } = await supabase
    .from("patients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!patient) return;

  await supabase
    .from("push_subscriptions")
    .delete()
    .eq("patient_id", patient.id)
    .contains("subscription", { endpoint });
}
