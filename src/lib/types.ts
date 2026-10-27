export type CoachStatus = "pending" | "approved" | "rejected";

export type Coach = {
  id: string;
  fullName: string;
  businessName: string | null;
  email: string;
  signedUpAt: string;
  activeClients: number;
  status: CoachStatus;
};

export type InviteCode = {
  code: string;
  note: string | null;
  used_count: number;
  max_uses: number;
  expires_at: string | null;
  created_at: string;
};
