import { UserAccount, initialUsers } from "@/data/admin/adminData";

export interface AuthSession {
  user: UserAccount;
  roleName: string;
  token: string;
}

export const AUTH_STORAGE_KEY = "sfy_admin_session";

export const roleDisplayNames: Record<string, string> = {
  super_admin: "Super Admin Lembaga",
  bendahara: "Bendahara Lembaga",
  koordinator_relawan: "Koordinator Relawan",
  staf_lapangan: "Staf Pendataan Lapangan",
  auditor: "Auditor & Pengawas",
};

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// Default dummy credentials for development & quick login:
export const defaultAccounts = [
  {
    email: "admin@sfypapua.org",
    password: "password123",
    label: "Super Admin (Akses Penuh)",
    user: initialUsers[0],
  },
  {
    email: "keuangan@sfypapua.org",
    password: "password123",
    label: "Bendahara (Keuangan & Donatur)",
    user: initialUsers[1],
  },
  {
    email: "faisal.s@gmail.com",
    password: "password123",
    label: "Koordinator Relawan",
    user: initialUsers[2],
  },
  {
    email: "daud.kogoya@sfypapua.org",
    password: "password123",
    label: "Staf Lapangan (Pendataan)",
    user: initialUsers[3],
  },
];

