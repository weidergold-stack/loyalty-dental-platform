import { createClient } from "@/lib/supabase/server";
import { TierName } from "@/lib/types";

function monthsBetween(start: string, end: Date) {
  const startDate = new Date(start);
  return (
    (end.getFullYear() - startDate.getFullYear()) * 12 +
    (end.getMonth() - startDate.getMonth())
  );
}

export async function getPatientBranding() {
  const supabase = await createClient();

  const { data: patient } = await supabase.from("patients").select("clinic_id").maybeSingle();
  if (!patient) return null;

  const { data: branding } = await supabase
    .from("clinic_branding")
    .select("*")
    .eq("clinic_id", patient.clinic_id)
    .maybeSingle();

  return branding;
}

export async function getPatientData() {
  const supabase = await createClient();

  const { data: patient } = await supabase.from("patients").select("*").single();

  if (!patient) {
    return null;
  }

  const [
    { data: membership },
    { data: tiers },
    { data: cashbackLedger },
    { data: stampLedger },
    { data: stampProgram },
    { data: rewards },
    { data: oralCredits },
    { data: oralRules },
    { data: digitalCard },
    { data: referrals },
    { data: branding },
    { data: wompiEnabled },
  ] = await Promise.all([
    supabase
      .from("memberships")
      .select("*, membership_tiers(*)")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("membership_tiers").select("*").order("min_months", { ascending: true }),
    supabase
      .from("cashback_ledger")
      .select("*")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("stamp_ledger")
      .select("*")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false }),
    supabase.from("stamp_programs").select("*").maybeSingle(),
    supabase.from("rewards").select("*").order("stamps_required", { ascending: true }),
    supabase
      .from("oral_health_credits")
      .select("*")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("oral_health_rules")
      .select("*")
      .eq("active", true)
      .order("credits_awarded", { ascending: true }),
    supabase.from("digital_cards").select("*").eq("patient_id", patient.id).maybeSingle(),
    supabase
      .from("referrals")
      .select("*, referred:referred_patient_id(full_name)")
      .eq("referrer_patient_id", patient.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("clinic_branding")
      .select("*")
      .eq("clinic_id", patient.clinic_id)
      .maybeSingle(),
    supabase.rpc("patient_wompi_enabled"),
  ]);

  const tier = membership?.membership_tiers as
    | {
        id: string;
        name: TierName;
        min_months: number;
        cashback_percent: number;
        benefits: string[];
        active: boolean;
      }
    | null
    | undefined;

  const monthsActive = membership ? monthsBetween(membership.start_date, new Date()) : 0;

  const sortedTiers = (tiers ?? []).sort((a, b) => a.min_months - b.min_months);
  const currentTierIndex = sortedTiers.findIndex((t) => t.id === tier?.id);
  const next = sortedTiers[currentTierIndex + 1];
  const nextTier = next
    ? { tier: next, monthsRemaining: Math.max(next.min_months - monthsActive, 0) }
    : null;

  return {
    patient,
    membership,
    tier,
    monthsActive,
    nextTier,
    tiers: sortedTiers,
    currentTierIndex,
    cashbackBalance: cashbackLedger?.[0]?.balance_after ?? 0,
    cashbackHistory: cashbackLedger ?? [],
    stampsBalance: stampLedger?.[0]?.balance_after ?? 0,
    stampHistory: stampLedger ?? [],
    stampProgram,
    rewards: rewards ?? [],
    oralHealthBalance: oralCredits?.[0]?.balance_after ?? 0,
    oralHealthHistory: oralCredits ?? [],
    oralHealthRules: oralRules ?? [],
    digitalCard,
    referrals: referrals ?? [],
    branding,
    wompiEnabled: Boolean(wompiEnabled),
  };
}
