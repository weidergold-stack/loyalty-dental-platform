"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface BrandingInput {
  clinicId: string;
  display_name: string;
  logo_url: string;
  primary_color: string;
  accent_color: string;
  contact_email: string;
  contact_phone: string;
}

export async function saveBranding(input: BrandingInput) {
  const supabase = await createClient();

  const { error } = await supabase.from("clinic_branding").upsert({
    clinic_id: input.clinicId,
    display_name: input.display_name,
    logo_url: input.logo_url || null,
    primary_color: input.primary_color || null,
    accent_color: input.accent_color || null,
    contact_email: input.contact_email || null,
    contact_phone: input.contact_phone || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { error: "No se pudieron guardar los cambios. Intenta de nuevo." };
  }

  revalidatePath("/admin/configuracion");
  revalidatePath("/", "layout");
  return { error: null };
}

export interface WompiInput {
  clinicId: string;
  wompi_public_key: string;
  wompi_integrity_secret: string;
  wompi_events_secret: string;
  wompi_environment: "sandbox" | "production";
  wompi_enabled: boolean;
}

export async function saveWompiConfig(input: WompiInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clinics")
    .update({
      wompi_public_key: input.wompi_public_key || null,
      wompi_integrity_secret: input.wompi_integrity_secret || null,
      wompi_events_secret: input.wompi_events_secret || null,
      wompi_environment: input.wompi_environment,
      wompi_enabled: input.wompi_enabled,
    })
    .eq("id", input.clinicId);

  if (error) {
    return { error: "No se pudieron guardar los cambios. Intenta de nuevo." };
  }

  revalidatePath("/admin/configuracion");
  return { error: null };
}
