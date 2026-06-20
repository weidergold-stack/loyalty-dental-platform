import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPatientData } from "@/lib/data/patient";
import { formatCurrency } from "@/lib/utils";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function GET() {
  const credentialsJson = process.env.GOOGLE_WALLET_CREDENTIALS_JSON;
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;

  if (!credentialsJson || !issuerId) {
    return NextResponse.json({ error: "Google Wallet not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getPatientData();
  if (!data) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  const { patient, tier, cashbackBalance, stampsBalance, membership, branding, digitalCard } =
    data;
  const tierName = tier?.name ?? "Bronce";
  const clinicName = branding?.display_name ?? "Sonrisa+";
  const serialNumber = (digitalCard?.qr_code ?? patient.id).replace(/-/g, "").slice(0, 30);

  let credentials: { client_email: string; private_key: string };
  try {
    credentials = JSON.parse(credentialsJson);
  } catch {
    return NextResponse.json({ error: "Invalid Google credentials" }, { status: 500 });
  }

  const classId = `${issuerId}.sonrisaplus_loyalty`;
  const objectId = `${issuerId}.patient_${serialNumber}`;

  const tierColors: Record<string, string> = {
    Bronce: "#a9683f",
    Plata: "#9aa3b5",
    Oro: "#b9892a",
    Diamante: "#3b5b87",
  };
  const hexColor = tierColors[tierName] ?? "#6366f1";

  const loyaltyClass = {
    id: classId,
    issuerName: clinicName,
    reviewStatus: "UNDER_REVIEW",
    programName: `${clinicName} · Fidelización`,
    hexBackgroundColor: hexColor,
    countryCode: "CO",
  };

  const loyaltyObject = {
    id: objectId,
    classId,
    state: membership?.status === "active" ? "ACTIVE" : "INACTIVE",
    accountId: patient.id.slice(0, 20),
    accountName: patient.full_name,
    loyaltyPoints: {
      label: "Cashback",
      balance: { string: formatCurrency(cashbackBalance) },
    },
    secondaryLoyaltyPoints: {
      label: "Sellos",
      balance: { int: stampsBalance },
    },
    textModulesData: [
      { header: "Nivel", body: tierName, id: "tier" },
      { header: "Clínica", body: clinicName, id: "clinic" },
    ],
    barcode: {
      type: "QR_CODE",
      value: digitalCard?.qr_code ?? patient.id,
      alternateText: patient.full_name,
    },
  };

  const claims = {
    iss: credentials.client_email,
    aud: "google",
    typ: "savetowallet",
    iat: Math.floor(Date.now() / 1000),
    payload: {
      loyaltyClasses: [loyaltyClass],
      loyaltyObjects: [loyaltyObject],
    },
  };

  try {
    const token = jwt.sign(claims, credentials.private_key, { algorithm: "RS256" });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;
    return NextResponse.json({ url: saveUrl });
  } catch (err) {
    console.error("Google Wallet error:", err);
    return NextResponse.json({ error: "Failed to generate pass" }, { status: 500 });
  }
}
