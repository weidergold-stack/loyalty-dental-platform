import { createClient } from "@/lib/supabase/server";

function latestBalanceByPatient(rows: { patient_id: string; balance_after: number }[] | null) {
  const map = new Map<string, number>();
  for (const r of rows ?? []) {
    if (!map.has(r.patient_id)) map.set(r.patient_id, r.balance_after);
  }
  return map;
}

export async function getClinicSettings() {
  const supabase = await createClient();

  const { data: clinic } = await supabase
    .from("clinics")
    .select(
      "id, name, wompi_public_key, wompi_integrity_secret, wompi_events_secret, wompi_environment, wompi_enabled"
    )
    .maybeSingle();

  if (!clinic) return null;

  const { data: branding } = await supabase
    .from("clinic_branding")
    .select("*")
    .eq("clinic_id", clinic.id)
    .maybeSingle();

  return { clinic, branding };
}

export async function getAdminData() {
  const supabase = await createClient();

  const [
    { data: clinic },
    { data: patients },
    { data: memberships },
    { data: tiers },
    { data: cashbackLedger },
    { data: stampLedger },
    { data: oralCredits },
    { data: stampProgram },
    { data: rewards },
    { data: oralRules },
  ] = await Promise.all([
    supabase.from("clinics").select("id").maybeSingle(),
    supabase.from("patients").select("*").order("created_at", { ascending: false }),
    supabase.from("memberships").select("*, membership_tiers(name)"),
    supabase.from("membership_tiers").select("*").order("min_months", { ascending: true }),
    supabase
      .from("cashback_ledger")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("stamp_ledger")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("oral_health_credits")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("stamp_programs").select("*").maybeSingle(),
    supabase.from("rewards").select("*").order("stamps_required", { ascending: true }),
    supabase.from("oral_health_rules").select("*").order("credits_awarded", { ascending: true }),
  ]);

  const cashbackBalances = latestBalanceByPatient(cashbackLedger);
  const stampBalances = latestBalanceByPatient(stampLedger);
  const oralBalances = latestBalanceByPatient(oralCredits);

  const membershipByPatient = new Map((memberships ?? []).map((m) => [m.patient_id, m]));

  const adminPatients = (patients ?? []).map((p) => {
    const membership = membershipByPatient.get(p.id);
    const tier = membership?.membership_tiers as { name: string } | null | undefined;
    return {
      id: p.id as string,
      name: p.full_name as string,
      tier: tier?.name ?? "—",
      status: (membership?.status ?? "paused") as string,
      cashback: cashbackBalances.get(p.id) ?? 0,
      stamps: stampBalances.get(p.id) ?? 0,
      oralCredits: oralBalances.get(p.id) ?? 0,
      since: membership?.start_date ?? (p.created_at as string),
    };
  });

  const activeMembers = (memberships ?? []).filter((m) => m.status === "active").length;
  const monthlyRevenue = (memberships ?? [])
    .filter((m) => m.status === "active")
    .reduce((sum, m) => sum + Number(m.monthly_amount), 0);

  const cashbackIssued = (cashbackLedger ?? [])
    .filter((c) => c.type === "earned")
    .reduce((sum, c) => sum + Number(c.amount), 0);
  const cashbackRedeemed = (cashbackLedger ?? [])
    .filter((c) => c.type === "redeemed")
    .reduce((sum, c) => sum + Math.abs(Number(c.amount)), 0);

  const tierDistribution = (tiers ?? []).map((t) => ({
    tier: t.name,
    count: adminPatients.filter((p) => p.tier === t.name).length,
  }));

  return {
    clinicId: clinic?.id as string,
    patients: adminPatients,
    tiers: tiers ?? [],
    stampProgram,
    rewards: rewards ?? [],
    oralRules: oralRules ?? [],
    kpis: {
      monthlyRevenue,
      activeMembers,
      cashbackIssued,
      cashbackRedeemed,
      tierDistribution,
    },
  };
}
