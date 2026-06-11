"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth-errors";

export async function requestPatientPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const origin = (await headers()).get("origin");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/paciente/reset-password`,
  });

  if (error) {
    redirect(`/paciente/forgot-password?error=${encodeURIComponent(translateAuthError(error.message))}`);
  }

  redirect("/paciente/forgot-password?sent=1");
}
