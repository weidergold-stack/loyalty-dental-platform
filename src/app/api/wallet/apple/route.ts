import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPatientData } from "@/lib/data/patient";
import { solidColorPng } from "@/lib/png";
import { PKPass } from "passkit-generator";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const signerCertB64 = process.env.APPLE_SIGNER_CERT_BASE64;
  const signerKeyB64 = process.env.APPLE_SIGNER_KEY_BASE64;
  const wwdrB64 = process.env.APPLE_WWDR_CERT_BASE64;
  const passTypeId = process.env.APPLE_PASS_TYPE_IDENTIFIER;
  const teamId = process.env.APPLE_TEAM_IDENTIFIER;
  const keyPassphrase = process.env.APPLE_CERT_PASSPHRASE ?? "";

  if (!signerCertB64 || !signerKeyB64 || !wwdrB64 || !passTypeId || !teamId) {
    return NextResponse.json({ error: "Apple Wallet not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getPatientData();
  if (!data) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  const { patient, tier, cashbackBalance, stampsBalance, membership, branding, digitalCard } = data;
  const tierName = tier?.name ?? "Bronce";
  const clinicName = branding?.display_name ?? "Sonrisa+";

  const tierColors: Record<string, [number, number, number]> = {
    Bronce: [169, 104, 63],
    Plata: [154, 163, 181],
    Oro: [185, 137, 42],
    Diamante: [59, 91, 135],
  };
  const [r, g, b] = tierColors[tierName] ?? [99, 102, 241];

  const iconPng = solidColorPng(r, g, b, 29, 29);
  const iconPng2x = solidColorPng(r, g, b, 58, 58);

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: passTypeId,
    serialNumber: digitalCard?.qr_code ?? patient.id,
    teamIdentifier: teamId,
    organizationName: clinicName,
    description: "Tarjeta de fidelización dental",
    logoText: clinicName,
    foregroundColor: `rgb(255, 255, 255)`,
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    labelColor: `rgb(255, 255, 255)`,
    storeCard: {
      headerFields: [
        { key: "tier", label: "Nivel", value: tierName },
      ],
      primaryFields: [
        {
          key: "cashback",
          label: "Cashback disponible",
          value: formatCurrency(cashbackBalance),
        },
      ],
      secondaryFields: [
        { key: "name", label: "Paciente", value: patient.full_name },
        { key: "stamps", label: "Sellos", value: String(stampsBalance) },
      ],
      backFields: [
        { key: "since", label: "Miembro desde", value: membership?.start_date ?? patient.created_at },
        { key: "clinic", label: "Clínica", value: clinicName },
        { key: "status", label: "Estado", value: membership?.status === "active" ? "Activo" : "Pausado" },
      ],
    },
    barcode: {
      message: digitalCard?.qr_code ?? patient.id,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    },
  };

  try {
    const pass = new PKPass(
      {
        "pass.json": Buffer.from(JSON.stringify(passJson)),
        "icon.png": iconPng,
        "icon@2x.png": iconPng2x,
      },
      {
        wwdr: Buffer.from(wwdrB64, "base64"),
        signerCert: Buffer.from(signerCertB64, "base64"),
        signerKey: Buffer.from(signerKeyB64, "base64"),
        signerKeyPassphrase: keyPassphrase,
      }
    );

    const buffer = await pass.getAsBuffer();

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="sonrisaplus.pkpass"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Apple Wallet error:", err);
    return NextResponse.json({ error: "Failed to generate pass" }, { status: 500 });
  }
}
