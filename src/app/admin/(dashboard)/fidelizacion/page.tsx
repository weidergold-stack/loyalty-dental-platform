import { getAdminData } from "@/lib/data/admin";
import { FidelizacionForm } from "./FidelizacionForm";

export const dynamic = "force-dynamic";

export default async function FidelizacionPage() {
  const { clinicId, tiers, stampProgram, rewards, oralRules } = await getAdminData();

  return (
    <FidelizacionForm
      clinicId={clinicId}
      tiers={tiers}
      stampProgram={stampProgram}
      rewards={rewards}
      oralRules={oralRules}
    />
  );
}
