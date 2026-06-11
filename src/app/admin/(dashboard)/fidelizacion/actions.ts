"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface TierInput {
  id: string;
  name: string;
  min_months: number;
  cashback_percent: number;
  benefits: string[];
}

export interface RewardInput {
  id: string;
  name: string;
  description: string;
  stamps_required: number;
}

export interface OralRuleInput {
  id: string;
  action: string;
  credits_awarded: number;
  active: boolean;
}

export interface StampRuleInput {
  action: string;
  stamps: number;
}

export async function saveFidelizacionConfig(input: {
  tiers: TierInput[];
  stampProgramId: string | null;
  stampProgramName: string;
  stampRules: StampRuleInput[];
  rewards: RewardInput[];
  deletedRewardIds: string[];
  oralRules: OralRuleInput[];
  deletedOralRuleIds: string[];
  programId: string | null;
  clinicId: string;
}) {
  const supabase = await createClient();
  const fail = { error: "No se pudieron guardar los cambios. Intenta de nuevo." };

  for (const tier of input.tiers) {
    const { error } = await supabase
      .from("membership_tiers")
      .update({
        min_months: tier.min_months,
        cashback_percent: tier.cashback_percent,
        benefits: tier.benefits,
      })
      .eq("id", tier.id);
    if (error) return fail;
  }

  if (input.stampProgramId) {
    const { error } = await supabase
      .from("stamp_programs")
      .update({ name: input.stampProgramName, rules: input.stampRules })
      .eq("id", input.stampProgramId);
    if (error) return fail;
  }

  for (const id of input.deletedRewardIds) {
    const { error } = await supabase.from("rewards").delete().eq("id", id);
    if (error) return fail;
  }

  for (const reward of input.rewards) {
    if (reward.id.startsWith("new-")) {
      const { error } = await supabase.from("rewards").insert({
        clinic_id: input.clinicId,
        program_id: input.programId,
        name: reward.name,
        description: reward.description,
        stamps_required: reward.stamps_required,
      });
      if (error) return fail;
    } else {
      const { error } = await supabase
        .from("rewards")
        .update({
          name: reward.name,
          description: reward.description,
          stamps_required: reward.stamps_required,
        })
        .eq("id", reward.id);
      if (error) return fail;
    }
  }

  for (const id of input.deletedOralRuleIds) {
    const { error } = await supabase.from("oral_health_rules").delete().eq("id", id);
    if (error) return fail;
  }

  for (const rule of input.oralRules) {
    if (rule.id.startsWith("new-")) {
      const { error } = await supabase.from("oral_health_rules").insert({
        clinic_id: input.clinicId,
        action: rule.action,
        credits_awarded: rule.credits_awarded,
        active: rule.active,
      });
      if (error) return fail;
    } else {
      const { error } = await supabase
        .from("oral_health_rules")
        .update({
          action: rule.action,
          credits_awarded: rule.credits_awarded,
          active: rule.active,
        })
        .eq("id", rule.id);
      if (error) return fail;
    }
  }

  revalidatePath("/admin/fidelizacion");
  return { error: null };
}
