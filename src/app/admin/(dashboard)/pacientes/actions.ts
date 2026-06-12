"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface NewPatientInput {
  clinicId: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  tier_id: string;
  monthly_amount: number;
}

export async function createPatient(input: NewPatientInput) {
  const supabase = await createClient();

  if (!input.full_name.trim()) {
    return { error: "El nombre es obligatorio." };
  }

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .insert({
      clinic_id: input.clinicId,
      full_name: input.full_name.trim(),
      email: input.email.trim() || null,
      phone: input.phone.trim() || null,
      birth_date: input.birth_date || null,
    })
    .select("id")
    .single();

  if (patientError || !patient) {
    return { error: "No se pudo crear el paciente. Intenta de nuevo." };
  }

  const { error: membershipError } = await supabase.from("memberships").insert({
    clinic_id: input.clinicId,
    patient_id: patient.id,
    tier_id: input.tier_id || null,
    status: "active",
    start_date: new Date().toISOString().slice(0, 10),
    monthly_amount: input.monthly_amount || 0,
    payment_provider: "manual",
  });

  if (membershipError) {
    return { error: "El paciente se creó, pero no se pudo crear su membresía." };
  }

  const { error: cardError } = await supabase.from("digital_cards").insert({
    clinic_id: input.clinicId,
    patient_id: patient.id,
    qr_code: crypto.randomUUID(),
  });

  if (cardError) {
    return { error: "El paciente se creó, pero no se pudo generar su tarjeta digital." };
  }

  revalidatePath("/admin/pacientes");
  revalidatePath("/admin");
  return { error: null };
}
