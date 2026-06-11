"use client";

import { useState, useTransition } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { saveBranding, saveWompiConfig } from "./actions";

const tabs = ["Branding", "Pasarela de pagos (Wompi)"] as const;
type Tab = (typeof tabs)[number];

interface ClinicRow {
  id: string;
  name: string;
  wompi_public_key: string | null;
  wompi_integrity_secret: string | null;
  wompi_events_secret: string | null;
  wompi_environment: string;
  wompi_enabled: boolean;
}

interface BrandingRow {
  clinic_id: string;
  display_name: string | null;
  logo_url: string | null;
  primary_color: string | null;
  accent_color: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

export function ConfiguracionForm({
  clinic,
  branding,
}: {
  clinic: ClinicRow;
  branding: BrandingRow | null;
}) {
  const [tab, setTab] = useState<Tab>("Branding");

  const [displayName, setDisplayName] = useState(branding?.display_name ?? clinic.name);
  const [logoUrl, setLogoUrl] = useState(branding?.logo_url ?? "");
  const [primaryColor, setPrimaryColor] = useState(branding?.primary_color ?? "");
  const [accentColor, setAccentColor] = useState(branding?.accent_color ?? "");
  const [contactEmail, setContactEmail] = useState(branding?.contact_email ?? "");
  const [contactPhone, setContactPhone] = useState(branding?.contact_phone ?? "");

  const [wompiPublicKey, setWompiPublicKey] = useState(clinic.wompi_public_key ?? "");
  const [wompiSecret, setWompiSecret] = useState(clinic.wompi_integrity_secret ?? "");
  const [wompiEventsSecret, setWompiEventsSecret] = useState(clinic.wompi_events_secret ?? "");
  const [wompiEnv, setWompiEnv] = useState<"sandbox" | "production">(
    (clinic.wompi_environment as "sandbox" | "production") ?? "sandbox"
  );
  const [wompiEnabled, setWompiEnabled] = useState(clinic.wompi_enabled);

  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<Tab | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSaveBranding = () => {
    startTransition(async () => {
      const result = await saveBranding({
        clinicId: clinic.id,
        display_name: displayName,
        logo_url: logoUrl,
        primary_color: primaryColor,
        accent_color: accentColor,
        contact_email: contactEmail,
        contact_phone: contactPhone,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setSaved("Branding");
      setTimeout(() => setSaved(null), 2500);
    });
  };

  const handleSaveWompi = () => {
    startTransition(async () => {
      const result = await saveWompiConfig({
        clinicId: clinic.id,
        wompi_public_key: wompiPublicKey,
        wompi_integrity_secret: wompiSecret,
        wompi_events_secret: wompiEventsSecret,
        wompi_environment: wompiEnv,
        wompi_enabled: wompiEnabled,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setSaved("Pasarela de pagos (Wompi)");
      setTimeout(() => setSaved(null), 2500);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Configuración de la clínica</h1>
        <p className="text-sm text-muted">
          Personaliza el branding de tu clínica y conecta tu propia cuenta de pagos.
        </p>
      </div>

      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setError(null);
            }}
            className={cn(
              "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              tab === t
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Branding" && (
        <Card>
          <CardTitle className="mb-3">Identidad de marca</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Nombre de la clínica</span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">URL del logo</span>
              <input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Color primario</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor || "#10b981"}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-9 w-9 rounded-lg border border-border bg-surface-2 p-1"
                />
                <input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#10b981"
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Color de acento</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor || "#10b981"}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-9 rounded-lg border border-border bg-surface-2 p-1"
                />
                <input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#10b981"
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Correo de contacto</span>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Teléfono de contacto</span>
              <input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
          </div>

          {error && tab === "Branding" && (
            <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            {saved === "Branding" && <span className="text-sm text-accent">Cambios guardados</span>}
            <button
              onClick={handleSaveBranding}
              disabled={isPending}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
            >
              {isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </Card>
      )}

      {tab === "Pasarela de pagos (Wompi)" && (
        <Card>
          <CardTitle className="mb-1">Cuenta de Wompi de tu clínica</CardTitle>
          <p className="mb-4 text-sm text-muted">
            Conecta las llaves de tu propia cuenta de Wompi para recibir los pagos de tus
            pacientes directamente. Encuéntralas en tu panel de Wompi, sección Desarrolladores.
            Configura como URL de eventos (webhook):{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">
              {typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/wompi
            </code>
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Llave pública</span>
              <input
                value={wompiPublicKey}
                onChange={(e) => setWompiPublicKey(e.target.value)}
                placeholder="pub_test_..."
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Secreto de integridad</span>
              <input
                type="password"
                value={wompiSecret}
                onChange={(e) => setWompiSecret(e.target.value)}
                placeholder="prod_integrity_..."
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Secreto de eventos (webhook)</span>
              <input
                type="password"
                value={wompiEventsSecret}
                onChange={(e) => setWompiEventsSecret(e.target.value)}
                placeholder="prod_events_..."
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Entorno</span>
              <select
                value={wompiEnv}
                onChange={(e) => setWompiEnv(e.target.value as "sandbox" | "production")}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="sandbox">Pruebas (sandbox)</option>
                <option value="production">Producción</option>
              </select>
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input
                type="checkbox"
                checked={wompiEnabled}
                onChange={(e) => setWompiEnabled(e.target.checked)}
              />
              Activar pagos con Wompi
            </label>
          </div>

          {error && tab === "Pasarela de pagos (Wompi)" && (
            <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            {saved === "Pasarela de pagos (Wompi)" && (
              <span className="text-sm text-accent">Cambios guardados</span>
            )}
            <button
              onClick={handleSaveWompi}
              disabled={isPending}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
            >
              {isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
