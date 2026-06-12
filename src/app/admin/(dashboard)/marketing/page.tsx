import { getMarketingData } from "@/lib/data/admin";
import { MarketingForm } from "./MarketingForm";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const { clinicId, patients, tiers, recentCampaigns } = await getMarketingData();

  return (
    <MarketingForm
      clinicId={clinicId}
      patients={patients.map((p) => ({ id: p.id, tierId: p.tierId, status: p.status }))}
      tiers={tiers}
      recentCampaigns={recentCampaigns}
    />
  );
}
