"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_TIERS = [
  { name: "Bronce", min_months: 0, cashback_percent: 3, benefits: ["3% cashback en pagos", "Descuentos especiales"] },
  { name: "Plata", min_months: 6, cashback_percent: 5, benefits: ["5% cashback en pagos", "Limpieza preventiva anual", "Prioridad en agendamiento"] },
  { name: "Oro", min_months: 12, cashback_percent: 8, benefits: ["8% cashback en pagos", "2 limpiezas preventivas", "Blanqueamiento con descuento", "Línea directa de atención"] },
];

export async function registrarClinica(formData: FormData) {
  const clinicName = String(formData.get("clinic_name") ?? "").trim();
  const adminName = String(formData.get("admin_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim(); // guardado en branding

  if (!clinicName || !adminName || !email || password.length < 8) {
    redirect("/admin/registro?error=Completa todos los campos. La contraseña debe tener al menos 8 caracteres.");
  }

  const admin = createAdminClient();

  // 1. Crear usuario auth
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: adminName },
  });

  if (authError || !authData.user) {
    const msg = authError?.message?.includes("already registered")
      ? "Ya existe una cuenta con ese correo."
      : "No se pudo crear la cuenta. Intenta de nuevo.";
    redirect(`/admin/registro?error=${encodeURIComponent(msg)}`);
  }

  const userId = authData.user.id;

  // 2. Crear clínica
  const { data: clinic, error: clinicError } = await admin
    .from("clinics")
    .insert({ name: clinicName })
    .select("id")
    .single();

  if (clinicError || !clinic) {
    await admin.auth.admin.deleteUser(userId);
    redirect("/admin/registro?error=No se pudo crear la clínica. Intenta de nuevo.");
  }

  const clinicId = clinic.id;

  // 3. Staff admin
  const { error: staffError } = await admin.from("staff").insert({
    user_id: userId,
    clinic_id: clinicId,
    role: "admin",
  });

  if (staffError) {
    await admin.auth.admin.deleteUser(userId);
    await admin.from("clinics").delete().eq("id", clinicId);
    redirect("/admin/registro?error=No se pudo configurar el acceso. Intenta de nuevo.");
  }

  // 4. Branding por defecto
  await admin.from("clinic_branding").insert({
    clinic_id: clinicId,
    display_name: clinicName,
    primary_color: "#6366f1",
    contact_phone: phone || null,
    contact_email: email,
  });

  // 5. Tiers por defecto
  await admin.from("membership_tiers").insert(
    DEFAULT_TIERS.map((t) => ({ ...t, clinic_id: clinicId }))
  );

  // 6. Programa de sellos por defecto
  const { data: program } = await admin
    .from("stamp_programs")
    .insert({
      clinic_id: clinicId,
      name: "Programa de sellos",
      rules: [
        { action: "consulta_general", stamps: 1 },
        { action: "limpieza", stamps: 2 },
        { action: "ortodoncia", stamps: 3 },
      ],
    })
    .select("id")
    .single();

  if (program) {
    await admin.from("rewards").insert([
      { clinic_id: clinicId, program_id: program.id, name: "Limpieza gratis", description: "Profilaxis dental sin costo", stamps_required: 8 },
      { clinic_id: clinicId, program_id: program.id, name: "Blanqueamiento 50% dto", description: "Blanqueamiento con el 50% de descuento", stamps_required: 15 },
    ]);
  }

  // 7. Auto-login
  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email, password });

  redirect("/admin");
}
