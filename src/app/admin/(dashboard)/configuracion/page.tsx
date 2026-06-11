import { getClinicSettings } from "@/lib/data/admin";
import { ConfiguracionForm } from "./ConfiguracionForm";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const settings = await getClinicSettings();
  if (!settings) return null;

  return <ConfiguracionForm clinic={settings.clinic} branding={settings.branding} />;
}
