"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ERROR_TRANSLATIONS: Record<string, string> = {
  "No autorizado": "Debes iniciar sesión para continuar.",
  "La recompensa no existe": "La recompensa no existe.",
  "No tienes suficientes sellos para esta recompensa":
    "No tienes suficientes sellos para esta recompensa.",
};

export async function redeemReward(rewardId: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("redeem_reward", { p_reward_id: rewardId });

  if (error) {
    return { error: ERROR_TRANSLATIONS[error.message] ?? "No se pudo procesar el canje. Intenta de nuevo." };
  }

  revalidatePath("/paciente/recompensas");
  revalidatePath("/paciente");
  return { error: null };
}
