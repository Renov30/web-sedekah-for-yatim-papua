import { UserAccount } from "@/data/admin/adminData";

export interface UserWithAuth extends UserAccount {
  password: string;
}

export interface AuthSession {
  user: UserAccount;
  roleName: string;
  token: string;
}

export const AUTH_STORAGE_KEY = "sfy_admin_session";
export const USERS_STORAGE_KEY = "sfy_registered_users";

export const roleDisplayNames: Record<string, string> = {
  super_admin: "Super Admin Lembaga",
  bendahara: "Bendahara Lembaga",
  koordinator_relawan: "Koordinator Relawan",
  staf_lapangan: "Staf Pendataan Lapangan",
  auditor: "Auditor & Pengawas",
};

// Master Admin (Super Admin) Default Account
export const MASTER_ADMIN_CREDENTIALS: UserWithAuth = {
  id: "USR-001",
  nama: "Master Administrator SFY",
  email: "admin@sfypapua.org",
  password: "AdminSFY2025!",
  roleId: "super_admin",
  status: "Aktif",
  terakhirLogin: "Belum pernah login",
  wilayahTugas: "Sekretariat Pusat Merauke (Papua Selatan)",
};

export function getStoredUsers(): UserWithAuth[] {
  if (typeof window === "undefined") {
    return [MASTER_ADMIN_CREDENTIALS];
  }
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify([MASTER_ADMIN_CREDENTIALS])
      );
      return [MASTER_ADMIN_CREDENTIALS];
    }
    const parsed = JSON.parse(raw) as UserWithAuth[];
    if (!parsed || parsed.length === 0) {
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify([MASTER_ADMIN_CREDENTIALS])
      );
      return [MASTER_ADMIN_CREDENTIALS];
    }
    // Ensure master admin is preserved with super_admin role
    const hasMaster = parsed.some(
      (u) => u.email.toLowerCase() === MASTER_ADMIN_CREDENTIALS.email.toLowerCase()
    );
    if (!hasMaster) {
      const merged = [MASTER_ADMIN_CREDENTIALS, ...parsed];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return [MASTER_ADMIN_CREDENTIALS];
  }
}

export function saveStoredUsers(users: UserWithAuth[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function authenticateUser(
  emailInput: string,
  passwordInput: string
): { success: boolean; message?: string; session?: AuthSession } {
  const cleanEmail = emailInput.trim().toLowerCase();
  const users = getStoredUsers();

  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return {
      success: false,
      message: "Email pengguna belum terdaftar di sistem SFY Papua.",
    };
  }

  if (user.status !== "Aktif") {
    return {
      success: false,
      message: "Akun ini telah dinonaktifkan oleh administrator.",
    };
  }

  if (user.password !== passwordInput) {
    return {
      success: false,
      message: "Kata sandi salah. Silakan periksa kembali huruf besar, huruf kecil, dan simbol.",
    };
  }

  // Update last login
  const now = new Date();
  const formattedTime =
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(now) + " WIT";

  user.terakhirLogin = `Hari ini, ${formattedTime}`;
  saveStoredUsers(users);

  // Create clean user account without exposing password
  const userAccount: UserAccount = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    roleId: user.roleId,
    status: user.status,
    terakhirLogin: user.terakhirLogin,
    wilayahTugas: user.wilayahTugas,
  };

  const session: AuthSession = {
    user: userAccount,
    roleName: roleDisplayNames[user.roleId] || "Staf Lembaga",
    token: `sfy_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  };

  saveSession(session);

  return {
    success: true,
    session,
  };
}

export function registerNewUser(
  newUser: Omit<UserWithAuth, "id" | "terakhirLogin">
): { success: boolean; message?: string; user?: UserWithAuth } {
  const users = getStoredUsers();
  const cleanEmail = newUser.email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      message: `Email ${newUser.email} sudah terdaftar. Gunakan alamat email lain.`,
    };
  }

  const newId = `USR-${String(users.length + 1).padStart(3, "0")}`;
  const created: UserWithAuth = {
    ...newUser,
    id: newId,
    email: cleanEmail,
    terakhirLogin: "Belum pernah login",
  };

  const updatedUsers = [created, ...users];
  saveStoredUsers(updatedUsers);

  return {
    success: true,
    user: created,
  };
}

export function updateStoredUser(
  id: string,
  updates: Partial<Omit<UserWithAuth, "id">>
): { success: boolean; message?: string } {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  // If email is changing, verify uniqueness
  if (updates.email) {
    const cleanEmail = updates.email.trim().toLowerCase();
    const duplicate = users.find(
      (u) => u.id !== id && u.email.toLowerCase() === cleanEmail
    );
    if (duplicate) {
      return { success: false, message: "Email sudah digunakan oleh akun lain." };
    }
    updates.email = cleanEmail;
  }

  users[index] = {
    ...users[index],
    ...updates,
  };

  saveStoredUsers(users);
  return { success: true };
}

export function resetUserPassword(
  id: string,
  newPassword: string
): { success: boolean; message?: string } {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  if (newPassword.length < 6) {
    return { success: false, message: "Kata sandi minimal 6 karakter." };
  }

  users[index].password = newPassword;
  saveStoredUsers(users);
  return { success: true };
}

export function deleteStoredUser(
  id: string
): { success: boolean; message?: string } {
  const users = getStoredUsers();
  const target = users.find((u) => u.id === id);

  if (!target) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  if (
    target.id === "USR-001" ||
    target.email.toLowerCase() === MASTER_ADMIN_CREDENTIALS.email.toLowerCase()
  ) {
    return {
      success: false,
      message: "Akun Master Admin utama tidak dapat dihapus demi keamanan sistem.",
    };
  }

  const filtered = users.filter((u) => u.id !== id);
  saveStoredUsers(filtered);
  return { success: true };
}

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
