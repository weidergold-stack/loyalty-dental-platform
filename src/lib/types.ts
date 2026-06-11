export type TierName = "Bronce" | "Plata" | "Oro" | "Diamante";

export interface MembershipTier {
  id: string;
  name: TierName;
  minMonths: number;
  cashbackPercent: number;
  benefits: string[];
  color: string;
}

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  memberSince: string; // ISO date
  familyRole: "Titular" | "Cónyuge" | "Hijo" | "Padre" | "Madre";
}

export interface Membership {
  patientId: string;
  tier: TierName;
  status: "active" | "paused" | "cancelled";
  monthlyAmount: number;
  currentPeriodEnd: string;
  cashbackBalance: number;
}

export interface StampProgram {
  id: string;
  name: string;
  stampsBalance: number;
  rules: { action: string; stamps: number }[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  stampsRequired: number;
}

export interface OralHealthRule {
  id: string;
  action: string;
  label: string;
  creditsAwarded: number;
  active: boolean;
}

export interface OralHealthState {
  balance: number;
  history: { date: string; reason: string; amount: number }[];
}

export interface CashbackMovement {
  id: string;
  type: "earned" | "redeemed" | "expired";
  amount: number;
  description: string;
  date: string;
}
